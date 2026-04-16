import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const env = {
    MONGODB_URI: !!process.env.MONGODB_URI,
    CHALLENGE_APP_WEBHOOK_URL: process.env.CHALLENGE_APP_WEBHOOK_URL
      ? "(set)"
      : "(NOT SET)",
    REVIEW_SYNC_SECRET: !!process.env.REVIEW_SYNC_SECRET,
  };

  let dbOk = false;
  let dbError = "";
  try {
    await connectDB();
    dbOk = true;
  } catch (e: any) {
    dbError = e?.message || "unknown";
  }

  return NextResponse.json({ env, dbOk, dbError });
}
