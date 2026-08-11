import { api } from "./api.js";

export const agentsService = {
  list: () => api.get("/listings/agents"),
  create: (data) => api.post("/admin/agents", data),
  update: (id, data) => api.put(`/admin/agents/${id}`, data),
  remove: (id) => api.delete(`/admin/agents/${id}`),
};
