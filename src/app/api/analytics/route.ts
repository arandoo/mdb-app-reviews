import { NextResponse } from "next/server";
import { auth } from "../../../../auth";
import { connectDB } from "@/lib/db";
import { Review, ReviewStatus } from "@/lib/models";

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const [totalReviews, approvedReviews, pendingReviews, rejectedReviews] =
    await Promise.all([
      Review.countDocuments(),
      Review.countDocuments({ status: ReviewStatus.APPROVED }),
      Review.countDocuments({ status: ReviewStatus.PENDING }),
      Review.countDocuments({ status: ReviewStatus.REJECTED }),
    ]);

  // Rating distribution
  const ratingAgg = await Review.aggregate([
    { $group: { _id: "$rating", count: { $sum: 1 } } },
  ]);

  const ratingDistribution: Record<string, number> = {
    "1": 0,
    "2": 0,
    "3": 0,
    "4": 0,
    "5": 0,
  };
  ratingAgg.forEach((r: { _id: number; count: number }) => {
    ratingDistribution[String(r._id)] = r.count;
  });

  // Average rating
  const avgAgg = await Review.aggregate([
    { $match: { status: ReviewStatus.APPROVED } },
    { $group: { _id: null, avg: { $avg: "$rating" } } },
  ]);
  const averageRating = avgAgg.length > 0 ? avgAgg[0].avg : 0;

  return NextResponse.json({
    success: true,
    data: {
      totalReviews,
      approvedReviews,
      pendingReviews,
      rejectedReviews,
      averageRating: Math.round(averageRating * 10) / 10,
      ratingDistribution,
    },
  });
}
