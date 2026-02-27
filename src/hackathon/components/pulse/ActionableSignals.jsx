/* ActionableSignals.jsx — Generated signals from check-in data */
import React from "react";
import usePulseStore from "../../stores/pulseStore";

export default function ActionableSignals({ t }) {
  const store = usePulseStore();
  const todayPulses = store.getTodayPulses();

  // Build signal list from pulse data
  const signals = [];

  todayPulses.forEach((user) => {
    if (!user.pulse) return;

    const hasBlocker = user.blk && user.blk !== "none";
    const isOverwhelmed = user.wl === "overwhelming";

    if (hasBlocker) {
      signals.push({
        type: "blocked",
        user,
        title: `${user.name} is blocked ${user.mood ? user.mood.emoji : ""}`,
        desc: user.focus || "Clear this before it cascades",
        bg: "#EF444408",
        border: "#EF444420",
        color: "#EF4444",
      });
    } else if (isOverwhelmed) {
      signals.push({
        type: "overwhelmed",
        user,
        title: `${user.name} is overwhelmed \u{1F198}`,
        desc: "Consider redistributing tasks or pairing up",
        bg: "#F9731608",
        border: "#F9731620",
        color: "#F97316",
      });
    } else if (user.pulse >= 4) {
      const bandwidth =
        user.wl === "light" ? "has bandwidth" : "high energy";
      signals.push({
        type: "high",
        user,
        title: `${user.name} is ${user.mood.label} ${user.mood.emoji}`,
        desc: bandwidth,
        bg: "#22C55E08",
        border: "#22C55E20",
        color: "#22C55E",
      });
    } else if (user.pulse <= 2) {
      signals.push({
        type: "low",
        user,
        title: `${user.name} is low energy ${user.mood ? user.mood.emoji : ""}`,
        desc: "Suggest lighter tasks or a break",
        bg: "#EAB30808",
        border: "#EAB30820",
        color: "#92710A",
      });
    }
  });

  return (
    <div
      style={{
        background: t.card,
        borderRadius: 18,
        padding: "22px 26px",
        border: `1px solid ${t.cb}`,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>
        Actionable Signals
      </div>

      {/* Signal cards */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {signals.map((sig, i) => (
          <div
            key={sig.user.id + "-" + sig.type}
            style={{
              padding: "12px 16px",
              borderRadius: 12,
              background: sig.bg,
              border: `1px solid ${sig.border}`,
            }}
          >
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: sig.color,
                marginBottom: 2,
              }}
            >
              {sig.title}
            </div>
            <div
              style={{
                fontSize: 11,
                color: t.ts,
              }}
            >
              {sig.desc}
            </div>
          </div>
        ))}

        {signals.length === 0 && (
          <div
            style={{
              fontSize: 12,
              color: t.tm,
              padding: "12px 0",
            }}
          >
            No signals yet — waiting for check-ins
          </div>
        )}
      </div>

      {/* Bottom info card */}
      <div
        style={{
          marginTop: 16,
          padding: "12px 16px",
          borderRadius: 10,
          background: t.ib,
          border: `1px solid ${t.cb}`,
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
          stroke={t.tm}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ flexShrink: 0 }}
        >
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
        <span style={{ fontSize: 11, color: t.tm }}>
          Signals generated from today's check-ins · Updated live
        </span>
      </div>
    </div>
  );
}
