import { api } from "./api.js";

export const partnersService = {
  list: () => api.get("/partners"),
  create: (data) => api.post("/admin/partners", data),
  update: (id, data) => api.put(`/admin/partners/${id}`, data),
  remove: (id) => api.delete(`/admin/partners/${id}`),
};
