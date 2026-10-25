import type {
  CatalogueItem,
  City,
  DataApi,
  EventItem,
  Post,
  Product,
  Room,
  World,
} from "../types";

// SAMPLE DATA. Nothing here is a real user, partner, venue or sale.
// It exists so the prototype looks alive before the backend is connected.

export const cities: City[] = [
  { slug: "delhi", name: "Delhi", pilot: true },
  { slug: "mumbai", name: "Mumbai", pilot: true },
  { slug: "bengaluru", name: "Bengaluru", pilot: false },
  { slug: "hyderabad", name: "Hyderabad", pilot: false },
  { slug: "kolkata", name: "Kolkata", pilot: false },
  { slug: "chennai", name: "Chennai", pilot: false },
  { slug: "pune", name: "Pune", pilot: false },
  { slug: "chandigarh", name: "Chandigarh", pilot: false },
  { slug: "amritsar", name: "Amritsar", pilot: false },
];

export const rooms: Room[] = [
  { slug: "one-piece", name: "One Piece", blurb: "Theories, rewatches and who gets the next arc.", kind: "interest", glyph: "海", tags: ["anime", "shonen", "adventure"], dimension: "Anime" },
  { slug: "j-music", name: "J-Music", blurb: "Share songs, soundtracks and the artists behind them.", kind: "interest", glyph: "音", tags: ["music", "jpop", "ost"], dimension: "Music" },
  { slug: "japanese-cinema", name: "Japanese Cinema", blurb: "From Ghibli to quiet dramas. Spoilers are tagged.", kind: "interest", glyph: "映", tags: ["film", "ghibli", "drama"], dimension: "Cinema" },
  { slug: "j-gaming", name: "J-Gaming", blurb: "Japanese games, release dates and co-op nights.", kind: "interest", glyph: "遊", tags: ["game", "rpg", "nintendo"], dimension: "Gaming" },
  { slug: "japanese-streetwear", name: "Japanese Streetwear & Food", blurb: "Fashion finds, cafe spots and things worth trying.", kind: "interest", glyph: "服", tags: ["fashion", "food", "lifestyle"], dimension: "Fashion" },
  { slug: "manga", name: "Manga", blurb: "What you are reading and what to read next.", kind: "interest", glyph: "漫", tags: ["manga", "seinen", "shonen"], dimension: "Manga" },
  { slug: "kizuna-delhi", name: "KIZUNA Delhi", blurb: "Fans in Delhi. Meetups, screenings and sketch walks.", kind: "city", glyph: "街", tags: ["delhi", "meetups"], citySlug: "delhi" },
  { slug: "kizuna-mumbai", name: "KIZUNA Mumbai", blurb: "Fans in Mumbai. Listening parties and street food runs.", kind: "city", glyph: "街", tags: ["mumbai", "meetups"], citySlug: "mumbai" },
  { slug: "kizuna-bengaluru", name: "KIZUNA Bengaluru", blurb: "Fans in Bengaluru. Game nights and cosplay meets.", kind: "city", glyph: "街", tags: ["bengaluru", "meetups"], citySlug: "bengaluru" },
];

export const posts: Post[] = [
  { id: "p1", roomSlug: "one-piece", author: "Aarav", body: "Rewatching the Alabasta arc for the fourth time. Still the best pacing in the whole series. Agree or fight me?", createdAt: "2026-10-20T10:12:00Z" },
  { id: "p2", roomSlug: "one-piece", author: "Meera", body: "Starting from episode 1 this weekend. Any arc I should not skip?", createdAt: "2026-10-21T08:40:00Z" },
  { id: "p3", roomSlug: "j-music", author: "Kabir", body: "Opening themes that deserve a full playlist. Drop yours and I will build one for the room.", createdAt: "2026-10-19T17:05:00Z" },
  { id: "p4", roomSlug: "j-music", author: "Ishita", body: "Anyone else find new artists through anime soundtracks first?", createdAt: "2026-10-22T12:30:00Z" },
  { id: "p5", roomSlug: "japanese-cinema", author: "Rohan", body: "Planning a Ghibli night. Which film for people who have never seen one?", createdAt: "2026-10-18T19:20:00Z" },
  { id: "p6", roomSlug: "j-gaming", author: "Tanya", body: "Looking for co-op partners for a weekend session. Beginners welcome.", createdAt: "2026-10-21T15:00:00Z" },
  { id: "p7", roomSlug: "manga", author: "Dev", body: "Just finished a long series and need something shorter. Recommendations?", createdAt: "2026-10-22T09:10:00Z" },
  { id: "p8", roomSlug: "kizuna-delhi", author: "Simran", body: "Who is up for a sketch walk before the film night? We can meet an hour early.", createdAt: "2026-10-22T18:45:00Z" },
  { id: "p9", roomSlug: "kizuna-mumbai", author: "Neil", body: "Looking for a good spot for a small listening party. Ideas?", createdAt: "2026-10-23T11:00:00Z" },
];

export const events: EventItem[] = [
  { id: "e1", title: "Studio film night", citySlug: "delhi", date: "2026-11-15T18:30:00+05:30", venue: "Venue to be announced", blurb: "A community screening of a classic animated film, followed by a short discussion circle.", tags: ["film", "screening"], roomSlug: "japanese-cinema" },
  { id: "e2", title: "J-Music listening party", citySlug: "mumbai", date: "2026-11-22T17:00:00+05:30", venue: "Venue to be announced", blurb: "Bring a song, tell us why. We play every track in the room.", tags: ["music", "meetup"], roomSlug: "j-music" },
  { id: "e3", title: "Sketch and swap meet", citySlug: "delhi", date: "2026-12-06T15:00:00+05:30", venue: "Venue to be announced", blurb: "Draw together, swap stickers and prints, meet people from the Delhi room.", tags: ["art", "meetup"], roomSlug: "kizuna-delhi" },
  { id: "e4", title: "Japanese street food walk", citySlug: "mumbai", date: "2026-12-13T12:00:00+05:30", venue: "Venue to be announced", blurb: "A guided walk through places that serve Japanese food, with a tasting stop.", tags: ["food", "walk"], roomSlug: "japanese-streetwear" },
  { id: "e5", title: "Retro games night", citySlug: "bengaluru", date: "2026-12-20T18:00:00+05:30", venue: "Venue to be announced", blurb: "Classic Japanese games on shared screens. Pass the controller.", tags: ["game", "meetup"], roomSlug: "j-gaming" },
  { id: "e6", title: "Anime sketch-and-chat", citySlug: "chandigarh", date: "2026-11-29T15:00:00+05:30", venue: "Place to be announced", blurb: "Bring a sketchbook, swap recommendations and meet the Chandigarh anime circle.", tags: ["anime", "meetup"], roomSlug: "kizuna-delhi" },
  { id: "e7", title: "Quiet cinema circle", citySlug: "pune", date: "2026-12-06T18:00:00+05:30", venue: "Venue to be announced", blurb: "A small Japanese film discussion for people who like to linger after the credits.", tags: ["film", "screening"], roomSlug: "japanese-cinema" },
];

export const catalogue: CatalogueItem[] = [
  { id: "spirited-away", title: "Spirited Away", kind: "film", world: "watch", year: 2001, maker: "Studio Ghibli", blurb: "A girl wanders into a spirit world and has to work her way out.", tags: ["film", "ghibli", "fantasy"] },
  { id: "your-name", title: "Your Name.", kind: "film", world: "watch", year: 2016, maker: "CoMix Wave Films", blurb: "Two strangers swap lives and slowly find each other.", tags: ["film", "romance", "drama"] },
  { id: "one-piece", title: "One Piece", kind: "anime", world: "watch", maker: "Toei Animation", blurb: "A crew sails the Grand Line in search of the greatest treasure.", tags: ["anime", "shonen", "adventure"] },
  { id: "frieren", title: "Frieren: Beyond Journey's End", kind: "anime", world: "watch", year: 2023, maker: "Madhouse", blurb: "An elf mage looks back on the quest that ended and what it meant.", tags: ["anime", "fantasy", "drama"] },
  { id: "jujutsu-kaisen", title: "Jujutsu Kaisen", kind: "anime", world: "watch", year: 2020, maker: "MAPPA", blurb: "A student joins a school of sorcerers to fight curses.", tags: ["anime", "shonen", "action"] },
  { id: "vagabond", title: "Vagabond", kind: "manga", world: "watch", maker: "Takehiko Inoue", blurb: "A wandering swordsman searches for strength and meaning.", tags: ["manga", "seinen", "drama"] },
  { id: "yoasobi", title: "YOASOBI", kind: "music", world: "listen", maker: "Artist profile", blurb: "A duo turning short stories into songs.", tags: ["music", "jpop", "ost"] },
  { id: "ado", title: "Ado", kind: "music", world: "listen", maker: "Artist profile", blurb: "A powerful vocalist who built a name from the internet up.", tags: ["music", "jpop", "rock"] },
  { id: "kenshi-yonezu", title: "Kenshi Yonezu", kind: "music", world: "listen", maker: "Artist profile", blurb: "A singer-songwriter who also draws and directs his own videos.", tags: ["music", "jpop", "ost"] },
  { id: "persona-5-royal", title: "Persona 5 Royal", kind: "game", world: "play", year: 2019, maker: "Atlus", blurb: "Student by day, phantom thief by night, with a very good soundtrack.", tags: ["game", "rpg", "music"] },
  { id: "elden-ring", title: "Elden Ring", kind: "game", world: "play", year: 2022, maker: "FromSoftware", blurb: "A huge open world that rewards curiosity and patience.", tags: ["game", "rpg", "fantasy"] },
  { id: "animal-crossing", title: "Animal Crossing: New Horizons", kind: "game", world: "play", year: 2020, maker: "Nintendo", blurb: "Build a quiet island life and invite friends over.", tags: ["game", "nintendo", "cozy"] },
];

export const products: Product[] = [
  { id: "pr1", title: "Graphic tee, studio collection", category: "apparel", brand: "Sample IP", partner: "Licensed partner (to be signed)", verified: false, blurb: "Everyday wear first. Apparel is where fans already spend." },
  { id: "pr2", title: "Enamel pin set", category: "accessories", brand: "Sample IP", partner: "Licensed partner (to be signed)", verified: false, blurb: "Small, cheap and easy to trade at meetups." },
  { id: "pr3", title: "Notebook and sticker pack", category: "stationery", brand: "Sample IP", partner: "Licensed partner (to be signed)", verified: false, blurb: "For classrooms, desks and sketch walks." },
  { id: "pr4", title: "Canvas tote bag", category: "bags", brand: "Sample IP", partner: "Licensed partner (to be signed)", verified: false, blurb: "Carries the notebook, the pins and the tee." },
  { id: "pr5", title: "Keychain charm", category: "accessories", brand: "Sample IP", partner: "Licensed partner (to be signed)", verified: false, blurb: "A tiny way to show what you are into." },
  { id: "pr6", title: "Display figure", category: "collectibles", brand: "Sample IP", partner: "Licensed partner (to be signed)", verified: false, blurb: "Later phase. Collectibles come after everyday items." },
];

export const api: DataApi = {
  async getCities() {
    return cities;
  },
  async getRooms() {
    return rooms;
  },
  async getRoom(slug) {
    return rooms.find((r) => r.slug === slug);
  },
  async getPosts(roomSlug) {
    return posts
      .filter((p) => p.roomSlug === roomSlug)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },
  async getEvents(citySlug) {
    return events
      .filter((e) => !citySlug || e.citySlug === citySlug)
      .sort((a, b) => a.date.localeCompare(b.date));
  },
  async getCatalogue(world?: World) {
    return catalogue.filter((c) => !world || c.world === world);
  },
  async getCatalogueItem(id) {
    return catalogue.find((c) => c.id === id);
  },
  async getProducts() {
    return products;
  },
};
