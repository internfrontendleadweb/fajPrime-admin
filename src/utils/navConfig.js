import {
  LayoutDashboard,
  Building2,
  FolderKanban,
  Briefcase,
  Users,
  Quote,
  Newspaper,
  Handshake,
  UserCircle,
  Mail,
  CalendarCheck,
  Send,
} from "lucide-react";

// Single source of truth for sidebar navigation — also used later to
// derive the topbar's page title from whatever route is active.
export const navSections = [
  {
    label: null, // no group heading for the single top-level item
    items: [{ to: "/", label: "Dashboard", icon: LayoutDashboard, end: true }],
  },
  {
    label: "Content",
    items: [
      { to: "/listings", label: "Listings", icon: Building2 },
      { to: "/projects", label: "Projects", icon: FolderKanban },
      { to: "/services", label: "Services", icon: Briefcase },
      { to: "/team", label: "Team", icon: Users },
      { to: "/testimonials", label: "Testimonials", icon: Quote },
      { to: "/blog", label: "Blog", icon: Newspaper },
      { to: "/partners", label: "Partners", icon: Handshake },
      { to: "/agents", label: "Agents", icon: UserCircle },
    ],
  },
  {
    label: "Inquiries",
    items: [
      { to: "/contact-submissions", label: "Contact Submissions", icon: Mail },
      { to: "/inspections", label: "Inspection Bookings", icon: CalendarCheck },
      { to: "/newsletter", label: "Newsletter", icon: Send },
    ],
  },
];

// Flat list — convenient for looking up a single nav item by path
// (e.g. to derive the topbar's current page title).
export const allNavItems = navSections.flatMap((section) => section.items);
