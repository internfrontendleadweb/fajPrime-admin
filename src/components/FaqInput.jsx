import { Plus, Trash2 } from "lucide-react";

// Services' faqs field is an array of { q, a } objects - a plain
// TagInput chip doesn't fit (each entry needs two fields), so this is
// its own small component.
export default function FaqInput({ value = [], onChange }) {
  function updateFaq(index, field, text) {
    const next = value.map((faq, i) => (i === index ? { ...faq, [field]: text } : faq));
    onChange(next);
  }

  function addFaq() {
    onChange([...value, { q: "", a: "" }]);
  }

  function removeFaq(index) {
    onChange(value.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-3">
      {value.map((faq, i) => (
        <div key={i} className="border border-slate-200 rounded-md p-3 space-y-2">
          <div className="flex items-start gap-2">
            <input
              type="text"
              value={faq.q}
              onChange={(e) => updateFaq(i, "q", e.target.value)}
              placeholder="Question"
              className="flex-1 border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
            />
            <button
              type="button"
              onClick={() => removeFaq(i)}
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
              aria-label={`Remove question ${i + 1}`}
            >
              <Trash2 size={15} />
            </button>
          </div>
          <textarea
            value={faq.a}
            onChange={(e) => updateFaq(i, "a", e.target.value)}
            placeholder="Answer"
            rows={2}
            className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
          />
        </div>
      ))}
      <button
        type="button"
        onClick={addFaq}
        className="flex items-center gap-1.5 text-sm text-navy-700 border border-slate-200 rounded-md px-3 py-1.5 hover:bg-slate-50 transition-colors"
      >
        <Plus size={15} /> Add FAQ
      </button>
    </div>
  );
}
