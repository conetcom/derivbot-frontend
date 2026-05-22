import axios from "axios";

const API = "http://localhost:3000/api/bot";

// ▶️ START BOT
export const startBot = async () => {
  const token = localStorage.getItem("token");

  const res = await axios.post(
    `${API}/start`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

// ⛔ STOP BOT (AGREGAR ESTO)
export const stopBot = async () => {
  const token = localStorage.getItem("token");

  const res = await axios.post(
    `${API}/stop`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};