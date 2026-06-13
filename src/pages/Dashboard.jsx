import { useState, useEffect } from "react";
import axios from "axios";
import BotControls from "../components/dashboard/BotControls";
import AccountSelector from "../components/dashboard/AccountSelector";
import Metrics from "../components/dashboard/MetricsPanel";
import TradingChart from "../components/dashboard/TradingChart";
import TradeHistory from "../components/dashboard/TradeTable";
import {
  startBot as startBotService,
  stopBot as stopBotService
} from "../services/botService";
import { io } from "socket.io-client";


export default function Dashboard() {

  // =========================
  // STATES
  // =========================
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [balance, setBalance] = useState(0);
  const [sessionProfit, setSessionProfit] = useState(0);
  const [metrics, setMetrics] = useState({
    trades: 0,
    wins: 0,
    losses: 0,
    pnl: 0,
    winrate: 0
    
  });

 const [botRunning, setBotRunning] =  useState(false);

const [botStatus, setBotStatus] =  useState("");

  const [price, setPrice] = useState(0);

  const [strategy, setStrategy] = useState("sma");

  const [targetProfit, setTargetProfit] = useState(10);

  const [stopLoss, setStopLoss] = useState(10);

  const [maxDrawdown, setMaxDrawdown] = useState(20);

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });

  const [rsiData, setRsiData] = useState({
    labels: [],
    datasets: []
  });

  const [trades, setTrades] = useState([]);

  // =========================
  // OBTENER CUENTAS
  // =========================

  const fetchAccounts = async () => {

    try {

      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:3000/api/deriv/accounts",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log("CUENTAS:", res.data);

      setAccounts(res.data);

      if (res.data.length > 0) {

        setSelectedAccount(res.data[0]);

        setBalance(
          Number(res.data[0].balance)
        );
      }

    } catch (err) {

      console.error(
        "Error cargando cuentas:",
        err
      );
    }
  };

  const startBot = async () => {

  try {

    if (!selectedAccount) {
      alert("Seleccione una cuenta");
      return;
    }

    const res = await startBotService({

      accountId: selectedAccount.id,

      symbol: "R_75",

      stake: 1,

      strategy,

      targetProfit,

      stopLoss,

      maxDrawdown
    });

    console.log(res);

    setBotRunning(true);

  } catch (err) {

    console.error(err);

    alert(
      err.response?.data?.error ||
      err.message
    );
  }
};

const stopBot = async () => {

  try {

    await stopBotService(
      selectedAccount.id
    );

    setBotRunning(false);

  } catch (err) {

    console.error(err);
  }
};

const manualTrade = (type) => {

  console.log(
    "MANUAL TRADE:",
    type
  );
};
const getTimeLeft = (dateExpiry) => {

  if (!dateExpiry) return 0;

  const now = Math.floor(Date.now() / 1000);

  return Math.max(0, dateExpiry - now);
};

const formatTime = (seconds) => {

  const mins = Math.floor(seconds / 60);

  const secs = seconds % 60;

  return `${mins}:${secs
    .toString()
    .padStart(2, "0")}`;
};

const getProgress = (
  dateStart,
  dateExpiry
) => {

  if (!dateStart || !dateExpiry)
    return 0;

  const now = Math.floor(
    Date.now() / 1000
  );

  const total =
    dateExpiry - dateStart;

  const elapsed =
    now - dateStart;

  return Math.min(
    100,
    Math.max(
      0,
      (elapsed / total) * 100
    )
  );
};
  // =========================
  // INIT
  // =========================
useEffect(() => {

  const socket = io("http://localhost:3000");

  // =========================
  // CONEXIÓN
  // =========================

  socket.on("connect", () => {

    console.log("🟢 SOCKET:", socket.id);

    socket.emit("join", 1);

  });

  // =========================
  // BOT START
  // =========================

  socket.on("bot_started", () => {

    console.log("🚀 BOT INICIADO");

    setBotRunning(true);

    setBotStatus("🟢 Bot ejecutándose");

  });

  // =========================
  // BOT STOP
  // =========================

  socket.on("bot_stopped", (data) => {

    console.log("🛑 BOT DETENIDO", data);

    setBotRunning(false);

    setBotStatus(
      data.reason === "take_profit"
        ? "🎯 Take Profit alcanzado"
        : data.reason === "stop_loss"
        ? "🛑 Stop Loss alcanzado"
        : "⛔ Bot detenido"
    );

  });

  // =========================
  // TRADE UPDATE
  // =========================

  socket.on("trade_update", (update) => {
 console.log("📥 PRICE_UPDATE RECIBIDO:", price);
    console.log("🔥 TRADE UPDATE:", update);

    setTrades(prev =>
      prev.map(trade =>
        String(trade.contract_id) ===
        String(update.contract_id)
          ? { ...trade, ...update }
          : trade
      )
    );

  });

  // =========================
  // NUEVO TRADE
  // =========================

  socket.on("new_trade", (trade) => {

    console.log("🆕 NEW TRADE:", trade);

    setTrades(prev => [
      trade,
      ...prev
    ]);

  });

  // =========================
  // BALANCE
  // =========================

  socket.on("balance", (data) => {

    console.log("💰 BALANCE:", data);

    setBalance(
      Number(data.balance)
    );

  });

  // =========================
  // MÉTRICAS
  // =========================

  socket.on("metrics", (data) => {

    console.log("📊 METRICAS:", data);

    setMetrics(data);

    setSessionProfit(
      Number(data.pnl || 0)
    );

  });

  // =========================
  // PRECIO
  // =========================

  socket.on("price_update", (price) => {

    setPrice(price);

    setChartData(prev => ({

      labels: [
        ...prev.labels,
        new Date().toLocaleTimeString()
      ].slice(-50),

      datasets: [
        {
          label: "Precio",
          data: [
            ...(prev.datasets[0]?.data || []),
            price
          ].slice(-50)
        }
      ]

    }));

  });

  // =========================
  // LIMPIEZA
  // =========================

  return () => {

    socket.off("connect");
    socket.off("bot_started");
    socket.off("bot_stopped");
    socket.off("trade_update");
    socket.off("new_trade");
    socket.off("balance");
    socket.off("metrics");
    socket.off("price_update");

    socket.disconnect();

  };

}, []);
  useEffect(() => {

    fetchAccounts();

  }, []);

  // =========================
  // UI
  // =========================

  return (

    <div className="container-fluid p-4">

      <h2 className="mb-4">
        🚀 Trading Bot Dashboard
      </h2>

      <AccountSelector
        accounts={accounts}
        selectedAccount={selectedAccount}
        setSelectedAccount={setSelectedAccount}
        setBalance={setBalance}
      />

      <Metrics
       balance={balance}
  sessionProfit={sessionProfit}
  metrics={metrics}
  botActive={botRunning}
  price={price}
      />

      <TradingChart
        chartData={chartData}
      />

      <TradeHistory
  trades={trades}
  getTimeLeft={getTimeLeft}
  getProgress={getProgress}
  formatTime={formatTime}
/>
      <BotControls
  
  handleStartBot={startBot}
  botRunning={botRunning}
  handleStopBot={stopBot}
  manualTrade={manualTrade}
/>

    </div>

  );
}