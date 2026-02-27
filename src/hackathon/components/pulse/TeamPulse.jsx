/* TeamPulse.jsx — Team Pulse card showing all 5 members' statuses */
import React from "react";
import usePulseStore from "../../stores/pulseStore";
import { MOODS, WLOAD_LABELS } from "../../constants";
import PulseUserRow from "./PulseUserRow";

export default function TeamPulse({ t }) {
  const { expandUser, setExpandUser, pulseLogged, blockerText } = usePulseStore();
  const todayPulses = usePulseStore((s) => s.getTodayPulses());
  const todayAvg = usePulseStore((s) => s.getTodayAvg());

  const avgMood = todayAvg > 0 ? MOODS[Math.round(todayAvg) - 1] : null;
  const overloaded = todayPulses.filter((p) => p.wl === "overwhelming").length;
  const blocked = todayPulses.filter((p) => p.blk && p.blk !== "none").length;

  return (
    <div
      style={{
        background: t.card,
        borderRadius: 18,
        padding: "24px 26px",
        border: `1px solid ${t.cb}`,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 18,
        }}
      >
        <div style={{ fontSize: 14, fontWeight: 700, color: t.text }}>Team Pulse</div>
        <span
          style={{
            fontSize: 11,
            color: t.tm,
            fontFamily: "'Space Mono', monospace",
          }}
        >
          Today
        </span>
      </div>

      {/* User rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {todayPulses.map((user) => (
          <PulseUserRow
            key={user.id}
            t={t}
            user={user}
            expanded={expandUser === user.id}
            onClick={() => setExpandUser(expandUser === user.id ? null : user.id)}
            pulseLogged={pulseLogged}
            blockerText={blockerText}
          />
        ))}
      </div>

      {/* Bottom bar — team average */}
      {todayAvg > 0 && avgMood && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginTop: 16,
            paddingTop: 14,
            borderTop: `1px solid ${t.cb}`,
          }}
        >
          <span style={{ fontSize: 18 }}>{avgMood.emoji}</span>
          <span
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 14,
              fontWeight: 700,
              color: avgMood.color,
            }}
          >
            {todayAvg.toFixed(1)}
          </span>
          <span style={{ fontSize: 11, color: t.tm }}>team avg</span>

          <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
            {overloaded > 0 && (
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  background: "#F9731612",
                  color: "#F97316",
                  padding: "3px 8px",
                  borderRadius: 6,
                }}
              >
                {overloaded} overloaded
              </span>
            )}
            {blocked > 0 && (
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  background: "#EF444412",
                  color: "#EF4444",
                  padding: "3px 8px",
                  borderRadius: 6,
                }}
              >
                {blocked} blocked
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
