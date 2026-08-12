import { api } from "./api.js";

export const CONTACT_STATUSES = ["NEW", "CONTACTED", "CLOSED"];

export const contactSubmissionsService = {
  list: (params = {}) => {
    const query = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, value]) => value !== undefined && value !== ""))
    ).toString();
    return api.get(`/admin/contact-submissions${query ? `?${query}` : ""}`);
  },
  updateStatus: (id, status) => api.patch(`/admin/contact-submissions/${id}`, { status }),
  remove: (id) => api.delete(`/admin/contact-submissions/${id}`),
};
