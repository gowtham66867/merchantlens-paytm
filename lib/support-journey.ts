import type {Session} from './interview.ts';
export const supportStages=[
 {id:'clarify',label:'1. Clarify the report',purpose:'Separate missing audio, app entry and bank credit.'},
 {id:'records',label:'2. Review payment evidence',purpose:'Record what was checked; never infer settlement from speech.'},
 {id:'self_service',label:'3. Capture self-service checks',purpose:'Keep attempted device/app checks and their reported outcome.'},
 {id:'prior_contact',label:'4. Review previous contact',purpose:'Carry earlier bot, app or staff interactions forward.'},
 {id:'handoff',label:'5. Prepare human handoff',purpose:'Provide the unresolved question and evidence without retelling.'},
] as const;
export type SupportStage=typeof supportStages[number]['id'];
export type SupportOutcome='unresolved'|'reported_resolved'|'unknown';
export type SupportAttempt={id:string;stage:SupportStage;channel:string;action:string;outcome:SupportOutcome;at:number;turnId:string};
export type SupportJourney={attempts:SupportAttempt[];humanRequested:boolean};
export function supportRecommendation(s:Session){
 const attempts=s.supportJourney?.attempts||[];const unresolved=attempts.filter(a=>a.outcome==='unresolved').length;
 if(s.supportJourney?.humanRequested)return{kind:'handoff',title:'Human help requested',reason:'Prepare a handoff now. Completing all five stages is not required.'};
 if(attempts.at(-1)?.outcome==='reported_resolved')return{kind:'confirm',title:'Confirm the reported resolution',reason:'The merchant reports improvement. Confirm it lasted; this is not system-verified closure.'};
 if(unresolved>=2)return{kind:'handoff',title:'Repeated attempts remain unresolved',reason:'Recommend a human review instead of another troubleshooting loop.'};
 const covered=new Set(attempts.map(a=>a.stage));
 if(!s.facts.some(f=>f.topic==='payment_status')&&!covered.has('records'))return{kind:'evidence',title:'Clarify the payment record once',reason:'Record whether the merchant checked the app. Unavailable evidence stays unknown; do not force a check.'};
 if(attempts.length||s.facts.some(f=>f.topic==='attempts'))return{kind:'handoff',title:'Carry the existing context forward',reason:'Prior checks are recorded. Review the remaining gap before suggesting the same action again.'};
 return{kind:'intake',title:'Capture what has already been tried',reason:'A prior app, bot, device or staff interaction can be recorded without completing earlier stages.'};
}
export function supportHandoff(s:Session){
 const attempts=s.supportJourney?.attempts||[];
 return{basis:'Merchant-entered support history; not independently verified',model:'Five illustrative stages; not a verified Paytm internal support map',human_requested:Boolean(s.supportJourney?.humanRequested),ticket_created:false,recommendation:supportRecommendation(s),attempts,existing_attempt_report:s.facts.find(f=>f.topic==='attempts')?.value||null,unknowns:['Paytm system records and ticket status are not connected.','A recorded attempt is not proof of execution or resolution.']};
}
export function supportMarkdown(s:Session){
 const h=supportHandoff(s);
 return `## Support handoff draft\n${h.basis}. ${h.model}.\n\nNext step: ${h.recommendation.title}. ${h.recommendation.reason}\nHuman help requested: ${h.human_requested?'yes':'no'}. Ticket created: no.\n\n${h.attempts.map((a,i)=>`${i+1}. ${a.channel}: ${a.action}\n   Merchant-reported outcome: ${a.outcome}. Source turn: ${a.turnId}.`).join('\n\n')||'No additional history recorded.'}\n\nExisting attempt report: ${h.existing_attempt_report||'Not captured.'}\n`;
}
