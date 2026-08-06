import { useState } from "react";
import { Plus, X, ImageOff } from "lucide-react";

// Stopgap until Section 7 wires up real Cloudinary drag-and-drop
// upload — for now, paste a URL/path and it's added to the list.
export default function ImageUrlList({ value = [], onChange }) {
  const [input, setInput] = useState("");

  function addUrl() {
    const trimmed = input.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
      setInput("");
    }
  }

  function removeUrl(url) {
    onChange(value.filter((u) => u !== url));
  }

  return (
    <div>
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addUrl();
            }
          }}
          placeholder="/images/properties/photo.webp or a full URL"
          className="flex-1 border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
        />
        <button
          type="button"
          onClick={addUrl}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-navy-900 text-white text-sm rounded-md hover:bg-navy-800 transition-colors"
        >
          <Plus size={16} /> Add
        </button>
      </div>

      {value.length === 0 ? (
        <p className="text-sm text-slate-400">No images added yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {value.map((url) => (
            <div key={url} className="relative group border border-slate-200 rounded-md overflow-hidden">
              <div className="aspect-video bg-slate-100 flex items-center justify-center">
                <img
                  src={url}
                  alt=""
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
                <div className="hidden w-full h-full items-center justify-center text-slate-300">
                  <ImageOff size={24} />
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeUrl(url)}
                className="absolute top-1.5 right-1.5 bg-white/90 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
              >
                <X size={14} className="text-red-600" />
              </button>
              <p className="text-[11px] text-slate-400 px-1.5 py-1 truncate">{url}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
