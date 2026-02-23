"use client";

import { useState, useRef } from "react";

interface UploadedMedia {
  type: "image" | "video";
  url: string;
  publicId: string;
  thumbnailUrl?: string;
}

interface MediaUploaderProps {
  media: UploadedMedia[];
  onChange: (media: UploadedMedia[]) => void;
  maxFiles?: number;
}

export function MediaUploader({
  media,
  onChange,
  maxFiles = 5,
}: MediaUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (media.length + files.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed`);
      return;
    }

    setUploading(true);
    setError("");

    try {
      // Get upload signature
      const signRes = await fetch("/api/upload/sign", { method: "POST" });
      const signData = await signRes.json();

      const newMedia: UploadedMedia[] = [];

      for (const file of Array.from(files)) {
        const isVideo = file.type.startsWith("video/");
        const isImage = file.type.startsWith("image/");

        if (!isVideo && !isImage) {
          continue;
        }

        // Max 10MB for images, 50MB for videos
        const maxSize = isVideo ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
        if (file.size > maxSize) {
          setError(
            `${file.name} is too large. Max ${isVideo ? "50" : "10"}MB.`
          );
          continue;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("api_key", signData.apiKey);
        formData.append("timestamp", String(signData.timestamp));
        formData.append("signature", signData.signature);
        formData.append("folder", signData.folder);

        const uploadRes = await fetch(
          `https://api.cloudinary.com/v1_1/${signData.cloudName}/${
            isVideo ? "video" : "image"
          }/upload`,
          { method: "POST", body: formData }
        );

        const uploadData = await uploadRes.json();

        if (uploadData.secure_url) {
          const thumbnailUrl = isImage
            ? uploadData.secure_url.replace(
                "/upload/",
                "/upload/w_200,h_200,c_fill/"
              )
            : undefined;

          newMedia.push({
            type: isVideo ? "video" : "image",
            url: uploadData.secure_url,
            publicId: uploadData.public_id,
            thumbnailUrl,
          });
        }
      }

      onChange([...media, ...newMedia]);
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  function removeMedia(index: number) {
    onChange(media.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        {media.map((item, index) => (
          <div key={index} className="relative group">
            {item.type === "image" ? (
              <img
                src={item.thumbnailUrl || item.url}
                alt="Upload"
                className="w-20 h-20 object-cover rounded-md border border-gray-200"
              />
            ) : (
              <div className="w-20 h-20 bg-gray-100 rounded-md border border-gray-200 flex items-center justify-center">
                <span className="text-2xl">🎬</span>
              </div>
            )}
            <button
              type="button"
              onClick={() => removeMedia(index)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ×
            </button>
          </div>
        ))}

        {media.length < maxFiles && (
          <label
            className={`w-20 h-20 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-amber-400 transition-colors ${
              uploading ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
            {uploading ? (
              <span className="text-xs text-gray-400">...</span>
            ) : (
              <>
                <span className="text-xl text-gray-400">+</span>
                <span className="text-xs text-gray-400">Photo/Video</span>
              </>
            )}
          </label>
        )}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
