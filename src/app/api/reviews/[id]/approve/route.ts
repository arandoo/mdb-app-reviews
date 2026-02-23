import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../../../auth";
import { connectDB } from "@/lib/db";
import { Review, ReviewStatus } from "@/lib/models";

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

  return NextResponse.json({ success: true, data: review });
}
