/* WorkloadPicker.jsx — Step 1: workload level selection */
import React from "react";
import usePulseStore from "../../stores/pulseStore";
import { WORKLOAD_OPTIONS } from "../../constants";

export default function WorkloadPicker({ t }) {
  const { logWorkload, workload } = usePulseStore();

  return (
    <div style={{ animation: "fadeUp 0.3s ease both" }}>
      <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 4 }}>
        How's your workload?
      </div>
      <div style={{ fontSize: 13, color: t.tm, marginBottom: 20 }}>
        Be honest — this helps your team balance the load.
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        {WORKLOAD_OPTIONS.map((w) => {
          const selected = workload === w.id;
          return (
            <button
              key={w.id}
              className="hFloat"
              onClick={() => logWorkload(w.id)}
              style={{
                flex: 1,
                padding: "18px 14px",
                borderRadius: 14,
                border: selected
                  ? `2px solid ${w.color}50`
                  : `2px solid ${t.cb}`,
                background: selected ? w.color + "08" : "transparent",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
                fontFamily: "inherit",
              }}
            >
              <span style={{ fontSize: 28, lineHeight: 1 }}>{w.emoji}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: w.color }}>
                {w.label}
              </span>
              <span style={{ fontSize: 11, color: t.tm }}>{w.desc}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
