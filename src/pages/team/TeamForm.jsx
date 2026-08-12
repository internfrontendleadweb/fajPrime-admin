import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useParams, useLocation, Link } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { teamService, TEAM_GROUPS } from "../../services/team.js";
import { useToast } from "../../context/ToastContext.jsx";
import SingleImageInput from "../../components/SingleImageInput.jsx";

const schema = z.object({
  group: z.enum(TEAM_GROUPS, { message: "Select a group" }),
  name: z.string().trim().min(2, "Name is required"),
  role: z.string().trim().min(2, "Role is required"),
  bio: z.string().trim().min(10, "Bio must be at least 10 characters"),
  image: z.string().trim().min(1, "An image is required"),
  linkedin: z.string().trim().url("Enter a valid URL").optional().or(z.literal("")),
  order: z.coerce.number().int().min(0),
});

const emptyDefaults = { group: "", name: "", role: "", bio: "", image: "", linkedin: "", order: 0 };

export default function TeamForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const [imageUploading, setImageUploading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema), defaultValues: emptyDefaults });

  useEffect(() => {
    if (!isEdit) return;
    const member = location.state?.member;
    if (!member) return;
    reset({
      group: member.group,
      name: member.name,
      role: member.role,
      bio: member.bio,
      image: member.image,
      linkedin: member.linkedin || "",
      order: member.order || 0,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const onSubmit = async (data) => {
    if (imageUploading) return;
    try {
      if (isEdit) {
        await teamService.update(id, data);
        showToast("Team member updated.");
      } else {
        await teamService.create(data);
        showToast("Team member created.");
      }
      navigate("/team");
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  return (
    <div className="max-w-2xl">
      <Link to="/team" className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-navy-900 mb-4 w-fit">
        <ArrowLeft size={15} /> Back to Team
      </Link>

      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h2 className="font-display text-xl text-navy-900 mb-6">{isEdit ? "Edit Team Member" : "New Team Member"}</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1.5">Name</label>
              <input id="name" {...register("name")} className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500" />
              {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label htmlFor="group" className="block text-sm font-medium text-slate-700 mb-1.5">Group</label>
              <select id="group" {...register("group")} className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500">
                <option value="">Select group…</option>
                {TEAM_GROUPS.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
              {errors.group && <p className="text-red-600 text-xs mt-1">{errors.group.message}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-slate-700 mb-1.5">Role</label>
            <input id="role" {...register("role")} className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500" placeholder="Chairman / Founder" />
            {errors.role && <p className="text-red-600 text-xs mt-1">{errors.role.message}</p>}
          </div>

          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-slate-700 mb-1.5">Bio</label>
            <textarea id="bio" {...register("bio")} rows={4} className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500" />
            {errors.bio && <p className="text-red-600 text-xs mt-1">{errors.bio.message}</p>}
          </div>

          <div>
            <label htmlFor="image" className="block text-sm font-medium text-slate-700 mb-1.5">Photo</label>
            <Controller name="image" control={control} render={({ field }) => <SingleImageInput value={field.value} onChange={field.onChange} folder="team" onUploadingChange={setImageUploading} />} />
            {errors.image && <p className="text-red-600 text-xs mt-1">{errors.image.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="linkedin" className="block text-sm font-medium text-slate-700 mb-1.5">LinkedIn <span className="text-slate-400 font-normal">(optional)</span></label>
              <input id="linkedin" {...register("linkedin")} className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500" placeholder="https://linkedin.com/in/…" />
              {errors.linkedin && <p className="text-red-600 text-xs mt-1">{errors.linkedin.message}</p>}
            </div>
            <div>
              <label htmlFor="order" className="block text-sm font-medium text-slate-700 mb-1.5">Display Order</label>
              <input id="order" type="number" {...register("order")} className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500" />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={isSubmitting || imageUploading} className="flex items-center gap-2 bg-gold-500 hover:bg-gold-400 disabled:opacity-60 text-navy-950 font-semibold text-sm px-5 py-2.5 rounded-md transition-colors">
              {isSubmitting && <Loader2 size={16} className="animate-spin" />}
              {isEdit ? "Save Changes" : "Create Team Member"}
            </button>
            <Link to="/team" className="px-5 py-2.5 text-sm text-slate-600 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
