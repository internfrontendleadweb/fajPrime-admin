import { api } from "./api.js";

export const blogService = {
  list: (params = {}) => {
    const query = new URLSearchParams(Object.fromEntries(Object.entries(params).filter(([, v]) => v))).toString();
    return api.get(`/blog${query ? `?${query}` : ""}`);
  },
  create: (data) => api.post("/admin/blog", data),
  update: (id, data) => api.put(`/admin/blog/${id}`, data),
  remove: (id) => api.delete(`/admin/blog/${id}`),
};
