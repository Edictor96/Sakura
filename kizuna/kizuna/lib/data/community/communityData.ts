export type CommunityCategory = "Anime" | "Manga" | "Music" | "Gaming" | "Cinema";

export interface CommunityGroup {
  slug: string;
  name: string;
  description: string;
  category: CommunityCategory;
  glyph: string;
  tint: string;
  members: number;
  activity?: string;
  city?: string;
  parentSlug?: string;
}

export interface CommunityUser {
  id: string;
  displayName: string;
  glyph: string;
}

export interface CommunityPost {
  id: string;
  groupSlug: string;
  authorId: string;
  body: string;
  type: "Discussion" | "Question" | "Recommendation";
  createdAt: string;
  reactions: number;
  replies: number;
  spoiler?: boolean;
  pinned?: boolean;
  imageLabel?: string;
  poll?: { question: string; options: string[] };
  repliesList?: CommunityReply[];
}

export interface CommunityReply {
  id: string;
  postId: string;
  parentId?: string;
  authorId: string;
  body: string;
  createdAt: string;
  reactions: number;
}

export interface WatchParty {
  id: string;
  groupSlug: string;
  title: string;
  when: string;
  place: string;
  dateTime: string;
  host: string;
  attendees: number;
  status: "upcoming" | "live" | "ended";
  description: string;
  prompt: string;
  discussionPostId?: string;
  chat: { id: string; author: string; body: string }[];
}

export interface NearbyEvent {
  id: string;
  title: string;
  groupSlug: string;
  city: string;
  date: string;
  location: string;
  attendees: number;
}

export interface NicheStep {
  label: string;
  groupSlug?: string;
}

export interface CommunityData {
  groups: CommunityGroup[];
  users: CommunityUser[];
  posts: CommunityPost[];
  watchParties: WatchParty[];
  nearbyEvents: NearbyEvent[];
  cities: string[];
  nichePaths: NicheStep[][];
  prompts: { question: string; groupSlug: string }[];
  rules: Record<string, string[]>;
  moderators: Record<string, string[]>;
  createdAt: Record<string, string>;
}

export const communityData: CommunityData = {
  groups: [
    { slug: "anime-fans-india", name: "Anime Fans India", description: "A friendly starting point for every kind of anime conversation.", category: "Anime", glyph: "ア", tint: "c-pink", members: 1840, activity: "12 conversations today" },
    { slug: "naruto-india", name: "Naruto India", description: "Rewatches, favourite arcs and the details hidden in the shinobi world.", category: "Anime", glyph: "忍", tint: "c-yellow", members: 920, activity: "New discussion" , parentSlug: "anime-fans-india" },
    { slug: "one-piece-india", name: "One Piece India", description: "Theories, rewatches and who gets the next arc.", category: "Anime", glyph: "海", tint: "c-blue", members: 1240, activity: "Watch party this weekend", parentSlug: "anime-fans-india" },
    { slug: "one-piece-theories", name: "One Piece Theories", description: "A smaller corner for clues, predictions and respectful deep dives.", category: "Anime", glyph: "考", tint: "c-lav", members: 188, activity: "6 conversations today", parentSlug: "one-piece-india" },
    { slug: "j-music-circle", name: "J-Music Circle", description: "Share songs, soundtracks and the artists behind them.", category: "Music", glyph: "音", tint: "c-lav", members: 760, activity: "8 conversations today" },
    { slug: "anime-ost-lovers", name: "Anime OST Lovers", description: "Openings, endings and the scores that make a scene stay.", category: "Music", glyph: "譜", tint: "c-peach", members: 316, activity: "New discussion", parentSlug: "j-music-circle" },
    { slug: "japanese-cinema-club", name: "Japanese Cinema Club", description: "From Ghibli to quiet dramas. Spoilers are tagged.", category: "Cinema", glyph: "映", tint: "c-mint", members: 540, activity: "4 conversations today" },
    { slug: "seinen-manga-society", name: "Seinen Manga Society", description: "Slow reads, big themes and manga worth sitting with.", category: "Manga", glyph: "漫", tint: "c-peach", members: 274, activity: "Recently joined by people like you" },
    { slug: "japanese-gaming-india", name: "Japanese Gaming India", description: "Japanese games, release dates and co-op nights.", category: "Gaming", glyph: "遊", tint: "c-blue", members: 680, activity: "Watch party this weekend" },
    { slug: "anime-fans-delhi", name: "Anime Fans Delhi", description: "Screenings, sketch walks and easy first hellos for Delhi anime fans.", category: "Anime", glyph: "街", tint: "c-yellow", members: 126, city: "Delhi" },
    { slug: "kizuna-delhi", name: "KIZUNA Delhi", description: "Fans in Delhi. Meetups, screenings and sketch walks.", category: "Anime", glyph: "街", tint: "c-yellow", members: 92, city: "Delhi" },
    { slug: "mumbai-j-music-circle", name: "Mumbai J-Music Circle", description: "Listening parties and song swaps for Mumbai music fans.", category: "Music", glyph: "音", tint: "c-pink", members: 88, city: "Mumbai" },
    { slug: "kizuna-mumbai", name: "KIZUNA Mumbai", description: "Fans in Mumbai. Listening parties and street food runs.", category: "Music", glyph: "街", tint: "c-pink", members: 74, city: "Mumbai" },
    { slug: "japanese-gaming-bengaluru", name: "Japanese Gaming Bengaluru", description: "Co-op nights and Japanese game discoveries around Bengaluru.", category: "Gaming", glyph: "遊", tint: "c-blue", members: 67, city: "Bengaluru" },
    { slug: "kizuna-bengaluru", name: "KIZUNA Bengaluru", description: "Fans in Bengaluru. Game nights and cosplay meets.", category: "Gaming", glyph: "街", tint: "c-mint", members: 61, city: "Bengaluru" },
    { slug: "pune-japanese-cinema", name: "Pune Japanese Cinema", description: "A relaxed local circle for Japanese films and thoughtful screenings.", category: "Cinema", glyph: "映", tint: "c-lav", members: 48, city: "Pune" },
    { slug: "chandigarh-anime-club", name: "Chandigarh Anime Club", description: "A small, welcoming anime circle for the city and nearby friends.", category: "Anime", glyph: "ア", tint: "c-mint", members: 39, city: "Chandigarh" },
    { slug: "kizuna-hyderabad", name: "KIZUNA Hyderabad", description: "A new local circle for screenings, swaps and shared discoveries.", category: "Cinema", glyph: "街", tint: "c-lav", members: 38, city: "Hyderabad" },
  ],
  users: [
    { id: "u-aarav", displayName: "Aarav", glyph: "あ" },
    { id: "u-meera", displayName: "Meera", glyph: "め" },
    { id: "u-kabir", displayName: "Kabir", glyph: "か" },
    { id: "u-ishita", displayName: "Ishita", glyph: "い" },
    { id: "u-rohan", displayName: "Rohan", glyph: "ろ" },
    { id: "u-tanya", displayName: "Tanya", glyph: "た" },
  ],
  posts: [
    { id: "cp-1", groupSlug: "one-piece-india", authorId: "u-aarav", body: "Rewatching Alabasta for the fourth time. Still the best pacing in the whole series. Agree or fight me?", type: "Discussion", createdAt: "2026-10-24T10:12:00Z", reactions: 18, replies: 7, pinned: true },
    { id: "cp-2", groupSlug: "anime-fans-india", authorId: "u-meera", body: "What's one anime you wish more people around you watched?", type: "Question", createdAt: "2026-10-24T08:40:00Z", reactions: 11, replies: 12 },
    { id: "cp-3", groupSlug: "j-music-circle", authorId: "u-kabir", body: "Opening themes that deserve a full playlist. Drop yours and I will build one for the room.", type: "Recommendation", createdAt: "2026-10-23T17:05:00Z", reactions: 24, replies: 9 },
    { id: "cp-4", groupSlug: "anime-ost-lovers", authorId: "u-ishita", body: "Which anime opening never gets skipped? I am making a long train-ride playlist.", type: "Question", createdAt: "2026-10-23T12:30:00Z", reactions: 16, replies: 8 },
    { id: "cp-5", groupSlug: "japanese-cinema-club", authorId: "u-rohan", body: "Best Japanese film you've watched this year? Quiet dramas and strange little films welcome.", type: "Question", createdAt: "2026-10-22T19:20:00Z", reactions: 14, replies: 6 },
    { id: "cp-6", groupSlug: "japanese-gaming-india", authorId: "u-tanya", body: "Looking for co-op partners for a weekend session. Beginners welcome.", type: "Discussion", createdAt: "2026-10-22T15:00:00Z", reactions: 9, replies: 4, imageLabel: "Co-op night sketch" },
    { id: "cp-7", groupSlug: "seinen-manga-society", authorId: "u-meera", body: "Just finished a long series and need something shorter. Recommendations?", type: "Question", createdAt: "2026-10-22T09:10:00Z", reactions: 7, replies: 5, spoiler: true },
    { id: "cp-8", groupSlug: "kizuna-delhi", authorId: "u-rohan", body: "Who is up for a sketch walk before the film night? We can meet an hour early.", type: "Discussion", createdAt: "2026-10-21T18:45:00Z", reactions: 8, replies: 3 },
    { id: "cp-9", groupSlug: "kizuna-mumbai", authorId: "u-kabir", body: "Looking for a good spot for a small listening party. Ideas?", type: "Question", createdAt: "2026-10-21T11:00:00Z", reactions: 5, replies: 4 },
    { id: "cp-10", groupSlug: "naruto-india", authorId: "u-aarav", body: "The small character moments are why I keep returning to this show.", type: "Discussion", createdAt: "2026-10-20T16:20:00Z", reactions: 13, replies: 5, poll: { question: "Which arc do you revisit most?", options: ["Chunin Exams", "Pain", "War"] } },
    { id: "cp-11", groupSlug: "one-piece-theories", authorId: "u-tanya", body: "A tiny detail from the latest chapter has me rethinking an old theory.", type: "Discussion", createdAt: "2026-10-20T12:00:00Z", reactions: 21, replies: 10, spoiler: true },
  ],
  watchParties: [
    { id: "wp-1", groupSlug: "one-piece-india", title: "One Piece rewatch: Water 7", when: "Saturday · 8:00 PM", place: "Online room", dateTime: "Saturday · 8:00 PM", host: "Aarav", attendees: 42, status: "upcoming", description: "A relaxed group rewatch with room for first-timers and longtime fans alike.", prompt: "Which Water 7 moment still gives you chills?", discussionPostId: "cp-1", chat: [{ id: "chat-1", author: "Meera", body: "Bringing snacks and my oldest Straw Hat tee." }, { id: "chat-2", author: "Kabir", body: "I am ready for the train sequence." }] },
    { id: "wp-2", groupSlug: "kizuna-delhi", title: "Studio film night", when: "15 November · 6:30 PM", place: "Delhi · venue to be announced", dateTime: "15 November · 6:30 PM", host: "Rohan", attendees: 18, status: "upcoming", description: "A community screening followed by a short, gentle discussion circle.", prompt: "What detail will you be looking for on your next Ghibli rewatch?", discussionPostId: "cp-8", chat: [{ id: "chat-3", author: "Simran", body: "I will bring a few sketch prompts for the break." }] },
  ],
  nearbyEvents: [
    { id: "e1", title: "Studio film night", groupSlug: "anime-fans-delhi", city: "Delhi", date: "15 November · evening", location: "Delhi · venue to be announced", attendees: 18 },
    { id: "e2", title: "J-Music listening party", groupSlug: "mumbai-j-music-circle", city: "Mumbai", date: "22 November · evening", location: "Mumbai · venue to be announced", attendees: 14 },
    { id: "e5", title: "Retro games night", groupSlug: "japanese-gaming-bengaluru", city: "Bengaluru", date: "20 December · evening", location: "Bengaluru · venue to be announced", attendees: 11 },
    { id: "e6", title: "Anime sketch-and-chat", groupSlug: "chandigarh-anime-club", city: "Chandigarh", date: "29 November · afternoon", location: "Chandigarh · place to be announced", attendees: 9 },
    { id: "e7", title: "Quiet cinema circle", groupSlug: "pune-japanese-cinema", city: "Pune", date: "6 December · evening", location: "Pune · venue to be announced", attendees: 7 },
  ],
  cities: ["Delhi", "Mumbai", "Bengaluru", "Pune", "Chandigarh", "Amritsar", "Hyderabad", "Kolkata"],
  nichePaths: [
    [{ label: "Anime" }, { label: "Shonen", groupSlug: "anime-fans-india" }, { label: "One Piece", groupSlug: "one-piece-india" }, { label: "One Piece Theories", groupSlug: "one-piece-theories" }],
    [{ label: "Music" }, { label: "Anime OSTs", groupSlug: "j-music-circle" }, { label: "Deep cuts", groupSlug: "anime-ost-lovers" }],
  ],
  prompts: [
    { question: "What's one anime you wish more people watched?", groupSlug: "anime-fans-india" },
    { question: "Which anime opening never gets skipped?", groupSlug: "anime-ost-lovers" },
    { question: "Best Japanese film you've watched this year?", groupSlug: "japanese-cinema-club" },
  ],
  rules: {
    "anime-fans-india": ["Be kind to first-time watchers.", "Use spoiler labels for recent releases.", "Keep recommendations about the work, not the person."],
    "one-piece-india": ["Mark chapter and episode spoilers.", "Theories welcome; personal attacks are not.", "Keep links to official sources."],
    "anime-ost-lovers": ["Credit the artist and composer.", "No streaming or download links.", "Let the song be the conversation starter."],
  },
  moderators: {
    "anime-fans-india": ["u-meera", "u-aarav"],
    "one-piece-india": ["u-aarav"],
    "anime-ost-lovers": ["u-ishita"],
  },
  createdAt: {
    "anime-fans-india": "August 2026",
    "one-piece-india": "September 2026",
    "anime-ost-lovers": "October 2026",
  },
};

export function getCommunityData(): CommunityData {
  return communityData;
}
