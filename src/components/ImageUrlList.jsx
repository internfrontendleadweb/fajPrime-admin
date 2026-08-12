import { useEffect, useRef, useState } from "react";
import { ImageOff, Loader2, Plus, Upload, X } from "lucide-react";
import { deleteUnusedUpload, uploadImage } from "../services/uploads.js";

// Retains the original component name so all listing/project forms use the
// new uploader without changing their data shape (an array of image URLs).
export default function ImageUrlList({ value = [], onChange, folder, onUploadingChange }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const pendingAssets = useRef(new Map());

  useEffect(() => () => {
    for (const { publicId } of pendingAssets.current.values()) {
      void deleteUnusedUpload(publicId).catch(() => {});
    }
  }, []);

  async function handleFilesChange(event) {
    const files = Array.from(event.target.files || []);
    event.target.value = "";
    if (!files.length) return;

    setError("");
    setUploading(true);
    onUploadingChange?.(true);
    const uploadedUrls = [];

    try {
      // Upload sequentially so the endpoint's one-file limit is respected and
      // each completed image appears immediately.
      for (const file of files) {
        const { url, publicId } = await uploadImage(file, folder);
        pendingAssets.current.set(url, { publicId });
        uploadedUrls.push(url);
        onChange([...value, ...uploadedUrls]);
      }
    } catch (err) {
      setError(`${uploadedUrls.length ? `${uploadedUrls.length} image(s) uploaded. ` : ""}${err.message || "Unable to upload the selected images."}`);
    } finally {
      setUploading(false);
      onUploadingChange?.(false);
    }
  }

  function removeUrl(url) {
    const asset = pendingAssets.current.get(url);
    if (asset) {
      pendingAssets.current.delete(url);
      void deleteUnusedUpload(asset.publicId).catch(() => {});
    }
    onChange(value.filter((item) => item !== url));
  }

  return (
    <div>
      <label className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-navy-900 text-white text-sm rounded-md hover:bg-navy-800 cursor-pointer transition-colors">
        {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
        {uploading ? "Uploading…" : <><Plus size={16} /> Add images</>}
        <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple onChange={handleFilesChange} disabled={uploading} className="sr-only" />
      </label>
      <p className="mt-1.5 mb-3 text-xs text-slate-400">Select one or more JPEG, PNG, WebP, or AVIF files (maximum 8MB each).</p>

      {value.length === 0 ? (
        <p className="text-sm text-slate-400">No images uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {value.map((url) => (
            <div key={url} className="relative group border border-slate-200 rounded-md overflow-hidden">
              <div className="aspect-video bg-slate-100 flex items-center justify-center">
                <img src={url} alt="Uploaded content" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = "none"; }} />
                <ImageOff size={24} className="text-slate-300" />
              </div>
              <button type="button" onClick={() => removeUrl(url)} disabled={uploading} className="absolute top-1.5 right-1.5 bg-white/90 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 disabled:opacity-50" aria-label="Remove image">
                <X size={14} className="text-red-600" />
              </button>
            </div>
          ))}
        </div>
      )}
      {error && <p role="alert" className="text-red-600 text-xs mt-2">{error}</p>}
    </div>
  );
}
