export type MerchCategory =
  | "Apparel"
  | "Accessories"
  | "Home & Decor"
  | "Stationery"
  | "Art & Prints"
  | "Collectibles"
  | "Fashion & Lifestyle";

export type StockStatus = "In stock" | "Small batch" | "Made to order";

export interface PartnerBusiness {
  id: string;
  name: string;
  city: string;
  state: string;
  glyph: string;
  description: string;
  makes: string;
  story?: string;
  inspiration?: string;
  followers?: number;
  eventId?: string;
}

export interface MerchProduct {
  id: string;
  name: string;
  partnerBusinessId: string;
  partnerBusinessName: string;
  city: string;
  state: string;
  price: number;
  image: string;
  category: MerchCategory;
  tags: string[];
  isFusion: boolean;
  isHandmade: boolean;
  isMadeInIndia: boolean;
  isNewSeller: boolean;
  stockStatus: StockStatus;
  rating: number;
  reviewCount: number;
  popularity: number;
  publishedAt: string;
  relatedExploreIds: string[];
  relatedCommunitySlugs: string[];
  relatedDropIds: string[];
}

export interface MerchDrop {
  id: string;
  name: string;
  partnerBusinessId: string;
  productId: string;
  quantity: number;
  endsAt: string;
  price: number;
  image: string;
  releaseAt: string;
  remainingQuantity: number;
  purchaseLimit: number;
  groupExclusive?: boolean;
  groupId?: string;
  discussionSlug?: string;
}

export interface MerchCity {
  name: string;
  state: string;
  productCount: number;
  tint: string;
}

export interface MerchData {
  categories: MerchCategory[];
  partners: PartnerBusiness[];
  products: MerchProduct[];
  drops: MerchDrop[];
  cities: MerchCity[];
  groupPicks: MerchGroupPick[];
}

export interface MerchGroupPick {
  productId: string;
  groupSlug: string;
  signal: string;
}

export interface MerchOrder {
  id: string;
  date: string;
  partnerIds: string[];
  productIds: string[];
  total: number;
  status: "Placed" | "Packed" | "Shipped" | "Delivered";
  deliveryEstimate: string;
}

export interface MerchReview {
  id: string;
  productId: string;
  rating: number;
  text: string;
  reviewer: string;
  verified: boolean;
  imageLabel?: string;
}

export const merchReviews: MerchReview[] = [
  { id: "review-01", productId: "m-01", rating: 5, text: "The block print has so much movement. It feels easy to wear, not costume-like.", reviewer: "Aarohi K.", verified: true },
  { id: "review-02", productId: "m-01", rating: 4, text: "Beautiful texture and a thoughtful little maker note in the parcel.", reviewer: "Mihir S.", verified: true, imageLabel: "Indigo fabric detail" },
  { id: "review-03", productId: "m-02", rating: 5, text: "The colours are even better in person and the paper has a lovely grain.", reviewer: "Naina R.", verified: true },
  { id: "review-04", productId: "m-03", rating: 5, text: "A joyful desk companion. The cover makes my morning planning feel ceremonial.", reviewer: "Dev P.", verified: true },
  { id: "review-05", productId: "m-04", rating: 4, text: "The cup is handmade, so its tiny variations are part of the charm.", reviewer: "Sana M.", verified: false },
  { id: "review-06", productId: "m-05", rating: 5, text: "The pin catches the light beautifully on my tote.", reviewer: "Ritwik J.", verified: true },
];

export function getPartnerStory(partner: PartnerBusiness) {
  return {
    story: partner.story ?? `${partner.name} is an independent ${partner.city} studio making small, thoughtful batches for people who keep their fandom close.`,
    inspiration: partner.inspiration ?? `Japanese visual language meets the materials, rhythms and everyday craft traditions of ${partner.state}.`,
    followers: partner.followers ?? 128,
  };
}

export const merchData: MerchData = {
  categories: ["Apparel", "Accessories", "Home & Decor", "Stationery", "Art & Prints", "Collectibles", "Fashion & Lifestyle"],
  partners: [
    { id: "paper-kitsune", name: "Paper Kitsune Studio", city: "Kolkata", state: "West Bengal", glyph: "狐", description: "Illustrated paper goods for desks, journals and slow mornings.", makes: "Prints, stickers and notebooks" },
    { id: "indigo-matsuri", name: "Indigo Matsuri", city: "Jaipur", state: "Rajasthan", glyph: "藍", description: "Indigo textiles and block-print details with a Tokyo-meets-Rajasthan feeling.", makes: "Textiles and wearable art", eventId: "e3" },
    { id: "moonlit-clay", name: "Moonlit Clay", city: "Pune", state: "Maharashtra", glyph: "月", description: "Small ceramic objects inspired by quiet evening rituals.", makes: "Ceramics and home decor" },
    { id: "tin-roof-prints", name: "Tin Roof Prints", city: "Delhi", state: "Delhi", glyph: "印", description: "Original fan-inspired posters made in tiny print runs.", makes: "Art prints and risograph work" },
    { id: "soft-arcade", name: "Soft Arcade", city: "Bengaluru", state: "Karnataka", glyph: "遊", description: "Playful accessories for people who carry their fandom lightly.", makes: "Pins, charms and collectibles" },
    { id: "monsoon-thread", name: "Monsoon Thread", city: "Mumbai", state: "Maharashtra", glyph: "雨", description: "Hand-finished everyday pieces with Indian textile stories.", makes: "Bags and lifestyle goods" },
  ],
  products: [
    { id: "m-01", name: "Indigo block-print haori", partnerBusinessId: "indigo-matsuri", partnerBusinessName: "Indigo Matsuri", city: "Jaipur", state: "Rajasthan", price: 2890, image: "Indigo textile folds", category: "Apparel", tags: ["textile", "layering", "slow fashion"], isFusion: true, isHandmade: true, isMadeInIndia: true, isNewSeller: false, stockStatus: "Small batch", rating: 4.8, reviewCount: 12, popularity: 94, publishedAt: "2026-10-21", relatedExploreIds: ["spirited-away"], relatedCommunitySlugs: ["japanese-streetwear"], relatedDropIds: ["drop-01"] },
    { id: "m-02", name: "Night train risograph print", partnerBusinessId: "tin-roof-prints", partnerBusinessName: "Tin Roof Prints", city: "Delhi", state: "Delhi", price: 850, image: "Blue night train print", category: "Art & Prints", tags: ["risograph", "wall art", "night"], isFusion: false, isHandmade: true, isMadeInIndia: true, isNewSeller: false, stockStatus: "Small batch", rating: 4.9, reviewCount: 18, popularity: 91, publishedAt: "2026-10-19", relatedExploreIds: ["your-name"], relatedCommunitySlugs: ["japanese-cinema-club"], relatedDropIds: ["drop-02"] },
    { id: "m-03", name: "Kitsune desk notebook", partnerBusinessId: "paper-kitsune", partnerBusinessName: "Paper Kitsune Studio", city: "Kolkata", state: "West Bengal", price: 420, image: "Coral fox notebook", category: "Stationery", tags: ["paper", "journaling", "desk"], isFusion: true, isHandmade: false, isMadeInIndia: true, isNewSeller: false, stockStatus: "In stock", rating: 4.7, reviewCount: 26, popularity: 89, publishedAt: "2026-10-16", relatedExploreIds: ["yoasobi"], relatedCommunitySlugs: ["j-music-circle"], relatedDropIds: [] },
    { id: "m-04", name: "Moon-view ceramic cup", partnerBusinessId: "moonlit-clay", partnerBusinessName: "Moonlit Clay", city: "Pune", state: "Maharashtra", price: 1180, image: "Lavender ceramic cup", category: "Home & Decor", tags: ["ceramic", "tea", "ritual"], isFusion: false, isHandmade: true, isMadeInIndia: true, isNewSeller: true, stockStatus: "Made to order", rating: 4.6, reviewCount: 8, popularity: 72, publishedAt: "2026-10-23", relatedExploreIds: ["frieren"], relatedCommunitySlugs: ["anime-fans-india"], relatedDropIds: [] },
    { id: "m-05", name: "Pixel shrine enamel pin", partnerBusinessId: "soft-arcade", partnerBusinessName: "Soft Arcade", city: "Bengaluru", state: "Karnataka", price: 360, image: "Mint pixel shrine pin", category: "Accessories", tags: ["pin", "pixel", "bag charm"], isFusion: false, isHandmade: false, isMadeInIndia: true, isNewSeller: true, stockStatus: "In stock", rating: 4.8, reviewCount: 21, popularity: 86, publishedAt: "2026-10-22", relatedExploreIds: ["persona-5-royal"], relatedCommunitySlugs: ["japanese-gaming-india"], relatedDropIds: [] },
    { id: "m-06", name: "Monsoon market tote", partnerBusinessId: "monsoon-thread", partnerBusinessName: "Monsoon Thread", city: "Mumbai", state: "Maharashtra", price: 740, image: "Peach printed tote", category: "Fashion & Lifestyle", tags: ["bag", "block print", "everyday"], isFusion: true, isHandmade: true, isMadeInIndia: true, isNewSeller: false, stockStatus: "In stock", rating: 4.5, reviewCount: 15, popularity: 78, publishedAt: "2026-10-18", relatedExploreIds: ["ado"], relatedCommunitySlugs: ["j-music-circle"], relatedDropIds: [] },
    { id: "m-07", name: "Lantern street sticker set", partnerBusinessId: "paper-kitsune", partnerBusinessName: "Paper Kitsune Studio", city: "Kolkata", state: "West Bengal", price: 240, image: "Yellow lantern stickers", category: "Stationery", tags: ["stickers", "journal", "collect"], isFusion: true, isHandmade: false, isMadeInIndia: true, isNewSeller: false, stockStatus: "In stock", rating: 4.7, reviewCount: 31, popularity: 83, publishedAt: "2026-10-14", relatedExploreIds: ["one-piece"], relatedCommunitySlugs: ["anime-fans-india"], relatedDropIds: [] },
    { id: "m-08", name: "Tiny arcade charm", partnerBusinessId: "soft-arcade", partnerBusinessName: "Soft Arcade", city: "Bengaluru", state: "Karnataka", price: 520, image: "Blue arcade charm", category: "Collectibles", tags: ["charm", "arcade", "collect"], isFusion: false, isHandmade: true, isMadeInIndia: true, isNewSeller: true, stockStatus: "Small batch", rating: 4.9, reviewCount: 10, popularity: 80, publishedAt: "2026-10-20", relatedExploreIds: ["animal-crossing"], relatedCommunitySlugs: ["japanese-gaming-india"], relatedDropIds: [] },
  ],
  drops: [
    { id: "drop-01", name: "Monsoon Indigo Edit", partnerBusinessId: "indigo-matsuri", productId: "m-01", quantity: 24, endsAt: "2026-11-15T20:00:00+05:30", releaseAt: "2026-11-15T18:00:00+05:30", remainingQuantity: 24, purchaseLimit: 1, price: 2890, image: "Indigo block-print layers", groupExclusive: true, groupId: "anime-fans-india" },
    { id: "drop-02", name: "Night Walk Print Club", partnerBusinessId: "tin-roof-prints", productId: "m-02", quantity: 40, endsAt: "2026-10-28T20:00:00+05:30", releaseAt: "2026-10-20T18:00:00+05:30", remainingQuantity: 17, purchaseLimit: 2, price: 850, image: "Blue risograph night" },
    { id: "drop-03", name: "First Light Sticker Archive", partnerBusinessId: "paper-kitsune", productId: "m-07", quantity: 30, endsAt: "2026-10-10T20:00:00+05:30", releaseAt: "2026-09-20T18:00:00+05:30", remainingQuantity: 0, purchaseLimit: 3, price: 240, image: "Yellow lantern stickers", discussionSlug: "anime-fans-india" },
  ],
  cities: [
    { name: "Jaipur", state: "Rajasthan", productCount: 12, tint: "c-peach" },
    { name: "Kolkata", state: "West Bengal", productCount: 9, tint: "c-yellow" },
    { name: "Delhi", state: "Delhi", productCount: 11, tint: "c-blue" },
    { name: "Mumbai", state: "Maharashtra", productCount: 8, tint: "c-pink" },
    { name: "Bengaluru", state: "Karnataka", productCount: 7, tint: "c-mint" },
    { name: "Pune", state: "Maharashtra", productCount: 5, tint: "c-lav" },
  ],
  groupPicks: [
    { productId: "m-01", groupSlug: "anime-fans-india", signal: "Recommended by Anime Fans India" },
    { productId: "m-03", groupSlug: "anime-ost-lovers", signal: "A favourite in Anime OST Lovers" },
    { productId: "m-05", groupSlug: "japanese-gaming-india", signal: "Spotted in Japanese Gaming India" },
    { productId: "m-02", groupSlug: "japanese-cinema-club", signal: "Passed around Japanese Cinema Club" },
  ],
};

export const merchOrders: MerchOrder[] = [
  { id: "SK-2026-02890", date: "2026-10-08", partnerIds: ["indigo-matsuri"], productIds: ["m-01"], total: 2890, status: "Delivered", deliveryEstimate: "Delivered on 14 Oct 2026" },
  { id: "SK-2026-01780", date: "2026-10-18", partnerIds: ["paper-kitsune", "soft-arcade"], productIds: ["m-03", "m-05"], total: 780, status: "Shipped", deliveryEstimate: "Expected 29 Oct 2026" },
  { id: "SK-2026-00420", date: "2026-10-22", partnerIds: ["moonlit-clay"], productIds: ["m-04"], total: 1180, status: "Packed", deliveryEstimate: "Expected 3 Nov 2026" },
];

export function getMerchData() {
  return merchData;
}
