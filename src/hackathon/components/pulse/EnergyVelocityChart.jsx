/* EnergyVelocityChart.jsx — 14-day timeline chart with task bars + energy line */
import React from "react";
import usePulseStore from "../../stores/pulseStore";
import { MOODS } from "../../constants";

export default function EnergyVelocityChart({ t }) {
  const { history, hoverDay, setHoverDay } = usePulseStore();

  const maxTasks = Math.max(...history.map((d) => d.tasks), 1);

  // Build energy dot positions for the SVG polyline
  const chartHeight = 200;
  const dayWidth = 100 / 14; // percentage per day

  const dotPositions = history.map((day, i) => {
    const x = (i / 13) * 100; // 0% to 100% across
    const y = 100 - ((day.avg - 1) / 4) * 100; // invert for SVG
    return { x, y };
  });

  const polylinePoints = dotPositions
    .map((p) => `${p.x},${p.y}`)
    .join(" ");

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
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 4,
        }}
      >
        <div style={{ fontSize: 14, fontWeight: 700, color: t.text }}>
          Energy × Velocity
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${t.acc}, ${t.acc}CC)`,
              }}
            />
            <span style={{ fontSize: 10, color: t.tm }}>Energy</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#22C55E",
              }}
            />
            <span style={{ fontSize: 10, color: t.tm }}>Tasks</span>
          </div>
        </div>
      </div>

      {/* Subtitle */}
      <div style={{ fontSize: 12, color: t.tm, marginBottom: 18 }}>
        When these lines diverge, something's off.
      </div>

      {/* Chart area */}
      <div style={{ position: "relative", height: chartHeight, display: "flex" }}>
        {/* Y-axis labels */}
        <div
          style={{
            width: 24,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            paddingRight: 6,
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontSize: 10,
              fontFamily: "'Space Mono', monospace",
              color: t.tm,
              lineHeight: 1,
            }}
          >
            5
          </span>
          <span
            style={{
              fontSize: 10,
              fontFamily: "'Space Mono', monospace",
              color: t.tm,
              lineHeight: 1,
            }}
          >
            3
          </span>
          <span
            style={{
              fontSize: 10,
              fontFamily: "'Space Mono', monospace",
              color: t.tm,
              lineHeight: 1,
            }}
          >
            1
          </span>
        </div>

        {/* Chart body */}
        <div style={{ flex: 1, position: "relative" }}>
          {/* Grid lines */}
          {[0, 50, 100].map((pct) => (
            <div
              key={pct}
              style={{
                position: "absolute",
                top: `${pct}%`,
                left: 0,
                right: 0,
                height: 1,
                background: t.cb,
              }}
            />
          ))}

          {/* Bars + dots + labels */}
          <div
            style={{
              position: "relative",
              height: "100%",
              display: "flex",
              alignItems: "flex-end",
              gap: 0,
            }}
          >
            {history.map((day, i) => {
              const barH = (day.tasks / maxTasks) * 100;
              const dotBottom = ((day.avg - 1) / 4) * 100;
              const isHover = hoverDay === i;
              const mood = MOODS[Math.round(day.avg) - 1];

              return (
                <div
                  key={i}
                  onMouseEnter={() => setHoverDay(i)}
                  onMouseLeave={() => setHoverDay(null)}
                  style={{
                    flex: 1,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    position: "relative",
                    cursor: "pointer",
                  }}
                >
                  {/* Tooltip */}
                  {isHover && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: `calc(${dotBottom}% + 16px)`,
                        left: "50%",
                        transform: "translateX(-50%)",
                        background: "#1A1A2E",
                        color: "#fff",
                        padding: "8px 12px",
                        borderRadius: 10,
                        fontSize: 11,
                        whiteSpace: "nowrap",
                        zIndex: 10,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                        animation: "fadeUp 0.15s ease both",
                      }}
                    >
                      <div style={{ fontWeight: 700, marginBottom: 3 }}>{day.date}</div>
                      <div style={{ color: mood?.color || "#fff" }}>
                        {mood?.emoji} Energy: {day.avg.toFixed(1)}
                      </div>
                      <div style={{ color: "#22C55E" }}>
                        Tasks: {day.tasks}
                      </div>
                    </div>
                  )}

                  {/* Energy dot */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: `${dotBottom}%`,
                      width: isHover ? 10 : 7,
                      height: isHover ? 10 : 7,
                      borderRadius: "50%",
                      background: t.acc,
                      transform: "translateY(50%)",
                      transition: "all 0.15s ease",
                      zIndex: 3,
                    }}
                  />

                  {/* Task bar */}
                  <div
                    className="bar-hover"
                    style={{
                      width: "70%",
                      height: `${barH}%`,
                      borderRadius: "6px 6px 2px 2px",
                      background: isHover
                        ? "#22C55E"
                        : "linear-gradient(to top, #22C55E40, #22C55E20)",
                      opacity: isHover ? 1 : 0.7,
                      transition: "all 0.15s ease",
                    }}
                  />

                  {/* X-axis label */}
                  <div
                    style={{
                      fontSize: 10,
                      fontFamily: "'Space Mono', monospace",
                      color: isHover ? t.text : t.tm,
                      marginTop: 6,
                      fontWeight: isHover ? 700 : 400,
                    }}
                  >
                    {day.short.slice(0, 2)}
                  </div>
                </div>
              );
            })}
          </div>

          {/* SVG polyline connecting energy dots */}
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
              overflow: "visible",
            }}
          >
            <defs>
              <filter id="lineShadow">
                <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor={t.acc} floodOpacity="0.3" />
              </filter>
            </defs>
            <polyline
              points={polylinePoints}
              fill="none"
              stroke={t.acc}
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
              filter="url(#lineShadow)"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
