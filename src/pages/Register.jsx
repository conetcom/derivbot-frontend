import { useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔍 validación básica
    if (!form.name || !form.email || !form.password) {
      alert("Todos los campos son obligatorios");
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/register", form);

      alert("✅ Usuario registrado");

      // 🚀 redirigir a login
      navigate("/connectDeriv");

    } catch (err) {
      console.error(err);
      alert("❌ Error al registrar usuario");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "20px" }}>
      <h2>📝 Registro</h2>

      <form onSubmit={handleSubmit}>

        <input
          placeholder="Nombre"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <br /><br />

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <br /><br />

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <br /><br />

        <button type="submit" disabled={loading}>
          {loading ? "Registrando..." : "Registrarse"}
        </button>
      </form>

      <br />

      {/* 🔗 ir a login */}
      <p>
        ¿Ya tienes cuenta?{" "}
        <Link to="/login">
          Iniciar sesión
        </Link>
      </p>
    </div>
  );
}