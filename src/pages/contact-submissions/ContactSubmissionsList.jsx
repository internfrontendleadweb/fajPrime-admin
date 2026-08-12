import { useCallback, useEffect, useState } from "react";
import { Eye, Loader2, Trash2, X } from "lucide-react";
import { CONTACT_STATUSES, contactSubmissionsService } from "../../services/contactSubmissions.js";
import { useToast } from "../../context/ToastContext.jsx";
import StatusBadge from "../../components/StatusBadge.jsx";
import ConfirmDialog from "../../components/ConfirmDialog.jsx";

function formatDate(value) {
  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function ContactSubmissionsList() {
  const { showToast } = useToast();
  const [submissions, setSubmissions] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, totalPages: 1 });
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [selected, setSelected] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await contactSubmissionsService.list({ status, page, limit: 20 });
      setSubmissions(result.data);
      setMeta(result.meta);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  }, [page, showToast, status]);

  useEffect(() => {
    load();
  }, [load]);

  async function updateStatus(submission, nextStatus) {
    setUpdatingId(submission.id);
    try {
      const updated = await contactSubmissionsService.updateStatus(submission.id, nextStatus);
      setSubmissions((items) => items.map((item) => item.id === updated.id ? updated : item));
      setSelected((item) => item?.id === updated.id ? updated : item);
      showToast("Submission status updated.");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setUpdatingId(null);
    }
  }

  async function confirmDelete() {
    setDeleting(true);
    try {
      await contactSubmissionsService.remove(deleteTarget.id);
      showToast(`Submission from ${deleteTarget.name} was deleted.`);
      setDeleteTarget(null);
      setSelected((item) => item?.id === deleteTarget.id ? null : item);
      load();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setDeleting(false);
    }
  }

  function changeFilter(nextStatus) {
    setStatus(nextStatus);
    setPage(1);
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <p className="text-sm text-slate-500">Review and manage messages submitted through the website contact form.</p>
        <select value={status} onChange={(event) => changeFilter(event.target.value)} className="text-sm border border-slate-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold-500">
          <option value="">All statuses</option>
          {CONTACT_STATUSES.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg overflow-x-auto">
        <table className="w-full min-w-[800px] text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 text-left text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Sender</th>
              <th className="px-4 py-3 font-medium">Subject</th>
              <th className="px-4 py-3 font-medium">Message</th>
              <th className="px-4 py-3 font-medium">Received</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium w-24">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => <tr key={index}><td colSpan={6} className="px-4 py-4"><div className="h-10 bg-slate-100 rounded animate-pulse" /></td></tr>)
            ) : submissions.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-slate-400">No contact submissions match this status.</td></tr>
            ) : submissions.map((submission) => (
              <tr key={submission.id} className="hover:bg-slate-50">
                <td className="px-4 py-3"><p className="font-medium text-navy-900">{submission.name}</p><a href={`mailto:${submission.email}`} className="text-xs text-slate-500 hover:text-navy-900">{submission.email}</a></td>
                <td className="px-4 py-3 text-slate-600 max-w-44 truncate">{submission.subject || "—"}</td>
                <td className="px-4 py-3 text-slate-500 max-w-xs truncate">{submission.message}</td>
                <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{formatDate(submission.createdAt)}</td>
                <td className="px-4 py-3">
                  <select aria-label={`Change status for ${submission.name}`} value={submission.status} onChange={(event) => updateStatus(submission, event.target.value)} disabled={updatingId === submission.id} className="text-xs border border-slate-200 rounded-md px-2 py-1.5 bg-white disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-gold-500">
                    {CONTACT_STATUSES.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                </td>
                <td className="px-4 py-3"><div className="flex items-center gap-1">
                  <button onClick={() => setSelected(submission)} className="p-1.5 text-slate-400 hover:text-navy-900 hover:bg-slate-100 rounded transition-colors" aria-label={`View message from ${submission.name}`}><Eye size={15} /></button>
                  <button onClick={() => setDeleteTarget(submission)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" aria-label={`Delete submission from ${submission.name}`}><Trash2 size={15} /></button>
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {meta.totalPages > 1 && <div className="flex items-center justify-between mt-4 text-sm text-slate-500"><p>Page {meta.page} of {meta.totalPages} — {meta.total} total</p><div className="flex gap-2"><button disabled={page <= 1} onClick={() => setPage((current) => current - 1)} className="px-3 py-1.5 border border-slate-200 rounded-md disabled:opacity-40 hover:bg-slate-50">Previous</button><button disabled={page >= meta.totalPages} onClick={() => setPage((current) => current + 1)} className="px-3 py-1.5 border border-slate-200 rounded-md disabled:opacity-40 hover:bg-slate-50">Next</button></div></div>}

      {selected && <div className="fixed inset-0 z-40 flex items-center justify-center p-4"><button aria-label="Close submission details" onClick={() => setSelected(null)} className="absolute inset-0 bg-navy-950/60" /><section role="dialog" aria-modal="true" aria-label="Contact submission details" className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-2xl p-6"><div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4"><div><p className="text-xs uppercase tracking-wide text-slate-400">Contact submission</p><h2 className="text-xl font-semibold text-navy-900 mt-1">{selected.subject || "Website inquiry"}</h2></div><button onClick={() => setSelected(null)} className="p-1.5 text-slate-400 hover:text-navy-900 rounded" aria-label="Close"><X size={20} /></button></div><dl className="grid sm:grid-cols-2 gap-x-6 gap-y-4 mt-5 text-sm"><div><dt className="text-slate-400">From</dt><dd className="font-medium text-navy-900 mt-0.5">{selected.name}</dd></div><div><dt className="text-slate-400">Received</dt><dd className="text-slate-700 mt-0.5">{formatDate(selected.createdAt)}</dd></div><div><dt className="text-slate-400">Email</dt><dd className="mt-0.5"><a href={`mailto:${selected.email}`} className="text-navy-900 underline">{selected.email}</a></dd></div><div><dt className="text-slate-400">Phone</dt><dd className="text-slate-700 mt-0.5">{selected.phone || "Not provided"}</dd></div></dl><div className="mt-5"><p className="text-sm text-slate-400">Message</p><p className="mt-1.5 whitespace-pre-wrap text-sm leading-6 text-slate-700">{selected.message}</p></div><div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-4"><StatusBadge value={selected.status} /><select aria-label="Submission status" value={selected.status} onChange={(event) => updateStatus(selected, event.target.value)} disabled={updatingId === selected.id} className="text-sm border border-slate-200 rounded-md px-3 py-2 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-gold-500">{CONTACT_STATUSES.map((item) => <option key={item} value={item}>{item}</option>)}</select></div>{updatingId === selected.id && <div className="flex items-center gap-2 text-sm text-slate-500 mt-3"><Loader2 size={15} className="animate-spin" /> Saving status…</div>}</section></div>}

      <ConfirmDialog open={!!deleteTarget} title="Delete this contact submission?" message={`The message from ${deleteTarget?.name} will be permanently removed. This can't be undone.`} onConfirm={confirmDelete} onCancel={() => setDeleteTarget(null)} confirming={deleting} />
    </div>
  );
}
