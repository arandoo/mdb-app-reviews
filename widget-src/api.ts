export interface ReviewData {
  _id: string;
  customerName: string;
  rating: number;
  title: string;
  body: string;
  media: { type: "image" | "video"; url: string; thumbnailUrl?: string }[];
  createdAt: string;
  adminReply?: string;
  adminReplyAt?: string;
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  distribution: Record<number, number>;
}

export interface ReviewsResponse {
  reviews: ReviewData[];
  stats: ReviewStats;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface WidgetConfig {
  shopName: string;
  widget: {
    primaryColor: string;
    backgroundColor: string;
    textColor: string;
    layout: string;
    reviewsPerPage: number;
    showMedia: boolean;
    showVerifiedBadge: boolean;
    showReviewForm: boolean;
  };
}

export class WidgetAPI {
  private baseUrl: string;
  private apiKey: string;

  constructor(baseUrl: string, apiKey: string) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  async fetchReviews(page = 1, limit?: number): Promise<ReviewsResponse> {
    const params = new URLSearchParams({
      apiKey: this.apiKey,
      page: String(page),
    });
    if (limit) params.set("limit", String(limit));

    const res = await fetch(`${this.baseUrl}/api/widget/reviews?${params}`);
    if (!res.ok) throw new Error("Failed to load reviews");
    return res.json();
  }

  async fetchConfig(): Promise<WidgetConfig> {
    const res = await fetch(
      `${this.baseUrl}/api/widget/config?apiKey=${this.apiKey}`
    );
    if (!res.ok) throw new Error("Failed to load config");
    return res.json();
  }

  async submitReview(data: {
    customerName: string;
    customerEmail: string;
    rating: number;
    title: string;
    body: string;
    media: { type: string; url: string; publicId: string; thumbnailUrl?: string }[];
  }): Promise<{ success: boolean; error?: string }> {
    const res = await fetch(`${this.baseUrl}/api/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  }

  async getUploadSignature(): Promise<{
    signature: string;
    timestamp: number;
    folder: string;
    cloudName: string;
    apiKey: string;
  }> {
    const res = await fetch(`${this.baseUrl}/api/upload/sign`, {
      method: "POST",
    });
    return res.json();
  }
}
