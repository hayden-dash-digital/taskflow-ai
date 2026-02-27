/* QuickPulse.jsx — Slim prompt shown inside hackathon room if user hasn't checked in */
import React from "react";
import usePulseStore from "../../stores/pulseStore";
import { MOODS } from "../../constants";

export default function QuickPulse({ t }) {
  const pulseLogged = usePulseStore((s) => s.pulseLogged);
  const logPulse = usePulseStore((s) => s.logPulse);
  const hoverMood = usePulseStore((s) => s.hoverMood);
  const setHoverMood = usePulseStore((s) => s.setHoverMood);

  if (pulseLogged) return null;

  return (
    <div
      style={{
        background: `linear-gradient(135deg, ${t.acc}08, #818CF808)`,
        borderRadius: 16,
        padding: "18px 24px",
        marginBottom: 20,
        border: `1px solid ${t.acc}20`,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        animation: "fadeUp 0.4s 0.1s ease both",
      }}
    >
      {/* Left: icon + prompt */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        {/* Bolt SVG */}
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke={t.acc}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
        <span style={{ fontSize: 14, fontWeight: 600 }}>
          How's your energy right now?
        </span>
      </div>

      {/* Right: 5 mood buttons */}
      <div style={{ display: "flex", gap: 6 }}>
        {MOODS.map((m) => {
          const isHover = hoverMood === m.value;
          return (
            <button
              key={m.value}
              className="mood-btn"
              onClick={() => logPulse(m.value)}
              onMouseEnter={() => setHoverMood(m.value)}
              onMouseLeave={() => setHoverMood(null)}
              style={{
                width: 42,
                height: 42,
                borderRadius: 10,
                border: isHover
                  ? `2px solid ${m.color}50`
                  : "2px solid transparent",
                background: isHover ? m.color + "12" : "transparent",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 0,
                transition: "all 0.2s ease",
                fontFamily: "inherit",
              }}
            >
              <span style={{ fontSize: 22, lineHeight: 1 }}>{m.emoji}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
