import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function BotSettings() {
  const [settings, setSettings] = useState({
    symbol: "R_75",
    strategy: "sma",
    stake: 1,
    targetProfit: 10,
    stopLoss: 10,
    maxDrawdown: 20
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setSettings((prev) => ({
      ...prev,
      [name]:
        name === "symbol" ||
        name === "strategy"
          ? value
          : Number(value)
    }));
  };

  const handleSave = async () => {
    try {
      const token =
        localStorage.getItem("token");

      await axios.post(
        "/api/bot-settings",
        settings,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Configuración guardada");
    } catch (err) {
      console.error(err);
      alert("Error guardando configuración");
    }
  };

  return (
    <div className="container mt-4">

      <div className="card shadow">

        <div className="card-header">
          <h4>
            ⚙️ Configuración Bot
          </h4>
        </div>

        <div className="card-body">

          {/* SYMBOL */}
          <div className="mb-3">
            <label className="form-label">
              Símbolo
            </label>

            <select
              className="form-select"
              name="symbol"
              value={settings.symbol}
              onChange={handleChange}
            >
              <option value="R_10">
                Volatility 10
              </option>

              <option value="R_25">
                Volatility 25
              </option>

              <option value="R_50">
                Volatility 50
              </option>

              <option value="R_75">
                Volatility 75
              </option>

              <option value="R_100">
                Volatility 100
              </option>
            </select>
          </div>

          {/* STRATEGY */}
          <div className="mb-3">
            <label className="form-label">
              Estrategia
            </label>

            <select
              className="form-select"
              name="strategy"
              value={settings.strategy}
              onChange={handleChange}
            >
              <option value="sma">
                SMA
              </option>

              <option value="liquidity">
                Liquidity
              </option>

              <option value="syntheticPro">
                Synthetic Pro
              </option>
            </select>
          </div>

          {/* STAKE */}
          <div className="mb-3">
            <label className="form-label">
              Stake Inicial
            </label>

            <input
              type="number"
              className="form-control"
              name="stake"
              value={settings.stake}
              onChange={handleChange}
            />
          </div>

          {/* TAKE PROFIT */}
          <div className="mb-3">
            <label className="form-label">
              Take Profit
            </label>

            <input
              type="number"
              className="form-control"
              name="targetProfit"
              value={settings.targetProfit}
              onChange={handleChange}
            />
          </div>

          {/* STOP LOSS */}
          <div className="mb-3">
            <label className="form-label">
              Stop Loss
            </label>

            <input
              type="number"
              className="form-control"
              name="stopLoss"
              value={settings.stopLoss}
              onChange={handleChange}
            />
          </div>

          {/* MAX DRAWDOWN */}
          <div className="mb-3">
            <label className="form-label">
              Max Drawdown
            </label>

            <input
              type="number"
              className="form-control"
              name="maxDrawdown"
              value={settings.maxDrawdown}
              onChange={handleChange}
            />
          </div>

          <button
            className="btn btn-primary"
            onClick={handleSave}
          >
            Guardar Configuración
          </button>

        </div>
      </div>
    </div>
  );
}