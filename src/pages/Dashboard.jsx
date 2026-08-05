import { useAuth } from "../context/AuthContext.jsx";

// Real layout (sidebar/topbar) comes in Section 3. This proves the
// auth loop works end-to-end: shows who's logged in, lets them log out.
export default function Dashboard() {
  const { admin, logout } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <h1 className="font-display text-3xl text-navy-900">Dashboard</h1>
        <p className="text-slate-600 mt-2">Logged in as {admin?.name} ({admin?.email})</p>
        <p className="text-slate-400 text-sm mt-1">Real layout + overview page — Section 3</p>
        <button
          onClick={logout}
          className="mt-6 text-sm text-navy-700 border border-slate-300 rounded-md px-4 py-2 hover:bg-slate-100 transition-colors"
        >
          Log out
        </button>
      </div>
    </div>
  );
}
