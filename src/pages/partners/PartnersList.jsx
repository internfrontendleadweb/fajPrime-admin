import { Link, useNavigate } from "react-router-dom";
import { Plus, Pencil, Trash2, ImageOff } from "lucide-react";
import { partnersService } from "../../services/partners.js";
import { useResourceList } from "../../utils/useResourceList.js";
import ConfirmDialog from "../../components/ConfirmDialog.jsx";

export default function PartnersList() {
  const navigate = useNavigate();
  const { items, loading, deleteTarget, setDeleteTarget, deleting, confirmDelete } = useResourceList(partnersService);

  return (
    <div>
      <div className="flex items-center justify-end mb-5">
        <Link to="/partners/new" className="flex items-center gap-1.5 bg-gold-500 hover:bg-gold-400 text-navy-950 text-sm font-semibold px-4 py-2 rounded-md transition-colors">
          <Plus size={16} /> New Partner
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-24 bg-white border border-slate-200 rounded-lg animate-pulse" />)}
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-lg p-10 text-center text-slate-400">No partners yet.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {items.map((partner) => (
            <div key={partner.id} className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-md bg-slate-50 flex items-center justify-center mb-2 overflow-hidden">
                {partner.logo ? <img src={partner.logo} alt="" className="w-full h-full object-contain" /> : <ImageOff size={18} className="text-slate-300" />}
              </div>
              <p className="text-sm font-medium text-navy-900 truncate w-full">{partner.name}</p>
              <div className="flex items-center gap-1 mt-2">
                <button onClick={() => navigate(`/partners/${partner.id}/edit`, { state: { partner } })} className="p-1.5 text-slate-400 hover:text-navy-900 hover:bg-slate-100 rounded transition-colors" aria-label={`Edit ${partner.name}`}>
                  <Pencil size={13} />
                </button>
                <button onClick={() => setDeleteTarget(partner)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" aria-label={`Delete ${partner.name}`}>
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete this partner?"
        message={`"${deleteTarget?.name}" will be permanently removed. This can't be undone.`}
        onConfirm={() => confirmDelete("name")}
        onCancel={() => setDeleteTarget(null)}
        confirming={deleting}
      />
    </div>
  );
}
