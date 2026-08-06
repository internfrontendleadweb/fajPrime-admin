import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Search, Pencil, Trash2, ImageOff, Star } from "lucide-react";
import { listingsService, LISTING_TYPES, LISTING_STATUSES } from "../../services/listings.js";
import { useToast } from "../../context/ToastContext.jsx";
import StatusBadge from "../../components/StatusBadge.jsx";
import ConfirmDialog from "../../components/ConfirmDialog.jsx";

function formatPrice(price, currency) {
  return new Intl.NumberFormat("en-NG", { style: "currency", currency, maximumFractionDigits: 0 }).format(price);
}

export default function ListingsList() {
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [listings, setListings] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ query: "", type: "", status: "" });
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await listingsService.list({ ...filters, page, limit: 10 });
      setListings(result.data);
      setMeta(result.meta);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, page]);

  useEffect(() => {
    load();
  }, [load]);

  function updateFilter(key, val) {
    setPage(1);
    setFilters((f) => ({ ...f, [key]: val }));
  }

  async function confirmDelete() {
    setDeleting(true);
    try {
      await listingsService.remove(deleteTarget.id);
      showToast(`"${deleteTarget.title}" was deleted.`);
      setDeleteTarget(null);
      load();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={filters.query}
            onChange={(e) => updateFilter("query", e.target.value)}
            placeholder="Search title or location…"
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
          />
        </div>

        <div className="flex gap-2.5">
          <select
            value={filters.type}
            onChange={(e) => updateFilter("type", e.target.value)}
            className="text-sm border border-slate-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold-500"
          >
            <option value="">All types</option>
            {LISTING_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <select
            value={filters.status}
            onChange={(e) => updateFilter("status", e.target.value)}
            className="text-sm border border-slate-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold-500"
          >
            <option value="">All statuses</option>
            {LISTING_STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <Link
            to="/listings/new"
            className="flex items-center gap-1.5 bg-gold-500 hover:bg-gold-400 text-navy-950 text-sm font-semibold px-4 py-2 rounded-md transition-colors whitespace-nowrap"
          >
            <Plus size={16} /> New Listing
          </Link>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 text-left text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Property</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Location</th>
              <th className="px-4 py-3 font-medium w-24">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td colSpan={6} className="px-4 py-4">
                    <div className="h-10 bg-slate-100 rounded animate-pulse" />
                  </td>
                </tr>
              ))
            ) : listings.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-slate-400">
                  No listings match your filters.
                </td>
              </tr>
            ) : (
              listings.map((listing) => (
                <tr key={listing.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-md bg-slate-100 flex-shrink-0 overflow-hidden flex items-center justify-center">
                        {listing.images?.[0] ? (
                          <img src={listing.images[0]} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <ImageOff size={16} className="text-slate-300" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-navy-900 truncate max-w-[220px]">{listing.title}</p>
                        <div className="flex items-center gap-1 text-xs text-slate-400">
                          {listing.featured && <Star size={11} className="fill-gold-400 text-gold-400" />}
                          {listing.bedrooms > 0 && <span>{listing.bedrooms} bed</span>}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{listing.type}</td>
                  <td className="px-4 py-3"><StatusBadge value={listing.status} /></td>
                  <td className="px-4 py-3 text-slate-700">{formatPrice(listing.price, listing.currency)}</td>
                  <td className="px-4 py-3 text-slate-500">{listing.location}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => navigate(`/listings/${listing.id}/edit`, { state: { listing } })}
                        className="p-1.5 text-slate-400 hover:text-navy-900 hover:bg-slate-100 rounded transition-colors"
                        aria-label={`Edit ${listing.title}`}
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(listing)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        aria-label={`Delete ${listing.title}`}
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

      {meta.totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 text-sm text-slate-500">
          <p>
            Page {meta.page} of {meta.totalPages} — {meta.total} total
          </p>
          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1.5 border border-slate-200 rounded-md disabled:opacity-40 hover:bg-slate-50"
            >
              Previous
            </button>
            <button
              disabled={page >= meta.totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1.5 border border-slate-200 rounded-md disabled:opacity-40 hover:bg-slate-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete this listing?"
        message={`"${deleteTarget?.title}" will be permanently removed. This can't be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
        confirming={deleting}
      />
    </div>
  );
}
