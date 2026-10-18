import { checkpointContext } from '@/lib/checkpoint-store';
import { checkpointDecision, checkpointSchema } from '@/lib/checkpoints';
import { scrub } from '@/lib/interview';
import { acceptsOrigin } from '@/lib/request-origin';
const noStore={'Cache-Control':'no-store'};
export async function GET(request:Request){
 if(process.env.PUBLIC_DEMO==='true')return Response.json({error:'Cloud checkpoints are unavailable in the public demo. Interviews stay in your browser.'},{status:403,headers:noStore});
 try{
  const {owner,store}=await checkpointContext();if(!owner)return Response.json({error:'Sign in to save or restore a private checkpoint.'},{status:401});
  if(!store)return Response.json({error:'Checkpoint database is unavailable.'},{status:503});
  const id=new URL(request.url).searchParams.get('id');
  if(id){const row=await store.get(owner,id);if(!row)return Response.json({error:'Checkpoint not found.'},{status:404});return Response.json({session:JSON.parse(row.payload),savedAt:row.updatedAt},{headers:noStore});}
  return Response.json({checkpoints:await store.list(owner)},{headers:noStore});
 }catch{return Response.json({error:'Unable to load checkpoints. Local data is unaffected.'},{status:503});}
}
export async function PUT(request:Request){
 if(process.env.PUBLIC_DEMO==='true')return Response.json({error:'Cloud checkpoints are unavailable in the public demo. Interviews stay in your browser.'},{status:403,headers:noStore});
 try{
  if(!acceptsOrigin(request))return Response.json({error:'Cross-origin requests are not accepted.'},{status:403});
  const {owner,store}=await checkpointContext();if(!owner)return Response.json({error:'Sign in to save a private checkpoint.'},{status:401});
  if(!store)return Response.json({error:'Checkpoint database is unavailable. Local data is unaffected.'},{status:503});
  const body=await request.text();if(body.length>500000)return Response.json({error:'Checkpoint is too large.'},{status:413});
  const parsed=JSON.parse(body);const session=checkpointSchema.parse(parsed.session);
  const cleanStrings=(value:unknown):unknown=>typeof value==='string'?scrub(value):Array.isArray(value)?value.map(cleanStrings):value&&typeof value==='object'?Object.fromEntries(Object.entries(value).map(([k,v])=>[k,cleanStrings(v)])):value;
  const payload=JSON.stringify(cleanStrings(session));const now=Date.now();
  const current=await store.get(owner,session.id);
  const decision=checkpointDecision(current,{version:session.version,payload,expectedSavedAt:parsed.expectedSavedAt});
  if(decision==='conflict')return Response.json({error:'A newer or different checkpoint already exists. Restore it before saving.'},{status:409});
  if(decision==='insert'||decision==='update'){
   if(!await store.write(owner,session.id,{version:session.version,payload,updatedAt:now},current))return Response.json({error:'Checkpoint changed concurrently. Restore it and retry.'},{status:409});
  }
  return Response.json({saved:true,id:session.id,version:session.version,idempotent:decision==='idempotent',savedAt:decision==='idempotent'?current!.updatedAt:now},{headers:noStore});
 }catch{return Response.json({error:'Checkpoint could not be saved. Local interview is preserved.'},{status:400});}
}
