import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { Lock, User, LogIn } from "lucide-react";
import { API, setToken, apiError } from "../admin/api";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/auth/login`, { username, password });
      setToken(data.token);
      toast.success(`Welcome back, ${data.user.name}!`);
      navigate("/admin");
    } catch (err) {
      toast.error(apiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F0FDF4] px-4 pt-24 pb-16" data-testid="admin-login-page">
      <div className="w-full max-w-md card-premium p-8 md:p-10 bg-white">
        <div className="w-14 h-14 rounded-2xl bg-emerald-900 flex items-center justify-center mb-6">
          <Lock className="w-6 h-6 text-amber-400" />
        </div>
        <h1 className="font-heading text-2xl font-bold text-emerald-950">Admin Login</h1>
        <p className="text-sm text-slate-500 mt-2">Restricted area — AASW website administration.</p>
        <form onSubmit={submit} className="mt-8 space-y-5">
          <div>
            <label className="text-sm font-semibold text-emerald-950 mb-1.5 block">Username</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                data-testid="admin-username-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Your admin username"
                className="w-full rounded-xl border border-slate-200 pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/30 focus:border-emerald-700"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold text-emerald-950 mb-1.5 block">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                data-testid="admin-password-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-200 pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/30 focus:border-emerald-700"
              />
            </div>
          </div>
          <button
            data-testid="admin-login-submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 bg-emerald-900 hover:bg-emerald-800 disabled:opacity-60 text-white font-semibold rounded-full px-6 py-3.5 transition-all"
          >
            <LogIn className="w-4 h-4" /> {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
