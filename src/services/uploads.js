import { api } from "./api.js";

export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
export const MAX_IMAGE_SIZE = 8 * 1024 * 1024;

export async function uploadImage(file, folder) {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    throw new Error("Choose a JPEG, PNG, WebP, or AVIF image.");
  }

  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error("Image is too large. The maximum size is 8MB.");
  }

  const formData = new FormData();
  formData.append("image", file);
  if (folder) formData.append("folder", folder);

  return api.post("/admin/upload", formData);
}

// The backend only permits deletion of tracked assets that are not referenced
// by any saved content record, so this is safe for cancelled form uploads.
export function deleteUnusedUpload(publicId) {
  return api.delete(`/admin/upload/${encodeURIComponent(publicId)}`);
}
