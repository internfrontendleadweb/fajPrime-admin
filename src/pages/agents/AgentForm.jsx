import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useParams, useLocation, Link } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { agentsService } from "../../services/agents.js";
import { useToast } from "../../context/ToastContext.jsx";
import SingleImageInput from "../../components/SingleImageInput.jsx";

const schema = z.object({
  name: z.string().trim().min(2, "Name is required"),
  role: z.string().trim().min(2, "Role is required"),
  phone: z.string().trim().min(7, "Enter a valid phone number"),
  email: z.string().trim().email("Enter a valid email address"),
  photo: z.string().trim().optional().or(z.literal("")),
});

const emptyDefaults = { name: "", role: "", phone: "", email: "", photo: "" };

export default function AgentForm() {
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
    const agent = location.state?.agent;
    if (!agent) return;
    reset({ name: agent.name, role: agent.role, phone: agent.phone, email: agent.email, photo: agent.photo || "" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const onSubmit = async (data) => {
    const payload = { ...data, photo: data.photo || undefined };
    try {
      if (isEdit) {
        await agentsService.update(id, payload);
        showToast("Agent updated.");
      } else {
        await agentsService.create(payload);
        showToast("Agent created.");
      }
      navigate("/agents");
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  return (
    <div className="max-w-lg">
      <Link to="/agents" className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-navy-900 mb-4 w-fit">
        <ArrowLeft size={15} /> Back to Agents
      </Link>

      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h2 className="font-display text-xl text-navy-900 mb-6">{isEdit ? "Edit Agent" : "New Agent"}</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1.5">Name</label>
            <input id="name" {...register("name")} className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500" />
            {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-slate-700 mb-1.5">Role</label>
            <input id="role" {...register("role")} className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500" placeholder="Senior Sales Agent" />
            {errors.role && <p className="text-red-600 text-xs mt-1">{errors.role.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1.5">Phone</label>
              <input id="phone" {...register("phone")} className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500" placeholder="+234 802 111 2223" />
              {errors.phone && <p className="text-red-600 text-xs mt-1">{errors.phone.message}</p>}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <input id="email" type="email" {...register("email")} className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500" />
              {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email.message}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="photo" className="block text-sm font-medium text-slate-700 mb-1.5">Photo <span className="text-slate-400 font-normal">(optional)</span></label>
            <Controller name="photo" control={control} render={({ field }) => <SingleImageInput value={field.value} onChange={field.onChange} />} />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 bg-gold-500 hover:bg-gold-400 disabled:opacity-60 text-navy-950 font-semibold text-sm px-5 py-2.5 rounded-md transition-colors">
              {isSubmitting && <Loader2 size={16} className="animate-spin" />}
              {isEdit ? "Save Changes" : "Create Agent"}
            </button>
            <Link to="/agents" className="px-5 py-2.5 text-sm text-slate-600 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
