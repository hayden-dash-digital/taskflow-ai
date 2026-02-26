/* HackAvatar.jsx — Av component from hackathon-v9.jsx */
import React from "react";

export default function HackAvatar({ user, size = 26, style = {} }) {
  if (!user) return null;
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", background: user.color,
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      color: "#fff", fontSize: size * 0.37, fontWeight: 700,
      fontFamily: "'Space Mono',monospace", flexShrink: 0, position: "relative", ...style,
    }}>
      {user.initials}
      {user.online && (
        <div style={{
          position: "absolute", bottom: -1, right: -1,
          width: Math.max(6, size * 0.25), height: Math.max(6, size * 0.25),
          borderRadius: "50%", background: "#22C55E",
          border: "2px solid var(--ring,#16161E)",
        }} />
      )}
    </div>
  );
}
