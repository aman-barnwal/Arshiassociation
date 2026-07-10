import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquare, HeartHandshake, FileText, Image, FolderOpen, LogOut, ShieldCheck } from "lucide-react";
import { authApi, clearToken, getToken } from "../admin/api";
import { MessagesTab } from "../admin/MessagesTab";
import { VolunteersTab } from "../admin/VolunteersTab";
import { ReportsTab } from "../admin/ReportsTab";
import { GalleryTab } from "../admin/GalleryTab";
import { ProjectsTab } from "../admin/ProjectsTab";

const TABS = [
  { key: "messages", label: "Messages", icon: MessageSquare },
  { key: "volunteers", label: "Volunteers", icon: HeartHandshake },
  { key: "reports", label: "Annual Reports", icon: FileText },
  { key: "gallery", label: "Gallery", icon: Image },
  { key: "projects", label: "Projects", icon: FolderOpen },
];

export default function Admin() {
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState("messages");
  const navigate = useNavigate();

  useEffect(() => {
    if (!getToken()) {
      navigate("/admin/login");
      return;
    }
    authApi
      .get("/auth/me")
      .then(({ data }) => setUser(data))
      .catch(() => {
        clearToken();
        navigate("/admin/login");
      });
  }, [navigate]);

  const logout = () => {
    clearToken();
    navigate("/admin/login");
  };

  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <p className="text-slate-400 text-sm">Checking access…</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F8FAF8] pt-24 pb-20" data-testid="admin-dashboard">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-bold text-amber-700">
              <ShieldCheck className="w-4 h-4" /> Admin Panel
            </p>
            <h1 className="font-heading text-2xl md:text-3xl font-bold text-emerald-950 mt-1">Welcome, {user.name}</h1>
          </div>
          <button
            data-testid="admin-logout-button"
            onClick={logout}
            className="inline-flex items-center gap-2 text-sm font-semibold text-red-700 bg-red-50 hover:bg-red-100 rounded-full px-5 py-2.5 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Log out
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {TABS.map((t) => (
            <button
              key={t.key}
              data-testid={`admin-tab-${t.key}`}
              onClick={() => setTab(t.key)}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                tab === t.key ? "bg-emerald-900 text-white shadow-md" : "bg-white text-emerald-900 border border-emerald-100 hover:bg-emerald-50"
              }`}
            >
              <t.icon className="w-4 h-4" /> {t.label}
            </button>
          ))}
        </div>

        {tab === "messages" && <MessagesTab />}
        {tab === "volunteers" && <VolunteersTab />}
        {tab === "reports" && <ReportsTab />}
        {tab === "gallery" && <GalleryTab />}
        {tab === "projects" && <ProjectsTab />}
      </div>
    </div>
  );
}
