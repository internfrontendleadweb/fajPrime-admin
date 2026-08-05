import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../src/context/AuthContext.jsx";
import Dashboard from "../src/pages/Dashboard.jsx";

function mockMe() {
  return Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve({ admin: { id: "1", name: "Jane Doe", email: "jane@example.com", role: "EDITOR" } }),
  });
}

function renderDashboard() {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <Dashboard />
      </AuthProvider>
    </MemoryRouter>
  );
}

describe("Dashboard stats", () => {
  it("displays real counts once every stat endpoint succeeds", async () => {
    global.fetch = vi.fn((url) => {
      if (url.includes("/auth/me")) return mockMe();
      if (url.includes("/listings?limit=1")) return Promise.resolve({ ok: true, json: () => Promise.resolve({ meta: { total: 13 } }) });
      if (url.includes("/projects")) return Promise.resolve({ ok: true, json: () => Promise.resolve(Array(9).fill({})) });
      if (url.includes("/contact-submissions")) return Promise.resolve({ ok: true, json: () => Promise.resolve({ meta: { total: 4 } }) });
      if (url.includes("/inspections")) return Promise.resolve({ ok: true, json: () => Promise.resolve({ meta: { total: 2 } }) });
      if (url.includes("/newsletter")) return Promise.resolve({ ok: true, json: () => Promise.resolve({ meta: { total: 87 } }) });
      if (url.includes("/blog")) return Promise.resolve({ ok: true, json: () => Promise.resolve({ meta: { total: 8 } }) });
      return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
    });

    renderDashboard();

    expect(await screen.findByText("13")).toBeInTheDocument(); // listings
    expect(await screen.findByText("9")).toBeInTheDocument(); // projects
    expect(await screen.findByText("4")).toBeInTheDocument(); // new inquiries
    expect(await screen.findByText("87")).toBeInTheDocument(); // subscribers
  });

  it("shows a dash for a stat whose specific endpoint fails, without breaking the rest of the page", async () => {
    global.fetch = vi.fn((url) => {
      if (url.includes("/auth/me")) return mockMe();
      // Simulate the newsletter endpoint specifically being down...
      if (url.includes("/newsletter")) return Promise.resolve({ ok: false, status: 500, json: () => Promise.resolve({ error: "Something went wrong" }) });
      // ...while everything else succeeds normally.
      if (url.includes("/listings?limit=1")) return Promise.resolve({ ok: true, json: () => Promise.resolve({ meta: { total: 13 } }) });
      if (url.includes("/projects")) return Promise.resolve({ ok: true, json: () => Promise.resolve(Array(9).fill({})) });
      return Promise.resolve({ ok: true, json: () => Promise.resolve({ meta: { total: 1 } }) });
    });

    renderDashboard();

    // The healthy stats still render correctly...
    expect(await screen.findByText("13")).toBeInTheDocument();
    // ...while the one broken endpoint degrades gracefully to a dash,
    // rather than crashing the whole dashboard or hanging forever.
    expect(await screen.findByText("—")).toBeInTheDocument();
  });

  it("greets the admin by first name", async () => {
    global.fetch = vi.fn((url) => {
      if (url.includes("/auth/me")) return mockMe();
      return Promise.resolve({ ok: true, json: () => Promise.resolve({ meta: { total: 0 } }) });
    });

    renderDashboard();

    expect(await screen.findByText(/welcome back, jane/i)).toBeInTheDocument();
  });
});
