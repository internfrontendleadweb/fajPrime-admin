import { AlertTriangle } from "lucide-react";

// Reusable across every resource's delete action — a plain browser
// confirm() works, but doesn't match the rest of the app and can't
// show which specific item is about to be deleted.
export default function ConfirmDialog({ open, title, message, onConfirm, onCancel, confirming }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-navy-950/60" onClick={onCancel} />
      <div className="relative bg-white rounded-lg shadow-2xl max-w-sm w-full p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={20} className="text-red-500" />
          </div>
          <div>
            <h3 className="font-semibold text-navy-900">{title}</h3>
            <p className="text-sm text-slate-500 mt-1">{message}</p>
          </div>
        </div>
        <div className="flex justify-end gap-2.5 mt-6">
          <button
            onClick={onCancel}
            disabled={confirming}
            className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={confirming}
            className="px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors disabled:opacity-60"
          >
            {confirming ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
