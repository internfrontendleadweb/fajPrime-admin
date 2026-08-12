import { api } from "./api.js";

export const INSPECTION_STATUSES = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];

export const inspectionsService = {
  list: (params = {}) => {
    const query = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, value]) => value !== undefined && value !== ""))
    ).toString();
    return api.get(`/admin/inspections${query ? `?${query}` : ""}`);
  },
  update: (id, data) => api.patch(`/admin/inspections/${id}`, data),
  remove: (id) => api.delete(`/admin/inspections/${id}`),
};
