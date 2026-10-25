import type { Prisma } from "@prisma/client";
import { createActivityRepository } from "../repositories/activityRepository";
import { prisma } from "../db/prisma";
import { getCurrentUser } from "../auth";

export const INTERACTION_TYPES = [
  "VIEW", "SEARCH", "SAVE", "LIKE", "JOIN_GROUP", "LEAVE_GROUP", "POST",
  "COMMENT", "REACTION", "RSVP", "CHECK_IN", "WISHLIST", "SHARE", "PURCHASE",
] as const;

export type InteractionType = (typeof INTERACTION_TYPES)[number];

export async function recordActivity(input: {
  userId: string;
  interactionType: InteractionType;
  entityType: string;
  entityId: string;
  metadata?: Prisma.InputJsonValue;
}) {
  return createActivityRepository(prisma).record(input);
}

export async function recordCurrentUserActivity(input: Omit<Parameters<typeof recordActivity>[0], "userId">) {
  const user = await getCurrentUser();
  if (!user) throw new Error("No application user is available.");
  return recordActivity({ ...input, userId: user.id });
}
