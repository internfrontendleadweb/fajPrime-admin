import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useParams, useLocation, Link } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { testimonialsService } from "../../services/testimonials.js";
import { useToast } from "../../context/ToastContext.jsx";
import SingleImageInput from "../../components/SingleImageInput.jsx";

const schema = z.object({
  name: z.string().trim().min(2, "Name is required"),
  location: z.string().trim().min(2, "Location is required"),
  rating: z.coerce.number().int().min(1).max(5),
  review: z.string().trim().min(10, "Review must be at least 10 characters"),
  image: z.string().trim().min(1, "An image is required"),
});

const emptyDefaults = { name: "", location: "", rating: 5, review: "", image: "" };

export default function TestimonialForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema), defaultValues: emptyDefaults });

  useEffect(() => {
    if (!isEdit) return;
    const testimonial = location.state?.testimonial;
    if (!testimonial) return;
    reset({
      name: testimonial.name,
      location: testimonial.location,
      rating: testimonial.rating,
      review: testimonial.review,
      image: testimonial.image,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const onSubmit = async (data) => {
    try {
      if (isEdit) {
        await testimonialsService.update(id, data);
        showToast("Testimonial updated.");
      } else {
        await testimonialsService.create(data);
        showToast("Testimonial created.");
      }
      navigate("/testimonials");
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  return (
    <div className="max-w-2xl">
      <Link to="/testimonials" className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-navy-900 mb-4 w-fit">
        <ArrowLeft size={15} /> Back to Testimonials
      </Link>

      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h2 className="font-display text-xl text-navy-900 mb-6">{isEdit ? "Edit Testimonial" : "New Testimonial"}</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1.5">Name</label>
              <input id="name" {...register("name")} className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500" />
              {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-slate-700 mb-1.5">Location</label>
              <input id="location" {...register("location")} className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500" placeholder="Lekki, Lagos" />
              {errors.location && <p className="text-red-600 text-xs mt-1">{errors.location.message}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="rating" className="block text-sm font-medium text-slate-700 mb-1.5">Rating (1–5)</label>
            <input id="rating" type="number" min="1" max="5" {...register("rating")} className="w-32 border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500" />
          </div>

          <div>
            <label htmlFor="review" className="block text-sm font-medium text-slate-700 mb-1.5">Review</label>
            <textarea id="review" {...register("review")} rows={4} className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500" />
            {errors.review && <p className="text-red-600 text-xs mt-1">{errors.review.message}</p>}
          </div>

          <div>
            <label htmlFor="image" className="block text-sm font-medium text-slate-700 mb-1.5">Photo</label>
            <Controller name="image" control={control} render={({ field }) => <SingleImageInput value={field.value} onChange={field.onChange} />} />
            {errors.image && <p className="text-red-600 text-xs mt-1">{errors.image.message}</p>}
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 bg-gold-500 hover:bg-gold-400 disabled:opacity-60 text-navy-950 font-semibold text-sm px-5 py-2.5 rounded-md transition-colors">
              {isSubmitting && <Loader2 size={16} className="animate-spin" />}
              {isEdit ? "Save Changes" : "Create Testimonial"}
            </button>
            <Link to="/testimonials" className="px-5 py-2.5 text-sm text-slate-600 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
