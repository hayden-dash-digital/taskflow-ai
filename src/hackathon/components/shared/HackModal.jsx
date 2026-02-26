/* HackModal.jsx — modal wrapper from hackathon-v9.jsx */
import React from "react";

export default function HackModal({ children, onClose, t, width = 600 }) {
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 999, backdropFilter: "blur(6px)", animation: "hackFadeIn 0.15s",
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: t.mod, borderRadius: 18, width, maxHeight: "85vh",
        overflow: "auto", boxShadow: "0 24px 60px rgba(0,0,0,0.3)",
        border: `1px solid ${t.cb}`, animation: "modalIn 0.2s ease",
      }}>
        {children}
      </div>
    </div>
  );
}
