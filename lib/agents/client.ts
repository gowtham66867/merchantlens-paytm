import type { ModelClient } from './types.ts';
export const geminiClient: ModelClient = async request => {
 const key = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
 if (!key) throw new Error('Gemini is not configured. Add GEMINI_API_KEY on the server, or select Guided demo.');
 const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
 const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, { method:'POST',headers:{'Content-Type':'application/json','x-goog-api-key':key},body:JSON.stringify({systemInstruction:{parts:[{text:request.system}]},contents:[{role:'user',parts:[{text:JSON.stringify(request.data)}]}],generationConfig:{temperature:0.15,maxOutputTokens:4500,responseMimeType:'application/json',responseJsonSchema:request.schema}}),signal:request.signal });
 if (!response.ok) throw new Error(response.status===429 ? 'Gemini rate limit reached. Your answer is preserved; retry shortly.' : `Gemini request failed (${response.status}). Check server configuration.`);
 const result = await response.json() as { candidates?: { content?: { parts?: { text?:string;thought?:boolean }[] } }[]; usageMetadata?: { promptTokenCount?: number; candidatesTokenCount?: number } };
 const value = result.candidates?.[0]?.content?.parts?.filter(p=>!p.thought).map(p=>p.text||'').join('');
 if (!value) throw new Error('Gemini returned no usable response. Your answer is preserved.');
 return {value:JSON.parse(value),inputTokens:result.usageMetadata?.promptTokenCount||0,outputTokens:result.usageMetadata?.candidatesTokenCount||0};
};
