import mongoose, { Schema, Document, Model } from "mongoose";

export interface IWidgetSettings {
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  layout: "list" | "grid";
  reviewsPerPage: number;
  showMedia: boolean;
  showVerifiedBadge: boolean;
  showReviewForm: boolean;
  customCss?: string;
}

export interface ISettings extends Document {
  shopName: string;
  shopUrl: string;
  apiKey: string;
  autoApproveReviews: boolean;
  autoApproveMinRating: number;
  widget: IWidgetSettings;
  createdAt: Date;
  updatedAt: Date;
}

const widgetSettingsSchema = new Schema<IWidgetSettings>(
  {
    primaryColor: { type: String, default: "#FFB800" },
    backgroundColor: { type: String, default: "#FFFFFF" },
    textColor: { type: String, default: "#1A1A1A" },
    layout: { type: String, enum: ["list", "grid"], default: "list" },
    reviewsPerPage: { type: Number, default: 10, min: 1, max: 50 },
    showMedia: { type: Boolean, default: true },
    showVerifiedBadge: { type: Boolean, default: true },
    showReviewForm: { type: Boolean, default: true },
    customCss: String,
  },
  { _id: false }
);

const settingsSchema = new Schema<ISettings>(
  {
    shopName: { type: String, required: true },
    shopUrl: { type: String, required: true },
    apiKey: { type: String, required: true, unique: true },
    autoApproveReviews: { type: Boolean, default: false },
    autoApproveMinRating: { type: Number, default: 4, min: 1, max: 5 },
    widget: { type: widgetSettingsSchema, default: () => ({}) },
  },
  { timestamps: true }
);

export const Settings: Model<ISettings> =
  mongoose.models.Settings ||
  mongoose.model<ISettings>("Settings", settingsSchema);
