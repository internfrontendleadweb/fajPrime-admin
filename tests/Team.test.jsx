import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { ToastProvider } from "../src/context/ToastContext.jsx";
import TeamList from "../src/pages/team/TeamList.jsx";

const sampleTeam = [
  { id: "tm-1", group: "board", name: "Adeola Faj-Johnson", role: "Chairman", bio: "...", image: "", linkedin: "", order: 0 },
  { id: "tm-2", group: "management", name: "Emeka Obi", role: "Head of Sales", bio: "...", image: "", linkedin: "", order: 0 },
];

function renderTeamList() {
  return render(
    <MemoryRouter>
      <ToastProvider>
        <Routes>
          <Route path="/" element={<TeamList />} />
        </Routes>
      </ToastProvider>
    </MemoryRouter>
  );
}

describe("TeamList", () => {
  it("re-fetches with the correct group query param when the filter changes", async () => {
    const requestedUrls = [];
    global.fetch = vi.fn((url) => {
      requestedUrls.push(url);
      const isBoardFilter = url.includes("group=board");
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(isBoardFilter ? [sampleTeam[0]] : sampleTeam),
      });
    });

    const user = userEvent.setup();
    renderTeamList();

    // Initial load: no filter, both members show.
    expect(await screen.findByText("Adeola Faj-Johnson")).toBeInTheDocument();
    expect(screen.getByText("Emeka Obi")).toBeInTheDocument();

    await user.selectOptions(screen.getByRole("combobox"), "board");

    // After filtering to "board", only the board member should remain,
    // and the actual request sent must have included the group param -
    // not just a UI state change with no real backend call.
    await waitFor(() => {
      expect(screen.queryByText("Emeka Obi")).not.toBeInTheDocument();
    });
    expect(screen.getByText("Adeola Faj-Johnson")).toBeInTheDocument();
    expect(requestedUrls.some((u) => u.includes("group=board"))).toBe(true);
  });

  it("deletes a team member only after confirming, using their name (not a generic label) in the toast", async () => {
    let deleteCalled = false;
    global.fetch = vi.fn((url, options) => {
      if (options?.method === "DELETE") {
        deleteCalled = true;
        return Promise.resolve({ ok: true, status: 204, json: () => Promise.resolve(null) });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve(sampleTeam) });
    });

    const user = userEvent.setup();
    renderTeamList();

    await screen.findByText("Adeola Faj-Johnson");
    await user.click(screen.getByRole("button", { name: /delete adeola faj-johnson/i }));

    expect(await screen.findByText(/adeola faj-johnson.*will be permanently removed/i)).toBeInTheDocument();
    expect(deleteCalled).toBe(false);

    await user.click(screen.getByRole("button", { name: "Delete" }));

    await waitFor(() => expect(deleteCalled).toBe(true));
  });
});
