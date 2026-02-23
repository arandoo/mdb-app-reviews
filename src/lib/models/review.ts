import mongoose, { Schema, Document, Model } from "mongoose";

export enum ReviewStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export interface IReviewMedia {
  type: "image" | "video";
  url: string;
  publicId: string;
  thumbnailUrl?: string;
}

export interface IReview extends Document {
  customerName: string;
  customerEmail: string;
  rating: number;
  title: string;
  body: string;
  media: IReviewMedia[];
  status: ReviewStatus;
  helpfulCount: number;
  adminReply?: string;
  adminReplyAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const reviewMediaSchema = new Schema<IReviewMedia>(
  {
    type: { type: String, enum: ["image", "video"], required: true },
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    thumbnailUrl: String,
  },
  { _id: false }
);

const reviewSchema = new Schema<IReview>(
  {
    customerName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    customerEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    body: { type: String, required: true, trim: true, maxlength: 5000 },
    media: {
      type: [reviewMediaSchema],
      default: [],
      validate: {
        validator: (val: IReviewMedia[]) => val.length <= 10,
        message: "Maximum 10 media items allowed",
      },
    },
    status: {
      type: String,
      enum: Object.values(ReviewStatus),
      default: ReviewStatus.PENDING,
      index: true,
    },
    helpfulCount: { type: Number, default: 0 },
    adminReply: { type: String, trim: true, maxlength: 2000 },
    adminReplyAt: Date,
  },
  { timestamps: true }
);

reviewSchema.index({ status: 1, createdAt: -1 });
reviewSchema.index({ customerEmail: 1 });

export const Review: Model<IReview> =
  mongoose.models.Review || mongoose.model<IReview>("Review", reviewSchema);
