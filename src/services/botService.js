import axios from "axios";

const API_URL =
  "http://localhost:3000/api/bot";

// ===============================
// 🚀 START BOT
// ===============================
export const startBot = async ({
  accountId,
  symbol,
  stake,
  strategy,
  targetProfit = 10,
  stopLoss = 10,
  maxDrawdown = 20
}) => {

  const token =
    localStorage.getItem("token");

  const res = await axios.post(

    `${API_URL}/start/${accountId}`,

    {
      symbol,
      stake,
      strategy,
      targetProfit,
      stopLoss,
      maxDrawdown
    },

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