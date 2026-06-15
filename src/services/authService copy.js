import axios from "axios";

const API = "/api/auth";

export const login = async (data) => {
  const res = await axios.post(`${API}/login`, data);

   return res.data;
};