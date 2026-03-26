import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE, setToken } from "@/lib/auth";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_BASE}/api/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        setToken(data.token);
        navigate("/admin");
      } else {
        alert(data.message || "Invalid login");
      }

    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <form
        onSubmit={handleLogin}
        className="bg-white p-10 rounded-xl shadow-lg w-[350px]"
      >

        <h2 className="text-2xl font-bold mb-6 text-center">
          Admin Login
        </h2>

        {/* USERNAME */}
        <input
          type="text"
          placeholder="Username"
          className="w-full border p-3 mb-4 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        {/* PASSWORD */}
        <input
          type="password"
          placeholder="Password"
          className="w-full border p-3 mb-6 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* BUTTON */}
        <button
          type="submit"
          className="w-full bg-green-700 text-white py-3 rounded hover:bg-green-800 transition"
        >
          Login
        </button>

      </form>

    </div>
  );
};

export default AdminLogin;