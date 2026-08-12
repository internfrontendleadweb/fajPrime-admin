import { useCallback, useEffect, useState } from "react";
import { Download, Loader2, Trash2 } from "lucide-react";
import { newsletterService } from "../../services/newsletter.js";
import { useToast } from "../../context/ToastContext.jsx";
import ConfirmDialog from "../../components/ConfirmDialog.jsx";

function formatDate(value) {
  return new Intl.DateTimeFormat("en-NG", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

export default function NewsletterList() {
  const { showToast } = useToast();
  const [subscribers, setSubscribers] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, totalPages: 1 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await newsletterService.list({ page, limit: 50 });
      setSubscribers(result.data);
      setMeta(result.meta);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  }, [page, showToast]);

  useEffect(() => { load(); }, [load]);

  async function exportCsv() {
    setExporting(true);
    try {
      const blob = await newsletterService.exportCsv();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "newsletter-subscribers.csv";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      showToast("Subscriber CSV downloaded.");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setExporting(false);
    }
  }

  async function confirmDelete() {
    setDeleting(true);
    try {
      await newsletterService.remove(deleteTarget.id);
      showToast(`${deleteTarget.email} was removed from the newsletter.`);
      setDeleteTarget(null);
      // If the last item on a later page was deleted, return to the prior page.
      if (subscribers.length === 1 && page > 1) setPage((current) => current - 1);
      else load();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setDeleting(false);
    }
  }

  return <div>
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
      <p className="text-sm text-slate-500">{meta.total} {meta.total === 1 ? "subscriber" : "subscribers"} opted in to the website newsletter.</p>
      <button onClick={exportCsv} disabled={exporting} className="inline-flex items-center justify-center gap-2 bg-navy-900 hover:bg-navy-800 disabled:opacity-60 text-white text-sm font-semibold px-4 py-2 rounded-md transition-colors">
        {exporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
        {exporting ? "Preparing CSV…" : "Export CSV"}
      </button>
    </div>

    <div className="bg-white border border-slate-200 rounded-lg overflow-x-auto"><table className="w-full min-w-[620px] text-sm"><thead className="bg-slate-50 border-b border-slate-200 text-left text-slate-500"><tr><th className="px-4 py-3 font-medium">Email address</th><th className="px-4 py-3 font-medium">Subscribed</th><th className="px-4 py-3 font-medium w-20">Actions</th></tr></thead><tbody className="divide-y divide-slate-100">
      {loading ? Array.from({ length: 5 }).map((_, index) => <tr key={index}><td colSpan={3} className="px-4 py-4"><div className="h-9 bg-slate-100 rounded animate-pulse" /></td></tr>) : subscribers.length === 0 ? <tr><td colSpan={3} className="px-4 py-10 text-center text-slate-400">No newsletter subscribers yet.</td></tr> : subscribers.map((subscriber) => <tr key={subscriber.id} className="hover:bg-slate-50"><td className="px-4 py-3"><a href={`mailto:${subscriber.email}`} className="font-medium text-navy-900 hover:underline">{subscriber.email}</a></td><td className="px-4 py-3 text-slate-500">{formatDate(subscriber.subscribedAt)}</td><td className="px-4 py-3"><button onClick={() => setDeleteTarget(subscriber)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" aria-label={`Remove ${subscriber.email}`}><Trash2 size={15} /></button></td></tr>)}
    </tbody></table></div>

    {meta.totalPages > 1 && <div className="flex items-center justify-between mt-4 text-sm text-slate-500"><p>Page {meta.page} of {meta.totalPages}</p><div className="flex gap-2"><button disabled={page <= 1} onClick={() => setPage((current) => current - 1)} className="px-3 py-1.5 border border-slate-200 rounded-md disabled:opacity-40 hover:bg-slate-50">Previous</button><button disabled={page >= meta.totalPages} onClick={() => setPage((current) => current + 1)} className="px-3 py-1.5 border border-slate-200 rounded-md disabled:opacity-40 hover:bg-slate-50">Next</button></div></div>}
    <ConfirmDialog open={!!deleteTarget} title="Remove this subscriber?" message={`${deleteTarget?.email} will no longer receive the newsletter. This can't be undone.`} onConfirm={confirmDelete} onCancel={() => setDeleteTarget(null)} confirming={deleting} />
  </div>;
}
