import { Link, useNavigate } from "react-router-dom";
import { Plus, Pencil, Trash2, User } from "lucide-react";
import { teamService, TEAM_GROUPS } from "../../services/team.js";
import { useResourceList } from "../../utils/useResourceList.js";
import ConfirmDialog from "../../components/ConfirmDialog.jsx";

export default function TeamList() {
  const navigate = useNavigate();
  const { items, loading, filters, updateFilter, deleteTarget, setDeleteTarget, deleting, confirmDelete } =
    useResourceList(teamService, { initialFilters: { group: "" } });

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-5">
        <select
          value={filters.group}
          onChange={(e) => updateFilter("group", e.target.value)}
          className="text-sm border border-slate-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold-500"
        >
          <option value="">All groups</option>
          {TEAM_GROUPS.map((g) => <option key={g} value={g}>{g}</option>)}
        </select>
        <Link to="/team/new" className="flex items-center gap-1.5 bg-gold-500 hover:bg-gold-400 text-navy-950 text-sm font-semibold px-4 py-2 rounded-md transition-colors">
          <Plus size={16} /> New Team Member
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-24 bg-white border border-slate-200 rounded-lg animate-pulse" />)}
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-lg p-10 text-center text-slate-400">No team members match your filter.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((member) => (
            <div key={member.id} className="bg-white border border-slate-200 rounded-lg p-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex-shrink-0 overflow-hidden flex items-center justify-center">
                {member.image ? <img src={member.image} alt="" className="w-full h-full object-cover" /> : <User size={18} className="text-slate-300" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-navy-900 truncate">{member.name}</p>
                <p className="text-xs text-slate-400 truncate">{member.role}</p>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => navigate(`/team/${member.id}/edit`, { state: { member } })} className="p-1.5 text-slate-400 hover:text-navy-900 hover:bg-slate-100 rounded transition-colors" aria-label={`Edit ${member.name}`}>
                  <Pencil size={14} />
                </button>
                <button onClick={() => setDeleteTarget(member)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" aria-label={`Delete ${member.name}`}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete this team member?"
        message={`"${deleteTarget?.name}" will be permanently removed. This can't be undone.`}
        onConfirm={() => confirmDelete("name")}
        onCancel={() => setDeleteTarget(null)}
        confirming={deleting}
      />
    </div>
  );
}
