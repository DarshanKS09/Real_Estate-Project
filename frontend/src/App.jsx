import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AgentDashboard from "./pages/AgentDashboard";
import Home from "./pages/Home";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        {/* Dashboards */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/agent/dashboard" element={<AgentDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
