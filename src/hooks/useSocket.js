import { useEffect } from "react";
import socket from "../services/socket";

export default function useSocket(user, handlers = {}) {
  useEffect(() => {
    if (!user?.id) return;

    socket.connect();

    const onConnect = () => {
      console.log("🟢 SOCKET:", socket.id);
      socket.emit("join", user.id);
    };

    socket.on("connect", onConnect);

    if (handlers.bot_started)
      socket.on("bot_started", handlers.bot_started);

    if (handlers.bot_stopped)
      socket.on("bot_stopped", handlers.bot_stopped);

    if (handlers.trade_update)
      socket.on("trade_update", handlers.trade_update);

    if (handlers.new_trade)
      socket.on("new_trade", handlers.new_trade);

    if (handlers.balance)
      socket.on("balance", handlers.balance);

    if (handlers.metrics)
      socket.on("metrics", handlers.metrics);

    if (handlers.price_update)
      socket.on("price_update", handlers.price_update);

    return () => {
      socket.off("connect", onConnect);
      Object.values(handlers).forEach((fn) => {
        socket.off(fn.event);
      });

      socket.disconnect();
    };
  }, [user]);
}