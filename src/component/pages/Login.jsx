import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function Login() {
  const navigate = useNavigate();
  const [role, setRole]         = useState(null);
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const handleLogin = async () => {
    setError("");
    if (!email || !password) { setError("Please enter email and password"); return; }
    setLoading(true);
    try {
      const data = await api.login(email, password);
      if (!data.token) { setError(data.message || "Invalid credentials"); setLoading(false); return; }
      localStorage.setItem("token", data.token);
      localStorage.setItem("role",  data.user.role);
      localStorage.setItem("user",  JSON.stringify(data.user));
      if (data.user.role === "admin")   { navigate("/admin");   return; }
      if (data.user.role === "manager") { navigate("/manager"); return; }
      if (data.user.role === "member")  { navigate("/member");  return; }
    } catch { setError("Server error. Please try again."); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-xl rounded-2xl p-10 w-96 text-center">
        {!role && (
          <>
            <h2 className="text-2xl font-bold mb-6">Select Dashboard</h2>
            <button onClick={() => setRole("admin")}   className="w-full bg-blue-500 text-white py-2 rounded mb-4">Admin Dashboard</button>
            <button onClick={() => setRole("manager")} className="w-full bg-green-500 text-white py-2 rounded mb-4">Manager Dashboard</button>
            <button onClick={() => setRole("member")}  className="w-full bg-purple-500 text-white py-2 rounded">Member Dashboard</button>
          </>
        )}
        {role && (
          <>
            <h2 className="text-2xl font-bold mb-6 capitalize">{role} Login</h2>
            {error && <p className="text-red-500 mb-3 text-sm">{error}</p>}
            <input type="email" placeholder="Email" className="w-full border p-2 rounded mb-4"
              value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" className="w-full border p-2 rounded mb-4"
              value={password} onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()} />
            <button onClick={handleLogin} disabled={loading}
              className="w-full bg-black text-white py-2 rounded mb-3 disabled:opacity-50">
              {loading ? "Logging in..." : "Login"}
            </button>
            <button onClick={() => { setRole(null); setEmail(""); setPassword(""); setError(""); }}
              className="text-sm text-gray-500">← Back</button>
          </>
        )}
      </div>
    </div>
  );
}
export default Login;
