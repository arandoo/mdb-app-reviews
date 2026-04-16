/**
 * Outbound sync: when a review is approved in the Review App,
 * POST it to the Challenge App so it appears on the Wall of Fame.
 *
 * Fire-and-forget. Env: CHALLENGE_APP_WEBHOOK_URL, REVIEW_SYNC_SECRET
 */

const CHALLENGE_URL = process.env.CHALLENGE_APP_WEBHOOK_URL;
const SYNC_SECRET = process.env.REVIEW_SYNC_SECRET;

export async function syncReviewToChallenge(args: {
  reviewId: string;
  name: string;
  email: string;
  rating: number;
  text: string;
  photoUrl?: string;
  country?: string;
  action?: "create" | "update" | "delete";
}): Promise<void> {
  if (!CHALLENGE_URL) return;
  try {
    await fetch(CHALLENGE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret: SYNC_SECRET || "",
        action: args.action || "create",
        review: {
          external_id: `review-app:${args.reviewId}`,
          name: args.name,
          email: args.email,
          rating: args.rating,
          text: args.text,
          photo_url: args.photoUrl || null,
          country: args.country || null,
          source: "review-app",
          created_at: new Date().toISOString(),
        },
      }),
    });
  } catch (e) {
    console.error("[challenge-sync] outbound failed", e);
  }
}
