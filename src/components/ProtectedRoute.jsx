import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

// Wraps every route that requires a logged-in admin. While the initial
// session check is in flight (e.g. right after a page refresh), shows
// a quiet loading state rather than redirecting prematurely — without
// this, a logged-in admin would see a flash-redirect to /login every
// time they reload the page, before the /auth/me check has resolved.
export default function ProtectedRoute() {
  const { status } = useAuth();

  if (status === "checking") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-2 border-navy-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
