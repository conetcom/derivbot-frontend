import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AccountSelector from "../components/dashboard/AccountSelector";

export default function BotSettings() {

  const navigate = useNavigate();

  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);

  const [settings, setSettings] = useState({
    symbol: "R_75",
    strategy: "sma",
    stake: 1,
    targetProfit: 10,
    stopLoss: 10,
    maxDrawdown: 20
  });

  // =========================
  // CUENTAS
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
        setSelectedAccount(res.data[0]);
      }

    } catch (err) {
      console.error(err);
    }
  };

  // =========================
  // CONFIG
  // =========================

  const fetchBotSettings = async () => {
    try {

      const token =
        localStorage.getItem("token");

      const res = await axios.get(
        "/api/bot-settings",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (res.data) {
        setSettings(res.data);
      }

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAccounts();
    fetchBotSettings();
  }, []);

  // =========================
  // HANDLERS
  // =========================

  const handleChange = (e) => {

    const { name, value } = e.target;

    setSettings(prev => ({
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
        {
          ...settings,
          accountId: selectedAccount?.id
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Configuración guardada");

      navigate("/dashboard");

    } catch (err) {

      console.error(err);

      alert(
        "Error guardando configuración"
      );
    }
  };

  return (

    <div className="container mt-4">

      <div className="card shadow">

        <div className="card-header">
          <h4>⚙️ Configuración Bot</h4>
        </div>

        <div className="card-body">

          {/* CUENTA DERIV */}
          <div className="mb-4">

            <h5 className="mb-3">
              💳 Cuenta Deriv
            </h5>

            <AccountSelector
              accounts={accounts}
              selectedAccount={selectedAccount}
              setSelectedAccount={setSelectedAccount}
            />

          </div>

          <hr />

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
              <option value="R_10">Volatility 10</option>
              <option value="R_25">Volatility 25</option>
              <option value="R_50">Volatility 50</option>
              <option value="R_75">Volatility 75</option>
              <option value="R_100">Volatility 100</option>
            </select>

          </div>

          {/* resto de campos */}

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