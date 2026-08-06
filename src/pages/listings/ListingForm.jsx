import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useParams, useLocation, Link } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { listingsService, LISTING_TYPES, LISTING_STATUSES } from "../../services/listings.js";
import { useToast } from "../../context/ToastContext.jsx";
import TagInput from "../../components/TagInput.jsx";
import ImageUrlList from "../../components/ImageUrlList.jsx";

const schema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters"),
  type: z.enum(LISTING_TYPES, { message: "Select a property type" }),
  status: z.enum(LISTING_STATUSES, { message: "Select a status" }),
  price: z.coerce.number().int().positive("Price must be a positive number"),
  currency: z.string().trim().min(1).default("NGN"),
  location: z.string().trim().min(2, "Location is required"),
  bedrooms: z.coerce.number().int().min(0),
  bathrooms: z.coerce.number().int().min(0),
  parking: z.coerce.number().int().min(0),
  sqm: z.coerce.number().int().positive("Size must be a positive number"),
  featured: z.boolean(),
  description: z.string().trim().min(10, "Description must be at least 10 characters"),
  agentId: z.string(),
  amenities: z.array(z.string()),
  images: z.array(z.string()),
});

const emptyDefaults = {
  title: "",
  type: "",
  status: "",
  price: "",
  currency: "NGN",
  location: "",
  bedrooms: 0,
  bathrooms: 0,
  parking: 0,
  sqm: "",
  featured: false,
  description: "",
  agentId: "",
  amenities: [],
  images: [],
};

export default function ListingForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [notFound, setNotFound] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema), defaultValues: emptyDefaults });

  useEffect(() => {
    listingsService.agents().then(setAgents).catch(() => setAgents([]));
  }, []);

  useEffect(() => {
    if (!isEdit) return;

    async function loadListing() {
      // Fast path: the list page already has the full record and
      // passed it via navigation state - no extra fetch needed.
      const passedListing = location.state?.listing;
      const listing = passedListing || (await listingsService.getById(id));

      if (!listing) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      reset({
        title: listing.title,
        type: listing.type,
        status: listing.status,
        price: listing.price,
        currency: listing.currency,
        location: listing.location,
        bedrooms: listing.bedrooms,
        bathrooms: listing.bathrooms,
        parking: listing.parking,
        sqm: listing.sqm,
        featured: listing.featured,
        description: listing.description,
        agentId: listing.agent || "",
        amenities: listing.amenities || [],
        images: listing.images || [],
      });
      setLoading(false);
    }

    loadListing();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const onSubmit = async (data) => {
    const payload = { ...data, agentId: data.agentId || undefined };
    try {
      if (isEdit) {
        await listingsService.update(id, payload);
        showToast("Listing updated.");
      } else {
        await listingsService.create(payload);
        showToast("Listing created.");
      }
      navigate("/listings");
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  if (loading) {
    return <div className="h-64 bg-white border border-slate-200 rounded-lg animate-pulse" />;
  }

  if (notFound) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg p-12 text-center">
        <p className="text-slate-500">This listing couldn't be found.</p>
        <Link to="/listings" className="text-gold-600 hover:underline text-sm mt-2 inline-block">
          Back to Listings
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <Link to="/listings" className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-navy-900 mb-4 w-fit">
        <ArrowLeft size={15} /> Back to Listings
      </Link>

      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h2 className="font-display text-xl text-navy-900 mb-6">
          {isEdit ? "Edit Listing" : "New Listing"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1.5">Title</label>
            <input
              id="title"
              {...register("title")}
              className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
              placeholder="Luxury 5-Bedroom Fully Detached Duplex"
            />
            {errors.title && <p className="text-red-600 text-xs mt-1">{errors.title.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-slate-700 mb-1.5">Type</label>
              <select
                id="type"
                {...register("type")}
                className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
              >
                <option value="">Select type…</option>
                {LISTING_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              {errors.type && <p className="text-red-600 text-xs mt-1">{errors.type.message}</p>}
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
              <select
                id="status"
                {...register("status")}
                className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
              >
                <option value="">Select status…</option>
                {LISTING_STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              {errors.status && <p className="text-red-600 text-xs mt-1">{errors.status.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-slate-700 mb-1.5">Price (NGN)</label>
              <input
                id="price"
                type="number"
                {...register("price")}
                className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
                placeholder="85000000"
              />
              {errors.price && <p className="text-red-600 text-xs mt-1">{errors.price.message}</p>}
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-slate-700 mb-1.5">Location</label>
              <input
                id="location"
                {...register("location")}
                className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
                placeholder="Ikoyi, Lagos"
              />
              {errors.location && <p className="text-red-600 text-xs mt-1">{errors.location.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div>
              <label htmlFor="bedrooms" className="block text-sm font-medium text-slate-700 mb-1.5">Bedrooms</label>
              <input id="bedrooms" type="number" {...register("bedrooms")} className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500" />
            </div>
            <div>
              <label htmlFor="bathrooms" className="block text-sm font-medium text-slate-700 mb-1.5">Bathrooms</label>
              <input id="bathrooms" type="number" {...register("bathrooms")} className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500" />
            </div>
            <div>
              <label htmlFor="parking" className="block text-sm font-medium text-slate-700 mb-1.5">Parking</label>
              <input id="parking" type="number" {...register("parking")} className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500" />
            </div>
            <div>
              <label htmlFor="sqm" className="block text-sm font-medium text-slate-700 mb-1.5">Size (sqm)</label>
              <input id="sqm" type="number" {...register("sqm")} className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500" />
              {errors.sqm && <p className="text-red-600 text-xs mt-1">{errors.sqm.message}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="agentId" className="block text-sm font-medium text-slate-700 mb-1.5">Agent</label>
            <select
              id="agentId"
              {...register("agentId")}
              className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
            >
              <option value="">No agent assigned</option>
              {agents.map((a) => (
                <option key={a.id} value={a.id}>{a.name} — {a.role}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
            <textarea
              id="description"
              {...register("description")}
              rows={4}
              className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
              placeholder="A brief description of the property…"
            />
            {errors.description && <p className="text-red-600 text-xs mt-1">{errors.description.message}</p>}
          </div>

          <div>
            <label htmlFor="amenities" className="block text-sm font-medium text-slate-700 mb-1.5">Amenities</label>
            <Controller
              name="amenities"
              control={control}
              render={({ field }) => (
                <TagInput value={field.value} onChange={field.onChange} placeholder="e.g. Swimming Pool, then Enter" />
              )}
            />
          </div>

          <div>
            <label htmlFor="images" className="block text-sm font-medium text-slate-700 mb-1.5">Images</label>
            <Controller
              name="images"
              control={control}
              render={({ field }) => <ImageUrlList value={field.value} onChange={field.onChange} />}
            />
          </div>

          <label className="flex items-center gap-2.5 cursor-pointer w-fit">
            <input id="featured" type="checkbox" {...register("featured")} className="w-4 h-4 accent-gold-500" />
            <span className="text-sm text-slate-700">Feature this listing on the homepage</span>
          </label>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 bg-gold-500 hover:bg-gold-400 disabled:opacity-60 text-navy-950 font-semibold text-sm px-5 py-2.5 rounded-md transition-colors"
            >
              {isSubmitting && <Loader2 size={16} className="animate-spin" />}
              {isEdit ? "Save Changes" : "Create Listing"}
            </button>
            <Link
              to="/listings"
              className="px-5 py-2.5 text-sm text-slate-600 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
