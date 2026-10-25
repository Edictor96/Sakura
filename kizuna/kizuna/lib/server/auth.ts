import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { prisma } from "./db/prisma";

const DEMO_USER_ID = "user-demo";

function usernameFromEmail(email: string) {
  return email.split("@")[0].toLowerCase().replace(/[^a-z0-9_]+/g, "-").replace(/^-|-$/g, "").slice(0, 24) || "sakura-user";
}

async function readAuthUser() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return null;
  const cookieStore = await cookies();
  const client = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (values) => values.forEach(({ name, value, options }) => cookieStore.set(name, value, options)),
    },
  });
  const { data: { user }, error } = await client.auth.getUser();
  if (error || !user?.email) return null;
  return user;
}

async function provisionUser(email: string, metadata: Record<string, unknown>) {
  const existing = await prisma.user.findUnique({ where: { email } });
  const name = typeof metadata.full_name === "string" ? metadata.full_name : typeof metadata.name === "string" ? metadata.name : undefined;
  const avatarUrl = typeof metadata.avatar_url === "string" ? metadata.avatar_url : undefined;
  if (existing) return prisma.user.update({ where: { id: existing.id }, data: { name: name ?? existing.name, avatarUrl: avatarUrl ?? existing.avatarUrl } });
  const base = usernameFromEmail(email);
  let username = base;
  let suffix = 1;
  while (await prisma.user.findUnique({ where: { username } })) username = `${base}-${suffix++}`;
  return prisma.user.create({ data: { email, username, name: name ?? username, avatarUrl } });
}

export async function getCurrentUser() {
  const authUser = await readAuthUser();
  return authUser?.email ? provisionUser(authUser.email, authUser.user_metadata ?? {}) : prisma.user.findUnique({ where: { id: DEMO_USER_ID } });
}

export async function requireCurrentUser() {
  const authUser = await readAuthUser();
  return authUser?.email ? provisionUser(authUser.email, authUser.user_metadata ?? {}) : null;
}
