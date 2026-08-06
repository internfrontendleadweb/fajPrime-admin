import { api } from "./api.js";

export const LISTING_TYPES = ["Apartment", "Duplex", "Terrace", "Land", "Commercial"];
export const LISTING_STATUSES = ["For Sale", "For Rent", "Off-Plan", "Sold", "Rented"];

export const listingsService = {
  list: (params = {}) => {
    const query = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== ""))
    ).toString();
    return api.get(`/listings${query ? `?${query}` : ""}`);
  },
  get: (slug) => api.get(`/listings/${slug}`),
  getById: async (id) => {
    // The public read endpoint is slug-based; the admin edit form
    // navigates by id. The list page passes the full record via router
    // state on click (fast path, no extra fetch) - this is only the
    // fallback for a direct URL visit/page refresh. Note: only searches
    // the first 100 listings; fine while the catalog is this size, but
    // would need a real by-id backend endpoint if it ever grows past that.
    const result = await api.get(`/listings?limit=100`);
    return result.data.find((l) => l.id === id);
  },
  agents: () => api.get("/listings/agents"),
  create: (data) => api.post("/admin/listings", data),
  update: (id, data) => api.put(`/admin/listings/${id}`, data),
  remove: (id) => api.delete(`/admin/listings/${id}`),
};
