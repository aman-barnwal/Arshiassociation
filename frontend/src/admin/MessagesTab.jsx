import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Trash2, Mail, Phone } from "lucide-react";
import { authApi, apiError } from "./api";

export const MessagesTab = () => {
  const [items, setItems] = useState(null);

  const load = () => authApi.get("/contact").then(({ data }) => setItems(data)).catch((e) => toast.error(apiError(e)));
  useEffect(() => { load(); }, []);

  const remove = async (id) => {
    if (!window.confirm("Delete this message permanently?")) return;
    try {
      await authApi.delete(`/admin/contact/${id}`);
      setItems((prev) => prev.filter((m) => m.id !== id));
      toast.success("Message deleted");
    } catch (e) {
      toast.error(apiError(e));
    }
  };

  if (!items) return <p className="text-sm text-slate-400">Loading messages…</p>;
  if (items.length === 0) return <p className="text-sm text-slate-500" data-testid="messages-empty">No contact messages yet.</p>;

  return (
    <div className="space-y-4" data-testid="admin-messages-list">
      {items.map((m) => (
        <div key={m.id} className="card-premium bg-white p-6 flex flex-col md:flex-row md:items-start gap-4" data-testid={`message-item-${m.id}`}>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <p className="font-bold text-emerald-950">{m.name}</p>
              <span className="text-xs text-slate-400">{new Date(m.created_at).toLocaleString("en-IN")}</span>
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-1 mt-1.5 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1"><Mail className="w-3 h-3" /> {m.email}</span>
              {m.phone && <span className="inline-flex items-center gap-1"><Phone className="w-3 h-3" /> {m.phone}</span>}
            </div>
            <p className="mt-3 text-sm font-semibold text-emerald-900">{m.subject}</p>
            <p className="mt-1 text-sm text-slate-600 leading-relaxed">{m.message}</p>
          </div>
          <button
            data-testid={`delete-message-${m.id}`}
            onClick={() => remove(m.id)}
            className="shrink-0 p-2.5 rounded-full text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
            aria-label="Delete message"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
