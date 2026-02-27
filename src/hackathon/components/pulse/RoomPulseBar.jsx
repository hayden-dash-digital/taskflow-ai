/* RoomPulseBar.jsx — Inline Team Vibe bar for hackathon room header */
import React from "react";
import usePulseStore from "../../stores/pulseStore";
import { MOODS } from "../../constants";

export default function RoomPulseBar({ t }) {
  const store = usePulseStore();
  const todayPulses = store.getTodayPulses();
  const todayAvg = store.getTodayAvg();
  const todayMoodObj = MOODS[Math.round(todayAvg) - 1] || MOODS[2];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        padding: "12px 16px",
        borderRadius: 12,
        background: t.ib,
      }}
    >
      {/* Label */}
      <span
        style={{
          fontSize: 11,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          color: t.tm,
          marginRight: 8,
        }}
      >
        Team Vibe
      </span>

      {/* User chips */}
      {todayPulses.map((user) => (
        <div
          key={user.id}
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
            padding: "4px 10px",
            borderRadius: 8,
            background: t.card,
            border: `1px solid ${t.cb}`,
          }}
        >
          {/* Avatar circle with initials */}
          <div
            style={{
              width: 20,
              height: 20,
              borderRadius: "50%",
              background: user.color,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 8,
              fontWeight: 700,
              fontFamily: "'Space Mono',monospace",
              flexShrink: 0,
            }}
          >
            {user.avatar}
          </div>
          {/* Mood emoji or dash */}
          {user.pulse ? (
            <span style={{ fontSize: 16, lineHeight: 1 }}>
              {user.mood ? user.mood.emoji : "—"}
            </span>
          ) : (
            <span style={{ fontSize: 11, color: t.tm }}>—</span>
          )}
        </div>
      ))}

      {/* Right side: avg */}
      <div
        style={{
          marginLeft: "auto",
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <span style={{ fontSize: 11, color: t.tm }}>Avg</span>
        <span style={{ fontSize: 20, lineHeight: 1 }}>
          {todayMoodObj.emoji}
        </span>
        <span
          style={{
            fontSize: 14,
            fontWeight: 800,
            fontFamily: "'Space Mono',monospace",
            color: todayMoodObj.color,
          }}
        >
          {todayAvg ? todayAvg.toFixed(1) : "—"}
        </span>
      </div>
    </div>
  );
}
