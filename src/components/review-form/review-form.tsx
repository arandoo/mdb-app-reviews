"use client";

import { useState } from "react";
import { StarInput } from "@/components/ui/star-input";
import { MediaUploader } from "./media-uploader";

interface UploadedMedia {
  type: "image" | "video";
  url: string;
  publicId: string;
  thumbnailUrl?: string;
}

interface ReviewFormProps {
  onSuccess?: () => void;
  apiUrl?: string;
}

export function ReviewForm({ onSuccess, apiUrl = "/api/reviews" }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [media, setMedia] = useState<UploadedMedia[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (rating === 0) {
      setError("Bitte wähle eine Bewertung.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerEmail,
          rating,
          title,
          body,
          media,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error || "Fehler beim Absenden.");
        setSubmitting(false);
        return;
      }

      setSuccess(true);
      setRating(0);
      setTitle("");
      setBody("");
      setCustomerName("");
      setCustomerEmail("");
      setMedia([]);
      onSuccess?.();
    } catch {
      setError("Netzwerkfehler. Bitte versuche es erneut.");
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <p className="text-green-700 font-medium text-lg">
          Vielen Dank für dein Review!
        </p>
        <p className="text-green-600 text-sm mt-1">
          Dein Review wird nach Prüfung veröffentlicht.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="mt-4 text-sm text-amber-600 hover:text-amber-700 underline"
        >
          Weiteres Review schreiben
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
          {error}
        </div>
      )}

      {/* Rating */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Bewertung *
        </label>
        <StarInput value={rating} onChange={setRating} size="lg" />
      </div>

      {/* Name & Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name *
          </label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
            maxLength={100}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            placeholder="Dein Name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            E-Mail *
          </label>
          <input
            type="email"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            placeholder="deine@email.de"
          />
        </div>
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Titel *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          maxLength={200}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          placeholder="Kurze Zusammenfassung"
        />
      </div>

      {/* Body */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Dein Review *
        </label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
          maxLength={5000}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-y"
          placeholder="Erzähle von deiner Erfahrung mit den MakeDesignerBags Kursen..."
        />
      </div>

      {/* Media Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Fotos / Videos (optional)
        </label>
        <MediaUploader media={media} onChange={setMedia} maxFiles={5} />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-amber-500 hover:bg-amber-600 text-white font-medium py-3 px-6 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? "Wird gesendet..." : "Review absenden"}
      </button>
    </form>
  );
}
