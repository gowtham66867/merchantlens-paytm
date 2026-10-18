import type { Fact } from '../interview.ts';
import type { KnowledgeCard, ToolCall, ToolName } from './types.ts';
export const knowledgeCards: KnowledgeCard[] = [
 { id: 'PAYTM-MERCHANT-HELP', title: 'Official merchant support channel', text: 'Paytm publishes support channels for QR, Soundbox and card-machine concerns. Routing a draft to operations does not mean a support ticket has been created.', url: 'https://business.paytmpayments.com/contact-us', basis: 'official_source', tags: ['soundbox','support','damaged','device','payment','merchant'] },
 { id: 'PAYTM-DEVICE-DAMAGE', title: 'Soundbox damage intake', text: 'Paytm’s published damaged-Soundbox support article asks for a description and visual evidence. A voice report alone cannot establish hardware damage or authorize replacement.', url: 'https://business.paytm.com/support/my-sound-box-has-been-damaged-what-should-i-do', basis: 'official_source', tags: ['damaged','cracked','broken','replacement','device'] },
 { id: 'PAYTM-SETTLEMENT', title: 'Settlement investigation context', text: 'Paytm publishes settlement-support and reconciliation guidance. Authorized payment and settlement records are distinct investigation inputs; MerchantLens has access to neither.', url: 'https://www.paytmpayments.com/docs/settlement-support', basis: 'official_source', tags: ['bank','settlement','statement','reconciliation','credit'] },
 { id: 'RULE-MONEY-MEANING', title: 'Payment value does not prove loss', text: 'Before using a money amount, clarify whether it is affected payment value, unconfirmed settlement, or merchant-reported loss. None is independently verified by speech.', url: null, basis: 'design_rule', tags: ['amount','loss','lost','value','rupees','₹'] },
 { id: 'RULE-SEPARATE-SIGNALS', title: 'Separate the three payment signals', text: 'Ask separately about the merchant-app entry, bank credit, and spoken device announcement. An audio symptom does not establish a payment or bank-settlement failure.', url: null, basis: 'design_rule', tags: ['silent','soundbox','announcement','success','payment','audio'] },
];
export function retrieveContext(query: string): KnowledgeCard[] {
 const q = query.toLowerCase();
 return knowledgeCards.map(card => ({ card, score: card.tags.reduce((sum, tag) => sum + (q.includes(tag) ? 1 : 0), 0) })).filter(row => row.score > 0).sort((a,b) => b.score-a.score || a.card.id.localeCompare(b.card.id)).slice(0,3).map(row => row.card);
}
export function dispatchTool(name: ToolName, facts: Fact[], merchantTurnCount: number, query: string): { call: ToolCall; output: unknown; knowledge: KnowledgeCard[] } {
 switch(name) {
  case 'get_coverage': { const filled = [...new Set(facts.map(f => f.topic))]; return { call: {name,summary:'Read captured topics and interview length; no external access.',count:filled.length},output:{captured:filled,merchantTurns:merchantTurnCount},knowledge:[] }; }
  case 'inspect_evidence': return { call:{name,summary:'Resolve the current evidence graph with source IDs and reported/estimated status.',count:facts.length},output:facts.map(f=>({topic:f.topic,source:f.turnId,kind:f.kind,corrected:Boolean(f.previous)})),knowledge:[] };
  case 'retrieve_context': { const knowledge = retrieveContext(query);return { call:{name,summary:'Retrieve curated context from local source cards; no live web request.',count:knowledge.length},output:knowledge,knowledge }; }
  default: throw new Error('Tool is outside the read-only allowlist.');
 }
}
