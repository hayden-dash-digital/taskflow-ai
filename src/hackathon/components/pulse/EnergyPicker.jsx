/* EnergyPicker.jsx — Step 0: mood/energy selection */
import React from "react";
import usePulseStore from "../../stores/pulseStore";
import { MOODS } from "../../constants";

export default function EnergyPicker({ t }) {
  const { logPulse, hoverMood, setHoverMood } = usePulseStore();

  return (
    <div style={{ animation: "fadeUp 0.3s ease both" }}>
      <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 4 }}>
        How are you feeling today?
      </div>
      <div style={{ fontSize: 13, color: t.tm, marginBottom: 20 }}>
        Tap your energy level
      </div>
      <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
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
                width: 52,
                height: 52,
                borderRadius: 14,
                border: isHover
                  ? `2px solid ${m.color}50`
                  : `2px solid transparent`,
                background: isHover ? m.color + "12" : "transparent",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                padding: 0,
                transition: "all 0.2s ease",
                fontFamily: "inherit",
              }}
            >
              <span style={{ fontSize: 26, lineHeight: 1 }}>{m.emoji}</span>
              <span
                style={{
                  fontSize: 9,
                  color: t.tm,
                  fontWeight: 500,
                }}
              >
                {m.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
