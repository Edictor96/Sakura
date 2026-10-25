import { prisma } from "../lib/server/db/prisma";
import {
  getRecommendations,
  getUserInterestProfile,
  getPersonalizedHome,
} from "../lib/server/services/recommendationService";
import { recordActivity } from "../lib/server/services/activityService";

async function main() {
  const user = await prisma.user.findUnique({ where: { id: "user-demo" }, select: { id: true, name: true } });
  if (!user) throw new Error("Seeded demo user user-demo was not found. Run npm run seed first.");

  const media = await prisma.media.findFirst({ orderBy: { createdAt: "asc" }, select: { id: true } });
  if (!media) throw new Error("No seeded media was found.");
  const recorded = await recordActivity({
    userId: user.id,
    interactionType: "VIEW",
    entityType: "MEDIA",
    entityId: media.id,
    metadata: { source: "verification" },
  });
  const latest = await prisma.activity.findUnique({ where: { id: recorded.id }, select: { userId: true, interactionType: true, entityId: true } });
  if (!latest || latest.userId !== user.id) throw new Error("The verification activity was not persisted for the expected user.");

  const profile = await getUserInterestProfile(user.id);
  const recommendations = await getRecommendations(user.id, { limit: 10 });
  const home = await getPersonalizedHome(user.id);

  console.log(`User: ${user.name ?? user.id}`);
  console.log(`Activities: ${profile.activityCount}`);
  console.log("Interest categories:", profile.categories);
  for (const recommendation of recommendations.slice(0, 5)) {
    console.log(`${recommendation.entityType} — ${recommendation.entityId}`);
    console.log(`Score: ${recommendation.score}`);
    console.log(`Reason: ${recommendation.reason}`);
  }
  console.log(`Home sections: ${Object.values(home).map((section) => section.length).join(", ")}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
