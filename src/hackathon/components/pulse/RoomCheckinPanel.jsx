/* RoomCheckinPanel.jsx — Individual check-in panel showing each team member's status */
import React from "react";
import usePulseStore from "../../stores/pulseStore";
import { WLOAD_LABELS } from "../../constants";

export default function RoomCheckinPanel({ t }) {
  const store = usePulseStore();
  const todayPulses = store.getTodayPulses();
  const blockerText = store.blockerText;

  return (
    <div
      style={{
        background: t.card,
        borderRadius: 18,
        padding: "22px 26px",
        border: `1px solid ${t.cb}`,
      }}
    >
      {/* Header */}
      <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>
        Individual Check-in
      </div>

      {/* User rows */}
      {todayPulses.map((user, i) => {
        const wlObj = user.wl ? WLOAD_LABELS[user.wl] : null;
        const hasBlocker = user.blk && user.blk !== "none";
        const isLowEnergy = user.pulse && user.pulse <= 2;
        const isHeavy =
          user.wl === "heavy" || user.wl === "overwhelming";

        // Determine badge
        let badge = null;
        if (isLowEnergy) {
          badge = { label: "Low energy", color: "#F97316" };
        } else if (hasBlocker) {
          badge = { label: "Blocked", color: "#EF4444" };
        } else if (isHeavy) {
          badge = { label: "Heavy load", color: "#F97316" };
        }

        return (
          <div key={user.id}>
            {/* Main row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 0",
                borderBottom:
                  i < todayPulses.length - 1
                    ? `1px solid ${t.cb}`
                    : "none",
              }}
            >
              {/* Avatar */}
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: user.color,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: 10,
                  fontWeight: 700,
                  fontFamily: "'Space Mono',monospace",
                  flexShrink: 0,
                }}
              >
                {user.avatar}
              </div>

              {/* Name */}
              <span style={{ fontSize: 13, fontWeight: 600 }}>
                {user.name}
              </span>

              {/* Workload emoji pill */}
              {wlObj && (
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    padding: "3px 8px",
                    borderRadius: 6,
                    background: wlObj.color + "15",
                    color: wlObj.color,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 3,
                  }}
                >
                  {wlObj.emoji} {wlObj.label}
                </span>
              )}

              {/* Mood emoji */}
              {user.mood && (
                <span style={{ fontSize: 20, lineHeight: 1 }}>
                  {user.mood.emoji}
                </span>
              )}

              {/* Badge on right */}
              {badge && (
                <span
                  style={{
                    marginLeft: "auto",
                    fontSize: 10,
                    fontWeight: 700,
                    padding: "3px 8px",
                    borderRadius: 6,
                    background: badge.color + "15",
                    color: badge.color,
                  }}
                >
                  {badge.label}
                </span>
              )}
            </div>

            {/* Focus line */}
            {user.focus && (
              <div
                style={{
                  fontSize: 11,
                  color: t.tm,
                  marginLeft: 38,
                  paddingBottom: 6,
                }}
              >
                {"📌 " + user.focus}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
