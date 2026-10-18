import {test} from 'node:test';import assert from 'node:assert/strict';
import {newSession,guidedInterview,type Turn} from '../lib/interview.ts';
import {runInterviewGraph} from '../lib/agents/graph.ts';
import {isStop,rankQuestions} from '../lib/agents/reasoning.ts';
import {requestSchema} from '../lib/provider.ts';import {checkpointSchema} from '../lib/checkpoints.ts';
import {speechLocale,hasRequestedScript,transcriptionInstruction} from '../lib/languages.ts';
for(const [language,speech,stop] of [['hi-IN','मेरे साउंडबॉक्स से आवाज़ नहीं आती।','रोकिए'],['kn-IN','ನನ್ನ ಸೌಂಡ್‌ಬಾಕ್ಸ್‌ನಲ್ಲಿ ಧ್ವನಿ ಬರುತ್ತಿಲ್ಲ.','ನಿಲ್ಲಿಸಿ']])test(`${language} supports native prompts, exact native sources, stop and checkpoint round-trip`,async()=>{
 const s=newSession(language);assert(hasRequestedScript(s.turns[0].text,language));assert.equal(checkpointSchema.parse(s).language,language);
 const t:Turn={id:'m1',role:'merchant',text:speech,at:1};const input={mode:'guided' as const,language,turns:[...s.turns,t],facts:[]};assert.equal(requestSchema.parse(input).language,language);
 const r=await runInterviewGraph(input);assert(hasRequestedScript(r.response,language));assert.equal(r.facts[0].quote,speech);
 assert(isStop(stop));const done=await runInterviewGraph({...input,mode:'gemini',turns:[...s.turns,{...t,text:stop}]},async()=>{throw Error('Must not call model after stop');});assert(done.ready);assert(hasRequestedScript(done.response,language));
 const candidates=rankQuestions(input.turns,r.facts,[{id:'c',type:'amount_ambiguity',topic:'affected_value',summary:'Amount unclear',question:'What does that amount mean?',turnIds:['m1'],resolved:false}],language);assert(hasRequestedScript(candidates[0].question,language));
});
test('romanized Hindi stays selectable while native Hindi and Kannada retain their scripts',()=>{assert.match(newSession('hi-Latn-IN').turns[0].text,/Apni/);assert.equal(speechLocale('hi-Latn-IN'),'hi-IN');assert.match(transcriptionInstruction('hi-IN'),/Devanagari/);assert.match(transcriptionInstruction('kn-IN'),/Kannada script/);assert.match(transcriptionInstruction('hi-Latn-IN'),/Romanize/);});
test('native language gate rejects an English planner output and uses a localized candidate',async()=>{const s=newSession('kn-IN');const r=await runInterviewGraph({turns:[...s.turns,{id:'m1',role:'merchant',text:'ನನ್ನ ಅಂಗಡಿಯಲ್ಲಿ ಸಮಸ್ಯೆ ಇದೆ.',at:1}],facts:[],language:'kn-IN',mode:'gemini'},async q=>({inputTokens:1,outputTokens:1,value:q.role==='extractor'?{claims:[],tool_requests:[]}:q.role==='critic'?{rejected_topics:[],challenges:[],summary:'Missing detail'}:{topic:'symptom',question:'What happened?',reason:'Clarify'}}));assert(hasRequestedScript(r.response,'kn-IN'));assert.match(r.purpose,/Code gate/);});
test('native language script validation permits English terms but rejects unrelated scripts',async()=>{const {hasUnexpectedScript}=await import('../lib/languages.ts');assert.equal(hasUnexpectedScript('ನನ್ನ Soundbox ಮೌನವಾಗಿದೆ.','kn-IN'),false);assert.equal(hasUnexpectedScript('نننا ಅಂಗಡಿಯಲ್ಲಿ','kn-IN'),true);assert.equal(hasUnexpectedScript('मेरी दुकान में ऐप','hi-IN'),false);assert.equal(hasUnexpectedScript('ನನ್ನ दुकान','hi-IN'),true);});
