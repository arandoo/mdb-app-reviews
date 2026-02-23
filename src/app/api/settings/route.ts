import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../auth";
import { connectDB } from "@/lib/db";
import { Settings } from "@/lib/models";
import { updateSettingsSchema } from "@/lib/validations/settings";
import { generateApiKey } from "@/lib/api-key";

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const settings = await Settings.findOne({});

  if (!settings) {
    return NextResponse.json(
      { error: "Settings not found. Run seed script." },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, data: settings });
}

export async function PATCH(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const body = await request.json();

  // Handle API key regeneration
  if (body.regenerateApiKey) {
    const settings = await Settings.findOneAndUpdate(
      {},
      { apiKey: generateApiKey() },
      { new: true }
    );
    return NextResponse.json({ success: true, data: settings });
  }

  const parsed = updateSettingsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  // Build update object, handling nested widget updates
  const updateData: Record<string, unknown> = {};
  const { widget, ...rest } = parsed.data;

  Object.entries(rest).forEach(([key, value]) => {
    if (value !== undefined) {
      updateData[key] = value;
    }
  });

  if (widget) {
    Object.entries(widget).forEach(([key, value]) => {
      if (value !== undefined) {
        updateData[`widget.${key}`] = value;
      }
    });
  }

  const settings = await Settings.findOneAndUpdate(
    {},
    { $set: updateData },
    { new: true }
  );

  return NextResponse.json({ success: true, data: settings });
}
