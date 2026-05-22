import { useEffect, useState } from "react";
import socket from "../socket";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import { RSI } from "technicalindicators";

export default function Dashboard() {
  const [balance, setBalance] = useState(0);
  const [trades, setTrades] = useState([]);
  const [price, setPrice] = useState(null);
  const [botActive, setBotActive] = useState(false);
  const [tick, setTick] = useState(0);
  const [strategy, setStrategy] = useState("sma");

  // 🔥 HISTORIAL REAL (clave para RSI correcto)
  const [priceHistory, setPriceHistory] = useState([]);

  // ================= RSI =================
  const [rsiData, setRsiData] = useState({
    labels: [],
    datasets: [
      {
        label: "RSI",
        data: [],
        borderWidth: 2,
        tension: 0.2
      },
      {
        label: "70",
        data: [],
        borderDash: [5, 5]
      },
      {
        label: "30",
        data: [],
        borderDash: [5, 5]
      }
    ]
  });

  // ================= CHART =================
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Precio R_100",
        data: [],
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.2
      },
      {
        label: "Entradas",
        data: [],
        pointRadius: 5,
        showLine: false
      }
    ]
  });

  // ================= RIESGO =================
  const [sessionProfit, setSessionProfit] = useState(0);
  const [targetProfit, setTargetProfit] = useState(10);
  const [stopLoss, setStopLoss] = useState(10);
  const [maxDrawdown, setMaxDrawdown] = useState(20);
  const [peakProfit, setPeakProfit] = useState(0);
  const [tradingBlocked, setTradingBlocked] = useState(false);

  const navigate = useNavigate();

  // ================= USER =================
  let userId = null;
  try {
    const token = localStorage.getItem("token");
    if (token) {
      const payload = token.split(".")[1];
      const decoded = JSON.parse(atob(payload));
      userId = decoded.id;
    }
  } catch (err) {
    console.error(err);
  }

  // ================= SOCKET =================
  useEffect(() => {
    socket.emit("join", userId);

    socket.on("balance", (data) => {
      console.log('datos', data)
      setBalance(data.balance);
    });

    socket.on("price_update", (price) => {
      setPrice(price);

      // 🔥 HISTORIAL
      setPriceHistory((prev) => {
        const newHistory = [...prev, price];
        if (newHistory.length > 100) newHistory.shift();
        return newHistory;
      });

      // 📊 CHART
      setChartData((prev) => {
        const newLabels = [...prev.labels, ""];
        const newPrices = [...prev.datasets[0].data, price];
        const newSignals = [...prev.datasets[1].data, null];

        if (newLabels.length > 100) {
          newLabels.shift();
          newPrices.shift();
          newSignals.shift();
        }

        return {
          labels: newLabels,
          datasets: [
            { ...prev.datasets[0], data: newPrices },
            { ...prev.datasets[1], data: newSignals }
          ]
        };
      });

      // ================= RSI =================
      setPriceHistory((prevPrices) => {
        const updated = [...prevPrices, price];
        if (updated.length > 100) updated.shift();

        if (updated.length >= 14) {
          const rsiValues = RSI.calculate({
            values: updated,
            period: 14
          });

          const lastRSI = rsiValues[rsiValues.length - 1];

          setRsiData((prev) => {
            const newLabels = [...prev.labels, ""];
            const newData = [...prev.datasets[0].data, lastRSI];

            if (newLabels.length > 100) {
              newLabels.shift();
              newData.shift();
            }

            const overbought = new Array(newLabels.length).fill(70);
            const oversold = new Array(newLabels.length).fill(30);

            return {
              labels: newLabels,
              datasets: [
                { ...prev.datasets[0], data: newData },
                { ...prev.datasets[1], data: overbought },
                { ...prev.datasets[2], data: oversold }
              ]
            };
          });
        }

        return updated;
      });
    });

 socket.on("new_trade", (trade) => {
  const normalized = {
    ...trade,
    contract_id: String(trade.contract_id),
    contract_type: trade.contract_type || trade.type,
    start_time: null,
    expiry_time: null
  };

  setTrades((prev) => [normalized, ...prev]);

  // 🔥 MARCAR EN GRÁFICA (PRO)
  setChartData((prev) => {
    const signals = [...prev.datasets[1].data];

    // 👇 usamos entry_price REAL
    signals.push(trade.entry_price || price);

    // mantener tamaño
    if (signals.length > 100) signals.shift();

    return {
      ...prev,
      datasets: [
        prev.datasets[0],
        {
          ...prev.datasets[1],
          data: signals,
          pointBackgroundColor:
            trade.contract_type === "CALL" ? "green" : "red"
        }
      ]
    };
  });
});

   socket.on("trade_closed", (trade) => {
  setTrades((prev) =>
    prev.map((t) =>
      t.id === trade.id
        ? { ...t, ...trade }
        : t
    )
  );

  const profit = trade.profit || 0;

  setSessionProfit((prev) => {
    const newProfit = prev + profit;
    setPeakProfit((peak) => (newProfit > peak ? newProfit : peak));
    return newProfit;
  });
});
socket.on("trade_update", (update) => {

  console.log("📡 UPDATE FRONT:", update);

  if (!update || !update.contract_id) return;

  setTrades((prev) =>
    prev.map((t) => {

      if (
        String(t.contract_id) ===
        String(update.contract_id)
      ) {

        const updatedTrade = {

          ...t,

          // 🔥 ENTRY REAL
          entry_price:
            update.entry_price ??
            t.entry_price,

          // 🔥 TIEMPOS
          start_time:
            update.date_start ??
            t.start_time,

          expiry_time:
            update.date_expiry ??
            t.expiry_time,

          // 🔥 DATOS LIVE
          current_spot:
            update.current_spot,

          profit:
            update.profit,

          status:
            update.status
        };

        console.log(
          "✅ TRADE ACTUALIZADO:",
          updatedTrade
        );

        return updatedTrade;
      }

      return t;
    })
  );
});

    return () => {
      socket.off("balance");
      socket.off("price_update");
      socket.off("new_trade");
      socket.off("trade_closed");
      socket.off("trade_update");
    };
  }, []);

useEffect(() => {
  const interval = setInterval(() => {
    setTick((t) => t + 1);
  }, 1000);

  return () => clearInterval(interval);
}, []);
  // ================= RIESGO ENGINE =================
  useEffect(() => {
    if (!botActive) return;

    if (sessionProfit >= targetProfit) {
      stopBot();
      setTradingBlocked(true);
    }

    if (sessionProfit <= -stopLoss) {
      stopBot();
      setTradingBlocked(true);
    }

    const drawdown = peakProfit - sessionProfit;

    if (drawdown >= maxDrawdown) {
      stopBot();
      setTradingBlocked(true);
    }
  }, [sessionProfit]);

  // ================= BOT =================
  const startBot = async () => {
    if (tradingBlocked) {
      alert("Trading bloqueado");
      return;
    }

    await api.post("/bot/start", {
  
  symbol: "R_75",
  stake: 1,
  strategy, // 🔥 CLAVE
  targetProfit,
  stopLoss,
  maxDrawdown

     
    });

    setBotActive(true);
  };
  const manualTrade = async (type) => {

  try {

    await api.post(
      "/bot/manual-trade",
      {
        symbol: "R_75",
        contract_type: type,
        amount: 1
      }
    );

    console.log(
      "✅ TRADE MANUAL:",
      type
    );

  } catch (err) {

    console.log(err);
  }
};

  const stopBot = async () => {
    await api.post("/bot/stop");
    setBotActive(false);
  };
  
const getTimeLeft = (expiry) => {
  if (!expiry) return 0;
  return Math.max(expiry - Math.floor(Date.now() / 1000), 0);
};

const formatTime = (sec) => {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
};

const getProgress = (start, expiry) => {
  if (!start || !expiry) return 0;

  const now = Math.floor(Date.now() / 1000);
  const total = expiry - start;
  const elapsed = now - start;

  return Math.min((elapsed / total) * 100, 100);
};
  // ================= CHART OPTIONS =================
  const options = {
    responsive: true,
    animation: false,
    scales: { x: { display: false } }
  };

  const rsiOptions = {
    responsive: true,
    animation: false,
    scales: {
      y: { min: 0, max: 100 },
      x: { display: false }
    }
  };

  // ================= UI =================
  return (
    <div style={{ padding: "20px" }}>
      <h1>🚀 Dashboard PRO</h1>

      <button onClick={() => navigate("/connect-deriv")}>
        🔗 Conectar
      </button>

      <h2>💰 Balance: ${balance}</h2>
      <h2>📊 Profit: ${sessionProfit.toFixed(2)}</h2>

      <h3>🤖 {botActive ? "ACTIVO" : "OFF"}</h3>
      <h3>📊 Precio: {price}</h3>

      {/* CONTROLES */}
      {/* CONTROLES */}
<div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
  
  {/* TAKE PROFIT */}
  <label>
    TP
    <input
      type="number"
      value={targetProfit}
      onChange={(e) => setTargetProfit(Number(e.target.value))}
    />
  </label>

  {/* STOP LOSS */}
  <label>
    SL
    <input
      type="number"
      value={stopLoss}
      onChange={(e) => setStopLoss(Number(e.target.value))}
    />
  </label>

  {/* DRAWDOWN */}
  <label>
    DD
    <input
      type="number"
      value={maxDrawdown}
      onChange={(e) => setMaxDrawdown(Number(e.target.value))}
    />
  </label>

  {/* ESTRATEGIA */}
  <label>
    STR
    <select
      value={strategy}
      onChange={(e) => setStrategy(e.target.value)}
    >
      <option value="sma">SMA</option>
      <option value="rsi">RSI</option>
    </select>
  </label>

</div>

   {/* CHART */}
      <Line data={chartData} options={options} />

      {/* RSI 
      <div style={{ marginTop: "20px" }}>
        <h4>📉 RSI</h4>
        <Line data={rsiData} options={rsiOptions} />
      </div> */}

      <button onClick={startBot}>▶️ Start</button>
      <button onClick={stopBot}>⛔ Stop</button>
<div
  style={{
    display: "flex",
    gap: "10px",
    marginTop: "20px"
  }}
>

  <button
    onClick={() => manualTrade("CALL")}
    style={{
      background: "green",
      color: "white",
      padding: "10px 20px"
    }}
  >
    📈 CALL
  </button>

  <button
    onClick={() => manualTrade("PUT")}
    style={{
      background: "red",
      color: "white",
      padding: "10px 20px"
    }}
  >
    📉 PUT
  </button>

</div>
      {/* TABLA */}
      <table border="1" cellPadding="10">
  <thead>
    <tr>
      <th>ID</th>
      <th>Tipo</th>
      <th>Precio Entrada</th>
      <th>Status</th>
      <th>Profit</th>
      <th>Tiempo</th>
      <th>Progreso</th>
      <th>Señal</th>
      
    </tr>
  </thead>
  <tbody>
    {trades.map((t) => {
      const timeLeft = getTimeLeft(t.expiry_time);
      const progress = getProgress(t.start_time, t.expiry_time);

      return (
        <tr key={t.id}>
          <td>{t.id}</td>
          <td>{t.contract_type}</td>
           <td>{t.entry_price}</td>
          <td>{t.status}</td>
          <td>{t.profit}</td>
          

          {/* ⏱️ TIMER */}
          <td style={{ color: timeLeft < 5 ? "red" : "black" }}>
            {formatTime(timeLeft)}
          </td>

          {/* 📊 BARRA PRO */}
          <td>
            <div style={{
              width: "100%",
              background: "#eee",
              height: "10px",
              borderRadius: "5px"
            }}>
              <div style={{
                width: `${progress}%`,
                height: "100%",
                background: progress > 90 ? "red" : "green",
                transition: "width 1s linear"
              }} />
            </div>
          </td>

          {/* 🔥 ANIMACIÓN */}
          <td>
            {timeLeft === 0
              ? "🔥 EXPIRADO"
              : timeLeft < 3
              ? "⚡"
              : ""}
          </td>
        </tr>
      );
    })}
  </tbody>
</table>
    </div>
  );
}