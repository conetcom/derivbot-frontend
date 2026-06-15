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

// Guardar token
localStorage.setItem("token", res.token);

// 🔥 Consultar usuario logueado
const userRes = await api.get("/api/users/me", {
headers: {
Authorization: `Bearer ${res.token}`,
},
});

// Guardar usuario
const user = userRes.data;

localStorage.setItem(
"user",
JSON.stringify(user)
);

console.log("USER:", user);

// ✅ VALIDAR SI TIENE TOKEN DERIV
if (user.hasDerivAccount === true) {
navigate("/dashboard");
} else {
navigate("/connect-deriv");
}

} catch (error) {
console.error("Error en login:", error);

alert(
error?.response?.data?.message ||
"Error al iniciar sesión"
);
} finally {
setLoading(false);
}
};

return (
<div>
<form onSubmit={handleLogin}>
<input
type="email"
placeholder="Correo electrónico"
value={form.email}
onChange={(e) =>
setForm({
...form,
email: e.target.value,
})
}
/>

<input
type="password"
placeholder="Contraseña"
value={form.password}
onChange={(e) =>
setForm({
...form,
password: e.target.value,
})
}
/>

<button type="submit" disabled={loading}>
{loading ? "Ingresando..." : "Iniciar sesión"}
</button>

<p>
¿No tienes cuenta?{" "}
<Link to="/register">
Regístrate aquí
</Link>
</p>
</form>
</div>
);
}