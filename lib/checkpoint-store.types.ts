export type CheckpointRow = { version: number; payload: string; updatedAt: number; revision?: string };
export interface CheckpointStore {
 get(owner: string, id: string): Promise<CheckpointRow | null>;
 list(owner: string): Promise<{session_id:string;version:number;updated_at:number}[]>;
 write(owner: string, id: string, row: CheckpointRow, previous: CheckpointRow | null): Promise<boolean>;
}
