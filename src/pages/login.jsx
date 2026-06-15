import { useState } from "react";
import { login } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // 🔐 LOGIN
      const res = await login(form);

      // guardar token
      const user = userRes.data;

localStorage.setItem(
  "user",
  JSON.stringify(user)
);
      
      // 🔥 consultar usuario logueado
      const userRes = await api.get(
        "/api/users/me",
        {
          headers: {
            Authorization: `Bearer ${res.token}`,
          },
        }
      );

      const user = userRes.data;

      console.log("USER:", user);

      // ✅ VALIDAR SI TIENE TOKEN DERIV
      if (user.hasDerivAccount === true) {
        navigate("/dashboard");
      } else {
        navigate("/connect-deriv");
      }

    } catch (err) {
      console.error(err);
      alert("❌ Credenciales incorrectas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "auto",
        padding: "20px",
      }}
    >
      <h2>🔐 Login</h2>

      <form onSubmit={handleLogin}>

        <input
          type="email"
          placeholder="Email"
          required
          value={form.email}
          onChange={(e) =>
            setForm({
              ...form,
              email: e.target.value,
            })
          }
        />

        <br /><br />

        <input
          type="password"
          placeholder="Password"
          required
          value={form.password}
          onChange={(e) =>
            setForm({
              ...form,
              password: e.target.value,
            })
          }
        />

        <br /><br />

        <button type="submit" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <br />

      <p>
        ¿No tienes cuenta?{" "}
        <Link to="/register">
          Registrarse
        </Link>
      </p>
    </div>
  );
}