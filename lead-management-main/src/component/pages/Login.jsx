import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {

  const navigate = useNavigate();

  const [role, setRole] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {

    setError("");

    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    // ADMIN LOGIN
    if (role === "admin" && email === "admin@gmail.com" && password === "1234") {
      localStorage.setItem("role", "admin");
      navigate("/admin");
      return;
    }

    // MANAGER LOGIN
    if (role === "manager" && email === "manager@gmail.com" && password === "1234") {
      localStorage.setItem("role", "manager");
      navigate("/manager");
      return;
    }

    // MEMBER LOGIN
    if (role === "member" && email === "member@gmail.com" && password === "1234") {
      localStorage.setItem("role", "member");
      navigate("/member");
      return;
    }

    setError("Invalid Credentials");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white shadow-xl rounded-2xl p-10 w-96 text-center">

        {!role && (
          <>
            <h2 className="text-2xl font-bold mb-6">Select Dashboard</h2>

            <button
              onClick={() => setRole("admin")}
              className="w-full bg-blue-500 text-white py-2 rounded mb-4"
            >
              Admin Dashboard
            </button>

            <button
              onClick={() => setRole("manager")}
              className="w-full bg-green-500 text-white py-2 rounded mb-4"
            >
              Manager Dashboard
            </button>

            <button
              onClick={() => setRole("member")}
              className="w-full bg-purple-500 text-white py-2 rounded"
            >
              Member Dashboard
            </button>
          </>
        )}

        {role && (
          <>
            <h2 className="text-2xl font-bold mb-6 capitalize">{role} Login</h2>

            {error && <p className="text-red-500 mb-3">{error}</p>}

            <input
              type="email"
              placeholder="Email"
              className="w-full border p-2 rounded mb-4"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full border p-2 rounded mb-4"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              onClick={handleLogin}
              className="w-full bg-black text-white py-2 rounded mb-3"
            >
              Login
            </button>

            <button
              onClick={() => {
                setRole(null);
                setEmail("");
                setPassword("");
                setError("");
              }}
              className="text-sm text-gray-500"
            >
              ← Back
            </button>
          </>
        )}

      </div>
    </div>
  );
}

export default Login;