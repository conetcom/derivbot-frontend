import { useState } from "react";
import { login } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";
// se cambio el nombvre del archivo

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      console.log("FORM:", form); // debug

      const res = await login(form);

      // 🔐 guardar token
      localStorage.setItem("token", res.token);

      // 🚀 redirigir
      navigate("/dashboard");

    } catch (err) {
      console.error(err);
      alert("❌ Credenciales incorrectas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "20px" }}>
      <h2>🔐 Login</h2>

      <form onSubmit={handleLogin}>

        <input
          type="email"
          placeholder="Email"
          required
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <br /><br />

        <input
          type="password"
          placeholder="Password"
          required
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <br /><br />

        <button type="submit" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <br />

      {/* 🔗 IR A REGISTRO */}
      <p>
        ¿No tienes cuenta?{" "}
        <Link to="/register">
          Registrarse
        </Link>
      </p>
    </div>
  );
}