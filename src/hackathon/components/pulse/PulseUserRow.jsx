/* PulseUserRow.jsx — single expandable user row for TeamPulse card */
import React from "react";
import { WLOAD_LABELS } from "../../constants";

export default function PulseUserRow({ t, user, expanded, onClick, pulseLogged, blockerText }) {
  const hasPulse = user.pulse != null;
  const wlObj = user.wl ? WLOAD_LABELS[user.wl] : null;
  const hasBlocker = user.blk && user.blk !== "none";

  const rowBg = expanded
    ? hasBlocker
      ? "#EF444404"
      : user.color + "06"
    : "transparent";
  const rowBorder = expanded
    ? hasBlocker
      ? "#EF444415"
      : user.color + "25"
    : "transparent";

  return (
    <div
      onClick={onClick}
      style={{
        padding: "10px 12px",
        borderRadius: 12,
        cursor: "pointer",
        background: rowBg,
        border: `1px solid ${rowBorder}`,
        transition: "all 0.2s ease",
      }}
    >
      {/* Main row */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {/* Avatar */}
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${user.color}, ${user.color}CC)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 11,
            fontWeight: 700,
            color: "#fff",
            flexShrink: 0,
          }}
        >
          {user.avatar}
        </div>

        {/* Name + role */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: t.text }}>{user.name}</div>
          <div style={{ fontSize: 11, color: t.tm }}>{user.role}</div>
        </div>

        {/* Workload pill */}
        {hasPulse && wlObj && (
          <span
            style={{
              fontSize: 9,
              fontWeight: 700,
              background: wlObj.color + "12",
              color: wlObj.color,
              padding: "2px 7px",
              borderRadius: 5,
            }}
          >
            {wlObj.emoji} {wlObj.label}
          </span>
        )}

        {/* Blocker pill */}
        {hasPulse && hasBlocker && (
          <span
            style={{
              fontSize: 9,
              fontWeight: 700,
              background: "#EF444412",
              color: "#EF4444",
              padding: "2px 7px",
              borderRadius: 5,
            }}
          >
            Blocked
          </span>
        )}

        {/* Mood emoji or Pending */}
        {hasPulse ? (
          <span
            style={{
              fontSize: 22,
              lineHeight: 1,
              animation:
                user.id === "u1" && pulseLogged
                  ? "emojiPop 0.4s ease both"
                  : "none",
            }}
          >
            {user.mood?.emoji}
          </span>
        ) : (
          <span
            style={{
              fontSize: 11,
              color: t.tm,
              background: t.ib,
              padding: "4px 12px",
              borderRadius: 6,
            }}
          >
            Pending
          </span>
        )}
      </div>

      {/* Expanded detail */}
      {expanded && hasPulse && (
        <div
          style={{
            borderTop: `1px solid ${user.color}15`,
            marginTop: 10,
            paddingTop: 10,
            animation: "fadeUp 0.2s ease both",
          }}
        >
          {user.focus && (
            <div style={{ fontSize: 12, color: t.text, marginBottom: 4 }}>
              📌 Focus: {user.focus}
            </div>
          )}
          {hasBlocker && (
            <div style={{ fontSize: 12, color: "#F97316", marginBottom: 4 }}>
              ⏳ Blocked: {user.id === "u1" && blockerText ? blockerText : user.focus || "Waiting on dependency"}
            </div>
          )}
          <div style={{ fontSize: 11, color: t.tm }}>
            {user.mood?.emoji} {user.mood?.label} · {wlObj?.emoji} {wlObj?.label}
          </div>
        </div>
      )}
    </div>
  );
}
