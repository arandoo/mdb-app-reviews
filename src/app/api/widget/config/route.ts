import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { Settings } from "@/lib/models";
import { corsResponse, jsonWithCors } from "@/lib/cors";

// OPTIONS preflight
export async function OPTIONS() {
  return corsResponse();
}

// GET /api/widget/config — Public: widget display configuration
export async function GET(request: NextRequest) {
  await connectDB();

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

  return jsonWithCors({
    shopName: settings.shopName,
    widget: settings.widget,
  });
}
