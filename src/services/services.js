import { api } from "./api.js";

export const servicesService = {
  list: () => api.get("/services"),
  create: (data) => api.post("/admin/services", data),
  update: (id, data) => api.put(`/admin/services/${id}`, data),
  remove: (id) => api.delete(`/admin/services/${id}`),
};
