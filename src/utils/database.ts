import * as SQLite from 'expo-sqlite';
import { FastRecord } from '../types';

let db: SQLite.SQLiteDatabase | null = null;

export async function initDatabase(): Promise<void> {
  db = await SQLite.openDatabaseAsync('fastsimple.db');
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS fasts (
      id TEXT PRIMARY KEY,
      start_time TEXT NOT NULL,
      end_time TEXT NOT NULL,
      target_hours REAL NOT NULL,
      actual_hours REAL NOT NULL,
      goal_met INTEGER NOT NULL,
      plan TEXT NOT NULL,
      note TEXT DEFAULT ''
    );
  `);
}

function getDB(): SQLite.SQLiteDatabase {
  if (!db) throw new Error('Database not initialized');
  return db;
}

export async function insertFast(record: FastRecord): Promise<void> {
  await getDB().runAsync(
    `INSERT INTO fasts (id, start_time, end_time, target_hours, actual_hours, goal_met, plan, note) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    record.id,
    record.start_time,
    record.end_time,
    record.target_hours,
    record.actual_hours,
    record.goal_met ? 1 : 0,
    record.plan,
    record.note,
  );
}

export async function getFasts(): Promise<FastRecord[]> {
  const rows = await getDB().getAllAsync<{
    id: string;
    start_time: string;
    end_time: string;
    target_hours: number;
    actual_hours: number;
    goal_met: number;
    plan: string;
    note: string;
  }>('SELECT * FROM fasts ORDER BY start_time DESC');

  return rows.map((row) => ({
    ...row,
    goal_met: row.goal_met === 1,
  }));
}

export async function updateFast(id: string, updates: Partial<FastRecord>): Promise<void> {
  const fields: string[] = [];
  const values: (string | number)[] = [];

  if (updates.start_time !== undefined) { fields.push('start_time = ?'); values.push(updates.start_time); }
  if (updates.end_time !== undefined) { fields.push('end_time = ?'); values.push(updates.end_time); }
  if (updates.target_hours !== undefined) { fields.push('target_hours = ?'); values.push(updates.target_hours); }
  if (updates.actual_hours !== undefined) { fields.push('actual_hours = ?'); values.push(updates.actual_hours); }
  if (updates.goal_met !== undefined) { fields.push('goal_met = ?'); values.push(updates.goal_met ? 1 : 0); }
  if (updates.plan !== undefined) { fields.push('plan = ?'); values.push(updates.plan); }
  if (updates.note !== undefined) { fields.push('note = ?'); values.push(updates.note); }

  if (fields.length === 0) return;
  values.push(id);
  await getDB().runAsync(`UPDATE fasts SET ${fields.join(', ')} WHERE id = ?`, ...values);
}

export async function deleteFast(id: string): Promise<void> {
  await getDB().runAsync('DELETE FROM fasts WHERE id = ?', id);
}
