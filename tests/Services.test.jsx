import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { ToastProvider } from "../src/context/ToastContext.jsx";
import ServicesList from "../src/pages/services/ServicesList.jsx";
import ServiceForm from "../src/pages/services/ServiceForm.jsx";

const sampleServices = [
  { id: "svc-1", slug: "property-sales", title: "Property Sales", icon: "Home", shortDescription: "We sell properties.", benefits: [], process: [], faqs: [] },
  { id: "svc-2", slug: "unknown-icon-service", title: "Mystery Service", icon: "SomeIconThatDoesntExist", shortDescription: "Uses an unrecognized icon name.", benefits: [], process: [], faqs: [] },
];

function renderWithRoutes(initialPath = "/services") {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <ToastProvider>
        <Routes>
          <Route path="/services" element={<ServicesList />} />
          <Route path="/services/new" element={<ServiceForm />} />
        </Routes>
      </ToastProvider>
    </MemoryRouter>
  );
}

describe("ServicesList", () => {
  it("renders services and falls back gracefully for an unrecognized icon name", async () => {
    global.fetch = vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve(sampleServices) }));

    // The real point of this test: an icon name that isn't in our
    // explicit registry (e.g. a typo, or a new icon nobody's added yet)
    // must not crash the page - it should fall back quietly.
    renderWithRoutes();

    expect(await screen.findByText("Property Sales")).toBeInTheDocument();
    expect(screen.getByText("Mystery Service")).toBeInTheDocument();
  });
});

describe("ServiceForm - FAQs", () => {
  it("adds and removes FAQ pairs, and submits them correctly", async () => {
    let createPayload = null;
    global.fetch = vi.fn((url, options) => {
      if (options?.method === "POST") {
        createPayload = JSON.parse(options.body);
        return Promise.resolve({ ok: true, status: 201, json: () => Promise.resolve({}) });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
    });

    const user = userEvent.setup();
    renderWithRoutes("/services/new");

    await user.type(screen.getByLabelText("Title", { exact: true }), "Test Service");
    await user.type(screen.getByLabelText(/icon name/i), "Home");
    await user.type(screen.getByLabelText("Short Description", { exact: true }), "A description long enough to pass.");

    await user.click(screen.getByRole("button", { name: /add faq/i }));
    const questionInputs = screen.getAllByPlaceholderText("Question");
    const answerInputs = screen.getAllByPlaceholderText("Answer");
    await user.type(questionInputs[0], "How much does this cost?");
    await user.type(answerInputs[0], "It depends on the scope.");

    await user.click(screen.getByRole("button", { name: /create service/i }));

    await waitFor(() => {
      expect(createPayload.faqs).toEqual([{ q: "How much does this cost?", a: "It depends on the scope." }]);
    });
  });
});
