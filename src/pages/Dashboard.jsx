import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Building2, FolderKanban, Mail, CalendarCheck, Send, Newspaper, ArrowRight } from "lucide-react";
import { api } from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";

const STAT_CONFIG = [
  { key: "listings", label: "Total Listings", icon: Building2, to: "/listings" },
  { key: "projects", label: "Active Projects", icon: FolderKanban, to: "/projects" },
  { key: "newInquiries", label: "New Inquiries", icon: Mail, to: "/contact-submissions" },
  { key: "pendingInspections", label: "Pending Inspections", icon: CalendarCheck, to: "/inspections" },
  { key: "subscribers", label: "Newsletter Subscribers", icon: Send, to: "/newsletter" },
  { key: "blogPosts", label: "Blog Posts", icon: Newspaper, to: "/blog" },
];

export default function Dashboard() {
  const { admin } = useAuth();
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    // Promise.allSettled rather than Promise.all - one slow/broken
    // stat (e.g. if an endpoint is briefly down) shouldn't take out
    // the entire dashboard. Each result is handled independently below.
    Promise.allSettled([
      api.get("/listings?limit=1"),
      api.get("/projects"),
      api.get("/admin/contact-submissions?status=NEW&limit=1"),
      api.get("/admin/inspections?status=PENDING&limit=1"),
      api.get("/admin/newsletter?limit=1"),
      api.get("/blog?limit=1"),
    ]).then(([listings, projects, contacts, inspections, subscribers, blog]) => {
      if (cancelled) return;
      setStats({
        listings: listings.status === "fulfilled" ? listings.value.meta.total : null,
        projects: projects.status === "fulfilled" ? projects.value.length : null,
        newInquiries: contacts.status === "fulfilled" ? contacts.value.meta.total : null,
        pendingInspections: inspections.status === "fulfilled" ? inspections.value.meta.total : null,
        subscribers: subscribers.status === "fulfilled" ? subscribers.value.meta.total : null,
        blogPosts: blog.status === "fulfilled" ? blog.value.meta.total : null,
      });
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <p className="text-slate-500 mb-6">Welcome back, {admin?.name?.split(" ")[0]}.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {STAT_CONFIG.map(({ key, label, icon: Icon, to }) => (
          <Link
            key={key}
            to={to}
            className="bg-white border border-slate-200 rounded-lg p-5 hover:border-gold-400 hover:shadow-sm transition-all group"
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-md bg-navy-900/5 flex items-center justify-center">
                <Icon size={20} className="text-navy-900" />
              </div>
              <ArrowRight size={16} className="text-slate-300 group-hover:text-gold-500 transition-colors mt-1" />
            </div>
            <p className="text-3xl font-semibold text-navy-900 mt-4">
              {loading ? (
                <span className="inline-block w-10 h-7 bg-slate-100 rounded animate-pulse" />
              ) : stats[key] === null ? (
                <span className="text-slate-300 text-lg">—</span>
              ) : (
                stats[key]
              )}
            </p>
            <p className="text-sm text-slate-500 mt-1">{label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
