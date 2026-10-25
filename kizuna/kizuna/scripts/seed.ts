import { PrismaClient } from "@prisma/client";
import { catalogue, events as mockEvents, posts as mockPosts, products, rooms } from "../lib/data/mock";
import type { CatalogueItem } from "../lib/types";

const prisma = new PrismaClient();
const demoUser = {
  id: "user-demo",
  email: "demo@sakura.example",
  username: "sakura-demo",
  name: "Sakura Demo",
  city: "Delhi",
};

const groupRooms = rooms.filter((room) => room.kind === "interest").slice(0, 6);
const groupId = (slug: string) => `group-${slug}`;
const userId = (name: string) => `user-${name.toLowerCase()}`;
const extraMedia: CatalogueItem[] = [
  { id: "blue-period", title: "Blue Period", kind: "manga", world: "watch", year: 2017, maker: "Tsubasa Yamaguchi", blurb: "An art student discovers a new way to see the world.", tags: ["manga", "drama"] },
  { id: "radwimps", title: "RADWIMPS", kind: "music", world: "listen", maker: "Artist profile", blurb: "A band known for cinematic melodies and emotional songwriting.", tags: ["music", "jpop", "ost"] },
  { id: "dragon-quest-xi", title: "Dragon Quest XI", kind: "game", world: "play", year: 2017, maker: "Square Enix", blurb: "A classic role-playing adventure with a bright, generous heart.", tags: ["game", "rpg", "adventure"] },
];

async function main() {
  await prisma.user.upsert({
    where: { id: demoUser.id },
    update: demoUser,
    create: demoUser,
  });

  const authors = [...new Set(mockPosts.map((post) => post.author))];
  for (const name of authors) {
    await prisma.user.upsert({
      where: { id: userId(name) },
      update: { name, username: name.toLowerCase() },
      create: {
        id: userId(name),
        email: `${name.toLowerCase()}@sakura.example`,
        username: name.toLowerCase(),
        name,
      },
    });
  }

  for (const room of groupRooms) {
    await prisma.group.upsert({
      where: { slug: room.slug },
      update: {
        name: room.name,
        description: room.blurb,
        kind: room.kind,
        glyph: room.glyph,
        tags: room.tags,
        dimension: room.dimension,
        city: room.citySlug,
      },
      create: {
        id: groupId(room.slug),
        slug: room.slug,
        name: room.name,
        description: room.blurb,
        kind: room.kind,
        glyph: room.glyph,
        tags: room.tags,
        dimension: room.dimension,
        city: room.citySlug,
        memberCount: room.slug === "one-piece" ? 1840 : 760,
      },
    });
  }

  const seedMedia = [...catalogue, ...extraMedia];
  for (const item of seedMedia) {
    await prisma.media.upsert({
      where: { id: item.id },
      update: {
        title: item.title,
        type: item.kind,
        world: item.world,
        year: item.year,
        maker: item.maker,
        blurb: item.blurb,
        description: item.blurb,
        imageUrl: item.imageUrl,
        tags: item.tags,
      },
      create: {
        id: item.id,
        title: item.title,
        type: item.kind,
        world: item.world,
        year: item.year,
        maker: item.maker,
        blurb: item.blurb,
        description: item.blurb,
        imageUrl: item.imageUrl,
        tags: item.tags,
      },
    });
    if (item.images?.length) {
      await prisma.mediaImage.deleteMany({ where: { mediaId: item.id } });
      await prisma.mediaImage.createMany({
        data: item.images.map((image) => ({
          mediaId: item.id,
          type: image.type,
          url: image.url,
          provider: image.provider,
          sourceUrl: image.sourceUrl,
          width: image.width,
          height: image.height,
        })),
      });
    }
  }

  for (const post of mockPosts) {
    const group = groupRooms.find((room) => room.slug === post.roomSlug);
    if (!group) continue;
    await prisma.post.upsert({
      where: { id: post.id },
      update: { content: post.body, createdAt: new Date(post.createdAt), groupId: groupId(group.slug), authorId: userId(post.author) },
      create: {
        id: post.id,
        content: post.body,
        createdAt: new Date(post.createdAt),
        groupId: groupId(group.slug),
        authorId: userId(post.author),
      },
    });
  }
  await prisma.post.upsert({
    where: { id: "p10" },
    update: { content: "What are you discovering this week? Share one title with the room.", groupId: groupId("one-piece"), authorId: demoUser.id },
    create: { id: "p10", content: "What are you discovering this week? Share one title with the room.", groupId: groupId("one-piece"), authorId: demoUser.id },
  });

  const seededEvents = [
    ...mockEvents,
    { id: "e8", title: "Manga morning", citySlug: "delhi", date: "2027-01-10T11:00:00+05:30", venue: "Public café", blurb: "Bring one volume and leave with three recommendations.", tags: ["manga", "meetup"], roomSlug: "manga" },
    { id: "e9", title: "J-Gaming co-op night", citySlug: "bengaluru", date: "2027-01-17T18:00:00+05:30", venue: "Community game room", blurb: "A relaxed evening of Japanese games and shared screens.", tags: ["game", "meetup"], roomSlug: "j-gaming" },
    { id: "e10", title: "Anime OST swap", citySlug: "mumbai", date: "2027-01-24T17:00:00+05:30", venue: "Venue to be announced", blurb: "Bring a favourite opening or ending and tell the room why.", tags: ["music", "anime"], roomSlug: "j-music" },
  ];

  for (const event of seededEvents) {
    await prisma.event.upsert({
      where: { id: event.id },
      update: {
        title: event.title,
        description: event.blurb,
        blurb: event.blurb,
        city: event.citySlug,
        citySlug: event.citySlug,
        venue: event.venue,
        startTime: new Date(event.date),
        roomSlug: event.roomSlug,
        tags: event.tags,
      },
      create: {
        id: event.id,
        title: event.title,
        description: event.blurb,
        blurb: event.blurb,
        type: event.tags[0] ?? "community",
        city: event.citySlug,
        citySlug: event.citySlug,
        venue: event.venue,
        startTime: new Date(event.date),
        roomSlug: event.roomSlug,
        groupId: event.roomSlug && groupRooms.some((room) => room.slug === event.roomSlug) ? groupId(event.roomSlug) : undefined,
        tags: event.tags,
      },
    });
  }

  const seedProducts = [
    ...products,
    ...Array.from({ length: 6 }, (_, index) => ({
      id: `pr${index + 7}`,
      title: ["Art print set", "Soft cotton cap", "Sticker sheet", "Travel pouch", "Desk charm", "Manga tote"][index],
      category: ["collectibles", "apparel", "stationery", "bags", "accessories", "bags"][index] as typeof products[number]["category"],
      brand: "Sample IP",
      partner: "Licensed partner (to be signed)",
      verified: false,
      blurb: "A sample SAKURA find for the prototype catalogue.",
    })),
  ];

  for (const product of seedProducts) {
    await prisma.product.upsert({
      where: { id: product.id },
      update: { name: product.title, description: product.blurb, category: product.category, brand: product.brand, partner: product.partner, verified: product.verified },
      create: { id: product.id, name: product.title, description: product.blurb, category: product.category, brand: product.brand, partner: product.partner, verified: product.verified, price: 0 },
    });
  }

  await prisma.groupMembership.upsert({
    where: { userId_groupId: { userId: demoUser.id, groupId: groupId("one-piece") } },
    update: {},
    create: { userId: demoUser.id, groupId: groupId("one-piece") },
  });
  await prisma.savedMedia.upsert({
    where: { userId_mediaId: { userId: demoUser.id, mediaId: "your-name" } },
    update: {},
    create: { userId: demoUser.id, mediaId: "your-name" },
  });
  await prisma.eventRsvp.upsert({
    where: { userId_eventId: { userId: demoUser.id, eventId: "e1" } },
    update: {},
    create: { userId: demoUser.id, eventId: "e1" },
  });
  await prisma.wishlistItem.upsert({
    where: { userId_productId: { userId: demoUser.id, productId: "pr2" } },
    update: {},
    create: { userId: demoUser.id, productId: "pr2" },
  });

  await prisma.activity.createMany({
    data: [
      { id: "activity-seed-view", userId: demoUser.id, interactionType: "VIEW", entityType: "MEDIA", entityId: "your-name", metadata: { source: "seed" } },
      { id: "activity-seed-join", userId: demoUser.id, interactionType: "JOIN_GROUP", entityType: "GROUP", entityId: groupId("one-piece"), metadata: { source: "seed" } },
      { id: "activity-seed-save", userId: demoUser.id, interactionType: "SAVE", entityType: "MEDIA", entityId: "your-name", metadata: { source: "seed" } },
      { id: "activity-seed-rsvp", userId: demoUser.id, interactionType: "RSVP", entityType: "EVENT", entityId: "e1", metadata: { source: "seed" } },
      { id: "activity-seed-wishlist", userId: demoUser.id, interactionType: "WISHLIST", entityType: "PRODUCT", entityId: "pr2", metadata: { source: "seed" } },
    ],
    skipDuplicates: true,
  });

  console.log(`Seeded ${seedMedia.length} media, ${groupRooms.length} groups, ${mockPosts.length + 1} posts, ${seededEvents.length} events, ${seedProducts.length} products.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
