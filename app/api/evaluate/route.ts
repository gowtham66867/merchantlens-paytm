import { evaluateGraph } from '@/lib/agents/evaluation';
import { acceptsOrigin } from '@/lib/request-origin';
export async function POST(request:Request){
 if(!acceptsOrigin(request))return Response.json({error:'Cross-origin requests are not accepted.'},{status:403});
 return Response.json(await evaluateGraph(),{headers:{'Cache-Control':'no-store'}});
}
