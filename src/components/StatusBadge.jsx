// Color mapping for every status/type string used across the CMS.
// Falls back to a neutral slate style for anything not listed here,
// so a new enum value added later never renders unstyled/broken.
const COLORS = {
  // Listing status
  "For Sale": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "For Rent": "bg-blue-50 text-blue-700 border-blue-200",
  "Off-Plan": "bg-amber-50 text-amber-700 border-amber-200",
  Sold: "bg-slate-100 text-slate-500 border-slate-200",
  Rented: "bg-slate-100 text-slate-500 border-slate-200",
  // Project status
  past: "bg-slate-100 text-slate-500 border-slate-200",
  current: "bg-emerald-50 text-emerald-700 border-emerald-200",
  future: "bg-blue-50 text-blue-700 border-blue-200",
  // Contact submission status
  NEW: "bg-blue-50 text-blue-700 border-blue-200",
  CONTACTED: "bg-amber-50 text-amber-700 border-amber-200",
  CLOSED: "bg-slate-100 text-slate-500 border-slate-200",
  // Inspection booking status
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  CONFIRMED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  COMPLETED: "bg-slate-100 text-slate-500 border-slate-200",
  CANCELLED: "bg-red-50 text-red-700 border-red-200",
};

export default function StatusBadge({ value }) {
  const style = COLORS[value] || "bg-slate-100 text-slate-600 border-slate-200";
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${style}`}>
      {value}
    </span>
  );
}
