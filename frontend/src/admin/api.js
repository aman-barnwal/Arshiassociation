import axios from "axios";

export const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const getToken = () => localStorage.getItem("aasw_admin_token");
export const setToken = (t) => localStorage.setItem("aasw_admin_token", t);
export const clearToken = () => localStorage.removeItem("aasw_admin_token");

export const authApi = axios.create({ baseURL: API });
authApi.interceptors.request.use((config) => {
  const t = getToken();
  if (t) config.headers.Authorization = `Bearer ${t}`;
  return config;
});

export const fileUrl = (id) => `${API}/files/${id}`;

export const apiError = (e) => {
  const d = e?.response?.data?.detail;
  if (typeof d === "string") return d;
  if (Array.isArray(d)) return d.map((x) => x?.msg || JSON.stringify(x)).join(" ");
  return e?.message || "Something went wrong";
};
