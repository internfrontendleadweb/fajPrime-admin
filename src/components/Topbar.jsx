import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ChevronDown, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { allNavItems } from "../utils/navConfig.js";

function currentPageTitle(pathname) {
  // Longest-matching path wins, so nested routes (added in later
  // sections, e.g. /listings/:id) still resolve to the right label.
  const match = allNavItems
    .filter((item) => pathname === item.to || pathname.startsWith(`${item.to}/`))
    .sort((a, b) => b.to.length - a.to.length)[0];
  return match?.label || "Dashboard";
}

export default function Topbar() {
  const { admin, logout } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initials = admin?.name
    ?.split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-10">
      <h1 className="text-lg font-semibold text-navy-900">{currentPageTitle(location.pathname)}</h1>

      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="flex items-center gap-2.5 hover:bg-slate-100 rounded-md px-2.5 py-1.5 transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-navy-900 text-gold-400 flex items-center justify-center text-xs font-semibold flex-shrink-0">
            {initials}
          </div>
          <span className="hidden sm:block text-sm text-slate-700 font-medium">{admin?.name}</span>
          <ChevronDown size={16} className="text-slate-400" />
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-md shadow-lg py-1.5">
            <div className="px-3.5 py-2 border-b border-slate-100">
              <p className="text-sm font-medium text-slate-800 truncate">{admin?.name}</p>
              <p className="text-xs text-slate-400 truncate">{admin?.email}</p>
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <LogOut size={16} /> Log out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
