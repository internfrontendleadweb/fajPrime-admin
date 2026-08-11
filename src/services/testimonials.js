import { api } from "./api.js";

export const testimonialsService = {
  list: () => api.get("/testimonials"),
  create: (data) => api.post("/admin/testimonials", data),
  update: (id, data) => api.put(`/admin/testimonials/${id}`, data),
  remove: (id) => api.delete(`/admin/testimonials/${id}`),
};
