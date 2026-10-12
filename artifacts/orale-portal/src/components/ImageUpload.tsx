import { useState } from "react";
import { X, Loader2, Upload, ImageIcon } from "lucide-react";

export function ImageUpload({ value, onChange }: { value: string | null; onChange: (url: string | null) => void }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const token = localStorage.getItem("orale_admin_token") ?? "";

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const requestUrlResponse = await fetch("/api/storage/uploads/request-url", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: file.name,
          size: file.size,
          contentType: file.type,
        }),
      });
      const uploadData = await requestUrlResponse.json() as {
        uploadURL?: string;
        objectPath?: string;
        error?: string;
      };
      if (!requestUrlResponse.ok || !uploadData.uploadURL || !uploadData.objectPath) {
        throw new Error(uploadData.error ?? "Upload failed");
      }

      const uploadResponse = await fetch(uploadData.uploadURL, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!uploadResponse.ok) {
        throw new Error("Image upload failed. Please try again.");
      }

      onChange(`/api/storage${uploadData.objectPath}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <div className="space-y-2">
      {value && (
        <div className="relative w-full aspect-video rounded-sm overflow-hidden bg-black border border-white/10 group">
          <img src={value} alt="preview" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute top-2 right-2 p-1 bg-black/70 rounded-full text-white hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
          >
            <X size={14} />
          </button>
        </div>
      )}
      {!value && (
        <div className="flex items-center justify-center w-full h-28 bg-background border border-dashed border-white/20 rounded-sm">
          <ImageIcon size={24} className="text-muted-foreground/40" />
        </div>
      )}
      <label className={`inline-flex items-center gap-2 px-4 py-2 rounded-sm text-sm cursor-pointer transition-colors font-mono border ${uploading ? "border-white/10 text-muted-foreground cursor-not-allowed" : "border-white/20 text-white hover:bg-white/5"}`}>
        {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
        {uploading ? "Uploading…" : value ? "Replace Image" : "Upload Image"}
        <input type="file" accept="image/*" className="hidden" disabled={uploading} onChange={handleFile} />
      </label>
      {error && <p className="text-red-400 text-xs font-mono">{error}</p>}
    </div>
  );
}
