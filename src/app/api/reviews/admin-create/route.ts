import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import { connectDB } from "@/lib/db";
import { Review, ReviewStatus } from "@/lib/models";
import { z } from "zod";

const adminCreateSchema = z.object({
  customerName: z.string().min(1).max(100).trim(),
  customerEmail: z.string().max(200).trim(),
  rating: z.number().int().min(1).max(5),
  title: z.string().min(1).max(200).trim(),
  body: z.string().min(1).max(5000).trim(),
  media: z
    .array(
      z.object({
        type: z.enum(["image", "video"]),
        url: z.string().url(),
        publicId: z.string(),
        thumbnailUrl: z.string().url().optional(),
      })
    )
    .max(10)
    .default([]),
  status: z.enum(["pending", "approved", "rejected"]).default("approved"),
  adminReply: z.string().max(2000).trim().optional(),
});

// POST /api/reviews/admin-create — Admin: create a review manually
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = adminCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;

  const reviewData: Record<string, unknown> = {
    customerName: data.customerName,
    customerEmail: data.customerEmail || `admin-${Date.now()}@noemail.local`,
    rating: data.rating,
    title: data.title,
    body: data.body,
    media: data.media,
    status: data.status as ReviewStatus,
    helpfulCount: 0,
  };

  if (data.adminReply) {
    reviewData.adminReply = data.adminReply;
    reviewData.adminReplyAt = new Date();
  }

  const review = await Review.create(reviewData);

  return NextResponse.json({ success: true, data: review }, { status: 201 });
}
