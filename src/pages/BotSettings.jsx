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
      console.log("DATOS", res);

      

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

      setSettings({
        symbol: res.data.symbol,
        strategy: res.data.strategy,
        stake: res.data.stake,
        targetProfit: res.data.target_profit,
        stopLoss: res.data.stop_loss,
        maxDrawdown: res.data.max_drawdown,
        deriv_account:
          res.data.account_id
      });

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

    if (!selectedAccount) {
      alert("Debes seleccionar una cuenta");
      return;
    }

    const payload = {
      symbol: settings.symbol,
      strategy: settings.strategy,
      stake: settings.stake,
      targetProfit: settings.targetProfit,
      stopLoss: settings.stopLoss,
      maxDrawdown: settings.maxDrawdown,

      // Cuenta Deriv real
      deriv_account: selectedAccount.account_id
    };

    console.log(
      "💾 Cuenta seleccionada:",
      selectedAccount
    );

    console.log(
      "📤 Payload:",
      payload
    );

    const token =
      localStorage.getItem("token");

    await axios.post(
      "/api/bot-settings",
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    alert(
      "Configuración guardada correctamente"
    );

    navigate("/dashboard");

  } catch (err) {

    console.error(
      "Error guardando configuración:",
      err
    );

    alert(
      err.response?.data?.error ||
      "Error guardando configuración"
    );
  }
};
useEffect(() => {

  if (
    accounts.length > 0 &&
    settings.deriv_account
  ) {

    const account = accounts.find(
  a =>
    a.account_id ===
    settings.deriv_account
);

  if (account) {
  setSelectedAccount(account);
  setBalance(
    Number(account.balance || 0)
  );
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
         <div className="card mb-3">
  <div className="card-body text-center">
    <h6>💰 Balance</h6>

    <h3 className="text-success">
      {selectedAccount?.currency || "USD"}{" "}
      {Number(balance || 0).toFixed(2)}
    </h3>
  </div>
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