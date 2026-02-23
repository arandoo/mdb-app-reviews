import { z } from "zod";

export const createReviewSchema = z.object({
  customerName: z.string().min(1).max(100).trim(),
  customerEmail: z.string().email().max(200).trim().toLowerCase(),
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
});

export const updateReviewSchema = z.object({
  customerName: z.string().min(1).max(100).trim().optional(),
  customerEmail: z.string().max(200).trim().optional(),
  rating: z.number().int().min(1).max(5).optional(),
  title: z.string().min(1).max(200).trim().optional(),
  body: z.string().min(1).max(5000).trim().optional(),
  status: z.enum(["pending", "approved", "rejected"]).optional(),
  adminReply: z.string().max(2000).trim().optional(),
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
    .optional(),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>;
