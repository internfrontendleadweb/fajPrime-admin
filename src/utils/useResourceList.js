import { useState, useEffect, useCallback } from "react";
import { useToast } from "../context/ToastContext.jsx";

// Shared list-page logic (fetch, loading state, delete-with-confirm
// flow, toast feedback) so each resource's list page only needs to
// define its own table columns and filters, not reimplement all of
// this from scratch 7 times.
export function useResourceList(service, { isPaginated = false, initialFilters = {} } = {}) {
  const { showToast } = useToast();
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(initialFilters);
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await service.list(isPaginated ? { ...filters, page, limit: 10 } : filters);
      if (isPaginated) {
        setItems(result.data);
        setMeta(result.meta);
      } else {
        setItems(result);
      }
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

  async function confirmDelete(labelField = "name") {
    setDeleting(true);
    try {
      await service.remove(deleteTarget.id);
      showToast(`"${deleteTarget[labelField]}" was deleted.`);
      setDeleteTarget(null);
      load();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setDeleting(false);
    }
  }

  return {
    items,
    meta,
    loading,
    filters,
    updateFilter,
    page,
    setPage,
    deleteTarget,
    setDeleteTarget,
    deleting,
    confirmDelete,
    reload: load,
  };
}
