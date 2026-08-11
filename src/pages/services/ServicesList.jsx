import { Link, useNavigate } from "react-router-dom";
import {
  Plus, Pencil, Trash2,
  Building2, Home, KeyRound, TrendingUp, MapPin, HardHat, Ruler, ClipboardList, Compass, Briefcase,
} from "lucide-react";
import { servicesService } from "../../services/services.js";
import { useResourceList } from "../../utils/useResourceList.js";
import ConfirmDialog from "../../components/ConfirmDialog.jsx";

// Explicit registry rather than `import * as Icons from "lucide-react"` -
// a wildcard import pulls the ENTIRE icon library (1500+ icons) into the
// bundle just to look one up by name, since the bundler can't tree-shake
// a dynamic string lookup. This covers every icon actually used by the
// seeded services, plus a sensible fallback for anything new.
const ICON_MAP = { Building2, Home, KeyRound, TrendingUp, MapPin, HardHat, Ruler, ClipboardList, Compass };

export default function ServicesList() {
  const navigate = useNavigate();
  const { items, loading, deleteTarget, setDeleteTarget, deleting, confirmDelete } = useResourceList(servicesService);

  return (
    <div>
      <div className="flex items-center justify-end mb-5">
        <Link to="/services/new" className="flex items-center gap-1.5 bg-gold-500 hover:bg-gold-400 text-navy-950 text-sm font-semibold px-4 py-2 rounded-md transition-colors">
          <Plus size={16} /> New Service
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-32 bg-white border border-slate-200 rounded-lg animate-pulse" />)}
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-lg p-10 text-center text-slate-400">No services yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((service) => {
            const Icon = ICON_MAP[service.icon] || Briefcase;
            return (
              <div key={service.id} className="bg-white border border-slate-200 rounded-lg p-5">
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-md bg-navy-900/5 flex items-center justify-center">
                    <Icon size={20} className="text-navy-900" />
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => navigate(`/services/${service.id}/edit`, { state: { service } })}
                      className="p-1.5 text-slate-400 hover:text-navy-900 hover:bg-slate-100 rounded transition-colors"
                      aria-label={`Edit ${service.title}`}
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(service)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      aria-label={`Delete ${service.title}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <h3 className="font-medium text-navy-900 mt-3">{service.title}</h3>
                <p className="text-sm text-slate-500 mt-1 line-clamp-2">{service.shortDescription}</p>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete this service?"
        message={`"${deleteTarget?.title}" will be permanently removed. This can't be undone.`}
        onConfirm={() => confirmDelete("title")}
        onCancel={() => setDeleteTarget(null)}
        confirming={deleting}
      />
    </div>
  );
}
