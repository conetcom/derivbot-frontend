import { useState } from "react";
import api from "../services/api";

export default function ConnectDeriv() {
  const [token, setToken] = useState("");

  const handleConnect = async () => {
    try {
      await api.post("/deriv/connect", { token });
      alert("✅ Conectado a Deriv");
    } catch (err) {
      console.error(err);
      alert("❌ Error conectando");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>🔗 Conectar Deriv</h2>

      <input
        type="text"
        placeholder="Pega tu token de Deriv"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        style={{ width: "300px", padding: "10px" }}
      />

      <br /><br />

      <button onClick={handleConnect}>
        Conectar
      </button>
    </div>
  );
}