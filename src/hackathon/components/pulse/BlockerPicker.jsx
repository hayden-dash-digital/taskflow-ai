/* BlockerPicker.jsx — Step 2: blocker type selection + detail input */
import React from "react";
import usePulseStore from "../../stores/pulseStore";
import { BLOCKER_OPTIONS } from "../../constants";

const PLACEHOLDERS = {
  waiting: "e.g. Waiting on Marcus...",
  stuck: "e.g. Can't figure out...",
  tooling: "e.g. No access to...",
};

export default function BlockerPicker({ t }) {
  const { logBlocker, blocker, blockerText, setBlockerText, submitBlockerText } =
    usePulseStore();

  const selectedOption = blocker
    ? BLOCKER_OPTIONS.find((b) => b.id === blocker)
    : null;

  return (
    <div style={{ animation: "fadeUp 0.3s ease both" }}>
      <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 4 }}>
        Any blockers slowing you down?
      </div>
      <div style={{ fontSize: 13, color: t.tm, marginBottom: 20 }}>
        This flags friction for the team to see and act on.
      </div>

      {/* No blocker selected yet — show option buttons */}
      {!blocker && (
        <div style={{ display: "flex", gap: 10 }}>
          {BLOCKER_OPTIONS.map((b) => (
            <button
              key={b.id}
              className="hFloat"
              onClick={() => logBlocker(b.id)}
              style={{
                flex: 1,
                padding: "18px 14px",
                borderRadius: 14,
                border: `2px solid ${t.cb}`,
                background: "transparent",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
                fontFamily: "inherit",
              }}
            >
              <span style={{ fontSize: 28, lineHeight: 1 }}>{b.emoji}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: b.color }}>
                {b.label}
              </span>
              <span style={{ fontSize: 11, color: t.tm }}>{b.desc}</span>
            </button>
          ))}
        </div>
      )}

      {/* Blocker selected and is NOT "none" — show detail input */}
      {blocker && blocker !== "none" && selectedOption && (
        <div style={{ animation: "fadeUp 0.2s ease both" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 14,
            }}
          >
            <span style={{ fontSize: 20 }}>{selectedOption.emoji}</span>
            <span
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: selectedOption.color,
              }}
            >
              {selectedOption.label}
            </span>
            <button
              onClick={() => logBlocker(null)}
              style={{
                fontSize: 12,
                color: t.tm,
                background: "none",
                border: "none",
                cursor: "pointer",
                textDecoration: "underline",
                fontFamily: "inherit",
              }}
            >
              Change
            </button>
          </div>
          <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
            <input
              autoFocus
              value={blockerText}
              onChange={(e) => setBlockerText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submitBlockerText()}
              placeholder={PLACEHOLDERS[blocker] || "What's blocking you?"}
              style={{
                flex: 1,
                padding: "10px 14px",
                borderRadius: 10,
                border: `1px solid ${t.cb}`,
                background: t.ib,
                color: t.text,
                fontSize: 13,
                outline: "none",
                fontFamily: "inherit",
              }}
            />
            <button
              onClick={() => submitBlockerText()}
              style={{
                padding: "10px 18px",
                borderRadius: 10,
                border: "none",
                background: t.acc,
                color: "#fff",
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Next
            </button>
          </div>
          <button
            onClick={() => submitBlockerText()}
            style={{
              fontSize: 12,
              color: t.tm,
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Skip details →
          </button>
        </div>
      )}
    </div>
  );
}
