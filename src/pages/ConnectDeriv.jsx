import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function ConnectDeriv() {

  const [accountName, setAccountName] = useState("");
  const [accountId, setAccountId] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

 const handleConnect = async () => {

  try {

    setLoading(true);

    console.log("TOKEN FRONT:", token);

    const res = await api.post(
      "/deriv/sync-accounts",
      {
        token,
        account_name: accountName
      }
    );

    console.log("RESPUESTA:", res.data);

    alert("✅ Cuenta conectada");

    navigate("/dashboard");

  } catch (err) {

    console.error(
      "ERROR COMPLETO:",
      err
    );

    console.error(
      "RESPONSE:",
      err.response?.data
    );

    alert(
      err.response?.data?.error ||
      err.message
    );

  } finally {

    setLoading(false);

  }
};
  return (
    <div style={{ padding: 20 }}>

      <h2>🔗 Conectar Deriv</h2>

      <input
        type="text"
        placeholder="Nombre de cuenta"
        value={accountName}
        onChange={(e) =>
          setAccountName(e.target.value)
        }
      />

      
      <br /><br />

      <input
        type="text"
        placeholder="PAT de Deriv"
        value={token}
        onChange={(e) =>
          setToken(e.target.value)
        }
        style={{
          width: "400px",
          padding: "10px"
        }}
      />

      <br /><br />

      <button
        onClick={handleConnect}
        disabled={loading}
      >
        {loading
          ? "Conectando..."
          : "Conectar"}
      </button>

    </div>
  );
}