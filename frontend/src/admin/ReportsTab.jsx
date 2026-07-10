import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Trash2, FileText, Upload, ExternalLink } from "lucide-react";
import { authApi, apiError, fileUrl } from "./api";

export const ReportsTab = () => {
  const [items, setItems] = useState(null);
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(null);

  const load = () => authApi.get("/reports").then(({ data }) => setItems(data)).catch((e) => toast.error(apiError(e)));
  useEffect(() => { load(); }, []);

  const upload = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Please choose a PDF file");
    const fd = new FormData();
    fd.append("title", title);
    fd.append("year", year);
    fd.append("desc", desc);
    fd.append("file", file);
    setProgress(0);
    try {
      await authApi.post("/admin/reports", fd, {
        onUploadProgress: (p) => setProgress(Math.round((p.loaded / (p.total || 1)) * 100)),
      });
      toast.success("Annual report uploaded! It is now live on the website.");
      setTitle(""); setYear(""); setDesc(""); setFile(null);
      e.target.reset();
      load();
    } catch (err) {
      toast.error(apiError(err));
    } finally {
      setProgress(null);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this report from the website?")) return;
    try {
      await authApi.delete(`/admin/reports/${id}`);
      setItems((prev) => prev.filter((r) => r.id !== id));
      toast.success("Report deleted");
    } catch (e) {
      toast.error(apiError(e));
    }
  };

  return (
    <div className="grid lg:grid-cols-5 gap-8">
      <form onSubmit={upload} className="lg:col-span-2 card-premium bg-white p-6 space-y-4 h-fit" data-testid="report-upload-form">
        <h3 className="font-heading font-bold text-emerald-950 inline-flex items-center gap-2"><Upload className="w-4 h-4 text-amber-700" /> Upload Annual Report (PDF)</h3>
        <input data-testid="report-title-input" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Title e.g. Annual Report 2024–25" className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/30" />
        <input data-testid="report-year-input" value={year} onChange={(e) => setYear(e.target.value)} required placeholder="Year e.g. 2024–2025" className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/30" />
        <textarea data-testid="report-desc-input" value={desc} onChange={(e) => setDesc(e.target.value)} rows={3} placeholder="Short description (optional)" className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/30" />
        <input data-testid="report-file-input" type="file" accept=".pdf" onChange={(e) => setFile(e.target.files[0])} required className="w-full text-sm file:mr-3 file:rounded-full file:border-0 file:bg-emerald-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-emerald-900" />
        {progress !== null && (
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div className="bg-emerald-700 h-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        )}
        <button data-testid="report-upload-submit" disabled={progress !== null} className="w-full bg-emerald-900 hover:bg-emerald-800 disabled:opacity-60 text-white text-sm font-semibold rounded-full px-5 py-3 transition-all">
          {progress !== null ? `Uploading… ${progress}%` : "Upload Report"}
        </button>
      </form>

      <div className="lg:col-span-3 space-y-4" data-testid="admin-reports-list">
        {!items ? (
          <p className="text-sm text-slate-400">Loading…</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-slate-500">No uploaded reports yet. The 2023–24 report bundled with the website is always shown.</p>
        ) : (
          items.map((r) => (
            <div key={r.id} className="card-premium bg-white p-5 flex items-center gap-4" data-testid={`report-item-${r.id}`}>
              <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0"><FileText className="w-5 h-5 text-emerald-800" /></div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-emerald-950 truncate">{r.title}</p>
                <p className="text-xs text-slate-500">{r.year}</p>
              </div>
              <a href={fileUrl(r.file_id)} target="_blank" rel="noreferrer" className="p-2.5 rounded-full text-emerald-800 bg-emerald-50 hover:bg-emerald-100 transition-colors" aria-label="Open report"><ExternalLink className="w-4 h-4" /></a>
              <button data-testid={`delete-report-${r.id}`} onClick={() => remove(r.id)} className="p-2.5 rounded-full text-red-600 bg-red-50 hover:bg-red-100 transition-colors" aria-label="Delete report"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
