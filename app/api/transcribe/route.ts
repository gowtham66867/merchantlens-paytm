import { acceptsOrigin } from '@/lib/request-origin';
import { scrub } from '@/lib/interview';
import { AudioInputError,readAudio,transcribeAudio } from '@/lib/transcription';
export async function POST(request:Request){
 if(!acceptsOrigin(request))return Response.json({error:'Cross-origin requests are not accepted.'},{status:403});
 if(request.headers.get('x-audio-consent')!=='yes')return Response.json({error:'Audio transcription consent is required.'},{status:400});
 try{
  const {bytes,mime}=await readAudio(request);const transcript=scrub(await transcribeAudio(bytes,mime));
  return Response.json({transcript},{headers:{'Cache-Control':'no-store'}});
 }catch(e){return Response.json({error:e instanceof AudioInputError?e.message:e instanceof Error&&/Transcription|provider unavailable/.test(e.message)?e.message:'Audio transcription failed. Please record again or type your answer.'},{status:e instanceof AudioInputError?e.status:503,headers:{'Cache-Control':'no-store'}});}
}
