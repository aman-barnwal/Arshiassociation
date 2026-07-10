import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Trash2, Mail, Phone, Briefcase, Clock } from "lucide-react";
import { authApi, apiError } from "./api";

export const VolunteersTab = () => {
  const [items, setItems] = useState(null);

  const load = () => authApi.get("/volunteer").then(({ data }) => setItems(data)).catch((e) => toast.error(apiError(e)));
  useEffect(() => { load(); }, []);

  const remove = async (id) => {
    if (!window.confirm("Delete this application permanently?")) return;
    try {
      await authApi.delete(`/admin/volunteer/${id}`);
      setItems((prev) => prev.filter((m) => m.id !== id));
      toast.success("Application deleted");
    } catch (e) {
      toast.error(apiError(e));
    }
  };

  if (!items) return <p className="text-sm text-slate-400">Loading applications…</p>;
  if (items.length === 0) return <p className="text-sm text-slate-500" data-testid="volunteers-empty">No volunteer applications yet.</p>;

  return (
    <div className="space-y-4" data-testid="admin-volunteers-list">
      {items.map((v) => (
        <div key={v.id} className="card-premium bg-white p-6 flex flex-col md:flex-row md:items-start gap-4" data-testid={`volunteer-item-${v.id}`}>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <p className="font-bold text-emerald-950">{v.name}</p>
              <span className="text-xs text-slate-400">{new Date(v.created_at).toLocaleString("en-IN")}</span>
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-1 mt-1.5 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1"><Mail className="w-3 h-3" /> {v.email}</span>
              <span className="inline-flex items-center gap-1"><Phone className="w-3 h-3" /> {v.phone}</span>
              {v.profession && <span className="inline-flex items-center gap-1"><Briefcase className="w-3 h-3" /> {v.profession}</span>}
              {v.availability && <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" /> {v.availability}</span>}
            </div>
            {v.areas_of_interest?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {v.areas_of_interest.map((a) => (
                  <span key={a} className="text-[11px] font-semibold bg-emerald-50 text-emerald-900 rounded-full px-3 py-1">{a}</span>
                ))}
              </div>
            )}
            {v.message && <p className="mt-3 text-sm text-slate-600 leading-relaxed">{v.message}</p>}
          </div>
          <button
            data-testid={`delete-volunteer-${v.id}`}
            onClick={() => remove(v.id)}
            className="shrink-0 p-2.5 rounded-full text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
            aria-label="Delete application"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
