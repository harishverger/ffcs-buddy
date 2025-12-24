import React from "react";

export default function ClashAlert({ message, onClose }) {
  if (!message) return null;

  return (
    <div className="clash-alert-overlay" onClick={onClose}>
      <div className="clash-alert-box" onClick={(e) => e.stopPropagation()}>
        <div className="clash-alert-icon">✕</div>
        <h3 className="clash-alert-title">⚠️ Clash Detected!</h3>
        <p className="clash-alert-message">{message}</p>
        <button className="clash-alert-close" onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  );
}
