import {acceptsOrigin} from '@/lib/request-origin';
import {interviewLanguages} from '@/lib/languages';
import {scrub} from '@/lib/interview';
import {generateSpeech} from '@/lib/speech';
// Demo instance budget, not a distributed production rate limiter.
let started=0, requests=0;
export async function POST(request:Request){
 const headers={'Cache-Control':'no-store'};
 if(!acceptsOrigin(request))return Response.json({error:'Cross-origin requests are not accepted.'},{status:403,headers});
 if(request.headers.get('x-speech-consent')!=='yes')return Response.json({error:'Speech processing consent is required.'},{status:400,headers});
 if(Date.now()-started>=60000){started=Date.now();requests=0;}
 if(requests>=20)return Response.json({error:'Voice is busy. Please try again shortly.'},{status:429,headers:{...headers,'Retry-After':'60'}});
 try{
  const raw=await request.text();if(raw.length>6000)return Response.json({error:'Speech request is too large.'},{status:413,headers});
  const body=JSON.parse(raw);
  if(typeof body.text!=='string'||!body.text.trim()||body.text.length>1200||!interviewLanguages.includes(body.language))return Response.json({error:'Invalid speech request.'},{status:400,headers});
  requests++;
  const bytes=await generateSpeech(scrub(body.text),body.language);
  return new Response(bytes.buffer as ArrayBuffer,{headers:{...headers,'Content-Type':'audio/wav','X-Voice-Provider':'Gemini'}});
 }catch{return Response.json({error:'Speech is temporarily unavailable. Use device playback or read the question.'},{status:503,headers});}
}
