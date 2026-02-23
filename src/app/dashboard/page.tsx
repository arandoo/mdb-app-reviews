"use client";

import { useEffect, useState } from "react";

interface Analytics {
  totalReviews: number;
  approvedReviews: number;
  pendingReviews: number;
  rejectedReviews: number;
  averageRating: number;
  ratingDistribution: Record<string, number>;
}

export default function DashboardPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics")
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setAnalytics(json.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-gray-500">Laden...</div>;
  }

  const stats = analytics || {
    totalReviews: 0,
    approvedReviews: 0,
    pendingReviews: 0,
    rejectedReviews: 0,
    averageRating: 0,
    ratingDistribution: { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 },
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Gesamt Reviews" value={stats.totalReviews} />
        <StatCard
          label="Durchschnitt"
          value={stats.averageRating > 0 ? `${stats.averageRating.toFixed(1)} ⭐` : "—"}
        />
        <StatCard
          label="Ausstehend"
          value={stats.pendingReviews}
          highlight={stats.pendingReviews > 0}
        />
        <StatCard label="Genehmigt" value={stats.approvedReviews} />
      </div>

      {/* Rating Distribution */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-4">Bewertungsverteilung</h2>
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = stats.ratingDistribution[String(star)] || 0;
            const percentage =
              stats.totalReviews > 0
                ? (count / stats.totalReviews) * 100
                : 0;
            return (
              <div key={star} className="flex items-center gap-3">
                <span className="text-sm w-12 text-right">
                  {star} ⭐
                </span>
                <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                  <div
                    className="bg-amber-400 h-full rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-500 w-12">{count}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string | number;
  highlight?: boolean;
}) {
  return (
    <div
      className={`bg-white rounded-lg border p-6 ${
        highlight ? "border-amber-300 bg-amber-50" : "border-gray-200"
      }`}
    >
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}
