/* FocusInput.jsx — Step 3: main focus / win text input */
import React from "react";
import usePulseStore from "../../stores/pulseStore";

export default function FocusInput({ t }) {
  const { win, setWin, finishCheckin } = usePulseStore();

  return (
    <div style={{ animation: "fadeUp 0.3s ease both" }}>
      <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 4 }}>
        What's your main focus today?
      </div>
      <div style={{ fontSize: 13, color: t.tm, marginBottom: 20 }}>
        Or share a quick win from yesterday. Hype yourself up.
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
        <input
          autoFocus
          value={win}
          onChange={(e) => setWin(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && finishCheckin()}
          placeholder="e.g. Finishing the auth flow 🚀 or Shipped the sidebar yesterday!"
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
          onClick={() => finishCheckin()}
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
          Done
        </button>
      </div>
      <button
        onClick={() => finishCheckin()}
        style={{
          fontSize: 12,
          color: t.tm,
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
          fontFamily: "inherit",
        }}
      >
        Skip →
      </button>
    </div>
  );
}
