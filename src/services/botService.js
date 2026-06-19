import axios from "axios";

const API_URL = "/api/bot";

// ===============================
// 🚀 START BOT
// ===============================
export const startBot = async  => {

  const token =
    localStorage.getItem("token");

  const res = await axios.post(

    `${API_URL}/start/${accountId}`,

    {
      headers: {
        Authorization:
          `Bearer ${token}`
      }
    }
  );

  return res.data;
};

// ===============================
// 🛑 STOP BOT
// ===============================
export const stopBot = async (
  accountId
) => {

  const token =
    localStorage.getItem("token");

  const res = await axios.post(

    `${API_URL}/stop/${accountId}`,

    {},

    {
      headers: {
        Authorization:
          `Bearer ${token}`
      }
    }
  );

  return res.data;
};