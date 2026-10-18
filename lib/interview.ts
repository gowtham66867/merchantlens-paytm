import type { RunTrace } from './agents/types';
export type Topic = 'symptom' | 'payment_status' | 'settlement' | 'frequency' | 'impact' | 'workaround' | 'attempts' | 'constraints' | 'outcome' | 'affected_value';
export type Turn = { id: string; role: 'agent' | 'merchant'; text: string; at: number; topic?: Topic };
export type Fact = { id: string; topic: Topic; label: string; value: string; quote: string; turnId: string; kind: 'reported' | 'estimate'; previous?: string };
export type Audit = { id: string; text: string; at: number };
export type Session = { id: string; alias: string; business: string; language: string; turns: Turn[]; facts: Fact[]; version: number; approvedInternal: number | null; approvedPublic: number | null; status: 'interviewing' | 'review' | 'approved'; summary: string; audit: Audit[]; synthetic: boolean; createdAt: number; provider: 'guided' | 'gemini'; runs?: RunTrace[] };
export type AgentResult = { response: string; topic?: Topic; facts: Fact[]; ready: boolean; purpose: string; provider: 'guided' | 'gemini'; run?: RunTrace };
export const topics: { key: Topic; label: string; question: string; hindi: string; purpose: string; sample: string }[] = [
 { key: 'symptom', label: 'What is happening', question: 'Tell me about a recent payment problem at your shop. What happened?', hindi: 'Apni dukaan mein payment ki kisi recent dikkat ke baare mein bataiye. Kya hua tha?', purpose: 'Start with a concrete incident in the merchant’s own words.', sample: 'This morning the Soundbox stayed silent after a customer paid. I think I lost ₹2,400. Customers were waiting at the counter.' },
 { key: 'payment_status', label: 'Payment confirmation', question: 'When you say the payment did not arrive, do you mean the entry in your merchant app, the credit in your bank, or the Soundbox announcement?', hindi: 'Payment nahi aaya se aapka matlab app ki entry, bank ka credit, ya Soundbox ki awaaz hai?', purpose: 'Distinguish missing audio from a missing payment record.', sample: 'The merchant app showed successful payments. It was the Soundbox announcement that was missing.' },
 { key: 'settlement', label: 'Bank settlement', question: 'Have you checked the bank credit separately, or is that still unknown?', hindi: 'Bank mein credit alag se check kiya hai, ya abhi pata nahi hai?', purpose: 'Keep payment confirmation and bank settlement separate.', sample: 'I have not checked the bank statement. Also, correction: ₹2,400 was the value of affected payments, not a confirmed loss.' },
 { key: 'frequency', label: 'Frequency', question: 'How often does this happen, and since when? An estimate is fine.', hindi: 'Yeh kitni baar hota hai, aur kab se? Andaaza bhi theek hai.', purpose: 'Establish recurrence and label estimates honestly.', sample: 'About two or three times a day over the last week. That is an estimate, I have not kept a log.' },
 { key: 'impact', label: 'Business impact', question: 'What changes at the counter when this happens? Have you measured any lost sales, or mainly waiting time?', hindi: 'Isse counter par kya asar padta hai? Kya sale ka nuksaan measure kiya hai, ya sirf wait badhta hai?', purpose: 'Establish business impact without inventing revenue loss.', sample: 'Staff stop serving to check the app. Customers wait a few minutes. I have not measured lost sales.' },
 { key: 'workaround', label: 'Current workaround', question: 'How do you and your staff confirm the payment when the announcement is missing?', hindi: 'Awaaz nahi aane par aap aur staff payment kaise confirm karte hain?', purpose: 'Understand the real workflow before proposing a solution.', sample: 'We open the merchant app on my phone and match the payment amount. Only I have that phone.' },
 { key: 'attempts', label: 'Already attempted', question: 'What have you already tried, and what changed afterwards?', hindi: 'Ab tak kya try kiya hai, aur uske baad kya badla?', purpose: 'Avoid repeating advice and capture attempted fixes.', sample: 'We restarted the Soundbox. It worked for a while, then went silent again. We have not tested the connection.' },
 { key: 'constraints', label: 'Constraints', question: 'What limits a useful fix—for example, access to a phone, connectivity, time, or information you want kept private?', hindi: 'Solution mein kya rukawat hai—phone, network, waqt, ya koi private jaankari?', purpose: 'Capture operational constraints and confidentiality preferences.', sample: 'The shop is busiest in the morning. Staff cannot keep borrowing my phone. A customer named Ravi was affected; please keep his name private.' },
 { key: 'outcome', label: 'Useful outcome', question: 'What would a useful improvement look like for your shop?', hindi: 'Aapki dukaan ke liye achha improvement kaisa hoga?', purpose: 'Define success in the merchant’s terms.', sample: 'Staff should be able to confirm a payment quickly without stopping the queue or borrowing my phone.' },
];
export const uid = () => typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
export const labelFor = (key: Topic) => topics.find(t => t.key === key)?.label || 'Affected payment value';
export function scrub(text: string, terms: string[] = []): string {
 let s = text.replace(/\b[A-Z]{5}\d{4}[A-Z]\b/gi, '[identity removed]').replace(/\b\d{4}[ -]?\d{4}[ -]?\d{4}(?:[ -]?\d{4})?\b/g, '[number removed]').replace(/(?<!\d)(?:\+91[ -]?)?[6-9]\d{9}(?!\d)/g, '[phone removed]').replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, '[email removed]').replace(/\b(?:OTP|UPI PIN|password|passcode)\s*(?:is|:|=)?\s*\S+/gi, '[secret removed]');
 for (const term of terms.filter(x => x.trim())) s = s.replace(new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), '[detail removed]');
 return s;
}
export function greeting(language: string): Turn { return { id: uid(), role: 'agent', text: language === 'hi-IN' ? topics[0].hindi : topics[0].question, topic: 'symptom', at: Date.now() }; }
export function newSession(language = 'en-IN', synthetic = false): Session {
 const at = Date.now();
 return { id: `ML-${uid().slice(0, 8).toUpperCase()}`, alias: synthetic ? 'Neighbourhood Kirana' : 'Merchant interview', business: 'Small retail', language, turns: [greeting(language)], facts: [], version: 1, approvedInternal: null, approvedPublic: null, status: 'interviewing', summary: '', audit: [{ id: uid(), text: 'Interview consent recorded. Audio is not retained by MerchantLens.', at }], synthetic, createdAt: at, provider: 'guided' };
}
export function upsert(facts: Fact[], fact: Fact): Fact[] { const old = facts.find(f => f.topic === fact.topic); return [...facts.filter(f => f.topic !== fact.topic), { ...fact, previous: old && old.turnId !== fact.turnId && old.value !== fact.value ? old.value : old?.previous }]; }
export function guidedInterview(turns: Turn[], oldFacts: Fact[], language = 'en-IN'): AgentResult {
 const last = turns.filter(t => t.role === 'merchant').at(-1)!;
 const prompt = [...turns].reverse().find(t => t.role === 'agent'); const text = last.text; let facts = [...oldFacts];
 const add = (topic: Topic, value: string, kind: Fact['kind'] = 'reported') => { facts = upsert(facts, { id: uid(), topic, label: labelFor(topic), value, quote: text, turnId: last.id, kind }); };
 if (/ignore (?:all |previous |your )?instructions|system prompt|mark .*verified|approve (?:everything|this)/i.test(text)) return { response: 'I can capture your experience, but approval happens in the review screen. What happened at your shop?', topic: 'symptom', facts, ready: false, purpose: 'Keep participant instructions separate from evidence and approvals.', provider: 'guided' };
 const stop = /^(?:stop|finish|end|that.s all|done)[.!\s]*$/i.test(text.trim());
 if (!stop) {
  if (prompt?.topic && prompt.topic !== 'affected_value') add(prompt.topic, text, /about|estimate|roughly|around|two or three|andaaz/i.test(text) ? 'estimate' : 'reported');
  if (/soundbox|sound box|speaker|awaaz/i.test(text) && /silent|missing|no sound|not working|chup|nahi|damag|broken|crack/i.test(text)) add('symptom', /damag|broken|crack/i.test(text) ? 'Merchant reports a damaged Soundbox device.' : 'Merchant reports missing or delayed Soundbox audio confirmation at checkout.');
  if (/app.*(?:success|received|show|entry)|(?:success|received).*app/i.test(text)) add('payment_status', text);
  if (/bank|statement|settlement/i.test(text) && /not checked|haven.t checked|unknown|don.t know|nahi|not received|credit|checked/i.test(text)) add('settlement', text);
  if (/times? (?:a|per) day|daily|every day|haft|roz|since.*week/i.test(text)) add('frequency', text, 'estimate');
  if (/restart|reboot|reset|already tried/i.test(text)) add('attempts', text);
  if (prompt?.topic === 'affected_value' || /(?:₹|rs\.?|rupees?)\s*[\d,]+|[\d,]+\s*rupees/i.test(text)) {
   const corrected = /not.*(?:loss|lost)|(?:affected|payment) value|value of.*payment|correction/i.test(text);
   add('affected_value', corrected ? `${text} Amount is affected payment value; financial loss is not established.` : `${text} Amount meaning requires clarification; financial loss is not established.`);
  }
 }
 const amount = facts.find(f => f.topic === 'affected_value');
 if (!stop && amount?.value.includes('requires clarification') && prompt?.topic !== 'affected_value') return { response: language === 'hi-IN' ? 'Yeh amount affected payments ka hai, ya aapne actual nuksaan confirm kiya hai?' : 'Is that amount the value of affected payments, or have you confirmed an actual financial loss?', topic: 'affected_value', facts, ready: false, purpose: 'Clarify payment value versus financial loss before recording impact.', provider: 'guided' };
 const next = topics.find(t => !facts.some(f => f.topic === t.key));
 if (stop || !next) return { response: language === 'hi-IN' ? 'Shukriya. Draft taiyaar hai. Review karke galti sudhaariye aur share karne se pehle approve kijiye.' : 'Thank you. Your draft is ready for review. Check the details, remove anything private, and approve each version before exporting.', facts, ready: true, purpose: stop ? 'Respect early finish and preserve unanswered questions.' : 'Return control to the merchant before handoff.', provider: 'guided' };
 const damaged = facts.some(f => f.topic === 'symptom' && /damag|broken|crack/i.test(f.value));
 let question = language === 'hi-IN' ? next.hindi : next.question;
 if (damaged && next.key === 'payment_status') question = language === 'hi-IN' ? 'Soundbox damage ke baad merchant app mein payment entries dikh rahi hain?' : 'Since the device was damaged, are payment entries still appearing in the merchant app?';
 if (damaged && next.key === 'attempts') question = language === 'hi-IN' ? 'Device ke damage ke liye ab tak support se baat ki hai?' : 'Have you already contacted support about the damage, and what happened?';
 return { response: question, topic: next.key, facts, ready: false, purpose: next.purpose, provider: 'guided' };
}
export function applyResult(s: Session, merchantTurn: Turn, result: AgentResult): Session {
 const at = Date.now(); const corrections = result.facts.filter(f => f.previous && !s.facts.some(o => o.topic === f.topic && o.value === f.value));
 return { ...s, turns: [...s.turns, merchantTurn, { id: uid(), role: 'agent', text: result.response, topic: result.topic, at }], facts: result.facts, provider: result.provider, runs: result.run ? [...(s.runs || []), result.run].slice(-30) : s.runs, version: s.version + 1, approvedInternal: null, approvedPublic: null, summary: '', status: result.ready ? 'review' : 'interviewing', audit: [...s.audit, { id: uid(), text: `${result.provider === 'gemini' ? 'Gemini' : 'Guided engine'} processed an answer. ${result.purpose}`, at }, ...corrections.map(f => ({ id: uid(), text: `${f.label} corrected; earlier claim superseded.`, at }))] };
}
export function finishSession(s: Session): Session { return { ...s, status: 'review', version: s.version + 1, approvedInternal: null, approvedPublic: null }; }
export function mutate(s: Session, text: string): Session { return { ...s, version: s.version + 1, approvedInternal: null, approvedPublic: null, status: s.status === 'interviewing' ? 'interviewing' : 'review', audit: [...s.audit, { id: uid(), text, at: Date.now() }] }; }
export function correctFact(s: Session, id: string, value: string): Session {
 const original = s.facts.find(f => f.id === id);
 if (!original || !value.trim()) return s;
 const text = scrub(value.trim());
 const turn: Turn = { id: uid(), role: 'merchant', text, at: Date.now(), topic: original.topic };
 return { ...mutate(s, `${original.label} corrected by merchant during review. Prior approvals invalidated.`), summary: '', turns: [...s.turns, turn], facts: s.facts.map(f => f.id === id ? { ...f, id: uid(), value: text, quote: text, turnId: turn.id, previous: f.value } : f) };
}
export function redactSession(s: Session, term: string): Session {
 if (!term.trim()) return s; const clean = (v: string) => scrub(v, [term.trim()]);
 const deepClean = (value: unknown): unknown => typeof value === 'string' ? clean(value) : Array.isArray(value) ? value.map(deepClean) : value && typeof value === 'object' ? Object.fromEntries(Object.entries(value).map(([k,v]) => [k, deepClean(v)])) : value;
 return { ...mutate(s, 'A private detail was removed from retained text. Prior approvals invalidated.'), runs: s.runs ? deepClean(s.runs) as RunTrace[] : undefined, alias: clean(s.alias), business: clean(s.business), summary: clean(s.summary), turns: s.turns.map(t => ({ ...t, text: clean(t.text) })), facts: s.facts.map(f => ({ ...f, value: clean(f.value), quote: clean(f.quote), previous: f.previous ? clean(f.previous) : undefined })), audit: [...s.audit.map(a => ({ ...a, text: clean(a.text) })), { id: uid(), text: 'A private detail was removed from retained text. Prior approvals invalidated.', at: Date.now() }] };
}
export function completeness(s: Session) { return Math.round(topics.filter(t => s.facts.some(f => f.topic === t.key)).length / topics.length * 100); }
export function unknowns(s: Session) { return [...topics.filter(t => !s.facts.some(f => f.topic === t.key)).map(t => t.label), 'Root cause is not independently verified', 'Financial loss is not independently verified', 'Bank settlement has not been independently verified']; }
export function problemStatement(s: Session) { if (s.summary) return s.summary; const f = s.facts.find(f => f.topic === 'symptom'); return f ? `The merchant reports: ${f.value} Operational impact and underlying cause require investigation; merchant statements are not independent payment verification.` : 'An incomplete merchant interview. Further detail is needed before investigation.'; }
export function publicFact(f: Fact) {
 const values: Record<Topic, string> = {
  symptom: /damag|broken|crack/i.test(f.value) ? 'A retailer reports a damaged payment announcement device.' : 'A retailer reports a payment-confirmation problem at checkout.',
  payment_status: /success|received/i.test(f.value) ? 'The merchant reports that the business app displays payment entries. Not independently verified.' : 'Payment-entry visibility was discussed; independent record review is needed.',
  settlement: /not checked|unknown|don.t know|nahi/i.test(f.value) ? 'Bank settlement has not been checked or remains unknown.' : 'A settlement experience was reported; authorized bank-record review is needed.',
  frequency: 'The merchant reports recurrence; precise counts are omitted from this version.',
  impact: 'Checkout disruption was discussed. Financial impact is unverified.',
  workaround: 'A payment-confirmation workaround was described; details remain in the private brief.',
  attempts: 'Prior troubleshooting was reported; effectiveness requires verification.',
  constraints: 'Operational constraints and confidentiality preferences were captured privately.',
  outcome: 'A desired improvement was captured; confirm the goal with the merchant before solution design.',
  affected_value: 'A payment amount was discussed. It must not be interpreted as verified financial loss.',
 }; return values[f.topic];
}
export function makeBrief(s: Session, audience: 'internal' | 'public') {
 const pub = audience === 'public';
 const hasSymptom=s.facts.some(f=>f.topic==='symptom');
 return {
  id: pub ? 'ANONYMIZED' : s.id, version: s.version, audience: pub ? 'Anonymized builder brief' : 'Internal investigation brief', synthetic: s.synthetic,
  approval: (pub ? s.approvedPublic : s.approvedInternal) === s.version ? 'Approved by merchant for this version' : 'Draft — not approved',
  merchant: pub ? 'Anonymous small retailer' : scrub(s.alias),
  problem: pub ? (hasSymptom?`A small retailer reports ${s.facts.some(f => f.topic === 'symptom' && /damag|broken|crack/i.test(f.value)) ? 'a damaged payment announcement device' : 'a payment-confirmation problem at checkout'}. Investigate the reported workflow and impact; root cause and financial loss remain unverified.`:'An incomplete merchant interview. Further detail is needed before a problem can be stated.') : scrub(problemStatement(s)),
  observations: s.facts.map(f => ({ topic: f.label, statement: pub ? publicFact(f) : scrub(f.value), basis: f.kind === 'estimate' ? 'Merchant estimate; unverified' : 'Merchant report; unverified', evidence: pub ? 'Source retained in private interview' : f.turnId, ...(!pub ? { quote: scrub(f.quote) } : {}) })),
  unknowns: unknowns(s), hypotheses: hasSymptom?['Device, audio delivery, and connectivity are possible investigation areas, not established causes.']:[],
  next_steps: ['Review a merchant-approved incident example and its payment record.', 'Check audio/device events separately from payment and settlement records.', 'Observe the checkout workaround and measure queue disruption.', 'Confirm recurrence before prioritizing a product change.'],
  proposed_success_measures: ['Time needed for staff to confirm a payment', 'Frequency of checkout interruptions', 'Completeness of evidence at handoff'],
  routing: !hasSymptom?'More merchant information is required before routing.':s.facts.some(f => f.topic === 'symptom' && /damag|broken|crack/i.test(f.value)) ? 'Merchant device operations — damage reported; human assessment needed' : 'Merchant operations → payments/device product investigation; human triage needed',
  limitations: ['No live Paytm connection or independent transaction verification.', 'Reported experiences do not establish financial loss or root cause.', 'Public output uses conservative topic templates; review for contextual re-identification before sharing.'],
 };
}
export function briefMarkdown(s: Session, audience: 'internal' | 'public') {
 const b = makeBrief(s, audience);
 return `# MerchantLens · ${b.audience}\n\n${b.id} · Version ${b.version} · ${b.approval}\n${b.synthetic ? '\nSYNTHETIC DEMONSTRATION DATA\n' : ''}\n## Problem\n${b.problem}\n\n## Observations\n${b.observations.map(o => `- **${o.topic}:** ${o.statement}\n  Basis: ${o.basis}. Evidence: ${o.evidence}`).join('\n')}\n\n## Unknowns\n${b.unknowns.map(x => `- ${x}`).join('\n')}\n\n## Investigation\n${b.next_steps.map(x => `- ${x}`).join('\n')}\n\n## Suggested routing\n${b.routing}\n\n## Limitations\n${b.limitations.map(x => `- ${x}`).join('\n')}\n`;
}
export function seededSessions(): Session[] {
 let main = newSession('en-IN', true); main.id = 'ML-0181'; main.alias = 'Neighbourhood Kirana';
 for (let i = 0; i < 15 && main.status === 'interviewing'; i++) {
  const topic = main.turns.filter(t => t.role === 'agent').at(-1)?.topic;
  const text = topic === 'affected_value' ? 'Correction: ₹2,400 was affected payment value, not a confirmed loss.' : topics.find(t => t.key === topic)?.sample || 'Done';
  const turn: Turn = { id: uid(), role: 'merchant', text, at: main.createdAt + main.turns.length * 9000 }; main = applyResult(main, turn, guidedInterview([...main.turns, turn], main.facts));
 }
 main.status = 'review';
 let damage = newSession('en-IN', true); damage.id = 'ML-0182'; damage.alias = 'Corner Chai'; damage.business = 'Food & beverage';
 const t: Turn = { id: uid(), role: 'merchant', text: 'Our Soundbox was damaged when it fell off the counter. The app still shows payments. I need to understand the replacement process.', at: Date.now() }; damage = applyResult(damage, t, guidedInterview([...damage.turns, t], []));
 let third = newSession('en-IN', true); third.id = 'ML-0183'; third.alias = 'Local Fresh Mart';
 const t3: Turn = { id: uid(), role: 'merchant', text: 'The Soundbox is sometimes silent. We ask customers to wait while we check the payment on a phone.', at: Date.now() }; third = applyResult(third, t3, guidedInterview([...third.turns, t3], []));
 return [main, damage, third];
}
