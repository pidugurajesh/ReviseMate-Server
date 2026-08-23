import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { buttonPrimary, cardStyle, inputStyle, labelStyle } from "../utils/styles";

export default function AuthPage({ isRegister = false }) {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const path = isRegister ? "/auth/register" : "/auth/login";
      const { data } = await api.post(path, form);
      login(data.token, data.user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Authentication failed");
    }
  };

  return (
    <div className="min-h-screen grid place-items-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.22),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(6,182,212,0.18),transparent_35%),radial-gradient(circle_at_50%_100%,rgba(217,70,239,0.2),transparent_40%)]" />
      <form onSubmit={submit} className={`${cardStyle} w-full max-w-md space-y-3 p-6 relative z-10`}>
        <div>
          <p className="text-xs uppercase tracking-wide text-indigo-600 dark:text-indigo-300 font-semibold">ReviseMate</p>
          <h1 className="text-2xl font-bold mt-1">{isRegister ? "Create your account" : "Welcome back"}</h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {isRegister ? "Start planning and revising smarter." : "Continue your study streak today."}
          </p>
        </div>
        {isRegister && (
          <div className="space-y-1">
            <p className={labelStyle}>Username</p>
            <input
              className={inputStyle}
              placeholder="Your username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
          </div>
        )}
        <div className="space-y-1">
          <p className={labelStyle}>Email</p>
          <input
            className={inputStyle}
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div className="space-y-1">
          <p className={labelStyle}>Password</p>
          <input
            className={inputStyle}
            placeholder="••••••••"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button className={`${buttonPrimary} w-full py-2`}>
          {isRegister ? "Create account" : "Login"}
        </button>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          {isRegister ? "Already have an account?" : "New here?"}{" "}
          <NavLink to={isRegister ? "/login" : "/register"} className="text-indigo-600 font-semibold hover:underline">
            Switch
          </NavLink>
        </p>
      </form>
    </div>
  );
}
