import { useState, useEffect } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
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

  const [botRunning, setBotRunning] = useState(false);

  const [botStatus, setBotStatus] = useState("");

  const [price, setPrice] = useState(0);

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });

  const [trades, setTrades] = useState([]);

  //expira contratos
  const getTimeLeft = (dateExpiry) => {
  if (!dateExpiry) return 0;

  const now = Math.floor(Date.now() / 1000);

  return Math.max(
    0,
    dateExpiry - now
  );
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
  // SOCKET
  // =========================

  useSocket(user, {
    setTrades,
    setBalance,
    setMetrics,
    setSessionProfit,
    setPrice,
    setChartData,
    setBotRunning,
    setBotStatus
  });

  // =========================
  // DEBUG
  // =========================

  useEffect(() => {
    console.log("💰 BALANCE:", balance);
  }, [balance]);

  useEffect(() => {
    console.log("📈 PRICE:", price);
  }, [price]);

  useEffect(() => {
    console.log("📊 CHART DATA:", chartData);
  }, [chartData]);

  useEffect(() => {
    console.log("📋 TRADES:", trades);
  }, [trades]);

  // =========================
  // ACCOUNTS
  // =========================

  const fetchAccounts = async () => {
    try {

      const token =
        localStorage.getItem("token");

      const res = await axios.get(
        "/api/deriv/accounts",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setAccounts(res.data);

      if (res.data.length > 0) {

        setSelectedAccount(
          res.data[0]
        );

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

  // =========================
  // BOT START
  // =========================

  const startBot = async () => {

    try {

      if (!selectedAccount) {

        alert("Seleccione una cuenta");
        return;
      }

      await startBotService({

        accountId:
          selectedAccount.id,

        symbol: "R_75",

        stake: 1
      });

    } catch (err) {

      console.error(err);

      alert(
        err.response?.data?.error ||
        err.message
      );
    }
  };

  // =========================
  // BOT STOP
  // =========================

  const stopBot = async () => {

    try {

      await stopBotService(
        selectedAccount.id
      );

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

  <h2 className="mb-3 text-center">
    🚀 Trading Bot Dashboard
  </h2>

  <div className="mb-3 text-center">
    <strong>Estado:</strong>{" "}
    {botStatus || "Desconectado"}
  </div>

  {/* ACCOUNT + METRICS */}
  <div className="row justify-content-center mb-4">

    <div className="col-md-5 mb-3">
      <AccountSelector
        accounts={accounts}
        selectedAccount={selectedAccount}
        setSelectedAccount={setSelectedAccount}
        setBalance={setBalance}
      />
    </div>

    <div className="col-md-5 mb-3">
      <Metrics
        balance={balance}
        sessionProfit={sessionProfit}
        metrics={metrics}
        botActive={botRunning}
        price={price}
      />
    </div>

  </div>

  {/* CHART */}
  <div className="row mb-4">
    <div className="col-12">
      <TradingChart chartData={chartData} />
    </div>
  </div>

  {/* TRADE HISTORY */}
  <div className="row mb-4">
    <div className="col-12">
      <TradeHistory
        trades={trades}
        getTimeLeft={getTimeLeft}
        getProgress={getProgress}
        formatTime={formatTime}
      />
    </div>
  </div>

  {/* BOT CONTROLS */}
  <div className="row justify-content-center">
    <div className="col-md-6">
      <BotControls
        handleStartBot={startBot}
        handleStopBot={stopBot}
        botRunning={botRunning}
      />
    </div>
  </div>

</div>
  );
}