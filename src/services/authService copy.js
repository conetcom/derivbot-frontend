import axios from "axios";

const API = "http://localhost:3000/api/auth";

export const login = async (data) => {
  const res = await axios.post(`${API}/login`, data);

   return res.data;
};