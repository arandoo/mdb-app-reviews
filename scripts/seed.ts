import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/mdb-app-reviews";

async function seed() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);

  const db = mongoose.connection.db!;

  // Create admin user
  const email = process.env.ADMIN_EMAIL || "admin@makedesignerbags.com";
  const password = process.env.ADMIN_PASSWORD || "changeme123";
  const passwordHash = await bcrypt.hash(password, 12);

  const usersCollection = db.collection("users");
  const existingUser = await usersCollection.findOne({ email });

  if (existingUser) {
    console.log(`Admin user already exists: ${email}`);
  } else {
    await usersCollection.insertOne({
      email,
      name: "Admin",
      passwordHash,
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log(`Admin user created: ${email}`);
  }

  // Create settings singleton
  const settingsCollection = db.collection("settings");
  const existingSettings = await settingsCollection.findOne({});

  if (existingSettings) {
    console.log(`Settings already exist. API Key: ${existingSettings.apiKey}`);
  } else {
    const apiKey = `rk_${crypto.randomBytes(24).toString("base64url")}`;
    await settingsCollection.insertOne({
      shopName: "MakeDesignerBags",
      shopUrl: "https://makedesignerbags.com",
      apiKey,
      autoApproveReviews: false,
      autoApproveMinRating: 4,
      widget: {
        primaryColor: "#FFB800",
        backgroundColor: "#FFFFFF",
        textColor: "#1A1A1A",
        layout: "list",
        reviewsPerPage: 10,
        showMedia: true,
        showVerifiedBadge: true,
        showReviewForm: true,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log(`Settings created. API Key: ${apiKey}`);
  }

  console.log("\nSeed complete!");
  console.log(`Login: ${email} / ${password}`);

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
