import { useEffect } from "react";
import socket from "../services/socket";

export default function useSocket(
  user,
  {
    setTrades,
    setBalance,
    setMetrics,
    setSessionProfit,
    setPrice,
    setChartData,
    setBotRunning,
    setBotStatus
  } = {}
) {
  useEffect(() => {
    if (!user?.id) return;

    socket.connect();

    // =========================
    // CONNECT + JOIN ROOM
    // =========================
    const onConnect = () => {
      console.log("🟢 SOCKET:", socket.id);
      socket.emit("join", user.id);
    };

    socket.on("connect", onConnect);

    // =========================
    // BOT STARTED
    // =========================
    const onBotStarted = () => {
      console.log("🚀 BOT INICIADO");
      setBotRunning?.(true);
      setBotStatus?.("🟢 Bot ejecutándose");
    };

    socket.on("bot_started", onBotStarted);

    // =========================
    // BOT STOPPED
    // =========================
    const onBotStopped = (data) => {
      console.log("🛑 BOT DETENIDO", data);

      setBotRunning?.(false);

      setBotStatus?.(
        data.reason === "take_profit"
          ? "🎯 Take Profit alcanzado"
          : data.reason === "stop_loss"
          ? "🛑 Stop Loss alcanzado"
          : "⛔ Bot detenido"
      );
    };

    socket.on("bot_stopped", onBotStopped);

    // =========================
    // TRADE UPDATE
    // =========================
    const onTradeUpdate = (update) => {
      console.log("🔥 TRADE UPDATE:", update);

      setTrades?.((prev) =>
        prev.map((trade) =>
          String(trade.contract_id) === String(update.contract_id)
            ? { ...trade, ...update }
            : trade
        )
      );
    };

    socket.on("trade_update", onTradeUpdate);

    // =========================
    // NEW TRADE
    // =========================
    const onNewTrade = (trade) => {
      console.log("🆕 NEW TRADE:", trade);

      setTrades?.((prev) => [trade, ...prev]);
    };

    socket.on("new_trade", onNewTrade);

    // =========================
    // BALANCE
    // =========================
    const onBalance = (data) => {
      console.log("💰 BALANCE:", data);

      setBalance?.(Number(data.balance));
    };

    socket.on("balance", onBalance);

    // =========================
    // METRICS
    // =========================
    const onMetrics = (data) => {
      console.log("📊 METRICS:", data);

      setMetrics?.(data);
      setSessionProfit?.(Number(data.pnl || 0));
    };

    socket.on("metrics", onMetrics);

    // =========================
    // PRICE UPDATE (CRÍTICO OPTIMIZADO)
    // =========================
    const onPriceUpdate = (price) => {
      setPrice?.(price);

      setChartData?.((prev) => ({
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
    };

    socket.on("price_update", onPriceUpdate);

    // =========================
    // CLEANUP (CRÍTICO)
    // =========================
    return () => {
      socket.off("connect", onConnect);
      socket.off("bot_started", onBotStarted);
      socket.off("bot_stopped", onBotStopped);
      socket.off("trade_update", onTradeUpdate);
      socket.off("new_trade", onNewTrade);
      socket.off("balance", onBalance);
      socket.off("metrics", onMetrics);
      socket.off("price_update", onPriceUpdate);

      socket.disconnect();
    };
  }, [user]);
}