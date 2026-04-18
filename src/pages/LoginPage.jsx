import { useState } from "react";
import "../Login.css"; // Pastikan file CSS sudah di-import

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    // Validasi Sederhana
    if (!email || !password) {
      setError("Email dan Password wajib diisi");
      return;
    }

    if (password.length < 8) {
      setError("Password minimal harus 8 karakter");
      return;
    }

    setError("");
    console.log("Login attempt with:", { email, password });
    // Di sini Anda akan memanggil API login nantinya
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>TaskHub Login</h2>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Masukkan email Anda"
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

          {error && <p style={{ color: "red", fontSize: "13px" }}>{error}</p>}

          <button type="submit" className="btn-login">
            Masuk
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Belum punya akun? <a href="/register">Daftar Sekarang</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
