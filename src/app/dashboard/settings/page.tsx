"use client";

import { useEffect, useState } from "react";

interface WidgetSettings {
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  layout: "list" | "grid";
  reviewsPerPage: number;
  showMedia: boolean;
  showVerifiedBadge: boolean;
  showReviewForm: boolean;
}

interface SettingsData {
  shopName: string;
  shopUrl: string;
  apiKey: string;
  autoApproveReviews: boolean;
  autoApproveMinRating: number;
  widget: WidgetSettings;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    const res = await fetch("/api/settings");
    const json = await res.json();
    if (json.success) {
      setSettings(json.data);
    }
    setLoading(false);
  }

  async function saveSettings() {
    if (!settings) return;
    setSaving(true);
    setMessage("");

    const res = await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        shopName: settings.shopName,
        shopUrl: settings.shopUrl,
        autoApproveReviews: settings.autoApproveReviews,
        autoApproveMinRating: settings.autoApproveMinRating,
        widget: settings.widget,
      }),
    });

    const json = await res.json();
    setSaving(false);

    if (json.success) {
      setMessage("Einstellungen gespeichert!");
      setTimeout(() => setMessage(""), 3000);
    } else {
      setMessage("Fehler beim Speichern");
    }
  }

  async function regenerateApiKey() {
    if (!confirm("API-Key wirklich neu generieren? Der alte Key wird sofort ungültig.")) return;

    const res = await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ regenerateApiKey: true }),
    });

    const json = await res.json();
    if (json.success) {
      setSettings(json.data);
      setMessage("Neuer API-Key generiert!");
      setTimeout(() => setMessage(""), 3000);
    }
  }

  function copyEmbedCode() {
    if (!settings) return;
    const appUrl = window.location.origin;
    const code = `<script\n  src="${appUrl}/widget/reviews-widget.js"\n  data-api-key="${settings.apiKey}"\n  async defer\n></script>\n<div id="reviews-widget"></div>`;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading) {
    return <div className="text-gray-500">Laden...</div>;
  }

  if (!settings) {
    return <div className="text-red-500">Settings nicht gefunden. Bitte Seed-Script ausführen.</div>;
  }

  return (
    <div className="max-w-3xl space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Einstellungen</h1>

      {message && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded text-sm">
          {message}
        </div>
      )}

      {/* General */}
      <section className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold">Allgemein</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Shop-Name</label>
          <input
            type="text"
            value={settings.shopName}
            onChange={(e) => setSettings({ ...settings, shopName: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Website-URL</label>
          <input
            type="url"
            value={settings.shopUrl}
            onChange={(e) => setSettings({ ...settings, shopUrl: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </section>

      {/* Auto Approve */}
      <section className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold">Auto-Approve</h2>
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={settings.autoApproveReviews}
            onChange={(e) =>
              setSettings({ ...settings, autoApproveReviews: e.target.checked })
            }
            className="h-4 w-4 text-amber-500 rounded"
          />
          <label className="text-sm text-gray-700">
            Reviews automatisch genehmigen
          </label>
        </div>
        {settings.autoApproveReviews && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mindest-Bewertung für Auto-Approve
            </label>
            <select
              value={settings.autoApproveMinRating}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  autoApproveMinRating: Number(e.target.value),
                })
              }
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n} Stern{n > 1 ? "e" : ""} und höher
                </option>
              ))}
            </select>
          </div>
        )}
      </section>

      {/* Widget Appearance */}
      <section className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold">Widget-Darstellung</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Primärfarbe</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={settings.widget.primaryColor}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    widget: { ...settings.widget, primaryColor: e.target.value },
                  })
                }
                className="h-10 w-10 rounded border border-gray-300 cursor-pointer"
              />
              <span className="text-sm text-gray-500">{settings.widget.primaryColor}</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hintergrundfarbe</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={settings.widget.backgroundColor}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    widget: { ...settings.widget, backgroundColor: e.target.value },
                  })
                }
                className="h-10 w-10 rounded border border-gray-300 cursor-pointer"
              />
              <span className="text-sm text-gray-500">{settings.widget.backgroundColor}</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Textfarbe</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={settings.widget.textColor}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    widget: { ...settings.widget, textColor: e.target.value },
                  })
                }
                className="h-10 w-10 rounded border border-gray-300 cursor-pointer"
              />
              <span className="text-sm text-gray-500">{settings.widget.textColor}</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Layout</label>
            <select
              value={settings.widget.layout}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  widget: { ...settings.widget, layout: e.target.value as "list" | "grid" },
                })
              }
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="list">Liste</option>
              <option value="grid">Grid</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Reviews pro Seite</label>
          <input
            type="number"
            min={1}
            max={50}
            value={settings.widget.reviewsPerPage}
            onChange={(e) =>
              setSettings({
                ...settings,
                widget: { ...settings.widget, reviewsPerPage: Number(e.target.value) },
              })
            }
            className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <div className="space-y-2">
          {[
            { key: "showMedia" as const, label: "Fotos/Videos anzeigen" },
            { key: "showReviewForm" as const, label: "Review-Formular im Widget anzeigen" },
          ].map(({ key, label }) => (
            <div key={key} className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.widget[key]}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    widget: { ...settings.widget, [key]: e.target.checked },
                  })
                }
                className="h-4 w-4 text-amber-500 rounded"
              />
              <label className="text-sm text-gray-700">{label}</label>
            </div>
          ))}
        </div>
      </section>

      {/* API Key */}
      <section className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold">API Key</h2>
        <div className="flex items-center gap-3">
          <code className="flex-1 bg-gray-100 px-3 py-2 rounded text-sm font-mono break-all">
            {settings.apiKey}
          </code>
          <button
            onClick={regenerateApiKey}
            className="text-sm text-red-600 hover:text-red-700 whitespace-nowrap"
          >
            Neu generieren
          </button>
        </div>
      </section>

      {/* Embed Code */}
      <section className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold">Widget Embed-Code</h2>
        <p className="text-sm text-gray-500">
          Füge diesen Code auf deiner Website ein, um das Review-Widget anzuzeigen.
        </p>
        <div className="relative">
          <pre className="bg-gray-900 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`<script
  src="${typeof window !== "undefined" ? window.location.origin : "https://your-app.com"}/widget/reviews-widget.js"
  data-api-key="${settings.apiKey}"
  async defer
></script>
<div id="reviews-widget"></div>`}
          </pre>
          <button
            onClick={copyEmbedCode}
            className="absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 text-white text-xs px-3 py-1 rounded"
          >
            {copied ? "Kopiert!" : "Kopieren"}
          </button>
        </div>
      </section>

      {/* Save */}
      <div className="flex justify-end">
        <button
          onClick={saveSettings}
          disabled={saving}
          className="bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 px-6 rounded-md transition-colors disabled:opacity-50"
        >
          {saving ? "Speichern..." : "Einstellungen speichern"}
        </button>
      </div>
    </div>
  );
}
