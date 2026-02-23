import { z } from "zod";

export const updateSettingsSchema = z.object({
  shopName: z.string().min(1).max(200).trim().optional(),
  shopUrl: z.string().url().optional(),
  autoApproveReviews: z.boolean().optional(),
  autoApproveMinRating: z.number().int().min(1).max(5).optional(),
  widget: z
    .object({
      primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
      backgroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
      textColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
      layout: z.enum(["list", "grid"]).optional(),
      reviewsPerPage: z.number().int().min(1).max(50).optional(),
      showMedia: z.boolean().optional(),
      showVerifiedBadge: z.boolean().optional(),
      showReviewForm: z.boolean().optional(),
      customCss: z.string().max(10000).optional(),
    })
    .optional(),
});

export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;
