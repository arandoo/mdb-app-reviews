import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import { connectDB } from "@/lib/db";
import { Review } from "@/lib/models";
import { updateReviewSchema } from "@/lib/validations/review";
import { syncReviewToChallenge } from "@/lib/challenge-sync";

// GET /api/reviews/[id] — Admin: single review detail
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const { id } = await params;
  const review = await Review.findById(id).lean();

  if (!review) {
    return NextResponse.json({ error: "Review not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: review });
}

// PATCH /api/reviews/[id] — Admin: update any review field
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const { id } = await params;

  const body = await request.json();
  const parsed = updateReviewSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const updateData: Record<string, unknown> = {};

  if (parsed.data.customerName !== undefined) {
    updateData.customerName = parsed.data.customerName;
  }
  if (parsed.data.customerEmail !== undefined) {
    updateData.customerEmail = parsed.data.customerEmail;
  }
  if (parsed.data.rating !== undefined) {
    updateData.rating = parsed.data.rating;
  }
  if (parsed.data.title !== undefined) {
    updateData.title = parsed.data.title;
  }
  if (parsed.data.body !== undefined) {
    updateData.body = parsed.data.body;
  }
  if (parsed.data.status !== undefined) {
    updateData.status = parsed.data.status;
  }
  if (parsed.data.adminReply !== undefined) {
    updateData.adminReply = parsed.data.adminReply;
    updateData.adminReplyAt = new Date();
  }
  if (parsed.data.media !== undefined) {
    updateData.media = parsed.data.media;
  }
  // product is passed outside Zod validation for now (optional field)
  if (body.product !== undefined) {
    updateData.product = body.product || null;
  }

  const review = await Review.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true }
  ).lean();

  if (!review) {
    return NextResponse.json({ error: "Review not found" }, { status: 404 });
  }

  // If the review is approved AND tagged as 5-day-challenge, sync it
  // to the Challenge App Wall of Fame. This covers the case where an
  // admin edits an existing review and sets the product to
  // "5-day-challenge" — without this, only approve + create triggered
  // the sync.
  const r = review as any;
  if (
    r.status === "approved" &&
    r.product === "5-day-challenge" &&
    r.media?.length > 0
  ) {
    syncReviewToChallenge({
      reviewId: String(r._id),
      name: r.customerName,
      email: r.customerEmail,
      rating: r.rating,
      text: r.body,
      photoUrl: r.media[0]?.url,
    });
  }

  return NextResponse.json({ success: true, data: review });
}

// DELETE /api/reviews/[id] — Admin: delete review
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const { id } = await params;
  const review = await Review.findByIdAndDelete(id);

  if (!review) {
    return NextResponse.json({ error: "Review not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
