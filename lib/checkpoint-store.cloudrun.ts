import { createHash } from 'node:crypto';
import type { CheckpointRow, CheckpointStore } from './checkpoint-store.types';

type Token = {access_token:string;expires_in:number};
let cachedToken:{value:string;expires:number}|undefined;
async function googleToken(){
 if(cachedToken&&cachedToken.expires>Date.now())return cachedToken.value;
 const r=await fetch('http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token',{headers:{'Metadata-Flavor':'Google'},signal:AbortSignal.timeout(5000)});
 if(!r.ok)throw Error('Cloud Run service identity is unavailable.');
 const token=await r.json() as Token;
 cachedToken={value:token.access_token,expires:Date.now()+Math.max(0,token.expires_in-60)*1000};return token.access_token;
}

// This adapter is exclusively for an IAM-private Cloud Run service. The edge
// authenticates invocation; all permitted invokers share its single-owner workspace.
// Client-supplied identity headers are deliberately never trusted here.
export function cloudStorageStore(bucket:string,request:typeof fetch=fetch,token:()=>Promise<string>=googleToken):CheckpointStore {
 const prefix=(owner:string)=>`checkpoints/${createHash('sha256').update(owner).digest('hex')}/`;
 const name=(owner:string,id:string)=>prefix(owner)+encodeURIComponent(id)+'.json';
 async function call(url:string,init:RequestInit={}){return request(url,{...init,headers:{...init.headers,Authorization:`Bearer ${await token()}`},signal:AbortSignal.timeout(15000)});}
 return {
  async get(owner,id){
   const r=await call(`https://storage.googleapis.com/storage/v1/b/${encodeURIComponent(bucket)}/o/${encodeURIComponent(name(owner,id))}?alt=media`);
   if(r.status===404)return null;if(!r.ok)throw Error('Unable to read private checkpoint.');
   const row=await r.json() as CheckpointRow;const revision=r.headers.get('x-goog-generation');
   if(!revision)throw Error('Checkpoint generation is missing.');return{...row,revision};
  },
  async list(owner){
   const rows:{session_id:string;version:number;updated_at:number}[]=[];let page='';let pages=0;
   do{
    if(++pages>10)throw Error('Checkpoint listing limit reached.');
    const url=new URL(`https://storage.googleapis.com/storage/v1/b/${encodeURIComponent(bucket)}/o`);url.searchParams.set('prefix',prefix(owner));url.searchParams.set('maxResults','1000');if(page)url.searchParams.set('pageToken',page);
    const r=await call(url.href);if(!r.ok)throw Error('Unable to list private checkpoints.');
    const b=await r.json() as {items?:{metadata?:Record<string,string>}[];nextPageToken?:string};
    for(const item of b.items||[]){const m=item.metadata;if(m?.sessionId)rows.push({session_id:m.sessionId,version:Number(m.version),updated_at:Number(m.updatedAt)});}page=b.nextPageToken||'';
   }while(page);
   return rows.sort((a,b)=>b.updated_at-a.updated_at).slice(0,30);
  },
  async write(owner,id,row,previous){
   if(previous&&!previous.revision)throw Error('Checkpoint generation is required for updates.');
   const boundary='merchantlens_'+crypto.randomUUID();
   const metadata={name:name(owner,id),contentType:'application/json',metadata:{sessionId:id,version:String(row.version),updatedAt:String(row.updatedAt)}};
   const body=`--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(metadata)}\r\n--${boundary}\r\nContent-Type: application/json\r\n\r\n${JSON.stringify({version:row.version,payload:row.payload,updatedAt:row.updatedAt})}\r\n--${boundary}--\r\n`;
   const url=new URL(`https://storage.googleapis.com/upload/storage/v1/b/${encodeURIComponent(bucket)}/o`);url.searchParams.set('uploadType','multipart');url.searchParams.set('ifGenerationMatch',previous?.revision||'0');
   const r=await call(url.href,{method:'POST',headers:{'Content-Type':`multipart/related; boundary=${boundary}`},body});
   if(r.status===412)return false;if(!r.ok)throw Error('Unable to save private checkpoint.');return true;
  }
 };
}
export async function checkpointContext():Promise<{owner:string|null;store:CheckpointStore|null}>{
 if(process.env.PUBLIC_DEMO==='true')return{owner:null,store:null};
 const owner=process.env.K_SERVICE?process.env.CLOUD_RUN_PRIVATE_OWNER:null;
 return{owner:owner||null,store:owner&&process.env.CHECKPOINT_BUCKET?cloudStorageStore(process.env.CHECKPOINT_BUCKET):null};
}
