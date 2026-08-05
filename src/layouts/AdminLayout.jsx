import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
import Topbar from "../components/Topbar.jsx";

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      {/* Margin matches the sidebar's width at each breakpoint (w-16
          on small screens, lg:w-64 on large) so content never sits
          underneath the fixed sidebar. */}
      <div className="ml-16 lg:ml-64">
        <Topbar />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
