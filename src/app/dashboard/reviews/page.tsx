"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { StarRating } from "@/components/ui/star-rating";

interface ReviewData {
  _id: string;
  customerName: string;
  customerEmail: string;
  rating: number;
  title: string;
  body: string;
  status: "pending" | "approved" | "rejected";
  media: { type: string; url: string; thumbnailUrl?: string }[];
  createdAt: string;
  adminReply?: string;
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

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [sort, setSort] = useState("newest");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [actionLoading, setActionLoading] = useState(false);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", "20");
    params.set("sort", sort);
    if (statusFilter) params.set("status", statusFilter);
    if (search) params.set("search", search);

    const res = await fetch(`/api/reviews?${params}`);
    const json = await res.json();

    if (json.success) {
      setReviews(json.data);
      setTotal(json.total);
      setTotalPages(json.totalPages);
    }
    setLoading(false);
  }, [page, statusFilter, search, sort]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  async function handleAction(id: string, action: "approve" | "reject" | "delete") {
    setActionLoading(true);
    if (action === "delete") {
      await fetch(`/api/reviews/${id}`, { method: "DELETE" });
    } else {
      await fetch(`/api/reviews/${id}/${action}`, { method: "PATCH" });
    }
    setSelected((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    await fetchReviews();
    setActionLoading(false);
  }

  async function handleBulkAction(action: "approve" | "reject" | "delete") {
    if (selected.size === 0) return;
    const confirmMsg =
      action === "delete"
        ? `${selected.size} Review(s) wirklich löschen?`
        : `${selected.size} Review(s) ${action === "approve" ? "genehmigen" : "ablehnen"}?`;
    if (!confirm(confirmMsg)) return;

    setActionLoading(true);
    for (const id of selected) {
      if (action === "delete") {
        await fetch(`/api/reviews/${id}`, { method: "DELETE" });
      } else {
        await fetch(`/api/reviews/${id}/${action}`, { method: "PATCH" });
      }
    }
    setSelected(new Set());
    await fetchReviews();
    setActionLoading(false);
  }

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    if (selected.size === reviews.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(reviews.map((r) => r._id)));
    }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Reviews</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">{total} Reviews gesamt</span>
          <Link
            href="/dashboard/reviews/import"
            className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            CSV Import
          </Link>
          <Link
            href="/dashboard/reviews/new"
            className="px-3 py-2 bg-amber-600 text-white rounded-md text-sm font-medium hover:bg-amber-700 transition-colors"
          >
            + Review hinzufügen
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Status Tabs */}
        <div className="flex bg-white border border-gray-200 rounded-md overflow-hidden">
          {[
            { value: "", label: "Alle" },
            { value: "pending", label: "Ausstehend" },
            { value: "approved", label: "Genehmigt" },
            { value: "rejected", label: "Abgelehnt" },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => {
                setStatusFilter(tab.value);
                setPage(1);
              }}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                statusFilter === tab.value
                  ? "bg-amber-50 text-amber-700"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Suche..."
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <button
            type="submit"
            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm transition-colors"
          >
            Suchen
          </button>
        </form>

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
            setPage(1);
          }}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          <option value="newest">Neueste zuerst</option>
          <option value="oldest">Älteste zuerst</option>
          <option value="highest">Beste Bewertung</option>
          <option value="lowest">Schlechteste Bewertung</option>
        </select>
      </div>

      {/* Bulk Actions */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-md px-4 py-2">
          <span className="text-sm font-medium text-amber-800">
            {selected.size} ausgewählt
          </span>
          <button
            onClick={() => handleBulkAction("approve")}
            disabled={actionLoading}
            className="text-sm text-green-700 hover:text-green-800 font-medium disabled:opacity-50"
          >
            Genehmigen
          </button>
          <button
            onClick={() => handleBulkAction("reject")}
            disabled={actionLoading}
            className="text-sm text-orange-700 hover:text-orange-800 font-medium disabled:opacity-50"
          >
            Ablehnen
          </button>
          <button
            onClick={() => handleBulkAction("delete")}
            disabled={actionLoading}
            className="text-sm text-red-700 hover:text-red-800 font-medium disabled:opacity-50"
          >
            Löschen
          </button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Laden...</div>
        ) : reviews.length === 0 ? (
          <div className="p-8 text-center text-gray-500">Keine Reviews gefunden.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selected.size === reviews.length && reviews.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded"
                  />
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  Bewertung
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  Titel / Kunde
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  Status
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  Datum
                </th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">
                  Aktionen
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {reviews.map((review) => (
                <tr key={review._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected.has(review._id)}
                      onChange={() => toggleSelect(review._id)}
                      className="rounded"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <StarRating rating={review.rating} size="sm" />
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/dashboard/reviews/${review._id}`}
                      className="hover:text-amber-600 transition-colors"
                    >
                      <p className="font-medium text-gray-900 truncate max-w-xs">
                        {review.title}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {review.customerName} &middot; {review.customerEmail}
                      </p>
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        STATUS_COLORS[review.status]
                      }`}
                    >
                      {STATUS_LABELS[review.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString("de-DE")}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {review.status !== "approved" && (
                        <button
                          onClick={() => handleAction(review._id, "approve")}
                          disabled={actionLoading}
                          className="text-green-600 hover:text-green-700 text-xs font-medium disabled:opacity-50"
                        >
                          Genehmigen
                        </button>
                      )}
                      {review.status !== "rejected" && (
                        <button
                          onClick={() => handleAction(review._id, "reject")}
                          disabled={actionLoading}
                          className="text-orange-600 hover:text-orange-700 text-xs font-medium disabled:opacity-50"
                        >
                          Ablehnen
                        </button>
                      )}
                      <button
                        onClick={() => {
                          if (confirm("Review wirklich löschen?")) {
                            handleAction(review._id, "delete");
                          }
                        }}
                        disabled={actionLoading}
                        className="text-red-600 hover:text-red-700 text-xs font-medium disabled:opacity-50"
                      >
                        Löschen
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 hover:bg-gray-50"
          >
            Zurück
          </button>
          <span className="text-sm text-gray-600">
            Seite {page} von {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 hover:bg-gray-50"
          >
            Weiter
          </button>
        </div>
      )}
    </div>
  );
}
