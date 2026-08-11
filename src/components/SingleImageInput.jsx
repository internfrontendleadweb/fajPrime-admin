import { ImageOff } from "lucide-react";

// For the single-image fields (TeamMember.image, Testimonial.image,
// BlogPost.image, Partner.logo, Agent.photo) - distinct from
// ImageUrlList, which handles multi-image arrays (Listings, Projects).
export default function SingleImageInput({ value = "", onChange, placeholder }) {
  return (
    <div className="flex gap-3 items-start">
      <div className="w-16 h-16 rounded-md bg-slate-100 border border-slate-200 flex-shrink-0 overflow-hidden flex items-center justify-center">
        {value ? (
          <img
            src={value}
            alt=""
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
        ) : null}
        <div className={`${value ? "hidden" : "flex"} w-full h-full items-center justify-center text-slate-300`}>
          <ImageOff size={18} />
        </div>
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "/images/photo.webp or a full URL"}
        className="flex-1 border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
      />
    </div>
  );
}
