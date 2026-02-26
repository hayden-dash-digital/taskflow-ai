/* Celebration.jsx — confetti + cheer text */
import React, { useEffect } from "react";

export default function Celebration({ text, onDone }) {
  useEffect(() => {
    const id = setTimeout(onDone, 2500);
    return () => clearTimeout(id);
  }, []);

  const particles = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    x: 50 + (Math.random() - 0.5) * 60,
    color: ["#5B4AE4", "#EC4899", "#F97316", "#22C55E", "#3B82F6", "#EAB308", "#A855F7", "#EF4444"][i % 8],
    delay: Math.random() * 0.3,
    size: 4 + Math.random() * 6,
  }));

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, pointerEvents: "none", display: "flex", alignItems: "center", justifyContent: "center", animation: "celebFade 2.5s ease forwards" }}>
      {particles.map((p) => (
        <div key={p.id} style={{ position: "absolute", left: `${p.x}%`, top: "45%", width: p.size, height: p.size, borderRadius: p.id % 3 === 0 ? "50%" : "1px", background: p.color, animation: `confettiFall 1.8s ease-out ${p.delay}s both` }} />
      ))}
      <div style={{ fontSize: 28, fontWeight: 700, color: "#5B4AE4", textShadow: "0 2px 20px rgba(91,74,228,0.3)", animation: "cheerPop 0.4s cubic-bezier(0.175,0.885,0.32,1.275) both", fontFamily: "'DM Sans',sans-serif" }}>{text}</div>
    </div>
  );
}
