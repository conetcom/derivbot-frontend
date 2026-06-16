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

      <h2 className="mb-3">
        🚀 Trading Bot Dashboard
      </h2>

      <div className="mb-2">
        <strong>Estado:</strong>{" "}
        {botStatus}
      </div>

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
      />

      <BotControls
        handleStartBot={startBot}
        handleStopBot={stopBot}
        botRunning={botRunning}
      />

    </div>
  );
}