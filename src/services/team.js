import { api } from "./api.js";

export const TEAM_GROUPS = ["board", "management"];

export const teamService = {
  list: (params = {}) => {
    const query = new URLSearchParams(Object.fromEntries(Object.entries(params).filter(([, v]) => v))).toString();
    return api.get(`/team${query ? `?${query}` : ""}`);
  },
  create: (data) => api.post("/admin/team", data),
  update: (id, data) => api.put(`/admin/team/${id}`, data),
  remove: (id) => api.delete(`/admin/team/${id}`),
};
