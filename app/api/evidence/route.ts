import {acceptsOrigin} from '@/lib/request-origin';
import {analyseImage,readImage,ImageInputError} from '@/lib/photo-evidence';
import {scrub} from '@/lib/interview';
let windowStart=0,calls=0;
export async function POST(request:Request){
 const headers={'Cache-Control':'no-store'};
 if(!acceptsOrigin(request))return Response.json({error:'Cross-origin requests are not accepted.'},{status:403,headers});
 if(request.headers.get('x-image-consent')!=='yes')return Response.json({error:'Image processing consent is required.'},{status:400,headers});
 if(Date.now()-windowStart>60000){windowStart=Date.now();calls=0;}if(++calls>20)return Response.json({error:'Demo image limit reached. Try again in a minute or enter a note.'},{status:429,headers});
 try{const {bytes,mime}=await readImage(request);const result=await analyseImage(bytes,mime);const digest=Buffer.from(await crypto.subtle.digest('SHA-256',bytes)).toString('hex');return Response.json({digest,observations:result.observations.map(x=>scrub(x)),uncertainties:result.uncertainties.map(x=>scrub(x)),suggestedQuestion:scrub(result.suggestedQuestion),basis:'Provisional visual observations; not payment or authenticity verification'},{headers});}
 catch(e){return Response.json({error:e instanceof ImageInputError?e.message:'Image analysis failed. Your existing interview is unchanged; retry or enter a manual note.'},{status:e instanceof ImageInputError?e.status:503,headers});}
}
