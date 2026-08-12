import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useParams, useLocation, Link } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { blogService } from "../../services/blog.js";
import { useToast } from "../../context/ToastContext.jsx";
import SingleImageInput from "../../components/SingleImageInput.jsx";

const schema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters"),
  category: z.string().trim().min(2, "Category is required"),
  date: z.string().trim().min(1, "Date is required"),
  readTime: z.string().trim().min(1, "Read time is required"),
  author: z.string().trim().min(2, "Author is required"),
  image: z.string().trim().min(1, "An image is required"),
  excerpt: z.string().trim().min(10, "Excerpt must be at least 10 characters"),
  content: z.string().trim().min(20, "Content must be at least 20 characters"),
});

const today = new Date().toISOString().slice(0, 10);
const emptyDefaults = { title: "", category: "", date: today, readTime: "", author: "", image: "", excerpt: "", content: "" };

export default function BlogForm() {
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
    const post = location.state?.post;
    if (!post) return;
    reset({
      title: post.title,
      category: post.category,
      date: post.date,
      readTime: post.readTime,
      author: post.author,
      image: post.image,
      excerpt: post.excerpt,
      content: post.content,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const onSubmit = async (data) => {
    if (imageUploading) return;
    try {
      if (isEdit) {
        await blogService.update(id, data);
        showToast("Post updated.");
      } else {
        await blogService.create(data);
        showToast("Post created.");
      }
      navigate("/blog");
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  return (
    <div className="max-w-3xl">
      <Link to="/blog" className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-navy-900 mb-4 w-fit">
        <ArrowLeft size={15} /> Back to Blog
      </Link>

      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h2 className="font-display text-xl text-navy-900 mb-6">{isEdit ? "Edit Post" : "New Post"}</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1.5">Title</label>
            <input id="title" {...register("title")} className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500" />
            {errors.title && <p className="text-red-600 text-xs mt-1">{errors.title.message}</p>}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-1.5">Category</label>
              <input id="category" {...register("category")} className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500" placeholder="Market Insights" />
              {errors.category && <p className="text-red-600 text-xs mt-1">{errors.category.message}</p>}
            </div>
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-slate-700 mb-1.5">Date</label>
              <input id="date" type="date" {...register("date")} className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500" />
            </div>
            <div>
              <label htmlFor="readTime" className="block text-sm font-medium text-slate-700 mb-1.5">Read Time</label>
              <input id="readTime" {...register("readTime")} className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500" placeholder="5 min" />
              {errors.readTime && <p className="text-red-600 text-xs mt-1">{errors.readTime.message}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="author" className="block text-sm font-medium text-slate-700 mb-1.5">Author</label>
            <input id="author" {...register("author")} className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500" />
            {errors.author && <p className="text-red-600 text-xs mt-1">{errors.author.message}</p>}
          </div>

          <div>
            <label htmlFor="image" className="block text-sm font-medium text-slate-700 mb-1.5">Cover Image</label>
            <Controller name="image" control={control} render={({ field }) => <SingleImageInput value={field.value} onChange={field.onChange} folder="blog" onUploadingChange={setImageUploading} />} />
            {errors.image && <p className="text-red-600 text-xs mt-1">{errors.image.message}</p>}
          </div>

          <div>
            <label htmlFor="excerpt" className="block text-sm font-medium text-slate-700 mb-1.5">Excerpt</label>
            <textarea id="excerpt" {...register("excerpt")} rows={2} className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500" />
            {errors.excerpt && <p className="text-red-600 text-xs mt-1">{errors.excerpt.message}</p>}
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-slate-700 mb-1.5">Content</label>
            <textarea id="content" {...register("content")} rows={8} className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500" />
            {errors.content && <p className="text-red-600 text-xs mt-1">{errors.content.message}</p>}
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={isSubmitting || imageUploading} className="flex items-center gap-2 bg-gold-500 hover:bg-gold-400 disabled:opacity-60 text-navy-950 font-semibold text-sm px-5 py-2.5 rounded-md transition-colors">
              {isSubmitting && <Loader2 size={16} className="animate-spin" />}
              {isEdit ? "Save Changes" : "Create Post"}
            </button>
            <Link to="/blog" className="px-5 py-2.5 text-sm text-slate-600 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
