import { localQuestion,hasRequestedScript } from '../languages.ts';
import { topics, type Fact, type Topic, type Turn } from '../interview.ts';
import type { CandidateClaim, Challenge, QuestionCandidate } from './types.ts';
export function verifyClaims(claims: CandidateClaim[], turns: Turn[]): void {
 const seen = new Set<Topic>();
 for (const claim of claims) {
  const source=turns.find(t=>t.id===claim.turn_id && t.role==='merchant');
  if (!source || !claim.quote.trim() || !source.text.includes(claim.quote)) throw new Error('Evidence citation could not be matched to the merchant transcript.');
  if (seen.has(claim.topic)) throw new Error('Conflicting duplicate claim topics require a repaired extraction.');
  seen.add(claim.topic);
  if (/(?<!un|not |not independently )\bverified\b|\bconfirmed (?:payment|bank credit|settlement)\b/i.test(claim.value) && !/merchant (?:reports|says)|not (?:independently )?verified/i.test(claim.value)) throw new Error('A merchant report cannot be promoted to independent verification.');
 }
}
export const isStop = (text: string) => /^(?:बस|रोकिए|समाप्त|बस इतना ही|ನಿಲ್ಲಿಸಿ|ಮುಗಿಸಿ|ಸಾಕು)[.!।\s]*$/u.test(text.trim()) || /^(?:(?:please|can we|let.s|i want to)\s+)?(?:stop|finish|end|done|that.s all)(?:\s+(?:now|here|the interview|this interview|please|thanks|thank you))*[.!\s]*$/i.test(text.trim());
const polarity = (text: string) => /not (?:show|received|success)|no (?:payment|entry)|failed|unsuccessful/i.test(text) ? 'negative' : /success|received|entry visible/i.test(text) ? 'positive' : 'unknown';
export function assessChallenges(turns: Turn[], oldFacts: Fact[], facts: Fact[]): Challenge[] {
 const challenges: Challenge[]=[];
 const amount=facts.find(f=>f.topic==='affected_value');
 if (amount) challenges.push({id:'money-meaning',type:'amount_ambiguity',topic:'affected_value',summary:amount.value.includes('requires clarification')?'A payment amount was described as a loss without clarification.':'Amount meaning has been discussed; independent financial loss remains unverified.',turnIds:[amount.turnId],question:'Is that amount the value of affected payments, or a financial loss you have confirmed?',resolved:!amount.value.includes('requires clarification')});
 for (const next of facts) {
  const previous=oldFacts.find(f=>f.topic===next.topic);
  if (next.topic==='payment_status' && previous && previous.turnId!==next.turnId && polarity(previous.value)!=='unknown' && polarity(next.value)!=='unknown' && polarity(previous.value)!==polarity(next.value)) {
   const source=turns.find(t=>t.id===next.turnId)?.text||'';
   const explicitCorrection=/correct|actually|earlier|mistak|meant|sorry/i.test(source);
   challenges.push({id:`contradiction-${next.topic}`,type:'contradiction',topic:next.topic,summary:explicitCorrection?'The merchant explicitly corrected an earlier payment-status account.':'Two payment-status accounts disagree. They may refer to different incidents.',turnIds:[previous.turnId,next.turnId],question:'Earlier you described a different app status. Are these the same payment, or separate incidents?',resolved:explicitCorrection});
  }
 }
 return challenges;
}
export function rankQuestions(turns: Turn[], facts: Fact[], challenges: Challenge[], language: string): QuestionCandidate[] {
 const hindi=language==='hi-Latn-IN';
 const explicit=challenges.filter(c=>!c.resolved).map(c=>({topic:c.topic,score:c.type==='contradiction'?110:120,reason:c.summary,question:localQuestion(c.type==='amount_ambiguity'?'affected_value':c.type==='contradiction'?'contradiction':hasRequestedScript(c.question,language)?'custom':c.topic,language,c.question,hindi&&c.type==='amount_ambiguity'?'Yeh amount affected payments ka hai, ya aapne actual nuksaan confirm kiya hai?':c.question),priority:'clarify' as const}));
 const damaged=facts.some(f=>f.topic==='symptom'&&/damag|broken|crack/i.test(f.value));
 const weights: Record<string,number>={symptom:100,payment_status:94,settlement:89,frequency:75,impact:83,workaround:72,attempts:69,constraints:62,outcome:60};
 const candidates=topics.filter(t=>!facts.some(f=>f.topic===t.key)).map(t=>{
  const attempts=turns.filter(turn=>turn.role==='agent'&&turn.topic===t.key).length;
  let question=localQuestion(t.key,language,t.question,t.hindi);
  if(damaged&&t.key==='payment_status')question=localQuestion('damage_status',language,'Since the device was damaged, are payment entries still appearing in the merchant app?','Soundbox damage ke baad app mein payment entries dikh rahi hain?');
  return {topic:t.key,score:weights[t.key]-(attempts>1?20:0),reason:t.purpose,question,priority:'discover' as const};
 });
 return [...explicit,...candidates].sort((a,b)=>b.score-a.score);
}
export function graphFingerprint(turns: Turn[]) { // Non-cryptographic resume fingerprint, not an integrity/authentication proof.
 let hash=2166136261;for(const ch of JSON.stringify(turns.map(t=>[t.id,t.role,t.text])))hash=Math.imul(hash^ch.charCodeAt(0),16777619);return (hash>>>0).toString(16).padStart(8,'0');
}
export function counterfactual(facts: Fact[], excludedTurnId: string) {
 const remaining=facts.filter(f=>f.turnId!==excludedTurnId);
 return {remaining,droppedTopics:facts.filter(f=>f.turnId===excludedTurnId).map(f=>f.topic),interpretation:'Source ablation only. This checks dependency, not causal effect or factual truth.'};
}
