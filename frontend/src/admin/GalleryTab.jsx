import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Trash2, Upload } from "lucide-react";
import { authApi, apiError, fileUrl } from "./api";
import { GALLERY_CATEGORIES } from "../data/content";

export const GalleryTab = () => {
  const [items, setItems] = useState(null);
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(null);

  const load = () => authApi.get("/gallery").then(({ data }) => setItems(data)).catch((e) => toast.error(apiError(e)));
  useEffect(() => { load(); }, []);

  const upload = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Please choose an image");
    const fd = new FormData();
    fd.append("caption", caption);
    fd.append("category", category);
    fd.append("file", file);
    setProgress(0);
    try {
      await authApi.post("/admin/gallery", fd, {
        onUploadProgress: (p) => setProgress(Math.round((p.loaded / (p.total || 1)) * 100)),
      });
      toast.success("Photo added to the website gallery!");
      setCaption(""); setCategory(""); setFile(null);
      e.target.reset();
      load();
    } catch (err) {
      toast.error(apiError(err));
    } finally {
      setProgress(null);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Remove this photo from the gallery?")) return;
    try {
      await authApi.delete(`/admin/gallery/${id}`);
      setItems((prev) => prev.filter((g) => g.id !== id));
      toast.success("Photo removed");
    } catch (e) {
      toast.error(apiError(e));
    }
  };

  return (
    <div className="grid lg:grid-cols-5 gap-8">
      <form onSubmit={upload} className="lg:col-span-2 card-premium bg-white p-6 space-y-4 h-fit" data-testid="gallery-upload-form">
        <h3 className="font-heading font-bold text-emerald-950 inline-flex items-center gap-2"><Upload className="w-4 h-4 text-amber-700" /> Add Photo to Gallery</h3>
        <input data-testid="gallery-caption-input" value={caption} onChange={(e) => setCaption(e.target.value)} required placeholder="Caption e.g. Health camp at Khunti" className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/30" />
        <input data-testid="gallery-category-input" value={category} onChange={(e) => setCategory(e.target.value)} required list="gallery-cats" placeholder="Category (pick or type new)" className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/30" />
        <datalist id="gallery-cats">
          {GALLERY_CATEGORIES.filter((c) => c !== "All").map((c) => <option key={c} value={c} />)}
        </datalist>
        <input data-testid="gallery-file-input" type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} required className="w-full text-sm file:mr-3 file:rounded-full file:border-0 file:bg-emerald-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-emerald-900" />
        {progress !== null && (
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div className="bg-emerald-700 h-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        )}
        <button data-testid="gallery-upload-submit" disabled={progress !== null} className="w-full bg-emerald-900 hover:bg-emerald-800 disabled:opacity-60 text-white text-sm font-semibold rounded-full px-5 py-3 transition-all">
          {progress !== null ? `Uploading… ${progress}%` : "Add Photo"}
        </button>
      </form>

      <div className="lg:col-span-3" data-testid="admin-gallery-list">
        {!items ? (
          <p className="text-sm text-slate-400">Loading…</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-slate-500">No uploaded photos yet. The 43 photographs bundled with the website are always shown.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {items.map((g) => (
              <div key={g.id} className="relative group rounded-2xl overflow-hidden shadow-sm" data-testid={`gallery-admin-item-${g.id}`}>
                <img src={fileUrl(g.file_id)} alt={g.caption} className="w-full h-40 object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                  <p className="text-amber-300 text-[10px] uppercase tracking-widest font-bold">{g.category}</p>
                  <p className="text-white text-xs leading-snug">{g.caption}</p>
                </div>
                <button data-testid={`delete-gallery-${g.id}`} onClick={() => remove(g.id)} className="absolute top-2 right-2 p-2 rounded-full bg-white/90 text-red-600 hover:bg-white shadow transition-colors" aria-label="Delete photo">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
