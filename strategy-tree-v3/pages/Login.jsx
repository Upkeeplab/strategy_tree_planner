import React, { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import Header from "../src/components/Header";
import Footer from "../src/components/Footer";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { user, login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/plans";

  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to={from} replace />;

  async function submit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await (mode === "login" ? login : register)(username, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  const isLogin = mode === "login";

  return (
    <>
      <Header />
      <div className="auth-page">
        <form className="auth-card" onSubmit={submit}>
          <h2>{isLogin ? "Log in" : "Create an account"}</h2>

          <label>
            Username
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={isLogin ? "current-password" : "new-password"}
              required
            />
          </label>

          {error && <p className="auth-error" role="alert">{error}</p>}

          <button type="submit" className="btn-primary" disabled={busy}>
            {isLogin ? "Log in" : "Create account"}
          </button>

          <p>
            {isLogin ? "No account yet? " : "Already have an account? "}
            <button
              type="button"
              className="link-btn"
              onClick={() => { setMode(isLogin ? "register" : "login"); setError(""); }}
            >
              {isLogin ? "Create one" : "Log in"}
            </button>
          </p>
          <p><Link to="/" style={{ fontSize: 15 }}>Continue as guest</Link></p>
        </form>
      </div>
      <Footer />
    </>
  );
}
