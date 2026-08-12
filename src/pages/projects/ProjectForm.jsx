import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useParams, useLocation, Link } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { projectsService, PROJECT_STATUSES } from "../../services/projects.js";
import { useToast } from "../../context/ToastContext.jsx";
import TagInput from "../../components/TagInput.jsx";
import ImageUrlList from "../../components/ImageUrlList.jsx";

const schema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters"),
  status: z.enum(PROJECT_STATUSES, { message: "Select a status" }),
  location: z.string().trim().min(2, "Location is required"),
  progress: z.coerce.number().int().min(0).max(100),
  completionDate: z.string().trim().min(2, "Completion date is required"),
  propertyType: z.string().trim().min(2, "Property type is required"),
  units: z.coerce.number().int().positive("Units must be a positive number"),
  description: z.string().trim().min(10, "Description must be at least 10 characters"),
  amenities: z.array(z.string()),
  images: z.array(z.string()),
});

const emptyDefaults = {
  title: "", status: "", location: "", progress: 0, completionDate: "",
  propertyType: "", units: "", description: "", amenities: [], images: [],
};

export default function ProjectForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const [loading] = useState(false);
  const [imagesUploading, setImagesUploading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema), defaultValues: emptyDefaults });

  useEffect(() => {
    if (!isEdit) return;
    const project = location.state?.project;
    if (!project) return; // no by-id fetch fallback needed - the list always passes state
    reset({
      title: project.title,
      status: project.status,
      location: project.location,
      progress: project.progress,
      completionDate: project.completionDate,
      propertyType: project.propertyType,
      units: project.units,
      description: project.description,
      amenities: project.amenities || [],
      images: project.images || [],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const onSubmit = async (data) => {
    if (imagesUploading) return;
    try {
      if (isEdit) {
        await projectsService.update(id, data);
        showToast("Project updated.");
      } else {
        await projectsService.create(data);
        showToast("Project created.");
      }
      navigate("/projects");
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  if (loading) return <div className="h-64 bg-white border border-slate-200 rounded-lg animate-pulse" />;

  return (
    <div className="max-w-3xl">
      <Link to="/projects" className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-navy-900 mb-4 w-fit">
        <ArrowLeft size={15} /> Back to Projects
      </Link>

      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h2 className="font-display text-xl text-navy-900 mb-6">{isEdit ? "Edit Project" : "New Project"}</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1.5">Title</label>
            <input id="title" {...register("title")} className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500" placeholder="FAJ Prime Heights" />
            {errors.title && <p className="text-red-600 text-xs mt-1">{errors.title.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
              <select id="status" {...register("status")} className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500">
                <option value="">Select status…</option>
                {PROJECT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              {errors.status && <p className="text-red-600 text-xs mt-1">{errors.status.message}</p>}
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-slate-700 mb-1.5">Location</label>
              <input id="location" {...register("location")} className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500" placeholder="Ikoyi, Lagos" />
              {errors.location && <p className="text-red-600 text-xs mt-1">{errors.location.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label htmlFor="progress" className="block text-sm font-medium text-slate-700 mb-1.5">Progress (%)</label>
              <input id="progress" type="number" min="0" max="100" {...register("progress")} className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500" />
            </div>
            <div>
              <label htmlFor="units" className="block text-sm font-medium text-slate-700 mb-1.5">Units</label>
              <input id="units" type="number" {...register("units")} className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500" />
              {errors.units && <p className="text-red-600 text-xs mt-1">{errors.units.message}</p>}
            </div>
            <div>
              <label htmlFor="propertyType" className="block text-sm font-medium text-slate-700 mb-1.5">Property Type</label>
              <input id="propertyType" {...register("propertyType")} className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500" placeholder="Luxury Apartments" />
              {errors.propertyType && <p className="text-red-600 text-xs mt-1">{errors.propertyType.message}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="completionDate" className="block text-sm font-medium text-slate-700 mb-1.5">Completion Date</label>
            <input id="completionDate" {...register("completionDate")} className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500" placeholder="Expected Q3 2027" />
            {errors.completionDate && <p className="text-red-600 text-xs mt-1">{errors.completionDate.message}</p>}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
            <textarea id="description" {...register("description")} rows={4} className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500" />
            {errors.description && <p className="text-red-600 text-xs mt-1">{errors.description.message}</p>}
          </div>

          <div>
            <label htmlFor="amenities" className="block text-sm font-medium text-slate-700 mb-1.5">Amenities</label>
            <Controller name="amenities" control={control} render={({ field }) => <TagInput value={field.value} onChange={field.onChange} />} />
          </div>

          <div>
            <label htmlFor="images" className="block text-sm font-medium text-slate-700 mb-1.5">Images</label>
            <Controller name="images" control={control} render={({ field }) => <ImageUrlList value={field.value} onChange={field.onChange} folder="projects" onUploadingChange={setImagesUploading} />} />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={isSubmitting || imagesUploading} className="flex items-center gap-2 bg-gold-500 hover:bg-gold-400 disabled:opacity-60 text-navy-950 font-semibold text-sm px-5 py-2.5 rounded-md transition-colors">
              {isSubmitting && <Loader2 size={16} className="animate-spin" />}
              {isEdit ? "Save Changes" : "Create Project"}
            </button>
            <Link to="/projects" className="px-5 py-2.5 text-sm text-slate-600 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
