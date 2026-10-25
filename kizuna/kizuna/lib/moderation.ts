// AI stays backstage: a first-pass filter that holds spam and scams before anyone sees them.
// Today this is plain rules so it works offline. Swap `moderate` for a model call later.
// Humans keep the final say: flagged posts should land in a review queue, not vanish.

export interface ModerationResult {
  ok: boolean;
  reason?: string;
}

const RULES: { test: RegExp; reason: string }[] = [
  { test: /free\s+(nitro|robux|v-?bucks|gift\s*card)/i, reason: "looks like a giveaway scam" },
  { test: /https?:\/\/\S*(bit\.ly|tinyurl|t\.me|wa\.me)\S*/i, reason: "contains a shortened or chat-invite link" },
  { test: /(guaranteed|100%)\s+(profit|returns?)/i, reason: "looks like a money scheme" },
  { test: /\b(send|pay)\b.*\b(upi|gpay|paytm|phonepe)\b/i, reason: "asks for a payment" },
  { test: /(.)\1{9,}/, reason: "looks like spam" },
];

export function moderate(text: string): ModerationResult {
  const body = text.trim();
  if (body.length < 2) return { ok: false, reason: "is empty" };
  if (body.length > 600) return { ok: false, reason: "is too long (600 characters max)" };
  for (const rule of RULES) {
    if (rule.test.test(body)) return { ok: false, reason: rule.reason };
  }
  return { ok: true };
}
