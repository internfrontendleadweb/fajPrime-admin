import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../src/context/AuthContext.jsx";
import ProtectedRoute from "../src/components/ProtectedRoute.jsx";

function renderApp() {
  return render(
    <MemoryRouter initialEntries={["/"]}>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<div>Dashboard Content</div>} />
          </Route>
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  );
}

describe("ProtectedRoute", () => {
  it("redirects to /login when there is no valid session", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({ ok: false, status: 401, json: () => Promise.resolve({ error: "Not authenticated" }) })
    );

    renderApp();

    expect(await screen.findByText("Login Page")).toBeInTheDocument();
    expect(screen.queryByText("Dashboard Content")).not.toBeInTheDocument();
  });

  it("renders the protected content when a valid session exists", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ admin: { id: "1", name: "Test Admin", email: "admin@example.com", role: "EDITOR" } }),
      })
    );

    renderApp();

    expect(await screen.findByText("Dashboard Content")).toBeInTheDocument();
    expect(screen.queryByText("Login Page")).not.toBeInTheDocument();
  });

  it("shows a loading state before the session check resolves", () => {
    // A fetch that never resolves during this test, so we can inspect
    // the in-between "checking" state before it settles either way.
    global.fetch = vi.fn(() => new Promise(() => {}));

    const { container } = renderApp();

    expect(screen.queryByText("Login Page")).not.toBeInTheDocument();
    expect(screen.queryByText("Dashboard Content")).not.toBeInTheDocument();
    expect(container.querySelector(".animate-spin")).toBeInTheDocument();
  });
});
