import type { DataApi } from "../types";
import { api as mock } from "./mock";
import { api as supa } from "./supabase";

// One switch for the whole app: sample data until both Supabase variables are set.
const hasSupabase = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

export const db: DataApi = hasSupabase ? supa : mock;
export const usingSampleData = !hasSupabase;
