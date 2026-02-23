"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { StarInput } from "@/components/ui/star-input";
import { MediaUploader } from "@/components/review-form/media-uploader";

interface MediaItem {
  type: "image" | "video";
  url: string;
  publicId: string;
  thumbnailUrl?: string;
}

export default function NewReviewPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState("approved");
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [adminReply, setAdminReply] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!customerName.trim()) {
      setError("Bitte Kundennamen eingeben");
      return;
    }
    if (!body.trim()) {
      setError("Bitte Review-Text eingeben");
      return;
    }

    setLoading(true);

    try {
      // Create review via admin API
      const res = await fetch("/api/reviews/admin-create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: customerName.trim(),
          customerEmail: customerEmail.trim() || `admin-${Date.now()}@noemail.local`,
          rating,
          title: title.trim() || body.trim().substring(0, 50) + (body.trim().length > 50 ? "..." : ""),
          body: body.trim(),
          media,
          status,
          adminReply: adminReply.trim() || undefined,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error || "Fehler beim Erstellen");
        return;
      }

      router.push("/dashboard/reviews");
    } catch {
      setError("Ein Fehler ist aufgetreten");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Review hinzufügen</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manuell ein neues Review erstellen
          </p>
        </div>
        <Link
          href="/dashboard/reviews"
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          Zurück zu Reviews
        </Link>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg border border-gray-200 p-6 space-y-5"
      >
        {/* Name + Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kundenname *
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Max Mustermann"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              E-Mail
            </label>
            <input
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              placeholder="kunde@email.de"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bewertung *
          </label>
          <StarInput value={rating} onChange={setRating} size="lg" />
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Titel
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Wird automatisch aus dem Text generiert, wenn leer"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {/* Body */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Review-Text *
          </label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Das Review des Kunden..."
            rows={5}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 resize-y"
            required
          />
        </div>

        {/* Media Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fotos / Videos
          </label>
          <MediaUploader media={media} onChange={setMedia} maxFiles={10} />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="approved">Genehmigt</option>
            <option value="pending">Ausstehend</option>
            <option value="rejected">Abgelehnt</option>
          </select>
        </div>

        {/* Admin Reply */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Admin-Antwort (optional)
          </label>
          <textarea
            value={adminReply}
            onChange={(e) => setAdminReply(e.target.value)}
            placeholder="Antwort auf das Review..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 resize-y"
          />
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Submit */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-md text-sm font-medium hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Wird erstellt..." : "Review erstellen"}
          </button>
          <Link
            href="/dashboard/reviews"
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors text-center"
          >
            Abbrechen
          </Link>
        </div>
      </form>
    </div>
  );
}
