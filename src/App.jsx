import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ConnectDeriv from "./pages/ConnectDeriv";
import BotSettings from "./pages/BotSettings";//comentario se cambio el nombre del archivo login por Login 

function App() {
  return (
    <Router>
      <Routes>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />  {/* 👈 ESTA FALTA */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/connect-deriv" element={<ConnectDeriv />} />

        {/* opcional: ruta raíz */}
        <Route path="/" element={<Login />} />
        <Route  path="/bot-settings"  element={<BotSettings />}
/>
      </Routes>
    </Router>
  );
}

export default App;