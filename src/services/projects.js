import { api } from "./api.js";

export const PROJECT_STATUSES = ["past", "current", "future"];

export const projectsService = {
  list: (params = {}) => {
    const query = new URLSearchParams(Object.fromEntries(Object.entries(params).filter(([, v]) => v))).toString();
    return api.get(`/projects${query ? `?${query}` : ""}`);
  },
  create: (data) => api.post("/admin/projects", data),
  update: (id, data) => api.put(`/admin/projects/${id}`, data),
  remove: (id) => api.delete(`/admin/projects/${id}`),
};
