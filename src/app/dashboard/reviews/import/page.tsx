"use client";

import { useState, useRef } from "react";
import Link from "next/link";

interface ImportResult {
  imported: number;
  skipped: number;
  errors: string[];
}

export default function ImportReviewsPage() {
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState("");
  const [importStatus, setImportStatus] = useState("approved");
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleImport(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;

    setImporting(true);
    setError("");
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`/api/reviews/import?status=${importStatus}`, {
        method: "POST",
        body: formData,
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error || "Import fehlgeschlagen");
        return;
      }

      setResult(json.data);
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch {
      setError("Ein Fehler ist aufgetreten. Bitte versuche es erneut.");
    } finally {
      setImporting(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reviews importieren</h1>
          <p className="text-sm text-gray-500 mt-1">
            Importiere Reviews aus einer CSV-Datei (Judge.me-Format)
          </p>
        </div>
        <Link
          href="/dashboard/reviews"
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          Zurück zu Reviews
        </Link>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-800 mb-2">CSV-Format</h3>
        <p className="text-sm text-blue-700 mb-2">
          Die CSV-Datei sollte folgende Spalten enthalten:
        </p>
        <div className="text-xs text-blue-600 font-mono bg-blue-100 rounded p-2 overflow-x-auto">
          reviewer_name, reviewer_email, rating, title, body, review_date, reply,
          picture_urls
        </div>
        <p className="text-xs text-blue-600 mt-2">
          Judge.me-Exporte werden direkt unterstützt. Duplikate (gleiche E-Mail +
          gleicher Text) werden automatisch übersprungen.
        </p>
      </div>

      {/* Import Form */}
      <form onSubmit={handleImport} className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        {/* File Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            CSV-Datei auswählen
          </label>
          <div className="flex items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,text/csv"
              onChange={(e) => {
                const f = e.target.files?.[0] || null;
                setFile(f);
                setResult(null);
                setError("");
              }}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100 file:cursor-pointer"
            />
          </div>
          {file && (
            <p className="text-xs text-gray-500 mt-1">
              {file.name} ({(file.size / 1024).toFixed(1)} KB)
            </p>
          )}
        </div>

        {/* Import Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status der importierten Reviews
          </label>
          <select
            value={importStatus}
            onChange={(e) => setImportStatus(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="approved">Genehmigt (empfohlen für Judge.me-Exporte)</option>
            <option value="pending">Ausstehend (manuell prüfen)</option>
            <option value="rejected">Abgelehnt</option>
          </select>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={!file || importing}
          className="w-full px-4 py-2 bg-amber-600 text-white rounded-md text-sm font-medium hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {importing ? "Importiere..." : "Reviews importieren"}
        </button>
      </form>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-3">
          <h3 className="text-lg font-medium text-gray-900">Import-Ergebnis</h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-green-700">{result.imported}</p>
              <p className="text-sm text-green-600">Importiert</p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-yellow-700">{result.skipped}</p>
              <p className="text-sm text-yellow-600">Übersprungen</p>
            </div>
          </div>

          {result.errors.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-1">Fehler:</h4>
              <ul className="text-xs text-red-600 space-y-1 max-h-40 overflow-y-auto">
                {result.errors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          <Link
            href="/dashboard/reviews"
            className="inline-flex px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            Reviews ansehen
          </Link>
        </div>
      )}
    </div>
  );
}
