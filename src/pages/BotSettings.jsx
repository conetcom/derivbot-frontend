import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AccountSelector from "../components/dashboard/AccountSelector";

export default function BotSettings() {

  const navigate = useNavigate();
 const [balance, setBalance] = useState(0);
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);

  const [settings, setSettings] = useState({
    symbol: "R_75",
    strategy: "sma",
    stake: 1,
    targetProfit: 10,
    stopLoss: 10,
    maxDrawdown: 20,
    deriv_account: null
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
        deriv_account:
          selectedAccount?.id
      },
      {
        headers: {
          Authorization:
            `Bearer ${token}`
        }
      }
    );

    alert(
      "Configuración guardada"
    );

    navigate("/dashboard");

  } catch (err) {

    console.error(err);

    alert(
      "Error guardando configuración"
    );
  }
};
useEffect(() => {

  if (
    accounts.length > 0 &&
    settings.deriv_account
  ) {

    const account =
      accounts.find(
        a =>
          Number(a.id) ===
          Number(
            settings.deriv_account
          )
      );

    if (account) {
      setSelectedAccount(account);
    }
  }

}, [
  accounts,
  settings.deriv_account
]);

return (
  <div className="container mt-4">

    <div className="row">

      {/* COLUMNA IZQUIERDA */}
      <div className="col-lg-4">

        <div className="card shadow mb-4">

          <div className="card-header">
            <h5 className="mb-0">
              💳 Cuenta Deriv
            </h5>
          </div>
          <div className="col-lg-4">
              <Metrics
                balance={balance}
               
              />
            </div>

          <div className="card-body">

           <AccountSelector
           accounts={accounts}
           selectedAccount={selectedAccount}
           setSelectedAccount={setSelectedAccount}
          setBalance={setBalance}
          />

          </div>

        </div>

      </div>

      {/* COLUMNA DERECHA */}
      <div className="col-lg-8">

        <div className="card shadow">

          <div className="card-header">
            <h4 className="mb-0">
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
                <option value="R_10">Volatility 10</option>
                <option value="R_25">Volatility 25</option>
                <option value="R_50">Volatility 50</option>
                <option value="R_75">Volatility 75</option>
                <option value="R_100">Volatility 100</option>
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
                <option value="sma">SMA</option>
                <option value="liquidity">Liquidity</option>
                <option value="syntheticPro">Synthetic Pro</option>
              </select>
            </div>

            {/* FILA 1 */}
            <div className="row">

              <div className="col-md-6 mb-3">
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

              <div className="col-md-6 mb-3">
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

            </div>

            {/* FILA 2 */}
            <div className="row">

              <div className="col-md-6 mb-3">
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

              <div className="col-md-6 mb-3">
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

            </div>

            <div className="d-flex justify-content-end">

              <button
                className="btn btn-success"
                onClick={handleSave}
              >
                💾 Guardar Configuración
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>

  </div>
);
  
}