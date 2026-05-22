import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

// 🔐 agregar token automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // ✅ CORRECTO
  }

  return config;
});

export default api;