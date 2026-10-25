export type EventMode = "offline" | "online" | "convention";
export type EventType =
  | "Micro Meet"
  | "City Event"
  | "Pop-up"
  | "Cosplay Walk"
  | "Manga Circle"
  | "Watch-along"
  | "In-game Companion"
  | "Convention";
export type EventStatus = "Upcoming" | "Happening Soon" | "Live" | "Full" | "Waitlist" | "Past";

export interface EventHost {
  id: string;
  name: string;
  handle: string;
  initials: string;
  verified: true;
  bio: string;
}

export interface EventCity {
  id: string;
  name: string;
  kind: "city" | "online";
}

export interface EventGroup {
  id: string;
  name: string;
  glyph: string;
  color: string;
}

export interface EventFranchise {
  id: string;
  name: string;
  kind: "anime" | "manga" | "music" | "game";
}

export interface EventRecap {
  id: string;
  title: string;
  note: string;
}

export interface EventBadge {
  id: string;
  label: string;
}

export interface EventItem {
  id: string;
  title: string;
  type: EventType;
  mode: EventMode;
  status: EventStatus;
  date: string;
  endDate?: string;
  time: string;
  cityId: string;
  area: string;
  venueLabel?: string;
  hostId: string;
  groupId?: string;
  franchiseId?: string;
  partnerBusiness?: string;
  partnerBusinessId?: string;
  relatedExploreIds?: string[];
  attendeeIds: string[];
  capacity?: number;
  spotsLeft?: number;
  recapId?: string;
  badgeIds: string[];
  imageTone: string;
  description: string;
  ageRule?: string;
  externalUrl?: string;
}

export const eventCities: EventCity[] = [
  { id: "delhi", name: "Delhi", kind: "city" },
  { id: "mumbai", name: "Mumbai", kind: "city" },
  { id: "bengaluru", name: "Bengaluru", kind: "city" },
  { id: "pune", name: "Pune", kind: "city" },
  { id: "chandigarh", name: "Chandigarh", kind: "city" },
  { id: "amritsar", name: "Amritsar", kind: "city" },
  { id: "hyderabad", name: "Hyderabad", kind: "city" },
  { id: "kolkata", name: "Kolkata", kind: "city" },
  { id: "online", name: "Online", kind: "online" },
];

export const eventHosts: EventHost[] = [
  { id: "host-aiko", name: "Aiko Sen", handle: "@aikoreads", initials: "AS", verified: true, bio: "Manga circles and slow Sunday conversations." },
  { id: "host-rohan", name: "Rohan Mehta", handle: "@rohanplays", initials: "RM", verified: true, bio: "Games, snacks and low-pressure city meetups." },
  { id: "host-meera", name: "Meera Iyer", handle: "@meeraonair", initials: "MI", verified: true, bio: "Soundtrack swaps and watch-alongs." },
  { id: "host-kabir", name: "Kabir Anand", handle: "@kabircosplays", initials: "KA", verified: true, bio: "Cosplay walks with a camera-friendly pace." },
  { id: "host-tara", name: "Tara Bose", handle: "@tarabose", initials: "TB", verified: true, bio: "Making room for niche fandoms in Kolkata." },
];

export const eventGroups: EventGroup[] = [
  { id: "anime-ost-lovers", name: "Anime OST Lovers", glyph: "音", color: "c-lav" },
  { id: "manga-sunday", name: "Manga Sunday Club", glyph: "漫", color: "c-peach" },
  { id: "cosplay-corner", name: "Cosplay Corner India", glyph: "衣", color: "c-pink" },
  { id: "cozy-gamers", name: "Cozy Gamers India", glyph: "遊", color: "c-mint" },
];

export const eventFranchises: EventFranchise[] = [
  { id: "spirited-away", name: "Spirited Away", kind: "anime" },
  { id: "frieren", name: "Frieren", kind: "manga" },
  { id: "yoasobi", name: "YOASOBI", kind: "music" },
  { id: "animal-crossing", name: "Animal Crossing", kind: "game" },
  { id: "one-piece", name: "One Piece", kind: "anime" },
];

export const eventBadges: EventBadge[] = [
  { id: "public-venue", label: "Public venue" },
  { id: "age-16", label: "16+" },
  { id: "partner-event", label: "Partner event" },
];

export const eventRecaps: EventRecap[] = [
  { id: "recap-mumbai-ramen", title: "A rainy evening, 12 new group chats", note: "The first bowl was only the beginning. The group left with three new watch lists." },
  { id: "recap-pune-manga", title: "Dog-ears, chai and a very full table", note: "A gentle afternoon of favourite panels and recommendations passed hand to hand." },
  { id: "recap-delhi-ost", title: "The chorus everyone carried home", note: "The group traded playlists and kept the conversation going in Anime OST Lovers." },
  { id: "recap-online-manga", title: "Small details, big discussion", note: "A structured online circle that ended with three new reading recommendations." },
];

export const eventAttendees: Record<string, string> = {
  "mira-01": "Mira", "dev-02": "Dev", "isha-03": "Isha", "arjun-04": "Arjun",
  "neel-05": "Neel", "sana-06": "Sana", "vansh-07": "Vansh", "zoya-08": "Zoya",
  "adi-09": "Adi", "pari-10": "Pari", "kabir-11": "Kabir", "tanvi-12": "Tanvi",
};

export const events: EventItem[] = [
  { id: "delhi-manga-circle", title: "Manga & chai: a Sunday circle", type: "Manga Circle", mode: "offline", status: "Upcoming", date: "2026-11-01", time: "11:00 AM – 1:00 PM", cityId: "delhi", area: "Khan Market", venueLabel: "Public café", hostId: "host-aiko", groupId: "manga-sunday", franchiseId: "frieren", relatedExploreIds: ["frieren"], attendeeIds: ["mira-01", "dev-02", "isha-03"], capacity: 18, spotsLeft: 7, recapId: "recap-pune-manga", badgeIds: ["public-venue"], imageTone: "c-peach", description: "Bring one volume you love and leave with a few new worlds to try.", ageRule: "16+" },
  { id: "mumbai-ramen-watch", title: "Ghibli ramen night", type: "Micro Meet", mode: "offline", status: "Happening Soon", date: "2026-10-31", time: "7:00 PM – 9:00 PM", cityId: "mumbai", area: "Bandra West", venueLabel: "Public restaurant", hostId: "host-meera", groupId: "anime-ost-lovers", franchiseId: "spirited-away", relatedExploreIds: ["spirited-away"], attendeeIds: ["mira-01", "sana-06", "zoya-08", "adi-09"], capacity: 16, spotsLeft: 3, recapId: "recap-mumbai-ramen", badgeIds: ["public-venue", "age-16"], imageTone: "c-pink", description: "A soundtrack-led evening for people who notice the music before the credits.", ageRule: "16+" },
  { id: "bengaluru-cosplay-walk", title: "Cosplay walk: soft launch edition", type: "Cosplay Walk", mode: "offline", status: "Upcoming", date: "2026-11-07", time: "4:30 PM – 6:30 PM", cityId: "bengaluru", area: "Cubbon Park", venueLabel: "Public park meet point", hostId: "host-kabir", groupId: "cosplay-corner", franchiseId: "one-piece", relatedExploreIds: ["one-piece"], attendeeIds: ["arjun-04", "neel-05", "pari-10"], capacity: 25, spotsLeft: 12, badgeIds: ["public-venue"], imageTone: "c-blue", description: "Costumes, character poses and a walking pace that lets everyone join in.", ageRule: "All ages" },
  { id: "pune-indie-pop-up", title: "Tiny fandom pop-up", type: "Pop-up", mode: "offline", status: "Upcoming", date: "2026-11-14", time: "12:00 PM – 4:00 PM", cityId: "pune", area: "Koregaon Park", venueLabel: "Partner bookstore", hostId: "host-aiko", groupId: "manga-sunday", franchiseId: "frieren", partnerBusiness: "Paper Kitsune Studio", partnerBusinessId: "paper-kitsune", relatedExploreIds: ["frieren"], attendeeIds: ["tanvi-12", "mira-01"], capacity: 30, spotsLeft: 22, badgeIds: ["public-venue"], imageTone: "c-yellow", description: "A small shelf takeover with zines, manga recommendations and a quiet corner to read." },
  { id: "hyderabad-anime-night", title: "Anime night: openings edition", type: "City Event", mode: "offline", status: "Full", date: "2026-11-21", time: "6:00 PM – 9:00 PM", cityId: "hyderabad", area: "Banjara Hills", venueLabel: "Community arts hall", hostId: "host-rohan", groupId: "anime-ost-lovers", franchiseId: "yoasobi", attendeeIds: ["mira-01", "dev-02", "isha-03", "arjun-04", "neel-05", "sana-06"], capacity: 24, spotsLeft: 0, badgeIds: ["public-venue", "age-16"], imageTone: "c-lav", description: "A big-screen singalong for the songs that made you press rewind.", ageRule: "16+" },
  { id: "online-yoasobi-listen", title: "YOASOBI first-listen lounge", type: "Watch-along", mode: "online", status: "Upcoming", date: "2026-11-03", time: "8:30 PM – 10:00 PM", cityId: "online", area: "Online", hostId: "host-meera", groupId: "anime-ost-lovers", franchiseId: "yoasobi", attendeeIds: ["mira-01", "zoya-08", "adi-09"], capacity: 40, spotsLeft: 18, badgeIds: [], imageTone: "c-lav", description: "Press play together, share translations and trade the song that got you through the week." },
  { id: "online-crossing-companion", title: "Cozy island companion hour", type: "In-game Companion", mode: "online", status: "Upcoming", date: "2026-11-05", time: "9:00 PM – 10:00 PM", cityId: "online", area: "Online", hostId: "host-rohan", groupId: "cozy-gamers", franchiseId: "animal-crossing", attendeeIds: ["vansh-07", "pari-10"], capacity: 20, spotsLeft: 9, badgeIds: [], imageTone: "c-mint", description: "A low-stakes evening of island tours, item swaps and gentle conversation." },
  { id: "online-frieren-watch", title: "Frieren chapter-to-screen watch-along", type: "Watch-along", mode: "online", status: "Waitlist", date: "2026-11-12", time: "8:00 PM – 9:45 PM", cityId: "online", area: "Online", hostId: "host-tara", groupId: "manga-sunday", franchiseId: "frieren", attendeeIds: ["mira-01", "dev-02", "isha-03", "tanvi-12"], capacity: 24, spotsLeft: 0, badgeIds: [], imageTone: "c-blue", description: "Compare a chapter you loved with the scene that brought it to life.", ageRule: "16+" },
  { id: "kolkata-sakura-con", title: "Sakura City Con 2026", type: "Convention", mode: "convention", status: "Upcoming", date: "2026-12-05", endDate: "2026-12-06", time: "All day", cityId: "kolkata", area: "New Town", venueLabel: "Partner convention venue", hostId: "host-tara", attendeeIds: ["mira-01", "zoya-08", "kabir-11"], badgeIds: ["partner-event"], imageTone: "c-pink", description: "A partner discovery listing for a larger city convention. Sakura is the community layer, not the organizer.", externalUrl: "https://example.com/sakura-city-con" },
  { id: "chandigarh-otaku-fest", title: "North Star Otaku Fest", type: "Convention", mode: "convention", status: "Upcoming", date: "2026-12-19", endDate: "2026-12-20", time: "All day", cityId: "chandigarh", area: "Sector 17", venueLabel: "Partner convention venue", hostId: "host-kabir", attendeeIds: ["arjun-04", "pari-10"], badgeIds: ["partner-event"], imageTone: "c-yellow", description: "Discover a partner convention and find the Sakura folks planning to arrive together.", externalUrl: "https://example.com/north-star-fest" },
  { id: "delhi-ost-retro", title: "Delhi OST rewind", type: "City Event", mode: "offline", status: "Past", date: "2026-09-20", time: "5:00 PM – 7:00 PM", cityId: "delhi", area: "Saket", venueLabel: "Public arts room", hostId: "host-meera", groupId: "anime-ost-lovers", franchiseId: "yoasobi", attendeeIds: ["mira-01", "dev-02"], capacity: 20, spotsLeft: 0, recapId: "recap-delhi-ost", badgeIds: ["public-venue"], imageTone: "c-lav", description: "A past community listening circle for favourite openings and endings." },
  { id: "online-manga-retro", title: "Manga Sunday: first chapter circle", type: "Watch-along", mode: "online", status: "Past", date: "2026-09-13", time: "7:00 PM – 8:00 PM", cityId: "online", area: "Online", hostId: "host-tara", groupId: "manga-sunday", franchiseId: "frieren", attendeeIds: ["mira-01", "isha-03"], capacity: 20, spotsLeft: 0, recapId: "recap-online-manga", badgeIds: [], imageTone: "c-blue", description: "A past structured reading and discussion event." },
];

export const getCity = (id: string) => eventCities.find((city) => city.id === id);
export const getHost = (id: string) => eventHosts.find((host) => host.id === id);
export const getGroup = (id?: string) => id ? eventGroups.find((group) => group.id === id) : undefined;
export const getFranchise = (id?: string) => id ? eventFranchises.find((franchise) => franchise.id === id) : undefined;
export const getRecap = (id?: string) => id ? eventRecaps.find((recap) => recap.id === id) : undefined;
export const getBadge = (id: string) => eventBadges.find((badge) => badge.id === id);
export const getEventsForGroup = (groupId: string) => events.filter((event) => event.groupId === groupId);
export const getEventsForPartner = (partnerId: string) => events.filter((event) => event.partnerBusinessId === partnerId);
