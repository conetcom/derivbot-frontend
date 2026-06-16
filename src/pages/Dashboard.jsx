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

import useSocket from "../hooks/useSocket";

export default function Dashboard() {

  const user = JSON.parse(localStorage.getItem("user"));

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

  const [botRunning, setBotRunning] = useState(false);
  const [botStatus, setBotStatus] = useState("");
  const [price, setPrice] = useState(0);

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });

  const [trades, setTrades] = useState([]);

  // =========================
  // SOCKET EVENTS LIMPIOS
  // =========================
  useSocket(user, {
    bot_started: () => {
      setBotRunning(true);
      setBotStatus("🟢 Bot ejecutándose");
    },

    bot_stopped: (data) => {
      setBotRunning(false);

      setBotStatus(
        data.reason === "take_profit"
          ? "🎯 Take Profit alcanzado"
          : data.reason === "stop_loss"
          ? "🛑 Stop Loss alcanzado"
          : "⛔ Bot detenido"
      );
    },

    trade_update: (update) => {
      setTrades((prev) =>
        prev.map((t) =>
          String(t.contract_id) === String(update.contract_id)
            ? { ...t, ...update }
            : t
        )
      );
    },

    new_trade: (trade) => {
      setTrades((prev) => [trade, ...prev]);
    },

    balance: (data) => {
      setBalance(Number(data.balance));
    },

    metrics: (data) => {
      setMetrics(data);
      setSessionProfit(Number(data.pnl || 0));
    },

    price_update: (p) => {
      setPrice(p);

      setChartData((prev) => ({
        labels: [...prev.labels, new Date().toLocaleTimeString()].slice(-50),
        datasets: [
          {
            label: "Precio",
            data: [...(prev.datasets[0]?.data || []), p].slice(-50)
          }
        ]
      }));
    }
  });

  // =========================
  // ACCOUNTS
  // =========================
  const fetchAccounts = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("/api/deriv/accounts", {
        headers: { Authorization: `Bearer ${token}` }
      });

      setAccounts(res.data);

      if (res.data.length > 0) {
        setSelectedAccount(res.data[0]);
        setBalance(Number(res.data[0].balance));
      }
    } catch (err) {
      console.error("Error cargando cuentas:", err);
    }
  };

  // =========================
  // BOT CONTROL
  // =========================
  const startBot = async () => {
    try {
      if (!selectedAccount) return alert("Seleccione una cuenta");

      await startBotService({
        accountId: selectedAccount.id,
        symbol: "R_75",
        stake: 1
      });

      setBotRunning(true);
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    }
  };

  const stopBot = async () => {
    try {
      await stopBotService(selectedAccount.id);
      setBotRunning(false);
    } catch (err) {
      console.error(err);
    }
  };

  // =========================
  // INIT
  // =========================
  useEffect(() => {
    fetchAccounts();
  }, []);

  // =========================
  // UI
  // =========================
  return (
    <div className="container-fluid p-4">

      <h2>🚀 Trading Bot Dashboard</h2>

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

      <TradingChart chartData={chartData} />

      <TradeHistory trades={trades} 
       getTimeLeft={getTimeLeft}
  getProgress={getProgress}
  formatTime={formatTime}/>

      <BotControls
        handleStartBot={startBot}
        handleStopBot={stopBot}
        botRunning={botRunning}
      />
    </div>
  );
}