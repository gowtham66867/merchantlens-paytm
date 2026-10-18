import { guidedInterview, scrub } from '@/lib/interview';
import { requestSchema } from '@/lib/provider';
import { runInterviewGraph } from '@/lib/agents/graph';
import { acceptsOrigin } from '@/lib/request-origin';
export async function POST(request: Request) {
 try {
  if (!acceptsOrigin(request)) return Response.json({ error: 'Cross-origin requests are not accepted.' }, { status: 403 });
  const body = await request.text();
  if (body.length > 150000) return Response.json({ error: 'Interview is too long. Finish this draft and start another interview.' }, { status: 413 });
  const input = requestSchema.parse(JSON.parse(body));
  if (input.turns.at(-1)?.role !== 'merchant') return Response.json({ error: 'The final turn must be a merchant answer.' }, { status: 400 });
  const turns = input.turns.map(t => ({ ...t, text: scrub(t.text) }));
  const facts = input.facts.map(f => ({ ...f, value: scrub(f.value), quote: scrub(f.quote), previous: f.previous ? scrub(f.previous) : undefined }));
  const result = await runInterviewGraph({turns, facts, language: input.language, mode: input.mode});
  return Response.json(result, { headers: { 'Cache-Control': 'no-store' } });
 } catch (error) {
  const message = error instanceof Error ? error.message : 'The interview could not be processed.';
  if (message.includes('Gemini') || message.includes('Evidence citation') || message.includes('budget')) return Response.json({ error: message }, { status: 503 });
  return Response.json({ error: 'The interview response could not be validated. Your answer is preserved; retry or use Guided demo.' }, { status: 400 });
 }
}
