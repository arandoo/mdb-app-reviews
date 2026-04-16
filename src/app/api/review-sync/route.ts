import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Review, ReviewStatus } from "@/lib/models";

/**
 * POST /api/review-sync
 *
 * INBOUND: receives testimonials from the Challenge App and creates
 * them as auto-approved Reviews in MongoDB. Also handles updates
 * and deletes.
 *
 * Authenticated via REVIEW_SYNC_SECRET shared between both apps.
 *
 * Payload (same shape the Challenge App sends):
 * {
 *   "secret": "...",
 *   "action": "create" | "update" | "delete",
 *   "review": {
 *     "external_id": "challenge:uuid",
 *     "name": "Martha",
 *     "email": "martha@example.com",
 *     "rating": 5,
 *     "text": "Great course...",
 *     "photo_url": "https://...",
 *     "source": "challenge-app",
 *     "created_at": "2026-04-15T..."
 *   }
 * }
 */
export async function POST(req: NextRequest) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Auth check
  const secret = process.env.REVIEW_SYNC_SECRET;
  if (secret && body.secret !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { action, review } = body;
  if (!action || !review?.name || !review?.text) {
    return NextResponse.json(
      { error: "Missing action, name, or text" },
      { status: 400 }
    );
  }

  await connectDB();

  if (action === "create") {
    // Dedup: check if we already have a review from this external_id or
    // same email within 24h
    if (review.external_id) {
      const existing = await Review.findOne({
        customerEmail: review.email?.toLowerCase(),
        body: review.text,
      });
      if (existing) {
        return NextResponse.json({
          ok: true,
          action: "already_exists",
          id: existing._id,
        });
      }
    }

    const newReview = await Review.create({
      customerName: review.name.trim(),
      customerEmail: (review.email || "").trim().toLowerCase(),
      rating: Math.max(1, Math.min(5, Number(review.rating) || 5)),
      title: `Challenge Graduate Review`,
      body: review.text.trim(),
      media: review.photo_url
        ? [
            {
              type: "image" as const,
              url: review.photo_url,
              publicId: `challenge-sync-${Date.now()}`,
            },
          ]
        : [],
      // Auto-approve reviews coming from the challenge app —
      // the user already opted in on the completion page.
      status: ReviewStatus.APPROVED,
      // Tag so we know which product this review is for and where
      // it came from. Only "5-day-challenge" reviews sync back.
      product: "5-day-challenge",
      source: review.source || "challenge-app",
    });

    return NextResponse.json({
      ok: true,
      action: "created",
      id: newReview._id,
    });
  }

  if (action === "update") {
    const existing = await Review.findOne({
      customerEmail: (review.email || "").trim().toLowerCase(),
      body: { $exists: true },
    }).sort({ createdAt: -1 });

    if (existing) {
      existing.customerName = review.name.trim();
      existing.rating = Math.max(1, Math.min(5, Number(review.rating) || 5));
      existing.body = review.text.trim();
      if (review.photo_url && !existing.media.length) {
        existing.media.push({
          type: "image",
          url: review.photo_url,
          publicId: `challenge-sync-${Date.now()}`,
        });
      }
      await existing.save();
      return NextResponse.json({
        ok: true,
        action: "updated",
        id: existing._id,
      });
    }
    // Fall through to create if not found
    return NextResponse.json({ ok: true, action: "not_found" });
  }

  if (action === "delete") {
    const result = await Review.deleteOne({
      customerEmail: (review.email || "").trim().toLowerCase(),
      body: review.text,
    });
    return NextResponse.json({
      ok: true,
      action: "deleted",
      deleted: result.deletedCount,
    });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
