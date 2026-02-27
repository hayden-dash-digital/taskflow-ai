/* CheckinProgress.jsx — progress dots for 4-step daily check-in */
import React from "react";

const STEPS = ["Energy", "Workload", "Blockers", "Wins"];

export default function CheckinProgress({ t, checkStep }) {
  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: 22 }}>
      {STEPS.map((label, i) => {
        const completed = i < checkStep;
        const current = i === checkStep;
        const dotColor = current
          ? t.acc + "80"
          : completed
          ? t.acc
          : t.cb;

        return (
          <React.Fragment key={label}>
            {i > 0 && (
              <div
                style={{
                  flex: 1,
                  height: 2,
                  background: completed ? t.acc : t.cb,
                  margin: "0 4px",
                }}
              />
            )}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: dotColor,
                  transition: "background 0.2s ease",
                }}
              />
              <span
                style={{
                  fontSize: 11,
                  fontWeight: current ? 700 : 400,
                  color: current ? t.text : t.tm,
                }}
              >
                {label}
              </span>
            </div>
          </React.Fragment>
        );
      })}
      <span
        style={{
          fontSize: 11,
          color: t.tm,
          marginLeft: "auto",
          whiteSpace: "nowrap",
        }}
      >
        ~30 sec
      </span>
    </div>
  );
}
