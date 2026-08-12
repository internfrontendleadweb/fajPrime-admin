import { api } from "./api.js";

export const newsletterService = {
  list: (params = {}) => {
    const query = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, value]) => value !== undefined && value !== ""))
    ).toString();
    return api.get(`/admin/newsletter${query ? `?${query}` : ""}`);
  },
  exportCsv: () => api.download("/admin/newsletter/export.csv"),
  remove: (id) => api.delete(`/admin/newsletter/${id}`),
};
