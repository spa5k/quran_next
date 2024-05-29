import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";

const dbPath = `./src/db/quran.db`;
const currentDir = process.cwd();
console.log("🚀 ~ file: index.ts ~ line 1 ~ currentDir", currentDir);

const sqlite = new Database(dbPath);
export const db = drizzle(sqlite, { schema });
