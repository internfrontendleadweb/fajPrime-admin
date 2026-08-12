import { ImageOff, Loader2, Trash2, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { deleteUnusedUpload, uploadImage } from "../services/uploads.js";

// Uploads a single image to Cloudinary, then gives the owning form its URL.
// Existing records remain compatible because their image fields are still URL strings.
export default function SingleImageInput({ value = "", onChange, folder, onUploadingChange }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const pendingAsset = useRef(null);

  async function discardPendingAsset() {
    const asset = pendingAsset.current;
    if (!asset) return;
    pendingAsset.current = null;
    await deleteUnusedUpload(asset.publicId).catch(() => {});
  }

  useEffect(() => () => { void discardPendingAsset(); }, []);

  async function handleFileChange(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setError("");
    setUploading(true);
    onUploadingChange?.(true);
    try {
      await discardPendingAsset();
      const { url, publicId } = await uploadImage(file, folder);
      pendingAsset.current = { url, publicId };
      onChange(url);
    } catch (err) {
      setError(err.message || "Unable to upload this image.");
    } finally {
      setUploading(false);
      onUploadingChange?.(false);
    }
  }

  return (
    <div>
      <div className="flex gap-3 items-start">
        <div className="w-16 h-16 rounded-md bg-slate-100 border border-slate-200 flex-shrink-0 overflow-hidden flex items-center justify-center">
          {value ? <img src={value} alt="Selected upload" className="w-full h-full object-cover" /> : <ImageOff size={18} className="text-slate-300" />}
        </div>
        <div className="flex-1 min-w-0">
          <label className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-navy-900 text-white text-sm rounded-md hover:bg-navy-800 cursor-pointer transition-colors">
            {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
            {uploading ? "Uploading…" : value ? "Replace image" : "Choose image"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              onChange={handleFileChange}
              disabled={uploading}
              className="sr-only"
            />
          </label>
          {value && (
            <button type="button" onClick={() => { void discardPendingAsset(); onChange(""); }} disabled={uploading} className="ml-2 inline-flex items-center gap-1 text-sm text-red-600 hover:text-red-700 disabled:opacity-50">
              <Trash2 size={15} /> Remove
            </button>
          )}
          <p className="mt-1.5 text-xs text-slate-400">JPEG, PNG, WebP, or AVIF — maximum 8MB.</p>
        </div>
      </div>
      {error && <p role="alert" className="text-red-600 text-xs mt-2">{error}</p>}
    </div>
  );
}
