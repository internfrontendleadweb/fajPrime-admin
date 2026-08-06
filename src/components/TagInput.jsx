import { useState } from "react";
import { X } from "lucide-react";

// Reusable for every string-array field across resources: amenities
// (Listings, Projects), benefits/process (Services). Type + Enter (or
// comma) adds a chip, click the x to remove one.
export default function TagInput({ value = [], onChange, placeholder = "Type and press Enter…" }) {
  const [input, setInput] = useState("");

  function addTag() {
    const trimmed = input.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
    }
    setInput("");
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    } else if (e.key === "Backspace" && !input && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  }

  function removeTag(tag) {
    onChange(value.filter((t) => t !== tag));
  }

  return (
    <div className="border border-slate-200 rounded-md px-2 py-1.5 flex flex-wrap gap-1.5 focus-within:ring-2 focus-within:ring-gold-500 focus-within:border-gold-500 transition-colors">
      {value.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 bg-navy-900/5 text-navy-800 text-sm px-2 py-1 rounded"
        >
          {tag}
          <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-600">
            <X size={13} />
          </button>
        </span>
      ))}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addTag}
        placeholder={value.length === 0 ? placeholder : ""}
        className="flex-1 min-w-[120px] outline-none text-sm py-1 px-1"
      />
    </div>
  );
}
