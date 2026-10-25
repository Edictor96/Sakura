import { redirect } from "next/navigation";

export default async function Live({ searchParams }: { searchParams: Promise<{ city?: string }> }) {
  const { city } = await searchParams;
  redirect(city ? `/events?city=${encodeURIComponent(city)}` : "/events");
}
