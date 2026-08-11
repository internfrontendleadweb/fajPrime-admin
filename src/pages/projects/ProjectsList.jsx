import { Link, useNavigate } from "react-router-dom";
import { Plus, Pencil, Trash2, ImageOff } from "lucide-react";
import { projectsService, PROJECT_STATUSES } from "../../services/projects.js";
import { useResourceList } from "../../utils/useResourceList.js";
import StatusBadge from "../../components/StatusBadge.jsx";
import ConfirmDialog from "../../components/ConfirmDialog.jsx";

export default function ProjectsList() {
  const navigate = useNavigate();
  const { items, loading, filters, updateFilter, deleteTarget, setDeleteTarget, deleting, confirmDelete, reload } =
    useResourceList(projectsService, { initialFilters: { status: "" } });

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-5">
        <select
          value={filters.status}
          onChange={(e) => updateFilter("status", e.target.value)}
          className="text-sm border border-slate-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold-500"
        >
          <option value="">All statuses</option>
          {PROJECT_STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <Link
          to="/projects/new"
          className="flex items-center gap-1.5 bg-gold-500 hover:bg-gold-400 text-navy-950 text-sm font-semibold px-4 py-2 rounded-md transition-colors"
        >
          <Plus size={16} /> New Project
        </Link>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 text-left text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Project</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Location</th>
              <th className="px-4 py-3 font-medium">Progress</th>
              <th className="px-4 py-3 font-medium">Units</th>
              <th className="px-4 py-3 font-medium w-24">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i}><td colSpan={6} className="px-4 py-4"><div className="h-10 bg-slate-100 rounded animate-pulse" /></td></tr>
              ))
            ) : items.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-slate-400">No projects match your filters.</td></tr>
            ) : (
              items.map((project) => (
                <tr key={project.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-md bg-slate-100 flex-shrink-0 overflow-hidden flex items-center justify-center">
                        {project.images?.[0] ? (
                          <img src={project.images[0]} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <ImageOff size={16} className="text-slate-300" />
                        )}
                      </div>
                      <p className="font-medium text-navy-900 truncate max-w-[220px]">{project.title}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3"><StatusBadge value={project.status} /></td>
                  <td className="px-4 py-3 text-slate-500">{project.location}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gold-500" style={{ width: `${project.progress}%` }} />
                      </div>
                      <span className="text-slate-500 text-xs">{project.progress}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{project.units}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => navigate(`/projects/${project.id}/edit`, { state: { project } })}
                        className="p-1.5 text-slate-400 hover:text-navy-900 hover:bg-slate-100 rounded transition-colors"
                        aria-label={`Edit ${project.title}`}
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(project)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        aria-label={`Delete ${project.title}`}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete this project?"
        message={`"${deleteTarget?.title}" will be permanently removed. This can't be undone.`}
        onConfirm={() => confirmDelete("title")}
        onCancel={() => setDeleteTarget(null)}
        confirming={deleting}
      />
    </div>
  );
}
