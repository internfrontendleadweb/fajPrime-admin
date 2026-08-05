// Reusable placeholder for every resource screen not yet built —
// keeps the sidebar fully navigable this section, with each screen
// honestly labeled rather than 404ing or showing nothing.
export default function ComingSoon({ title }) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-12 text-center">
      <h2 className="font-display text-2xl text-navy-900 mb-2">{title}</h2>
      <p className="text-slate-500">This screen is coming in a later section.</p>
    </div>
  );
}
