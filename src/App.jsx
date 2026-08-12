import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ToastProvider } from "./context/ToastContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import ComingSoon from "./components/ComingSoon.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";

import ListingsList from "./pages/listings/ListingsList.jsx";
import ListingForm from "./pages/listings/ListingForm.jsx";
import ProjectsList from "./pages/projects/ProjectsList.jsx";
import ProjectForm from "./pages/projects/ProjectForm.jsx";
import ServicesList from "./pages/services/ServicesList.jsx";
import ServiceForm from "./pages/services/ServiceForm.jsx";
import TeamList from "./pages/team/TeamList.jsx";
import TeamForm from "./pages/team/TeamForm.jsx";
import TestimonialsList from "./pages/testimonials/TestimonialsList.jsx";
import TestimonialForm from "./pages/testimonials/TestimonialForm.jsx";
import BlogList from "./pages/blog/BlogList.jsx";
import BlogForm from "./pages/blog/BlogForm.jsx";
import PartnersList from "./pages/partners/PartnersList.jsx";
import PartnerForm from "./pages/partners/PartnerForm.jsx";
import AgentsList from "./pages/agents/AgentsList.jsx";
import AgentForm from "./pages/agents/AgentForm.jsx";
import ContactSubmissionsList from "./pages/contact-submissions/ContactSubmissionsList.jsx";
import InspectionsList from "./pages/inspections/InspectionsList.jsx";
import NewsletterList from "./pages/newsletter/NewsletterList.jsx";

// All 8 content resources now follow the identical pattern Listings
// established in Section 4. Only the 3 submission-management screens
// (Section 6) remain as ComingSoon placeholders.
export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/" element={<Dashboard />} />

              <Route path="/listings" element={<ListingsList />} />
              <Route path="/listings/new" element={<ListingForm />} />
              <Route path="/listings/:id/edit" element={<ListingForm />} />

              <Route path="/projects" element={<ProjectsList />} />
              <Route path="/projects/new" element={<ProjectForm />} />
              <Route path="/projects/:id/edit" element={<ProjectForm />} />

              <Route path="/services" element={<ServicesList />} />
              <Route path="/services/new" element={<ServiceForm />} />
              <Route path="/services/:id/edit" element={<ServiceForm />} />

              <Route path="/team" element={<TeamList />} />
              <Route path="/team/new" element={<TeamForm />} />
              <Route path="/team/:id/edit" element={<TeamForm />} />

              <Route path="/testimonials" element={<TestimonialsList />} />
              <Route path="/testimonials/new" element={<TestimonialForm />} />
              <Route path="/testimonials/:id/edit" element={<TestimonialForm />} />

              <Route path="/blog" element={<BlogList />} />
              <Route path="/blog/new" element={<BlogForm />} />
              <Route path="/blog/:id/edit" element={<BlogForm />} />

              <Route path="/partners" element={<PartnersList />} />
              <Route path="/partners/new" element={<PartnerForm />} />
              <Route path="/partners/:id/edit" element={<PartnerForm />} />

              <Route path="/agents" element={<AgentsList />} />
              <Route path="/agents/new" element={<AgentForm />} />
              <Route path="/agents/:id/edit" element={<AgentForm />} />

              <Route path="/contact-submissions" element={<ContactSubmissionsList />} />
              <Route path="/inspections" element={<InspectionsList />} />
              <Route path="/newsletter" element={<NewsletterList />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </ToastProvider>
  );
}
