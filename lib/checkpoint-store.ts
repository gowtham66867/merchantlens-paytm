import { env } from 'cloudflare:workers';
import { getChatGPTUser } from '../app/chatgpt-auth';
import type { CheckpointStore, CheckpointRow } from './checkpoint-store.types';
export async function checkpointContext(): Promise<{owner:string|null;store:CheckpointStore|null}> {
 const user=await getChatGPTUser();const db=env.DB;
 if(!db)return{owner:user?.userId||null,store:null};
 const store:CheckpointStore={
  async get(owner,id){const r=await db.prepare('SELECT version,payload,updated_at FROM interview_checkpoints WHERE owner_id = ? AND session_id = ?').bind(owner,id).first<{version:number;payload:string;updated_at:number}>();return r?{version:r.version,payload:r.payload,updatedAt:r.updated_at}:null;},
  async list(owner){const r=await db.prepare('SELECT session_id, version, updated_at FROM interview_checkpoints WHERE owner_id = ? ORDER BY updated_at DESC LIMIT 30').bind(owner).all<{session_id:string;version:number;updated_at:number}>();return r.results;},
  async write(owner,id,row:CheckpointRow,previous){const r=previous
   ?await db.prepare('UPDATE interview_checkpoints SET version = ?, payload = ?, updated_at = ? WHERE owner_id = ? AND session_id = ? AND version = ? AND updated_at = ?').bind(row.version,row.payload,row.updatedAt,owner,id,previous.version,previous.updatedAt).run()
   :await db.prepare('INSERT OR IGNORE INTO interview_checkpoints (owner_id,session_id,version,payload,updated_at) VALUES (?,?,?,?,?)').bind(owner,id,row.version,row.payload,row.updatedAt).run();return Boolean(r.meta.changes);}
 };
 return{owner:user?.userId||null,store};
}
