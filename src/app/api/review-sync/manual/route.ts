import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import { connectDB } from "@/lib/db";
import { Review } from "@/lib/models";
import { syncReviewToChallenge } from "@/lib/challenge-sync";

export const dynamic = "force-dynamic";

/**
 * POST /api/review-sync/manual
 * Admin-only: force-sync a specific review to the Challenge App.
 * Body: { "reviewId": "69da80103b8aed7d70b5ad6a" }
 */
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { reviewId } = body;
  if (!reviewId) {
    return NextResponse.json({ error: "Missing reviewId" }, { status: 400 });
  }

  await connectDB();
  const review = await Review.findById(reviewId).lean();
  if (!review) {
    return NextResponse.json({ error: "Review not found" }, { status: 404 });
  }

  const r = review as any;

  // Debug info
  const debug = {
    id: String(r._id),
    name: r.customerName,
    email: r.customerEmail,
    rating: r.rating,
    status: r.status,
    product: r.product,
    mediaCount: r.media?.length || 0,
    firstMediaUrl: r.media?.[0]?.url || null,
    challengeUrl: process.env.CHALLENGE_APP_WEBHOOK_URL || "(NOT SET)",
    syncSecret: process.env.REVIEW_SYNC_SECRET ? "(set)" : "(NOT SET)",
  };

  // Force sync regardless of product/status/media filters
  try {
    await syncReviewToChallenge({
      reviewId: String(r._id),
      name: r.customerName,
      email: r.customerEmail,
      rating: r.rating,
      text: r.body,
      photoUrl: r.media?.[0]?.url,
    });
    return NextResponse.json({ ok: true, synced: true, debug });
  } catch (e: any) {
    return NextResponse.json({
      ok: false,
      error: e?.message,
      debug,
    });
  }
}
