import type { Metadata } from "next";
import { PageHead } from "@/components/Bits";
import PassportView from "@/components/PassportView";
import { db } from "@/lib/data";

export const metadata: Metadata = { title: "Passport" };

export default async function Passport() {
  const [rooms, events, items] = await Promise.all([db.getRooms(), db.getEvents(), db.getCatalogue()]);
  return (
    <>
      <PageHead title="SAKURA Passport">Your identity in this culture, built from what you actually do.</PageHead>
      <PassportView rooms={rooms} events={events} items={items} />
    </>
  );
}
