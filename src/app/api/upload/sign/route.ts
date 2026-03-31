import cloudinary from "@/lib/cloudinary";
import { corsHeaders, corsResponse, jsonWithCors } from "@/lib/cors";

export async function OPTIONS() {
  return corsResponse();
}

export async function POST() {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const folder = "mdb-reviews";

  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder },
    process.env.CLOUDINARY_API_SECRET!
  );

  return jsonWithCors({
    signature,
    timestamp,
    folder,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
  });
}
