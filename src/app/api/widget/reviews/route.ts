import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { Review, ReviewStatus, Settings } from "@/lib/models";
import { corsResponse, jsonWithCors } from "@/lib/cors";

// OPTIONS preflight
export async function OPTIONS() {
  return corsResponse();
}

// GET /api/widget/reviews — Public: fetch approved reviews
export async function GET(request: NextRequest) {
  await connectDB();

  // API key validation
  const apiKey =
    request.headers.get("X-API-Key") ||
    new URL(request.url).searchParams.get("apiKey");

  if (!apiKey) {
    return jsonWithCors({ error: "API key required" }, 401);
  }

  const settings = await Settings.findOne({ apiKey });
  if (!settings) {
    return jsonWithCors({ error: "Invalid API key" }, 401);
  }

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const limit = Math.min(
    50,
    Math.max(1, Number(searchParams.get("limit")) || settings.widget.reviewsPerPage || 10)
  );

  const filter = { status: ReviewStatus.APPROVED };

  const [reviews, total] = await Promise.all([
    Review.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select("customerName rating title body media createdAt adminReply adminReplyAt")
      .lean(),
    Review.countDocuments(filter),
  ]);

  // Compute stats
  const ratingAgg = await Review.aggregate([
    { $match: { status: ReviewStatus.APPROVED } },
    {
      $group: {
        _id: null,
        avg: { $avg: "$rating" },
        total: { $sum: 1 },
        r1: { $sum: { $cond: [{ $eq: ["$rating", 1] }, 1, 0] } },
        r2: { $sum: { $cond: [{ $eq: ["$rating", 2] }, 1, 0] } },
        r3: { $sum: { $cond: [{ $eq: ["$rating", 3] }, 1, 0] } },
        r4: { $sum: { $cond: [{ $eq: ["$rating", 4] }, 1, 0] } },
        r5: { $sum: { $cond: [{ $eq: ["$rating", 5] }, 1, 0] } },
      },
    },
  ]);

  const stats =
    ratingAgg.length > 0
      ? {
          averageRating: Math.round(ratingAgg[0].avg * 10) / 10,
          totalReviews: ratingAgg[0].total,
          distribution: {
            1: ratingAgg[0].r1,
            2: ratingAgg[0].r2,
            3: ratingAgg[0].r3,
            4: ratingAgg[0].r4,
            5: ratingAgg[0].r5,
          },
        }
      : {
          averageRating: 0,
          totalReviews: 0,
          distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        };

  return jsonWithCors({
    reviews,
    stats,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  });
}
