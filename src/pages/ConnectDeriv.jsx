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

      const res = await api.post(
        "/deriv/connect",
        {
          token,
          account_id: accountId,
          account_name: accountName
        }
      );

      console.log(res.data);

      alert("✅ Cuenta conectada");

      navigate("/dashboard");

    } catch (err) {

      console.error(err);

      alert(
        err.response?.data?.error ||
        "Error conectando"
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
        placeholder="Account ID (DOT123456)"
        value={accountId}
        onChange={(e) =>
          setAccountId(e.target.value)
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