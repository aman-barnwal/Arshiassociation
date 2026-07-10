import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Trash2, FolderPlus, ImagePlus, ChevronDown, ChevronUp } from "lucide-react";
import { authApi, apiError, fileUrl } from "./api";

export const ProjectsTab = () => {
  const [items, setItems] = useState(null);
  const [form, setForm] = useState({ title: "", subtitle: "", location: "", date: "", beneficiaries: "", summary: "" });
  const [open, setOpen] = useState(null);
  const [progress, setProgress] = useState(null);

  const load = () => authApi.get("/projects").then(({ data }) => setItems(data)).catch((e) => toast.error(apiError(e)));
  useEffect(() => { load(); }, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const create = async (e) => {
    e.preventDefault();
    try {
      await authApi.post("/admin/projects", form);
      toast.success("Project folder created! Now add photos to it.");
      setForm({ title: "", subtitle: "", location: "", date: "", beneficiaries: "", summary: "" });
      load();
    } catch (err) {
      toast.error(apiError(err));
    }
  };

  const addPhoto = async (projectId, file) => {
    const fd = new FormData();
    fd.append("file", file);
    setProgress(projectId);
    try {
      const { data } = await authApi.post(`/admin/projects/${projectId}/photos`, fd);
      setItems((prev) => prev.map((p) => (p.id === projectId ? data : p)));
      toast.success("Photo added to project");
    } catch (err) {
      toast.error(apiError(err));
    } finally {
      setProgress(null);
    }
  };

  const removePhoto = async (projectId, fid) => {
    try {
      await authApi.delete(`/admin/projects/${projectId}/photos/${fid}`);
      setItems((prev) => prev.map((p) => (p.id === projectId ? { ...p, photos: p.photos.filter((x) => x !== fid) } : p)));
      toast.success("Photo removed");
    } catch (e) {
      toast.error(apiError(e));
    }
  };

  const removeProject = async (id) => {
    if (!window.confirm("Delete this project and all its photos from the website?")) return;
    try {
      await authApi.delete(`/admin/projects/${id}`);
      setItems((prev) => prev.filter((p) => p.id !== id));
      toast.success("Project deleted");
    } catch (e) {
      toast.error(apiError(e));
    }
  };

  return (
    <div className="grid lg:grid-cols-5 gap-8">
      <form onSubmit={create} className="lg:col-span-2 card-premium bg-white p-6 space-y-3.5 h-fit" data-testid="project-create-form">
        <h3 className="font-heading font-bold text-emerald-950 inline-flex items-center gap-2"><FolderPlus className="w-4 h-4 text-amber-700" /> Create Project Folder</h3>
        <input data-testid="project-title-input" value={form.title} onChange={set("title")} required placeholder="Project title *" className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/30" />
        <input data-testid="project-subtitle-input" value={form.subtitle} onChange={set("subtitle")} placeholder="Subtitle e.g. Supported by NABARD" className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/30" />
        <div className="grid grid-cols-2 gap-3">
          <input data-testid="project-location-input" value={form.location} onChange={set("location")} placeholder="Location" className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/30" />
          <input data-testid="project-date-input" value={form.date} onChange={set("date")} placeholder="Date e.g. 2025–26" className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/30" />
        </div>
        <input data-testid="project-beneficiaries-input" value={form.beneficiaries} onChange={set("beneficiaries")} placeholder="Beneficiaries e.g. 50 Women Trained" className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/30" />
        <textarea data-testid="project-summary-input" value={form.summary} onChange={set("summary")} rows={3} placeholder="Short description" className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/30" />
        <button data-testid="project-create-submit" className="w-full bg-emerald-900 hover:bg-emerald-800 text-white text-sm font-semibold rounded-full px-5 py-3 transition-all">Create Project</button>
      </form>

      <div className="lg:col-span-3 space-y-4" data-testid="admin-projects-list">
        {!items ? (
          <p className="text-sm text-slate-400">Loading…</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-slate-500">No project folders yet. Create one and add photos — it will appear on the Projects page.</p>
        ) : (
          items.map((p) => (
            <div key={p.id} className="card-premium bg-white overflow-hidden" data-testid={`project-admin-item-${p.id}`}>
              <div className="p-5 flex items-center gap-4">
                <button onClick={() => setOpen(open === p.id ? null : p.id)} className="flex-1 flex items-center gap-3 text-left min-w-0" data-testid={`project-toggle-${p.id}`}>
                  {open === p.id ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                  <div className="min-w-0">
                    <p className="font-bold text-emerald-950 truncate">{p.title}</p>
                    <p className="text-xs text-slate-500">{p.photos.length} photo{p.photos.length !== 1 ? "s" : ""}{p.location ? ` • ${p.location}` : ""}</p>
                  </div>
                </button>
                <label className={`inline-flex items-center gap-1.5 text-xs font-semibold rounded-full px-4 py-2 cursor-pointer transition-colors ${progress === p.id ? "bg-slate-100 text-slate-400" : "bg-emerald-50 text-emerald-900 hover:bg-emerald-100"}`}>
                  <ImagePlus className="w-3.5 h-3.5" /> {progress === p.id ? "Uploading…" : "Add Photo"}
                  <input type="file" accept="image/*" className="hidden" disabled={progress === p.id} data-testid={`project-photo-input-${p.id}`}
                    onChange={(e) => { if (e.target.files[0]) addPhoto(p.id, e.target.files[0]); e.target.value = ""; }} />
                </label>
                <button data-testid={`delete-project-${p.id}`} onClick={() => removeProject(p.id)} className="p-2.5 rounded-full text-red-600 bg-red-50 hover:bg-red-100 transition-colors" aria-label="Delete project">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              {open === p.id && (
                <div className="px-5 pb-5">
                  {p.photos.length === 0 ? (
                    <p className="text-xs text-slate-400">No photos yet — use "Add Photo" above.</p>
                  ) : (
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                      {p.photos.map((fid) => (
                        <div key={fid} className="relative group rounded-xl overflow-hidden">
                          <img src={fileUrl(fid)} alt="" className="w-full h-28 object-cover" loading="lazy" />
                          <button onClick={() => removePhoto(p.id, fid)} data-testid={`delete-project-photo-${fid}`} className="absolute top-1.5 right-1.5 p-1.5 rounded-full bg-white/90 text-red-600 opacity-0 group-hover:opacity-100 shadow transition-opacity" aria-label="Remove photo">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
