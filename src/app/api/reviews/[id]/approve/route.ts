import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../../../auth";
import { connectDB } from "@/lib/db";
import { Review, ReviewStatus } from "@/lib/models";
import { syncReviewToChallenge } from "@/lib/challenge-sync";

// PATCH /api/reviews/[id]/approve
export async function PATCH(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const { id } = await params;

  const review = await Review.findByIdAndUpdate(
    id,
    { $set: { status: ReviewStatus.APPROVED } },
    { new: true }
  ).lean();

  if (!review) {
    return NextResponse.json({ error: "Review not found" }, { status: 404 });
  }

  // Only sync "5-day-challenge" reviews to the Challenge App Wall of Fame.
  // Reviews for other courses (Fundamentals, etc.) stay here only.
  const r = review as any;
  if (r.product === "5-day-challenge") {
    syncReviewToChallenge({
      reviewId: String(r._id),
      name: r.customerName,
      email: r.customerEmail,
      rating: r.rating,
      text: r.body,
      photoUrl: r.media?.[0]?.url,
    });
  }

  return NextResponse.json({ success: true, data: review });
}
