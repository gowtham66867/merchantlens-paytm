export async function GET() {
 return Response.json({ configured: Boolean(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY), model: process.env.GEMINI_MODEL || 'gemini-2.5-flash', publicDemo:process.env.PUBLIC_DEMO==='true', voice: {provider:'Gemini', ttsModel:process.env.GEMINI_TTS_MODEL||'gemini-3.8-flash-lite-tts', vad:'Local energy-based pause detection'}, storage: 'Browser local storage; audio not retained', paytm: 'Not connected' }, { headers: { 'Cache-Control': 'no-store' } });
}
