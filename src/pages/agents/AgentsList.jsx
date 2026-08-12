import { Link, useNavigate } from "react-router-dom";
import { Plus, Pencil, Trash2, User } from "lucide-react";
import { agentsService } from "../../services/agents.js";
import { useResourceList } from "../../utils/useResourceList.js";
import ConfirmDialog from "../../components/ConfirmDialog.jsx";

export default function AgentsList() {
  const navigate = useNavigate();
  const {
    items,
    loading,
    deleteTarget,
    setDeleteTarget,
    deleting,
    confirmDelete,
  } = useResourceList(agentsService);

  return (
    <div>
      <div className="flex items-center justify-end mb-5">
        <Link
          to="/agents/new"
          className="flex items-center gap-1.5 bg-gold-500 hover:bg-gold-400 text-navy-950 text-sm font-semibold px-4 py-2 rounded-md transition-colors"
        >
          <Plus size={16} /> New Agent
        </Link>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 text-left text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Agent</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Phone</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium w-24">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i}>
                  <td colSpan={5} className="px-4 py-4">
                    <div className="h-8 bg-slate-100 rounded animate-pulse" />
                  </td>
                </tr>
              ))
            ) : items.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-10 text-center text-slate-400"
                >
                  No agents yet.
                </td>
              </tr>
            ) : (
              items.map((agent) => (
                <tr key={agent.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-navy-900 text-gold-400 flex items-center justify-center text-xs font-semibold flex-shrink-0 overflow-hidden">
                        {agent.photo ? (
                          <img
                            src={agent.photo}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          agent.name
                            .split(" ")
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join("")
                        )}
                      </div>
                      <p className="font-medium text-navy-900">{agent.name}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{agent.role}</td>
                  <td className="px-4 py-3 text-slate-500">{agent.phone}</td>
                  <td className="px-4 py-3 text-slate-500">{agent.email}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() =>
                          navigate(`/agents/${agent.id}/edit`, {
                            state: { agent },
                          })
                        }
                        className="p-1.5 text-slate-400 hover:text-navy-900 hover:bg-slate-100 rounded transition-colors"
                        aria-label={`Edit ${agent.name}`}
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(agent)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        aria-label={`Delete ${agent.name}`}
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
        title="Delete this agent?"
        message={`"${deleteTarget?.name}" will be permanently removed, and unassigned from any listings they're attached to. This can't be undone.`}
        onConfirm={() => confirmDelete("name")}
        onCancel={() => setDeleteTarget(null)}
        confirming={deleting}
      />
    </div>
  );
}
