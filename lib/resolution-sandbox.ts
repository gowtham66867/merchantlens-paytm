import {z} from 'zod';
export const scenarioIds=['silent-device','missing-record','recovered-device'] as const;
export type ScenarioId=typeof scenarioIds[number];
const receipt=z.object({id:z.string(),incident:z.enum(scenarioIds),tool:z.enum(['history','transaction','device','diagnostic','ticket','followup']),at:z.number(),result:z.string(),basis:z.literal('synthetic_fixture')});
const ticket=z.object({id:z.string(),incident:z.enum(scenarioIds),key:z.string(),createdAt:z.number(),context:z.string(),status:z.literal('open')});
export const sandboxSchema=z.object({version:z.literal(1),receipts:z.array(receipt).max(100),tickets:z.array(ticket).max(3)}).strict();
export type Sandbox=z.infer<typeof sandboxSchema>;
export const emptySandbox=():Sandbox=>({version:1,receipts:[],tickets:[]});
export const scenarios:Record<ScenarioId,{title:string;report:string;transaction:string;device:string;history:string;diagnostic:string;recovered:boolean}>={
 'silent-device':{title:'Silent Soundbox, matching payment',report:'Customer paid ₹500. The Soundbox was silent. I already restarted it.',transaction:'Synthetic transaction TX-500: successful merchant receipt of ₹500. Bank settlement has not been checked.',device:'Synthetic device DEV-A: speaker self-test failed; network reachable at fixture snapshot.',history:'Synthetic prior case: restart attempted once; announcement still missing.',diagnostic:'No repeat restart requested. Recorded fixture speaker-test failure supports device-team review; root cause is not established.',recovered:false},
 'missing-record':{title:'Customer screenshot, no matching record',report:'A customer showed an ₹800 success screenshot, but I cannot find the payment.',transaction:'Synthetic lookup for this ₹800 incident: no matching merchant record. This does not establish failure or financial loss.',device:'Synthetic device DEV-B: no current telemetry. Device diagnosis unavailable.',history:'Synthetic history: no earlier support attempt for this incident.',diagnostic:'Payment-record investigation recommended. A customer screenshot cannot establish receipt. Device reset is not relevant evidence.',recovered:false},
 'recovered-device':{title:'Reported recovery needs confirmation',report:'The Soundbox started announcing after I charged it. Has it stayed fixed?',transaction:'Synthetic transaction TX-250: successful merchant receipt of ₹250. Bank settlement unknown.',device:'Synthetic device DEV-C: latest fixture test announcement succeeded.',history:'Synthetic history: charged device; merchant reports improvement.',diagnostic:'Fixture follow-up confirms one subsequent announcement. Record improvement for this test only; long-term reliability remains unmeasured.',recovered:true}
};
function add(s:Sandbox,id:ScenarioId,tool:z.infer<typeof receipt>['tool'],result:string,at:number):Sandbox{
 if(s.receipts.length>=100)throw Error('Receipt limit reached. Export and reset the synthetic sandbox.');
 return {...s,receipts:[...s.receipts,{id:`R-${s.receipts.length+1}`,incident:id,tool,at,result,basis:'synthetic_fixture'}]};
}
export function inspectIncident(s:Sandbox,id:ScenarioId,at=Date.now()):Sandbox{
 const f=scenarios[id];let n=s;for(const [tool,result] of [['history',f.history],['transaction',f.transaction],['device',f.device]] as const)n=add(n,id,tool,result,at);return n;
}
export function diagnose(s:Sandbox,id:ScenarioId,at=Date.now()):Sandbox{
 if(!['history','transaction','device'].every(t=>s.receipts.some(r=>r.incident===id&&r.tool===t)))throw Error('Inspect this incident before choosing a diagnostic.');
 return add(s,id,'diagnostic',scenarios[id].diagnostic,at);
}
export function caseContext(s:Sandbox,id:ScenarioId):string{return JSON.stringify({incident:id,report:scenarios[id].report,receipts:s.receipts.filter(r=>r.incident===id&&r.tool!=='ticket'),basis:'Synthetic sandbox only; no Paytm records or support connection.'});}
export function createCase(s:Sandbox,id:ScenarioId,approvedContext:string,at=Date.now()):Sandbox{
 const key=`sandbox-case:${id}`;const existing=s.tickets.find(t=>t.key===key);if(existing)return s;
 if(approvedContext!==caseContext(s,id))throw Error('Context changed. Review and approve this incident again.');
 if(!s.receipts.some(r=>r.incident===id&&r.tool==='diagnostic'))throw Error('Run a diagnostic before case creation.');
 const t={id:`DEMO-${s.tickets.length+1}`,incident:id,key,createdAt:at,context:approvedContext,status:'open' as const};
 return add({...s,tickets:[...s.tickets,t]},id,'ticket',`Created local mock case ${t.id}. No real ticket sent.`,at);
}
export function followup(s:Sandbox,id:ScenarioId,at=Date.now()):Sandbox{
 if(!s.receipts.some(r=>r.incident===id&&r.tool==='diagnostic'))throw Error('A diagnostic is required before follow-up.');
 return add(s,id,'followup',scenarios[id].recovered?'Fixture shows one successful subsequent announcement. Improvement in this synthetic test only.':'Fixture remains unresolved. Existing mock case stays open; do not mark resolved.',at);
}
export function parseSandbox(raw:string):Sandbox{return sandboxSchema.parse(JSON.parse(raw));}
