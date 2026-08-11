import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useParams, useLocation, Link } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { servicesService } from "../../services/services.js";
import { useToast } from "../../context/ToastContext.jsx";
import TagInput from "../../components/TagInput.jsx";
import FaqInput from "../../components/FaqInput.jsx";

const schema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters"),
  icon: z.string().trim().min(1, "Icon name is required"),
  shortDescription: z.string().trim().min(10, "Description must be at least 10 characters"),
  benefits: z.array(z.string()),
  process: z.array(z.string()),
  faqs: z.array(z.object({ q: z.string().min(1, "Question required"), a: z.string().min(1, "Answer required") })),
});

const emptyDefaults = { title: "", icon: "", shortDescription: "", benefits: [], process: [], faqs: [] };

export default function ServiceForm() {
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
    const service = location.state?.service;
    if (!service) return;
    reset({
      title: service.title,
      icon: service.icon,
      shortDescription: service.shortDescription,
      benefits: service.benefits || [],
      process: service.process || [],
      faqs: service.faqs || [],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const onSubmit = async (data) => {
    try {
      if (isEdit) {
        await servicesService.update(id, data);
        showToast("Service updated.");
      } else {
        await servicesService.create(data);
        showToast("Service created.");
      }
      navigate("/services");
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  return (
    <div className="max-w-3xl">
      <Link to="/services" className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-navy-900 mb-4 w-fit">
        <ArrowLeft size={15} /> Back to Services
      </Link>

      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h2 className="font-display text-xl text-navy-900 mb-6">{isEdit ? "Edit Service" : "New Service"}</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1.5">Title</label>
            <input id="title" {...register("title")} className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500" placeholder="Property Development" />
            {errors.title && <p className="text-red-600 text-xs mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label htmlFor="icon" className="block text-sm font-medium text-slate-700 mb-1.5">
              Icon name <span className="text-slate-400 font-normal">(from lucide-react, e.g. "Building2", "Home", "KeyRound")</span>
            </label>
            <input id="icon" {...register("icon")} className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500" placeholder="Building2" />
            {errors.icon && <p className="text-red-600 text-xs mt-1">{errors.icon.message}</p>}
          </div>

          <div>
            <label htmlFor="shortDescription" className="block text-sm font-medium text-slate-700 mb-1.5">Short Description</label>
            <textarea id="shortDescription" {...register("shortDescription")} rows={3} className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500" />
            {errors.shortDescription && <p className="text-red-600 text-xs mt-1">{errors.shortDescription.message}</p>}
          </div>

          <div>
            <label htmlFor="benefits" className="block text-sm font-medium text-slate-700 mb-1.5">Benefits</label>
            <Controller name="benefits" control={control} render={({ field }) => <TagInput value={field.value} onChange={field.onChange} placeholder="e.g. Full-cycle project management" />} />
          </div>

          <div>
            <label htmlFor="process" className="block text-sm font-medium text-slate-700 mb-1.5">Process Steps</label>
            <Controller name="process" control={control} render={({ field }) => <TagInput value={field.value} onChange={field.onChange} placeholder="e.g. Site acquisition & feasibility study" />} />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">FAQs</label>
            <Controller name="faqs" control={control} render={({ field }) => <FaqInput value={field.value} onChange={field.onChange} />} />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 bg-gold-500 hover:bg-gold-400 disabled:opacity-60 text-navy-950 font-semibold text-sm px-5 py-2.5 rounded-md transition-colors">
              {isSubmitting && <Loader2 size={16} className="animate-spin" />}
              {isEdit ? "Save Changes" : "Create Service"}
            </button>
            <Link to="/services" className="px-5 py-2.5 text-sm text-slate-600 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
