/* SessionEnergy.jsx — Session energy timeline showing mood snapshots at intervals */
import React from "react";
import { MOODS, SESSION_SNAPSHOTS } from "../../constants";

export default function SessionEnergy({ t }) {
  const lastSnapshot = SESSION_SNAPSHOTS[SESSION_SNAPSHOTS.length - 1];
  const energyDropping = lastSnapshot && lastSnapshot.avg < 3.5;

  return (
    <div
      style={{
        background: t.card,
        borderRadius: 18,
        padding: "22px 26px",
        border: `1px solid ${t.cb}`,
        marginBottom: 20,
        animation: "fadeUp 0.4s 0.2s ease both",
      }}
    >
      {/* Header */}
      <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 18 }}>
        Session Energy
      </div>

      {/* Timeline */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 16,
        }}
      >
        {SESSION_SNAPSHOTS.map((snap, i) => {
          const moodObj = MOODS[Math.round(snap.avg) - 1] || MOODS[2];
          return (
            <React.Fragment key={snap.time}>
              {/* Connecting line between snapshots */}
              {i > 0 && (
                <div
                  style={{
                    flex: 1,
                    height: 2,
                    background: t.cb,
                    minWidth: 20,
                  }}
                />
              )}
              {/* Snapshot column */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                  position: "relative",
                }}
              >
                <span style={{ fontSize: 28, lineHeight: 1 }}>
                  {snap.emoji}
                </span>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    fontFamily: "'Space Mono',monospace",
                    color: moodObj.color,
                  }}
                >
                  {snap.avg.toFixed(1)}
                </span>
                <span
                  style={{
                    fontSize: 10,
                    color: t.tm,
                  }}
                >
                  {snap.time}
                </span>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {/* Warning bar if energy dropping */}
      {energyDropping && (
        <div
          style={{
            marginTop: 16,
            padding: "12px 16px",
            borderRadius: 10,
            background: "#EAB30808",
            border: "1px solid #EAB30820",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          {/* Bolt icon */}
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#EAB308"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ flexShrink: 0 }}
          >
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "#92710A",
            }}
          >
            Energy dropping — might be a good time for a break or playlist
            switch
          </span>
        </div>
      )}
    </div>
  );
}
