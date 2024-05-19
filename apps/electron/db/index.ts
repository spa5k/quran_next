import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { ayah } from "./schema.js";

const sqlite = new Database("sqlite.db");
const db = drizzle(sqlite);

db.select().from(ayah);
