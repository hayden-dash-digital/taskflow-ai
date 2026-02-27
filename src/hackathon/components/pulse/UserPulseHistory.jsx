/* UserPulseHistory.jsx — expanded 14-day detail view for a single user */
import React from "react";
import { MOODS } from "../../constants";

export default function UserPulseHistory({ t, user, history }) {
  // Compute per-day pulse for this specific user
  const userHistory = history.map((day) => {
    const userPulse = day.pulses.find((p) => p.userId === user.id);
    const value = userPulse ? userPulse.value : null;
    const mood = value ? MOODS[value - 1] : null;
    return { ...day, value, mood };
  });

  return (
    <div
      style={{
        padding: "20px 22px",
        borderRadius: 14,
        background: user.color + "06",
        border: `1px solid ${user.color}20`,
        animation: "insightSlide 0.3s ease both",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 16,
        }}
      >
        {/* Avatar */}
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${user.color}, ${user.color}CC)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 10,
            fontWeight: 700,
            color: "#fff",
            flexShrink: 0,
          }}
        >
          {user.avatar}
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: t.text }}>{user.name}</div>
          <div style={{ fontSize: 11, color: t.tm }}>{user.role} · 14-day history</div>
        </div>
      </div>

      {/* 14-day bars */}
      <div style={{ display: "flex", alignItems: "flex-end", gap: 0 }}>
        {userHistory.map((day, i) => {
          const barHeight = day.value ? (day.value / 5) * 40 : 0;
          const moodColor = day.mood ? day.mood.color : t.tm;

          return (
            <div
              key={i}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 3,
              }}
            >
              {/* Emoji */}
              <span style={{ fontSize: 12, lineHeight: 1 }}>
                {day.mood ? day.mood.emoji : "·"}
              </span>

              {/* Bar */}
              <div
                style={{
                  width: "100%",
                  height: barHeight,
                  borderRadius: 3,
                  background: day.mood
                    ? `linear-gradient(to top, ${moodColor}60, ${moodColor}25)`
                    : t.cb,
                  transition: "height 0.3s ease",
                }}
              />

              {/* Day label */}
              <span
                style={{
                  fontSize: 8,
                  fontFamily: "'Space Mono', monospace",
                  color: t.tm,
                  lineHeight: 1,
                }}
              >
                {day.short.slice(0, 2)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
