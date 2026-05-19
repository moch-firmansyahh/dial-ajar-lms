import React from "react";
import logoImg from "../assets/logo.png";
import "./LoadingSpinner.css";

export default function LoadingSpinner({ message = "Memuat...", fullPage = false }) {
  return (
    <div className={`loading-spinner-container ${fullPage ? "full-page" : ""}`}>
      <div className="logo-loading-box">
        <img src={logoImg} alt="LeMaS Logo" className="logo-loading-img" />
      </div>
      {message && <p className="loading-spinner-message">{message}</p>}
    </div>
  );
}
