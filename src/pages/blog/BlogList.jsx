import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Pencil, Trash2, ImageOff } from "lucide-react";
import { blogService } from "../../services/blog.js";
import { useResourceList } from "../../utils/useResourceList.js";
import ConfirmDialog from "../../components/ConfirmDialog.jsx";

export default function BlogList() {
  const navigate = useNavigate();
  const [categoryInput, setCategoryInput] = useState("");
  const { items, meta, loading, filters, updateFilter, page, setPage, deleteTarget, setDeleteTarget, deleting, confirmDelete } =
    useResourceList(blogService, { isPaginated: true, initialFilters: { category: "" } });

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-5">
        <input
          type="text"
          value={categoryInput}
          onChange={(e) => setCategoryInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && updateFilter("category", categoryInput)}
          onBlur={() => updateFilter("category", categoryInput)}
          placeholder="Filter by category…"
          className="text-sm border border-slate-200 rounded-md px-3 py-2 w-56 focus:outline-none focus:ring-2 focus:ring-gold-500"
        />
        <Link to="/blog/new" className="flex items-center gap-1.5 bg-gold-500 hover:bg-gold-400 text-navy-950 text-sm font-semibold px-4 py-2 rounded-md transition-colors">
          <Plus size={16} /> New Post
        </Link>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 text-left text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Post</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Author</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium w-24">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => <tr key={i}><td colSpan={5} className="px-4 py-4"><div className="h-10 bg-slate-100 rounded animate-pulse" /></td></tr>)
            ) : items.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-10 text-center text-slate-400">No posts match your filter.</td></tr>
            ) : (
              items.map((post) => (
                <tr key={post.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-md bg-slate-100 flex-shrink-0 overflow-hidden flex items-center justify-center">
                        {post.image ? <img src={post.image} alt="" className="w-full h-full object-cover" /> : <ImageOff size={16} className="text-slate-300" />}
                      </div>
                      <p className="font-medium text-navy-900 truncate max-w-[260px]">{post.title}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{post.category}</td>
                  <td className="px-4 py-3 text-slate-500">{post.author}</td>
                  <td className="px-4 py-3 text-slate-500">{post.date}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => navigate(`/blog/${post.id}/edit`, { state: { post } })} className="p-1.5 text-slate-400 hover:text-navy-900 hover:bg-slate-100 rounded transition-colors" aria-label={`Edit ${post.title}`}>
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => setDeleteTarget(post)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" aria-label={`Delete ${post.title}`}>
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
          <p>Page {meta.page} of {meta.totalPages} — {meta.total} total</p>
          <div className="flex gap-2">
            <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="px-3 py-1.5 border border-slate-200 rounded-md disabled:opacity-40 hover:bg-slate-50">Previous</button>
            <button disabled={page >= meta.totalPages} onClick={() => setPage((p) => p + 1)} className="px-3 py-1.5 border border-slate-200 rounded-md disabled:opacity-40 hover:bg-slate-50">Next</button>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete this blog post?"
        message={`"${deleteTarget?.title}" will be permanently removed. This can't be undone.`}
        onConfirm={() => confirmDelete("title")}
        onCancel={() => setDeleteTarget(null)}
        confirming={deleting}
      />
    </div>
  );
}
