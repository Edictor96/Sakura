import type { InteractionType } from "./server/services/activityService";

export function recordClientActivity(interactionType: InteractionType, entityType: "MEDIA" | "GROUP" | "EVENT" | "PRODUCT", entityId: string, metadata?: Record<string, string>) {
  void fetch("/api/activity", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ interactionType, entityType, entityId, metadata }),
  }).then(async (response) => {
    if (!response.ok) console.error("Could not record activity:", await response.text());
  }).catch((error: unknown) => console.error("Could not record activity:", error));
}
