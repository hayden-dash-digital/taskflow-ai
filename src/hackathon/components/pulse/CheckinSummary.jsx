/* CheckinSummary.jsx — post-checkin summary card */
import React from "react";
import usePulseStore from "../../stores/pulseStore";
import { MOODS } from "../../constants";

const BLOCKER_COLORS = {
  waiting: "#F97316",
  stuck: "#EF4444",
  tooling: "#A855F7",
  none: "#22C55E",
};

const BLOCKER_LABELS = {
  waiting: "Waiting on someone",
  stuck: "Stuck on a problem",
  tooling: "Tooling / access issue",
};

export default function CheckinSummary({ t }) {
  const { myPulse, workload, blocker, blockerText, win, redoCheckin } =
    usePulseStore();

  const mood = myPulse ? MOODS[myPulse - 1] : null;
  const moodColor = mood ? mood.color : t.acc;
  const blockerColor = BLOCKER_COLORS[blocker] || t.tm;
  const hasBlocker = blocker && blocker !== "none";
  const hasFocus = win && win.trim().length > 0;

  return (
    <div
      style={{
        background: t.card,
        borderRadius: 20,
        padding: "22px 34px",
        border: `1px solid ${t.acc}25`,
        position: "relative",
        overflow: "hidden",
        animation: "fadeUp 0.4s ease both",
      }}
    >
      {/* Top color bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: moodColor,
        }}
      />

      {/* Header row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 16,
        }}
      >
        {/* Animated checkmark */}
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "#22C55E18",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "checkPop 0.4s ease both",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M3 8.5L6.5 12L13 4"
              stroke="#22C55E"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <span style={{ fontSize: 15, fontWeight: 700 }}>
          Check-in complete — {mood ? mood.label : ""} {mood ? mood.emoji : ""}
        </span>

        {/* Redo button */}
        <button
          onClick={redoCheckin}
          style={{
            marginLeft: "auto",
            fontSize: 12,
            color: t.tm,
            background: "none",
            border: "none",
            cursor: "pointer",
            textDecoration: "underline",
            fontFamily: "inherit",
          }}
        >
          Redo
        </button>
      </div>

      {/* Status pills row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 16,
        }}
      >
        {/* Workload pill */}
        {workload && (
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              padding: "4px 10px",
              borderRadius: 8,
              background: t.ib,
              color: t.ts,
            }}
          >
            {workload.charAt(0).toUpperCase() + workload.slice(1)} workload
          </span>
        )}

        {/* Blocker pill */}
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            padding: "4px 10px",
            borderRadius: 8,
            background: hasBlocker ? blockerColor + "15" : "#22C55E15",
            color: hasBlocker ? blockerColor : "#22C55E",
          }}
        >
          {hasBlocker ? "Blocked" : "No blockers"}
        </span>

        {/* Team check-in count */}
        <span style={{ fontSize: 12, color: t.tm, marginLeft: "auto" }}>
          4 of 5 checked in
        </span>
      </div>

      {/* Summary details section */}
      {(hasBlocker || hasFocus) && (
        <div
          style={{
            borderTop: `1px solid ${t.cb}`,
            paddingTop: 14,
            display: "flex",
            gap: 12,
          }}
        >
          {/* Blocker detail card */}
          {hasBlocker && (
            <div
              style={{
                flex: 1,
                padding: "12px 14px",
                borderRadius: 12,
                background: blockerColor + "10",
              }}
            >
              <div
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  color: blockerColor,
                  marginBottom: 4,
                }}
              >
                BLOCKER
              </div>
              <div style={{ fontSize: 12, color: t.text, lineHeight: 1.4 }}>
                {blockerText || BLOCKER_LABELS[blocker] || blocker}
              </div>
            </div>
          )}

          {/* Focus card */}
          {hasFocus && (
            <div
              style={{
                flex: 1,
                padding: "12px 14px",
                borderRadius: 12,
                background: "#22C55E10",
              }}
            >
              <div
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  color: "#22C55E",
                  marginBottom: 4,
                }}
              >
                TODAY'S FOCUS
              </div>
              <div style={{ fontSize: 12, color: t.text, lineHeight: 1.4 }}>
                {win}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Fallback if no blocker and no focus */}
      {!hasBlocker && !hasFocus && (
        <div
          style={{
            borderTop: `1px solid ${t.cb}`,
            paddingTop: 14,
            fontSize: 12,
            color: t.tm,
          }}
        >
          No blockers reported · No focus set
        </div>
      )}
    </div>
  );
}
