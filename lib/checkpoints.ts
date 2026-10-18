import { interviewLanguages } from './languages.ts';
import { z } from 'zod';
import { requestSchema, turnSchema } from './provider.ts';
export const checkpointSchema=z.object({
 id:z.string().regex(/^ML-[A-Z0-9-]{1,50}$/),alias:z.string().max(100),business:z.string().max(100),language:z.enum(interviewLanguages),turns:z.array(turnSchema).min(1).max(120),facts:requestSchema.shape.facts,version:z.number().int().min(1).max(10000),approvedInternal:z.number().int().nullable(),approvedPublic:z.number().int().nullable(),status:z.enum(['interviewing','review','approved']),summary:z.string().max(12000),audit:z.array(z.object({id:z.string().max(100),text:z.string().max(2000),at:z.number()})).max(300),synthetic:z.boolean(),createdAt:z.number(),provider:z.enum(['guided','gemini']),runs:z.array(z.unknown()).max(30).optional(),
});
export function checkpointDecision(current:{version:number;payload:string;updatedAt?:number}|null,incoming:{version:number;payload:string;expectedSavedAt?:number}):'insert'|'update'|'idempotent'|'conflict'{
 if(!current)return'insert';
 if(current.version>incoming.version)return'conflict';
 if(current.version===incoming.version){if(current.payload===incoming.payload)return'idempotent';return incoming.expectedSavedAt!==undefined&&incoming.expectedSavedAt===current.updatedAt?'update':'conflict';}
 return'update';
}
