export type HostProposalStatus = "Pending Review" | "Listed";

export interface HostProposal {
  id: string;
  title: string;
  eventType: string;
  franchise: string;
  date: string;
  time: string;
  venue: string;
  city: string;
  capacity: number;
  description: string;
  groupSlug: string;
  partnerBusiness: string;
  status: HostProposalStatus;
  submittedAt: string;
}

export const hostEventTypes = [
  "Micro Meet",
  "Cosplay Walk",
  "Manga Circle",
  "Workshop",
  "Themed Night",
  "Pop-up",
  "Watch-Along",
  "In-game Companion",
] as const;

export const hostCities = ["Delhi", "Mumbai", "Bengaluru", "Pune", "Chandigarh", "Amritsar", "Hyderabad", "Kolkata"];

export const hostProfile = {
  name: "Mira Kapoor",
  initials: "MK",
  level: "Level 2",
  hostedCount: 3,
  verified: true,
  note: "Demo host profile. Verified Host is a prototype trust signal, not identity-verification infrastructure.",
};
