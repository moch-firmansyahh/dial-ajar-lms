import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { login } from "../api/auth.api";
import InputField from "../components/ui/InputField";
import Button from "../components/ui/Button";

import { User, Lock, LogIn } from 'lucide-react';

const Login = () => {
  const [role, setRole] = useState("MAHASISWA");
  const [nomorInduk, setNomorInduk] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login: setLoginState } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await login({ nomorInduk, password, role });
      setLoginState(response.data.token, response.data.user, rememberMe);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Login gagal. Periksa kembali kredensial Anda.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col p-6 sm:p-8 md:p-10 bg-[#F0F8FF] font-sans text-slate-800 overflow-y-auto">
      
      {/* Header / Brand */}
      <div className="w-full flex justify-center md:justify-start shrink-0 mb-6 md:mb-0">
        <div className="flex flex-col">
          <h1 className="text-2xl font-medium tracking-tight text-slate-900 mb-2">
            Dial Ajar
          </h1>
          <div className="w-12 h-0.5 bg-slate-300"></div>
        </div>
      </div>

      {/* Center Wrapper */}
      <div className="flex-1 flex items-center justify-center w-full py-6 shrink-0">
        {/* Login Card */}
        <div className="w-full max-w-[440px] bg-white rounded-[28px] shadow-[0_12px_40px_rgba(0,0,0,0.04)] p-6 sm:p-10 z-10">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-medium text-slate-900 mb-2">
              Dial Ajar
            </h2>
            <p className="text-[13px] sm:text-[14px] text-slate-500 font-medium leading-relaxed">
              Masukan Nomor Induk dan password yang sesuai untuk <br className="hidden sm:block" />
              masuk ke dalam akun LMS
            </p>
          </div>

          {/* Role Toggle */}
          <div className="relative flex p-1.5 bg-slate-50 rounded-xl mb-6 border border-slate-100">
            <div
              className={`absolute top-1.5 bottom-1.5 left-1.5 w-[calc(50%-6px)] bg-white rounded-lg shadow-sm border border-slate-200/60 transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                role === "MAHASISWA" ? "translate-x-0" : "translate-x-full"
              }`}
            />
            
            <button
              type="button"
              onClick={() => setRole("MAHASISWA")}
              className={`relative flex-1 py-2.5 text-[13px] font-medium z-10 transition-colors duration-300 ${
                role === "MAHASISWA"
                  ? "text-slate-900"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              Mahasiswa
            </button>
            <button
              type="button"
              onClick={() => setRole("DOSEN")}
              className={`relative flex-1 py-2.5 text-[13px] font-medium z-10 transition-colors duration-300 ${
                role === "DOSEN"
                  ? "text-slate-900"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              Dosen
            </button>
          </div>

          {error && (
            <div className="mb-6 p-3.5 bg-red-50 text-red-600 text-[13px] rounded-xl border border-red-100 font-semibold text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">
            <InputField
              label={role === "DOSEN" ? "NIP Dosen" : "NIM Mahasiswa"}
              placeholder={`Masukkan ${role === "DOSEN" ? "NIP" : "NIM"} Anda`}
              value={nomorInduk}
              onChange={(e) => setNomorInduk(e.target.value)}
              required
              icon={User}
              className="!rounded-xl !py-2.5 sm:!py-3 !text-[13px] sm:!text-[14px]"
            />
            <InputField
              label="Kata Sandi"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              icon={Lock}
              className="!rounded-xl !py-2.5 sm:!py-3 !text-[13px] sm:!text-[14px]"
            />

            <div className="flex items-center pt-1 pb-3">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 appearance-none border border-slate-300 rounded-[4px] checked:bg-[#93C5FD] checked:border-[#93C5FD] transition-colors cursor-pointer"
                  />
                  {rememberMe && (
                    <svg
                      className="w-3 h-3 text-white absolute pointer-events-none"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  )}
                </div>
                <span className="text-[12px] sm:text-[13px] font-semibold text-slate-600 group-hover:text-slate-800 transition-colors">
                  Tetap login di perangkat ini
                </span>
              </label>
            </div>

            <Button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 sm:py-3.5 text-[14px] sm:text-[15px] font-medium rounded-xl transition-all duration-300 !bg-[#BFDBFE] hover:!bg-[#93C5FD] !text-blue-950 border border-blue-200/50 shadow-sm"
              disabled={loading}
            >
              {loading ? (
                "Memproses..."
              ) : (
                <>
                  <LogIn size={18} /> Sign in
                </>
              )}
            </Button>
          </form>
        </div>
      </div>

      {/* Footer Links */}
      <div className="w-full flex flex-col items-center gap-3 shrink-0 mt-2">
        <div className="flex items-center justify-center gap-4 sm:gap-5 text-[12px] sm:text-[13px] font-medium text-slate-500">
          <Link to="/bantuan" className="hover:text-slate-800 transition-colors">
            Bantuan
          </Link>
          <span className="text-slate-300">|</span>
          <Link to="/faq" className="hover:text-slate-800 transition-colors">
            FAQ
          </Link>
          <span className="text-slate-300">|</span>
          <Link to="/service" className="hover:text-slate-800 transition-colors">
            Service
          </Link>
        </div>
        <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium mt-1">
          Copyright @wework 2026 | Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default Login;
