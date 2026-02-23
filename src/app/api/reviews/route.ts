import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../auth";
import { connectDB } from "@/lib/db";
import { Review, ReviewStatus, Settings } from "@/lib/models";
import { createReviewSchema } from "@/lib/validations/review";

// GET /api/reviews — Admin: list reviews with pagination, filter, search
export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit")) || 20));
  const status = searchParams.get("status");
  const rating = searchParams.get("rating");
  const search = searchParams.get("search");
  const sort = searchParams.get("sort") || "newest";

  // Build filter
  const filter: Record<string, unknown> = {};
  if (status && Object.values(ReviewStatus).includes(status as ReviewStatus)) {
    filter.status = status;
  }
  if (rating) {
    filter.rating = Number(rating);
  }
  if (search) {
    filter.$or = [
      { customerName: { $regex: search, $options: "i" } },
      { customerEmail: { $regex: search, $options: "i" } },
      { title: { $regex: search, $options: "i" } },
      { body: { $regex: search, $options: "i" } },
    ];
  }

  // Build sort
  const sortOptions: Record<string, Record<string, 1 | -1>> = {
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    highest: { rating: -1, createdAt: -1 },
    lowest: { rating: 1, createdAt: -1 },
  };
  const sortBy = sortOptions[sort] || sortOptions.newest;

  const [reviews, total] = await Promise.all([
    Review.find(filter)
      .sort(sortBy)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Review.countDocuments(filter),
  ]);

  return NextResponse.json({
    success: true,
    data: reviews,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  });
}

// POST /api/reviews — Public: submit a new review
export async function POST(request: NextRequest) {
  await connectDB();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = createReviewSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;

  // Duplicate check: same email within 24h
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const existing = await Review.findOne({
    customerEmail: data.customerEmail,
    createdAt: { $gte: oneDayAgo },
  });

  if (existing) {
    return NextResponse.json(
      { error: "You have already submitted a review recently. Please wait 24 hours." },
      { status: 429 }
    );
  }

  // Check auto-approve settings
  const settings = await Settings.findOne({});
  let status = ReviewStatus.PENDING;
  if (
    settings?.autoApproveReviews &&
    data.rating >= (settings.autoApproveMinRating || 4)
  ) {
    status = ReviewStatus.APPROVED;
  }

  const review = await Review.create({
    ...data,
    status,
  });

  return NextResponse.json(
    { success: true, data: review },
    { status: 201 }
  );
}
