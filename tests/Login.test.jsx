import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../src/context/AuthContext.jsx";
import Login from "../src/pages/Login.jsx";

function renderLogin() {
  return render(
    <MemoryRouter initialEntries={["/login"]}>
      <AuthProvider>
        <Login />
      </AuthProvider>
    </MemoryRouter>
  );
}

describe("Login page", () => {
  beforeEach(() => {
    // Every AuthProvider mount calls GET /auth/me once to check for an
    // existing session - stub that as "not logged in" by default so
    // each test starts from a clean slate.
    global.fetch = vi.fn((url) => {
      if (url.includes("/auth/me")) {
        return Promise.resolve({ ok: false, status: 401, json: () => Promise.resolve({ error: "Not authenticated" }) });
      }
      return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({}) });
    });
  });

  it("shows validation errors when submitting an empty form", async () => {
    const user = userEvent.setup();
    renderLogin();

    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(await screen.findByText("Enter a valid email address")).toBeInTheDocument();
    expect(await screen.findByText("Password is required")).toBeInTheDocument();
  });

  it("shows the backend's error message on failed login, without exposing which field was wrong", async () => {
    global.fetch = vi.fn((url) => {
      if (url.includes("/auth/me")) {
        return Promise.resolve({ ok: false, status: 401, json: () => Promise.resolve({}) });
      }
      if (url.includes("/auth/login")) {
        return Promise.resolve({ ok: false, status: 401, json: () => Promise.resolve({ error: "Invalid email or password" }) });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
    });

    const user = userEvent.setup();
    renderLogin();

    await user.type(screen.getByLabelText("Email", { exact: true }), "admin@example.com");
    await user.type(screen.getByLabelText("Password", { exact: true }), "wrongpassword");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(await screen.findByText("Invalid email or password")).toBeInTheDocument();
  });

  it("toggles password visibility", async () => {
    const user = userEvent.setup();
    renderLogin();

    const passwordInput = screen.getByLabelText("Password", { exact: true });
    expect(passwordInput).toHaveAttribute("type", "password");

    await user.click(screen.getByRole("button", { name: "Show password" }));
    expect(passwordInput).toHaveAttribute("type", "text");
  });

  it("calls the login endpoint with the entered credentials on valid submit", async () => {
    let loginCallBody = null;
    global.fetch = vi.fn((url, options) => {
      if (url.includes("/auth/me")) {
        return Promise.resolve({ ok: false, status: 401, json: () => Promise.resolve({}) });
      }
      if (url.includes("/auth/login")) {
        loginCallBody = JSON.parse(options.body);
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ success: true, admin: { id: "1", name: "Test Admin", email: "admin@example.com", role: "EDITOR" } }),
        });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
    });

    const user = userEvent.setup();
    renderLogin();

    await user.type(screen.getByLabelText("Email", { exact: true }), "admin@example.com");
    await user.type(screen.getByLabelText("Password", { exact: true }), "correctpassword");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(loginCallBody).toEqual({ email: "admin@example.com", password: "correctpassword" });
    });
  });

  it("shows a friendly message when the server is completely unreachable, not a raw browser error", async () => {
    global.fetch = vi.fn((url) => {
      if (url.includes("/auth/me")) {
        return Promise.resolve({ ok: false, status: 401, json: () => Promise.resolve({}) });
      }
      // Simulates fetch() itself throwing - the backend being down,
      // no internet, or a CORS failure before any response comes
      // back. This is a real bug we hit: left unhandled, this surfaces
      // as a raw "Failed to fetch" message that means nothing to a
      // non-technical admin.
      if (url.includes("/auth/login")) {
        return Promise.reject(new TypeError("Failed to fetch"));
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
    });

    const user = userEvent.setup();
    renderLogin();

    await user.type(screen.getByLabelText("Email", { exact: true }), "admin@example.com");
    await user.type(screen.getByLabelText("Password", { exact: true }), "anypassword");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(
      await screen.findByText("Unable to reach the server. Please check your internet connection and try again.")
    ).toBeInTheDocument();
    // The raw, meaningless browser error should never reach the screen.
    expect(screen.queryByText(/failed to fetch/i)).not.toBeInTheDocument();
  });
});
