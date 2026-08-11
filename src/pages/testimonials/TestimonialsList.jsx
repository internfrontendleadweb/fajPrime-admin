import { Link, useNavigate } from "react-router-dom";
import { Plus, Pencil, Trash2, User, Star } from "lucide-react";
import { testimonialsService } from "../../services/testimonials.js";
import { useResourceList } from "../../utils/useResourceList.js";
import ConfirmDialog from "../../components/ConfirmDialog.jsx";

export default function TestimonialsList() {
  const navigate = useNavigate();
  const { items, loading, deleteTarget, setDeleteTarget, deleting, confirmDelete } = useResourceList(testimonialsService);

  return (
    <div>
      <div className="flex items-center justify-end mb-5">
        <Link to="/testimonials/new" className="flex items-center gap-1.5 bg-gold-500 hover:bg-gold-400 text-navy-950 text-sm font-semibold px-4 py-2 rounded-md transition-colors">
          <Plus size={16} /> New Testimonial
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 2 }).map((_, i) => <div key={i} className="h-32 bg-white border border-slate-200 rounded-lg animate-pulse" />)}
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-lg p-10 text-center text-slate-400">No testimonials yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {items.map((t) => (
            <div key={t.id} className="bg-white border border-slate-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex-shrink-0 overflow-hidden flex items-center justify-center">
                    {t.image ? <img src={t.image} alt="" className="w-full h-full object-cover" /> : <User size={16} className="text-slate-300" />}
                  </div>
                  <div>
                    <p className="font-medium text-navy-900 text-sm">{t.name}</p>
                    <p className="text-xs text-slate-400">{t.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => navigate(`/testimonials/${t.id}/edit`, { state: { testimonial: t } })} className="p-1.5 text-slate-400 hover:text-navy-900 hover:bg-slate-100 rounded transition-colors" aria-label={`Edit testimonial from ${t.name}`}>
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => setDeleteTarget(t)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" aria-label={`Delete testimonial from ${t.name}`}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div className="flex gap-0.5 mt-2.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={12} className={i < t.rating ? "fill-gold-400 text-gold-400" : "text-slate-200"} />
                ))}
              </div>
              <p className="text-sm text-slate-600 mt-2 line-clamp-3">{t.review}</p>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete this testimonial?"
        message={`The testimonial from "${deleteTarget?.name}" will be permanently removed. This can't be undone.`}
        onConfirm={() => confirmDelete("name")}
        onCancel={() => setDeleteTarget(null)}
        confirming={deleting}
      />
    </div>
  );
}
