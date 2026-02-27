/* EnergyInsight.jsx — AI Insight card with priority-based insight detection */
import React from "react";
import usePulseStore from "../../stores/pulseStore";

const STATUS_MAP = {
  warning: { label: "Attention needed", color: "#EF4444" },
  positive: { label: "Looking great", color: "#22C55E" },
  caution: { label: "Heads up", color: "#EAB308" },
  neutral: { label: "Steady", color: null }, // uses t.tm
};

export default function EnergyInsight({ t }) {
  const { showInsight, myPulse } = usePulseStore();
  const insight = usePulseStore((s) => s.getAiInsight());

  const statusInfo = STATUS_MAP[insight.type] || STATUS_MAP.neutral;
  const statusColor = statusInfo.color || t.tm;

  const statColor = (val, high, low) =>
    val > high ? "#22C55E" : val < low ? "#EF4444" : t.text;

  const showContent = showInsight || myPulse === null;

  return (
    <div
      style={{
        background: t.card,
        borderRadius: 18,
        padding: "24px 26px",
        border: `1px solid ${t.cb}`,
        display: "flex",
        flexDirection: "column",
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
        <div style={{ fontSize: 14, fontWeight: 700, color: t.text }}>Energy Insight</div>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <polygon
            points="13 2 3 14 12 14 11 22 21 10 12 10"
            stroke={t.acc}
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </div>

      {showContent ? (
        <div style={{ animation: "insightSlide 0.4s ease both", flex: 1 }}>
          {/* Status indicator */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 14,
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: statusColor,
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: statusColor,
              }}
            >
              {statusInfo.label}
            </span>
          </div>

          {/* Insight text */}
          <div
            style={{
              fontSize: 15,
              fontWeight: 600,
              lineHeight: 1.6,
              color: t.text,
              marginBottom: 20,
            }}
          >
            {insight.text}
          </div>

          {/* 3-column stat grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            {/* 3-Day Avg */}
            <div
              style={{
                textAlign: "center",
                padding: "10px 0",
                borderRadius: 10,
                background: t.ib,
              }}
            >
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  fontFamily: "'Space Mono', monospace",
                  color: statColor(insight.last3Avg, 3.5, 2.5),
                }}
              >
                {insight.last3Avg.toFixed(1)}
              </div>
              <div style={{ fontSize: 10, color: t.tm, marginTop: 2 }}>3-Day Avg</div>
            </div>

            {/* Trend */}
            <div
              style={{
                textAlign: "center",
                padding: "10px 0",
                borderRadius: 10,
                background: t.ib,
              }}
            >
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  fontFamily: "'Space Mono', monospace",
                  color: statColor(insight.energyTrend, 0, -0.5),
                }}
              >
                {insight.energyTrend >= 0 ? "+" : ""}
                {insight.energyTrend.toFixed(1)}
              </div>
              <div style={{ fontSize: 10, color: t.tm, marginTop: 2 }}>Trend</div>
            </div>

            {/* Velocity */}
            <div
              style={{
                textAlign: "center",
                padding: "10px 0",
                borderRadius: 10,
                background: t.ib,
              }}
            >
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  fontFamily: "'Space Mono', monospace",
                  color: statColor(insight.last3Tasks, 6, 3),
                }}
              >
                {insight.last3Tasks.toFixed(1)}
              </div>
              <div style={{ fontSize: 10, color: t.tm, marginTop: 2 }}>Velocity</div>
            </div>
          </div>
        </div>
      ) : (
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "40px 20px",
            fontSize: 13,
            color: t.tm,
            lineHeight: 1.6,
          }}
        >
          Log your pulse to unlock today's insight
        </div>
      )}
    </div>
  );
}
