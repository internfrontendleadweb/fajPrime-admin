import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { ToastProvider } from "../src/context/ToastContext.jsx";
import ListingsList from "../src/pages/listings/ListingsList.jsx";
import ListingForm from "../src/pages/listings/ListingForm.jsx";

const sampleListings = [
  {
    id: "lst-1",
    slug: "test-duplex",
    title: "Test Duplex in Lekki",
    type: "Duplex",
    status: "For Sale",
    price: 85000000,
    currency: "NGN",
    location: "Lekki, Lagos",
    bedrooms: 4,
    bathrooms: 5,
    parking: 2,
    sqm: 300,
    featured: true,
    agent: "agt-1",
    description: "A lovely test duplex.",
    amenities: ["Pool"],
    images: [],
  },
];

function renderWithRoutes(initialPath = "/listings") {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <ToastProvider>
        <Routes>
          <Route path="/listings" element={<ListingsList />} />
          <Route path="/listings/new" element={<ListingForm />} />
          <Route path="/listings/:id/edit" element={<ListingForm />} />
        </Routes>
      </ToastProvider>
    </MemoryRouter>
  );
}

describe("ListingsList", () => {
  beforeEach(() => {
    global.fetch = vi.fn((url) => {
      if (url.includes("/listings/agents")) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
      }
      if (url.includes("/listings")) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({ data: sampleListings, meta: { total: 1, page: 1, totalPages: 1 } }) });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
    });
  });

  it("renders fetched listings with formatted price and status", async () => {
    renderWithRoutes();

    expect(await screen.findByText("Test Duplex in Lekki")).toBeInTheDocument();
    expect(screen.getByText("For Sale", { selector: "span" })).toBeInTheDocument();
    expect(screen.getByText("Lekki, Lagos")).toBeInTheDocument();
    // Price should be formatted as currency, not a raw number
    expect(screen.getByText(/₦85,000,000|NGN.*85,000,000/)).toBeInTheDocument();
  });

  it("shows an empty state when no listings match", async () => {
    global.fetch = vi.fn((url) => {
      if (url.includes("/listings/agents")) return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
      return Promise.resolve({ ok: true, json: () => Promise.resolve({ data: [], meta: { total: 0, page: 1, totalPages: 1 } }) });
    });

    renderWithRoutes();

    expect(await screen.findByText("No listings match your filters.")).toBeInTheDocument();
  });

  it("opens a confirmation dialog before deleting, and only deletes after confirming", async () => {
    let deleteWasCalled = false;
    global.fetch = vi.fn((url, options) => {
      if (url.includes("/listings/agents")) return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
      if (options?.method === "DELETE") {
        deleteWasCalled = true;
        return Promise.resolve({ ok: true, status: 204, json: () => Promise.resolve(null) });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve({ data: sampleListings, meta: { total: 1, page: 1, totalPages: 1 } }) });
    });

    const user = userEvent.setup();
    renderWithRoutes();

    await screen.findByText("Test Duplex in Lekki");
    await user.click(screen.getByRole("button", { name: /delete test duplex in lekki/i }));

    // The confirmation dialog should appear, and the delete request
    // should NOT have fired yet just from clicking the trash icon.
    expect(await screen.findByText("Delete this listing?")).toBeInTheDocument();
    expect(deleteWasCalled).toBe(false);

    await user.click(screen.getByRole("button", { name: "Delete" }));

    await waitFor(() => expect(deleteWasCalled).toBe(true));
  });
});

describe("ListingForm", () => {
  beforeEach(() => {
    global.fetch = vi.fn((url) => {
      if (url.includes("/listings/agents")) return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
      return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
    });
  });

  it("shows validation errors when required fields are missing", async () => {
    const user = userEvent.setup();
    renderWithRoutes("/listings/new");

    await user.click(await screen.findByRole("button", { name: /create listing/i }));

    expect(await screen.findByText("Title must be at least 3 characters")).toBeInTheDocument();
    expect(await screen.findByText("Location is required")).toBeInTheDocument();
  });

  it("submits the correct payload when creating a valid listing", async () => {
    let createPayload = null;
    global.fetch = vi.fn((url, options) => {
      if (url.includes("/listings/agents")) return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
      if (options?.method === "POST") {
        createPayload = JSON.parse(options.body);
        return Promise.resolve({ ok: true, status: 201, json: () => Promise.resolve({ id: "new-1", ...createPayload }) });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
    });

    const user = userEvent.setup();
    renderWithRoutes("/listings/new");

    await user.type(screen.getByPlaceholderText(/luxury 5-bedroom/i), "My Test Property");
    await user.selectOptions(screen.getByRole("combobox", { name: /type/i }), "Duplex");
    await user.selectOptions(screen.getByRole("combobox", { name: /status/i }), "For Sale");
    await user.type(screen.getByPlaceholderText("85000000"), "50000000");
    await user.type(screen.getByPlaceholderText("Ikoyi, Lagos"), "Victoria Island, Lagos");
    await user.type(screen.getByPlaceholderText(/a brief description/i), "A description long enough to pass validation.");
    // sqm has no dedicated placeholder in the grid - target by label instead
    const sqmInput = screen.getByLabelText("Size (sqm)");
    await user.type(sqmInput, "250");

    await user.click(screen.getByRole("button", { name: /create listing/i }));

    await waitFor(() => {
      expect(createPayload).toMatchObject({
        title: "My Test Property",
        type: "Duplex",
        status: "For Sale",
        price: 50000000,
        location: "Victoria Island, Lagos",
        sqm: 250,
      });
    });
  });
});
