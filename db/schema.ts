import { sqliteTable, text, integer, primaryKey } from 'drizzle-orm/sqlite-core';
export const interviewCheckpoints = sqliteTable('interview_checkpoints', {
 ownerId: text('owner_id').notNull(),
 sessionId: text('session_id').notNull(),
 version: integer('version').notNull(),
 payload: text('payload').notNull(),
 updatedAt: integer('updated_at').notNull(),
}, table => [primaryKey({ columns: [table.ownerId, table.sessionId] })]);
