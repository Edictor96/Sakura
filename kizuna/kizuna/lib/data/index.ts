import type { DataApi } from "../types";
import { api as mock } from "./mock";
import { api as prisma } from "./prisma";
import { api as supa } from "./supabase";

const hasDatabase = Boolean(process.env.DATABASE_URL);
const hasSupabase = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL
  && (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY),
);

export const db: DataApi = hasDatabase ? prisma : hasSupabase ? supa : mock;
export const usingSampleData = !hasDatabase && !hasSupabase;
