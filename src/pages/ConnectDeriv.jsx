import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function ConnectDeriv() {
  const [accountName, setAccountName] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleConnect = async () => {

    try {

      setLoading(true);

     const res= await api.post("/deriv/connect", {
  token,
  account_name: accountName
});
    

      console.log("DERIV:", res.data);

      alert("✅ Conectado a Deriv");

      // 🔥 ir al dashboard
      navigate("/dashboard");

    } catch (err) {

      console.error(err);

      alert("❌ Error conectando");

    } finally {

      setLoading(false);

    }
  };

  return (
    <div style={{ padding: 20 }}>

      <h2>🔗 Conectar Deriv</h2>
      <input
  type="text"
  placeholder="Nombre cuenta"
  value={accountName}
  onChange={(e) => setAccountName(e.target.value)}
/>

      <input
        type="text"
        placeholder="Pega tu token de Deriv"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        style={{
          width: "350px",
          padding: "10px",
        }}
      />

      <br /><br />

      <button
        onClick={handleConnect}
        disabled={loading}
      >
        {loading ? "Conectando..." : "Conectar"}
      </button>

    </div>
  );
}