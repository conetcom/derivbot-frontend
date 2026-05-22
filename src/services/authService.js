import api from "../services/api";



export const login = async (data) => {
  const res = await api.post("/auth/login", data);

  // 🔥 Guardar sesión
  localStorage.setItem("token", res.data.token);
  localStorage.setItem("user", JSON.stringify(res.data.user));

  return res.data;
};