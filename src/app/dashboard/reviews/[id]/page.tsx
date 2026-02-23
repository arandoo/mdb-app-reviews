"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { StarRating } from "@/components/ui/star-rating";

interface ReviewMedia {
  type: "image" | "video";
  url: string;
  publicId: string;
  thumbnailUrl?: string;
}

interface ReviewDetail {
  _id: string;
  customerName: string;
  customerEmail: string;
  rating: number;
  title: string;
  body: string;
  status: "pending" | "approved" | "rejected";
  media: ReviewMedia[];
  helpfulCount: number;
  adminReply?: string;
  adminReplyAt?: string;
  createdAt: string;
  updatedAt: string;
}

const STATUS_LABELS: Record<string, string> = {
  pending: "Ausstehend",
  approved: "Genehmigt",
  rejected: "Abgelehnt",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

export default function ReviewDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [review, setReview] = useState<ReviewDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [adminReply, setAdminReply] = useState("");
  const [replyLoading, setReplyLoading] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchReview();
  }, [id]);

  async function fetchReview() {
    const res = await fetch(`/api/reviews/${id}`);
    const json = await res.json();
    if (json.success) {
      setReview(json.data);
      setAdminReply(json.data.adminReply || "");
    }
    setLoading(false);
  }

  async function handleAction(action: "approve" | "reject" | "delete") {
    if (action === "delete" && !confirm("Review wirklich löschen?")) return;
    setActionLoading(true);

    if (action === "delete") {
      await fetch(`/api/reviews/${id}`, { method: "DELETE" });
      router.push("/dashboard/reviews");
      return;
    }

    await fetch(`/api/reviews/${id}/${action}`, { method: "PATCH" });
    await fetchReview();
    setActionLoading(false);
  }

  async function saveAdminReply() {
    setReplyLoading(true);
    setReplyMessage("");

    const res = await fetch(`/api/reviews/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adminReply }),
    });

    const json = await res.json();
    setReplyLoading(false);

    if (json.success) {
      setReview(json.data);
      setReplyMessage("Antwort gespeichert!");
      setTimeout(() => setReplyMessage(""), 3000);
    } else {
      setReplyMessage("Fehler beim Speichern.");
    }
  }

  if (loading) {
    return <div className="text-gray-500">Laden...</div>;
  }

  if (!review) {
    return <div className="text-red-500">Review nicht gefunden.</div>;
  }

  return (
    <div className="max-w-3xl space-y-6">
      {/* Back link */}
      <Link
        href="/dashboard/reviews"
        className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
      >
        &larr; Zurück zur Übersicht
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{review.title}</h1>
          <div className="flex items-center gap-3 mt-2">
            <StarRating rating={review.rating} />
            <span
              className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                STATUS_COLORS[review.status]
              }`}
            >
              {STATUS_LABELS[review.status]}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {review.status !== "approved" && (
            <button
              onClick={() => handleAction("approve")}
              disabled={actionLoading}
              className="bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors disabled:opacity-50"
            >
              Genehmigen
            </button>
          )}
          {review.status !== "rejected" && (
            <button
              onClick={() => handleAction("reject")}
              disabled={actionLoading}
              className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors disabled:opacity-50"
            >
              Ablehnen
            </button>
          )}
          <button
            onClick={() => handleAction("delete")}
            disabled={actionLoading}
            className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors disabled:opacity-50"
          >
            Löschen
          </button>
        </div>
      </div>

      {/* Customer Info */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Kunde
        </h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Name:</span>{" "}
            <span className="font-medium">{review.customerName}</span>
          </div>
          <div>
            <span className="text-gray-500">E-Mail:</span>{" "}
            <span className="font-medium">{review.customerEmail}</span>
          </div>
          <div>
            <span className="text-gray-500">Erstellt am:</span>{" "}
            <span className="font-medium">
              {new Date(review.createdAt).toLocaleString("de-DE")}
            </span>
          </div>
          <div>
            <span className="text-gray-500">Hilfreich-Stimmen:</span>{" "}
            <span className="font-medium">{review.helpfulCount}</span>
          </div>
        </div>
      </div>

      {/* Review Body */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Review-Text
        </h2>
        <p className="text-gray-800 whitespace-pre-wrap">{review.body}</p>
      </div>

      {/* Media */}
      {review.media.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Medien ({review.media.length})
          </h2>
          <div className="flex flex-wrap gap-3">
            {review.media.map((item, index) => (
              <button
                key={index}
                onClick={() => setLightboxUrl(item.url)}
                className="focus:outline-none focus:ring-2 focus:ring-amber-500 rounded-md"
              >
                {item.type === "image" ? (
                  <img
                    src={item.thumbnailUrl || item.url}
                    alt={`Media ${index + 1}`}
                    className="w-24 h-24 object-cover rounded-md border border-gray-200 hover:opacity-80 transition-opacity"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gray-100 rounded-md border border-gray-200 flex items-center justify-center hover:bg-gray-200 transition-colors">
                    <span className="text-3xl">🎬</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Admin Reply */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-3">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
          Admin-Antwort
        </h2>
        <textarea
          value={adminReply}
          onChange={(e) => setAdminReply(e.target.value)}
          rows={3}
          maxLength={2000}
          placeholder="Antwort auf das Review schreiben..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 resize-y text-sm"
        />
        <div className="flex items-center gap-3">
          <button
            onClick={saveAdminReply}
            disabled={replyLoading}
            className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors disabled:opacity-50"
          >
            {replyLoading ? "Speichern..." : "Antwort speichern"}
          </button>
          {replyMessage && (
            <span className="text-sm text-green-600">{replyMessage}</span>
          )}
        </div>
        {review.adminReplyAt && (
          <p className="text-xs text-gray-400">
            Zuletzt geantwortet: {new Date(review.adminReplyAt).toLocaleString("de-DE")}
          </p>
        )}
      </div>

      {/* Lightbox */}
      {lightboxUrl && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setLightboxUrl(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setLightboxUrl(null)}
              className="absolute -top-10 right-0 text-white text-2xl hover:text-gray-300"
            >
              ✕
            </button>
            {lightboxUrl.includes("/video/") ? (
              <video
                src={lightboxUrl}
                controls
                className="max-w-full max-h-[85vh] rounded-lg"
              />
            ) : (
              <img
                src={lightboxUrl}
                alt="Review media"
                className="max-w-full max-h-[85vh] rounded-lg object-contain"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
