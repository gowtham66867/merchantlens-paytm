import {speechLocale} from './languages.ts';
export async function generateSpeech(text: string, language: string, fetcher: typeof fetch = fetch): Promise<Uint8Array> {
 const key=process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
 if(!key)throw Error('Speech is not configured.');
 const model=process.env.GEMINI_TTS_MODEL || 'gemini-3.8-flash-lite-tts';
 const response=await fetcher(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,{
  method:'POST',headers:{'Content-Type':'application/json','x-goog-api-key':key},signal:AbortSignal.timeout(18000),
  body:JSON.stringify({contents:[{role:'user',parts:[{text,speech_metadata:{style:`Warm, calm, clear interviewer. Unhurried conversational pacing. Speak in ${speechLocale(language)}; preserve the supplied words and language.`}}]}],generationConfig:{responseModalities:['AUDIO'],speechConfig:{voiceConfig:{voice:'Kore'}}}})
 });
 if(!response.ok)throw Error('Speech provider unavailable.');
 const result=await response.json() as {candidates?:{content?:{parts?:{inlineData?:{data?:string;mimeType?:string}}[]}}[]};
 const audio=result.candidates?.[0]?.content?.parts?.find(p=>p.inlineData)?.inlineData;
 if(audio?.mimeType!=='audio/wav' || !audio.data || audio.data.length>6_000_000)throw Error('Speech response could not be validated.');
 const bytes=Buffer.from(audio.data,'base64');
 if(bytes.length<44 || bytes.toString('ascii',0,4)!=='RIFF' || bytes.toString('ascii',8,12)!=='WAVE')throw Error('Speech response could not be validated.');
 return new Uint8Array(bytes);
}
