import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../Login.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const tanggalHariIni = new Date().toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Email dan password wajib diisi");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await api.post("/login", { email, password });
      localStorage.setItem("token", response.data.access_token);

      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login gagal, coba lagi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <p className="tanggal">{tanggalHariIni}</p>
        <h2>TaskHub+ Login</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Masukkan email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="error-msg">{error}</p>}
          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </form>
        <div className="auth-footer">
          <p>
            Belum punya akun? <Link to="/register">Daftar Sekarang</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
