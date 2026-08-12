import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useParams, useLocation, Link } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { partnersService } from "../../services/partners.js";
import { useToast } from "../../context/ToastContext.jsx";
import SingleImageInput from "../../components/SingleImageInput.jsx";

const schema = z.object({
  name: z.string().trim().min(2, "Name is required"),
  logo: z.string().trim().min(1, "A logo is required"),
});

const emptyDefaults = { name: "", logo: "" };

export default function PartnerForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const [logoUploading, setLogoUploading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema), defaultValues: emptyDefaults });

  useEffect(() => {
    if (!isEdit) return;
    const partner = location.state?.partner;
    if (!partner) return;
    reset({ name: partner.name, logo: partner.logo });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const onSubmit = async (data) => {
    if (logoUploading) return;
    try {
      if (isEdit) {
        await partnersService.update(id, data);
        showToast("Partner updated.");
      } else {
        await partnersService.create(data);
        showToast("Partner created.");
      }
      navigate("/partners");
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  return (
    <div className="max-w-lg">
      <Link to="/partners" className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-navy-900 mb-4 w-fit">
        <ArrowLeft size={15} /> Back to Partners
      </Link>

      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h2 className="font-display text-xl text-navy-900 mb-6">{isEdit ? "Edit Partner" : "New Partner"}</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1.5">Name</label>
            <input id="name" {...register("name")} className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500" placeholder="Meridian Trust Bank" />
            {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label htmlFor="logo" className="block text-sm font-medium text-slate-700 mb-1.5">Logo</label>
            <Controller name="logo" control={control} render={({ field }) => <SingleImageInput value={field.value} onChange={field.onChange} folder="partners" onUploadingChange={setLogoUploading} />} />
            {errors.logo && <p className="text-red-600 text-xs mt-1">{errors.logo.message}</p>}
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={isSubmitting || logoUploading} className="flex items-center gap-2 bg-gold-500 hover:bg-gold-400 disabled:opacity-60 text-navy-950 font-semibold text-sm px-5 py-2.5 rounded-md transition-colors">
              {isSubmitting && <Loader2 size={16} className="animate-spin" />}
              {isEdit ? "Save Changes" : "Create Partner"}
            </button>
            <Link to="/partners" className="px-5 py-2.5 text-sm text-slate-600 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
