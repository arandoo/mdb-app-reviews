"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { StarInput } from "@/components/ui/star-input";

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

const STATUS_OPTIONS = [
  { value: "approved", label: "Approved", color: "bg-green-100 text-green-800" },
  { value: "pending", label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  { value: "rejected", label: "Rejected", color: "bg-red-100 text-red-800" },
];

export default function ReviewDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [review, setReview] = useState<ReviewDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");
  const [actionLoading, setActionLoading] = useState(false);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Edit fields
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState("approved");
  const [media, setMedia] = useState<ReviewMedia[]>([]);
  const [adminReply, setAdminReply] = useState("");

  useEffect(() => {
    fetchReview();
  }, [id]);

  async function fetchReview() {
    const res = await fetch(`/api/reviews/${id}`);
    const json = await res.json();
    if (json.success) {
      const r = json.data as ReviewDetail;
      setReview(r);
      setCustomerName(r.customerName);
      setCustomerEmail(r.customerEmail);
      setRating(r.rating);
      setTitle(r.title);
      setBody(r.body);
      setStatus(r.status);
      setMedia(r.media || []);
      setAdminReply(r.adminReply || "");
    }
    setLoading(false);
  }

  function showMessage(text: string, type: "success" | "error") {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => setMessage(""), 4000);
  }

  async function handleSave() {
    if (!customerName.trim()) {
      showMessage("Customer name is required.", "error");
      return;
    }
    if (!body.trim()) {
      showMessage("Review text is required.", "error");
      return;
    }

    setSaving(true);

    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: customerName.trim(),
          customerEmail: customerEmail.trim(),
          rating,
          title: title.trim() || body.trim().substring(0, 50) + (body.trim().length > 50 ? "..." : ""),
          body: body.trim(),
          status,
          media,
          adminReply: adminReply.trim() || undefined,
        }),
      });

      const json = await res.json();

      if (json.success) {
        setReview(json.data);
        showMessage("Review saved!", "success");
      } else {
        showMessage(json.error || "Error saving.", "error");
      }
    } catch {
      showMessage("Network error. Please try again.", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this review? This cannot be undone.")) return;
    setActionLoading(true);
    await fetch(`/api/reviews/${id}`, { method: "DELETE" });
    router.push("/dashboard/reviews");
  }

  // Media management
  async function handleMediaUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (media.length + files.length > 10) {
      showMessage("Maximum 10 media items allowed.", "error");
      return;
    }

    setUploading(true);

    try {
      const signRes = await fetch("/api/upload/sign", { method: "POST" });
      const signData = await signRes.json();

      const newMedia: ReviewMedia[] = [];

      for (const file of Array.from(files)) {
        const isVideo = file.type.startsWith("video/");
        const isImage = file.type.startsWith("image/");
        if (!isVideo && !isImage) continue;

        const maxSize = isVideo ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
        if (file.size > maxSize) {
          showMessage(`${file.name} is too large. Max ${isVideo ? "50" : "10"}MB.`, "error");
          continue;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("api_key", signData.apiKey);
        formData.append("timestamp", String(signData.timestamp));
        formData.append("signature", signData.signature);
        formData.append("folder", signData.folder);

        const uploadRes = await fetch(
          `https://api.cloudinary.com/v1_1/${signData.cloudName}/${isVideo ? "video" : "image"}/upload`,
          { method: "POST", body: formData }
        );
        const uploadData = await uploadRes.json();

        if (uploadData.secure_url) {
          newMedia.push({
            type: isVideo ? "video" : "image",
            url: uploadData.secure_url,
            publicId: uploadData.public_id,
            thumbnailUrl: isImage
              ? uploadData.secure_url.replace("/upload/", "/upload/w_200,h_200,c_fill/")
              : undefined,
          });
        }
      }

      setMedia((prev) => [...prev, ...newMedia]);
      showMessage(`${newMedia.length} file(s) uploaded. Save to apply changes.`, "success");
    } catch {
      showMessage("Upload failed. Please try again.", "error");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function removeMedia(index: number) {
    setMedia((prev) => prev.filter((_, i) => i !== index));
    showMessage("Media removed. Save to apply changes.", "success");
  }

  async function downloadMedia(url: string, filename: string) {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch {
      showMessage("Download failed.", "error");
    }
  }

  if (loading) {
    return <div className="text-gray-500">Loading...</div>;
  }

  if (!review) {
    return <div className="text-red-500">Review not found.</div>;
  }

  return (
    <div className="max-w-3xl space-y-6">
      {/* Back link */}
      <Link
        href="/dashboard/reviews"
        className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
      >
        &larr; Back to reviews
      </Link>

      {/* Header with save/delete */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Edit Review</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium px-5 py-2 rounded-md transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <button
            onClick={handleDelete}
            disabled={actionLoading}
            className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`px-4 py-3 rounded text-sm ${
            messageType === "success"
              ? "bg-green-50 border border-green-200 text-green-700"
              : "bg-red-50 border border-red-200 text-red-700"
          }`}
        >
          {message}
        </div>
      )}

      {/* Meta info */}
      <div className="flex items-center gap-4 text-xs text-gray-400">
        <span>Created: {new Date(review.createdAt).toLocaleString("en-US")}</span>
        <span>Updated: {new Date(review.updatedAt).toLocaleString("en-US")}</span>
        <span>Helpful votes: {review.helpfulCount}</span>
      </div>

      {/* Customer Info */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
          Customer
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>
      </div>

      {/* Rating & Status */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rating *</label>
            <StarInput value={rating} onChange={setRating} size="lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <div className="flex gap-2">
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setStatus(opt.value)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    status === opt.value
                      ? `${opt.color} ring-2 ring-offset-1 ring-gray-400`
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Title & Body */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
          Review Content
        </h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={200}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Review Text *</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={5}
            maxLength={5000}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 resize-y"
          />
          <p className="text-xs text-gray-400 mt-1">{body.length} / 5000</p>
        </div>
      </div>

      {/* Media Management */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
            Media ({media.length})
          </h2>
          <label
            className={`px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md text-xs font-medium hover:bg-gray-200 transition-colors cursor-pointer ${
              uploading ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={handleMediaUpload}
              className="hidden"
            />
            {uploading ? "Uploading..." : "+ Add Photos/Videos"}
          </label>
        </div>

        {media.length === 0 ? (
          <p className="text-sm text-gray-400 py-4 text-center">No media attached.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {media.map((item, index) => (
              <div key={index} className="relative group rounded-lg overflow-hidden border border-gray-200">
                {item.type === "image" ? (
                  <img
                    src={item.thumbnailUrl || item.url}
                    alt={`Media ${index + 1}`}
                    className="w-full aspect-square object-cover cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => setLightboxUrl(item.url)}
                  />
                ) : (
                  <div
                    className="w-full aspect-square bg-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors"
                    onClick={() => setLightboxUrl(item.url)}
                  >
                    <span className="text-4xl">🎬</span>
                  </div>
                )}
                {/* Overlay actions */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-end justify-center gap-1 pb-2 opacity-0 group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      const ext = item.type === "video" ? "mp4" : "jpg";
                      downloadMedia(item.url, `review-media-${index + 1}.${ext}`);
                    }}
                    className="bg-white/90 hover:bg-white text-gray-800 text-xs font-medium px-2 py-1 rounded shadow"
                    title="Download"
                  >
                    Download
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeMedia(index);
                    }}
                    className="bg-red-500/90 hover:bg-red-600 text-white text-xs font-medium px-2 py-1 rounded shadow"
                    title="Remove"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Admin Reply */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-3">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
          Admin Reply
        </h2>
        <textarea
          value={adminReply}
          onChange={(e) => setAdminReply(e.target.value)}
          rows={3}
          maxLength={2000}
          placeholder="Write a reply to this review..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 resize-y text-sm"
        />
        {review.adminReplyAt && (
          <p className="text-xs text-gray-400">
            Last replied: {new Date(review.adminReplyAt).toLocaleString("en-US")}
          </p>
        )}
      </div>

      {/* Bottom Save */}
      <div className="flex items-center justify-between pt-2 pb-8">
        <Link
          href="/dashboard/reviews"
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Cancel
        </Link>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium px-6 py-2 rounded-md transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
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
            {lightboxUrl.includes("/video/") || lightboxUrl.endsWith(".mp4") || lightboxUrl.endsWith(".mov") ? (
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
