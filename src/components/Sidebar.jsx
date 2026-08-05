import { NavLink } from "react-router-dom";
import { navSections } from "../utils/navConfig.js";

export default function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 w-16 lg:w-64 bg-navy-950 border-r border-navy-800 flex flex-col z-20">
      {/* Wordmark — full on large screens, just the initial on smaller ones */}
      <div className="h-16 flex items-center justify-center lg:justify-start lg:px-6 border-b border-navy-800 flex-shrink-0">
        <span className="font-display italic text-gold-400 text-2xl lg:hidden">F</span>
        <span className="hidden lg:block font-display italic text-gold-400 text-xl">FAJ Prime</span>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        {navSections.map((section, i) => (
          <div key={i} className="mb-4">
            {section.label && (
              <p className="hidden lg:block px-6 text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-2">
                {section.label}
              </p>
            )}
            <ul>
              {section.items.map(({ to, label, icon: Icon, end }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    end={end}
                    title={label}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-6 lg:px-6 py-2.5 mx-0 lg:mx-3 lg:rounded-md text-sm transition-colors justify-center lg:justify-start border-l-2 lg:border-l-0 ${
                        isActive
                          ? "border-gold-500 lg:border-l-0 bg-navy-900 lg:bg-gold-500/10 text-gold-400 font-medium"
                          : "border-transparent text-slate-300 hover:bg-navy-900 hover:text-white"
                      }`
                    }
                  >
                    <Icon size={19} className="flex-shrink-0" />
                    <span className="hidden lg:inline">{label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
