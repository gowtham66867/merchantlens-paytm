import {test} from 'node:test';
import assert from 'node:assert/strict';
import {cloudStorageStore,checkpointContext} from '../lib/checkpoint-store.cloudrun.ts';
const row={version:2,payload:'{"id":"ML-TEST"}',updatedAt:100};
function store(handler:(url:URL,init:RequestInit)=>Response|Promise<Response>){return cloudStorageStore('private-checkpoints',((url,init)=>handler(new URL(String(url)),init||{})) as typeof fetch,async()=>'fixture-token');}
test('Cloud Run inserts require generation zero and updates require observed generation',async()=>{
 const calls:URL[]=[];const s=store((url,init)=>{calls.push(url);assert.equal((init.headers as Record<string,string>).Authorization,'Bearer fixture-token');assert(!String(init.body).includes('revision'));return new Response('{}');});
 assert(await s.write('owner','ML-TEST',row,null));assert.equal(calls[0].searchParams.get('ifGenerationMatch'),'0');
 assert(await s.write('owner','ML-TEST',row,{...row,revision:'42'}));assert.equal(calls[1].searchParams.get('ifGenerationMatch'),'42');
 await assert.rejects(()=>s.write('owner','ML-TEST',row,row),/generation is required/);
});
test('Cloud Storage generation conflict refuses the write',async()=>{assert.equal(await store(()=>new Response('',{status:412})).write('owner','ML-TEST',row,null),false);});
test('restore retains object generation and refuses missing concurrency metadata',async()=>{
 const s=store(()=>new Response(JSON.stringify(row),{headers:{'x-goog-generation':'43'}}));assert.equal((await s.get('owner','ML-TEST'))?.revision,'43');
 await assert.rejects(()=>store(()=>Response.json(row)).get('owner','ML-TEST'),/generation is missing/);
});
test('owner namespaces differ and restore cannot traverse object paths',async()=>{
 const paths:string[]=[];const s=store(url=>{paths.push(url.pathname);return new Response('',{status:404});});
 await s.get('owner-a','../ML-TEST');await s.get('owner-b','../ML-TEST');assert.notEqual(paths[0],paths[1]);assert(!paths[0].includes('/../'));
});
test('list follows pagination, scopes prefix, and sorts most recent checkpoints',async()=>{
 let calls=0;const s=store(url=>{calls++;assert.match(url.searchParams.get('prefix')||'',/^checkpoints\/[a-f0-9]{64}\/$/);if(calls===1)return Response.json({items:[{metadata:{sessionId:'ML-OLD',version:'1',updatedAt:'10'}}],nextPageToken:'next'});assert.equal(url.searchParams.get('pageToken'),'next');return Response.json({items:[{metadata:{sessionId:'ML-NEW',version:'2',updatedAt:'20'}}]});});
 assert.deepEqual((await s.list('owner')).map(r=>r.session_id),['ML-NEW','ML-OLD']);assert.equal(calls,2);
});
test('Cloud Run adapter ignores spoofed Sites identity and requires private-runtime configuration',async()=>{
 const old=process.env.K_SERVICE;delete process.env.K_SERVICE;try{assert.deepEqual(await checkpointContext(),{owner:null,store:null});}finally{if(old)process.env.K_SERVICE=old;}
});
test('public demo cannot acquire the private owner or bucket even when both remain configured',async()=>{
 const keys=['K_SERVICE','CLOUD_RUN_PRIVATE_OWNER','CHECKPOINT_BUCKET','PUBLIC_DEMO'];const prior=keys.map(k=>process.env[k]);
 try{process.env.K_SERVICE='fixture';process.env.CLOUD_RUN_PRIVATE_OWNER='owner';process.env.CHECKPOINT_BUCKET='private-bucket';process.env.PUBLIC_DEMO='true';assert.deepEqual(await checkpointContext(),{owner:null,store:null});}
 finally{keys.forEach((k,i)=>{if(prior[i]===undefined)delete process.env[k];else process.env[k]=prior[i];});}
});
