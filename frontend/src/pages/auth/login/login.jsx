import { useState } from "react";
import "./login.css";

function Login({ onLogin }) {
  const [role, setRole] = useState("Mahasiswa");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="login-main">
      {/* Background Elements */}
      <div className="bg-gradient-overlay"></div>
      <div className="circle-decoration-1"></div>
      <div className="circle-decoration-2"></div>

      <div className="login-container">
        {/* Logo & Branding */}
        <div className="brand-header">
          <div className="logo-box">
            <h1 className="logo-text"></h1>
          </div>
          <h2 className="welcome-text">Selamat Datang</h2>
          <p className="welcome-subtext">
            Silakan masuk ke Learning Management System Kelompok 8.
          </p>
        </div>

        {/* Login Card */}
        <div className="login-card">
          {/* Role Toggle */}
          <div className="role-toggle">
            <button
              onClick={() => setRole("Mahasiswa")}
              className={`role-button ${role === "Mahasiswa" ? "active" : ""}`}
            >
              Mahasiswa
            </button>
            <button
              onClick={() => setRole("Dosen")}
              className={`role-button ${role === "Dosen" ? "active" : ""}`}
            >
              Dosen
            </button>
          </div>

          <form
            className="login-form"
            onSubmit={(e) => {
              e.preventDefault();
              if (onLogin) {
                onLogin(role);
              }
            }}
          >
            {/* Input Field: Nomor Induk */}
            <div className="form-group">
              <label htmlFor="id_number">Nomor Induk</label>
              <div className="input-wrapper">
                <span className="material-symbols-outlined input-icon">
                  person
                </span>
                <input
                  className="input-field"
                  id="id_number"
                  placeholder="Contoh: 2106001234"
                  type="text"
                />
              </div>
            </div>

            {/* Input Field: Kata Sandi */}
            <div className="form-group">
              <div className="form-group-header">
                <label htmlFor="password">Kata Sandi</label>
                <a className="forgot-password" href="#">
                  Lupa sandi?
                </a>
              </div>
              <div className="input-wrapper">
                <span className="material-symbols-outlined input-icon">
                  lock
                </span>
                <input
                  className="input-field"
                  id="password"
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle"
                  type="button"
                >
                  <span className="material-symbols-outlined">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="remember-me">
              <input id="remember" type="checkbox" />
              <label htmlFor="remember">Tetap masuk di perangkat ini</label>
            </div>

            {/* Primary Button */}
            <button className="submit-button" type="submit">
              <span>Masuk</span>
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </form>
        </div>

        {/* Footer Links */}
        <div className="footer">
          <p className="footer-text">
            Belum memiliki akun?{" "}
            <a className="academic-admin-link" href="#">
              Hubungi Administrasi Akademik
            </a>
          </p>
          <div className="footer-links">
            <a href="#">Bantuan</a>
            <a href="#">Privasi</a>
            <a href="#">Syarat</a>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Login;
