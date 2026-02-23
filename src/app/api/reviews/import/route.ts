import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import { connectDB } from "@/lib/db";
import { Review, ReviewStatus } from "@/lib/models";

// Simple CSV parser that handles quoted fields, commas inside quotes, and multiline values
function parseCSV(text: string): Record<string, string>[] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = "";
  let inQuotes = false;
  let i = 0;

  while (i < text.length) {
    const char = text[i];

    if (inQuotes) {
      if (char === '"') {
        // Check for escaped quote ""
        if (i + 1 < text.length && text[i + 1] === '"') {
          currentField += '"';
          i += 2;
          continue;
        }
        // End of quoted field
        inQuotes = false;
        i++;
        continue;
      }
      currentField += char;
      i++;
    } else {
      if (char === '"') {
        inQuotes = true;
        i++;
      } else if (char === ",") {
        currentRow.push(currentField);
        currentField = "";
        i++;
      } else if (char === "\n" || (char === "\r" && text[i + 1] === "\n")) {
        currentRow.push(currentField);
        currentField = "";
        if (currentRow.some((f) => f.trim() !== "")) {
          rows.push(currentRow);
        }
        currentRow = [];
        i += char === "\r" ? 2 : 1;
      } else {
        currentField += char;
        i++;
      }
    }
  }

  // Last field/row
  if (currentField || currentRow.length > 0) {
    currentRow.push(currentField);
    if (currentRow.some((f) => f.trim() !== "")) {
      rows.push(currentRow);
    }
  }

  if (rows.length < 2) return [];

  const headers = rows[0].map((h) => h.trim().toLowerCase());
  return rows.slice(1).map((row) => {
    const obj: Record<string, string> = {};
    headers.forEach((header, idx) => {
      obj[header] = (row[idx] || "").trim();
    });
    return obj;
  });
}

interface ImportResult {
  imported: number;
  skipped: number;
  errors: string[];
}

// POST /api/reviews/import — Admin: import reviews from judge.me CSV
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  let csvText: string;
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }
    csvText = await file.text();
  } catch {
    return NextResponse.json(
      { error: "Error reading file" },
      { status: 400 }
    );
  }

  const records = parseCSV(csvText);

  if (records.length === 0) {
    return NextResponse.json(
      { error: "No data found in CSV file" },
      { status: 400 }
    );
  }

  const result: ImportResult = { imported: 0, skipped: 0, errors: [] };
  const importStatus =
    (new URL(request.url).searchParams.get("status") as ReviewStatus) ||
    ReviewStatus.APPROVED;

  for (let i = 0; i < records.length; i++) {
    const row = records[i];
    const rowNum = i + 2; // +2 because row 1 is header, data starts at row 2

    try {
      // Map judge.me fields to our model
      const customerName =
        row["reviewer_name"] || row["name"] || row["customer_name"] || "";
      const customerEmail =
        row["reviewer_email"] || row["email"] || row["customer_email"] || "";
      const rating = parseInt(row["rating"] || "0", 10);
      const title = row["title"] || "";
      const body = row["body"] || row["content"] || row["review"] || "";
      const reviewDate = row["review_date"] || row["date"] || row["created_at"];
      const reply = row["reply"] || row["admin_reply"] || "";
      const replyDate = row["reply_date"] || "";
      const pictureUrls =
        row["picture_urls"] || row["images"] || row["media"] || "";

      // Validation
      if (!customerName) {
        result.errors.push(`Row ${rowNum}: No customer name`);
        result.skipped++;
        continue;
      }
      if (!body) {
        result.errors.push(`Row ${rowNum}: No review text`);
        result.skipped++;
        continue;
      }
      if (rating < 1 || rating > 5) {
        result.errors.push(
          `Row ${rowNum}: Invalid rating (${row["rating"]})`
        );
        result.skipped++;
        continue;
      }

      // Parse media URLs (judge.me uses comma+space separated URLs)
      const media: { type: "image" | "video"; url: string; publicId: string; thumbnailUrl?: string }[] = [];
      if (pictureUrls) {
        const urls = pictureUrls
          .split(",")
          .map((u: string) => u.trim())
          .filter((u: string) => u.length > 0);
        for (const url of urls) {
          const isVideo =
            url.includes("video") ||
            url.endsWith(".mp4") ||
            url.endsWith(".mov");
          media.push({
            type: isVideo ? "video" : "image",
            url: url,
            publicId: `imported_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
            thumbnailUrl: !isVideo ? url : undefined,
          });
        }
      }

      // Parse date
      let createdAt: Date | undefined;
      if (reviewDate) {
        const parsed = new Date(reviewDate);
        if (!isNaN(parsed.getTime())) {
          createdAt = parsed;
        }
      }

      // Check for duplicate (same email + same body)
      const existing = await Review.findOne({
        customerEmail: customerEmail.toLowerCase(),
        body: body,
      });
      if (existing) {
        result.skipped++;
        continue;
      }

      // Create review
      const reviewData: Record<string, unknown> = {
        customerName,
        customerEmail: customerEmail || `imported-${Date.now()}@noemail.local`,
        rating,
        title: title || body.substring(0, 50) + (body.length > 50 ? "..." : ""),
        body,
        media,
        status: importStatus,
        helpfulCount: 0,
      };

      if (reply) {
        reviewData.adminReply = reply;
        if (replyDate) {
          const parsedReplyDate = new Date(replyDate);
          if (!isNaN(parsedReplyDate.getTime())) {
            reviewData.adminReplyAt = parsedReplyDate;
          }
        }
      }

      const review = await Review.create(reviewData);

      // Override createdAt timestamp if we have original date
      if (createdAt) {
        await Review.updateOne(
          { _id: review._id },
          { $set: { createdAt } }
        );
      }

      result.imported++;
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Unknown error";
      result.errors.push(`Row ${rowNum}: ${errMsg}`);
      result.skipped++;
    }
  }

  return NextResponse.json({ success: true, data: result });
}
