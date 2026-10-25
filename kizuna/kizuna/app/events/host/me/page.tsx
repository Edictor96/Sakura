import type { Metadata } from "next";
import HostProfile from "./HostProfile";

export const metadata: Metadata = { title: "My host page" };

export default function MyHostPage() {
  return <HostProfile />;
}
