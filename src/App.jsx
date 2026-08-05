import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import ComingSoon from "./components/ComingSoon.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";

// Each ComingSoon placeholder below gets replaced with real content
// in Sections 4-6 (Listings first, then the rest of the content
// resources, then the 3 submission-management screens).
export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/listings" element={<ComingSoon title="Listings" />} />
            <Route path="/projects" element={<ComingSoon title="Projects" />} />
            <Route path="/services" element={<ComingSoon title="Services" />} />
            <Route path="/team" element={<ComingSoon title="Team" />} />
            <Route path="/testimonials" element={<ComingSoon title="Testimonials" />} />
            <Route path="/blog" element={<ComingSoon title="Blog" />} />
            <Route path="/partners" element={<ComingSoon title="Partners" />} />
            <Route path="/agents" element={<ComingSoon title="Agents" />} />
            <Route path="/contact-submissions" element={<ComingSoon title="Contact Submissions" />} />
            <Route path="/inspections" element={<ComingSoon title="Inspection Bookings" />} />
            <Route path="/newsletter" element={<ComingSoon title="Newsletter" />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
}
