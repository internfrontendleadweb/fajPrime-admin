// The one seam between this dashboard and the backend. Every function
// here talks to the real API — there's no mock mode, since this app
// only exists to manage real data.
//
// credentials: "include" on every request is essential: the admin
// dashboard and the backend API live on different domains (this app
// on its own Render Static Site, the API on faj-prime-api.onrender.com),
// so the browser will NOT send the auth cookie automatically unless
// every fetch explicitly asks it to.

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

class ApiError extends Error {
  constructor(message, status, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

async function request(path, options = {}) {
  let res;
  try {
    res = await fetch(`${API_URL}${path}`, {
      credentials: "include",
      cache: "no-store",
      headers:
        options.body instanceof FormData
          ? {}
          : { "Content-Type": "application/json" },
      ...options,
    });
  } catch {
    // fetch() itself throws (not a bad response, an actual failure to
    // connect at all) for things like: the backend is down, there's no
    // internet connection, or CORS blocked the request before a response
    // ever came back. Left alone, this surfaces as a raw browser message
    // like "Failed to fetch" - meaningless to anyone who isn't a developer.
    throw new ApiError(
      "Unable to reach the server. Please check your internet connection and try again.",
      0,
    );
  }

  // 204 No Content (delete endpoints) has no body to parse
  if (res.status === 204) return null;

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new ApiError(
      data?.error || `Request failed (${res.status})`,
      res.status,
      data?.details,
    );
  }

  return data;
}

export const api = {
  get: (path) => request(path),
  post: (path, body) =>
    request(path, {
      method: "POST",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  put: (path, body) =>
    request(path, { method: "PUT", body: JSON.stringify(body) }),
  patch: (path, body) =>
    request(path, { method: "PATCH", body: JSON.stringify(body) }),
  delete: (path) => request(path, { method: "DELETE" }),
};

export { ApiError };
