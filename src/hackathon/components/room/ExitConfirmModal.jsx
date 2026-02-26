/* ExitConfirmModal.jsx — "Leave the room?" dialog */
import React from "react";

export default function ExitConfirmModal({ t, onYes, onNo }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999, backdropFilter: "blur(4px)" }}>
      <div style={{ background: t.mod, borderRadius: 18, padding: "30px 34px", width: 400, textAlign: "center", boxShadow: "0 24px 60px rgba(0,0,0,0.25)", border: `1px solid ${t.cb}`, animation: "modalIn 0.2s" }}>
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Leave the room?</div>
        <p style={{ fontSize: 14, color: t.ts, marginBottom: 22 }}>The hackathon is still live. You can rejoin anytime.</p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <button onClick={onNo} style={{ padding: "10px 22px", borderRadius: 10, border: `1px solid ${t.ibr}`, background: "transparent", color: t.ts, fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>Stay</button>
          <button onClick={onYes} style={{ padding: "10px 22px", borderRadius: 10, border: "none", background: "#EF4444", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Leave</button>
        </div>
      </div>
    </div>
  );
}
