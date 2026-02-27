/* IndividualTrends.jsx — 5 team member cards with sparklines, click to expand */
import React from "react";
import usePulseStore from "../../stores/pulseStore";
import { PULSE_USERS } from "../../mockData";
import { MOODS } from "../../constants";
import UserPulseHistory from "./UserPulseHistory";

export default function IndividualTrends({ t }) {
  const { expandUser, setExpandUser, history } = usePulseStore();

  // Compute 7-day data per user
  const last7 = history.slice(-7);

  const userCards = PULSE_USERS.map((user) => {
    const values = last7.map((day) => {
      const p = day.pulses.find((p) => p.userId === user.id);
      return p ? p.value : 3;
    });
    const avg = values.reduce((s, v) => s + v, 0) / values.length;
    const avgMood = MOODS[Math.round(avg) - 1];
    return { ...user, values, avg, avgMood };
  });

  const selectedUser = expandUser
    ? PULSE_USERS.find((u) => u.id === expandUser)
    : null;

  return (
    <div
      style={{
        background: t.card,
        borderRadius: 18,
        padding: "24px 28px",
        border: `1px solid ${t.cb}`,
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: t.text, marginBottom: 4 }}>
          Individual Trends
        </div>
        <div style={{ fontSize: 12, color: t.tm }}>
          7-day energy patterns per team member
        </div>
      </div>

      {/* 5 user cards */}
      <div style={{ display: "flex", gap: 10 }}>
        {userCards.map((user) => {
          const isSelected = expandUser === user.id;

          return (
            <div
              key={user.id}
              className="hFloat"
              onClick={() => setExpandUser(isSelected ? null : user.id)}
              style={{
                flex: 1,
                padding: "14px 10px",
                borderRadius: 14,
                border: isSelected
                  ? `1px solid ${user.color}40`
                  : `1px solid ${t.cb}`,
                background: isSelected ? user.color + "08" : "transparent",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
                transition: "all 0.2s ease",
              }}
            >
              {/* Avatar */}
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${user.color}, ${user.color}CC)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#fff",
                }}
              >
                {user.avatar}
              </div>

              {/* First name */}
              <div style={{ fontSize: 12, fontWeight: 700, color: t.text }}>
                {user.name.split(" ")[0]}
              </div>

              {/* 7-day avg emoji + numeric */}
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ fontSize: 20, lineHeight: 1 }}>
                  {user.avgMood?.emoji}
                </span>
                <span
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: 10,
                    fontWeight: 700,
                    color: user.avgMood?.color || t.tm,
                  }}
                >
                  {user.avg.toFixed(1)}
                </span>
              </div>

              {/* Mini sparkline — 7 bars */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  gap: 2,
                  height: 24,
                }}
              >
                {user.values.map((v, vi) => {
                  const isLast = vi === user.values.length - 1;
                  return (
                    <div
                      key={vi}
                      style={{
                        width: 4,
                        height: `${(v / 5) * 100}%`,
                        borderRadius: 2,
                        background: isLast ? user.color : user.color + "40",
                        transition: "height 0.2s ease",
                      }}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Expanded user pulse history */}
      {selectedUser && (
        <div style={{ marginTop: 16 }}>
          <UserPulseHistory t={t} user={selectedUser} history={history} />
        </div>
      )}
    </div>
  );
}
