/* RoomHeader.jsx — timer, live badge, participants, exit */
import React from "react";
import HackAvatar from "../shared/HackAvatar";
import { useTimer } from "../shared/TimerDisplay";
import I from "../../icons";
import { u } from "../../mockData";
import useHackathonStore from "../../stores/hackathonStore";

export default function RoomHeader({ h, t, onExit }) {
  const { tasks } = useHackathonStore();
  const timer = useTimer(h.start);
  const parts = h.participants.map((id) => u(id)).filter(Boolean);

  const calcGP = (g) => {
    const gt = g.taskIds.map((tid) => tasks.find((tk) => tk.id === tid)).filter(Boolean);
    return gt.length ? Math.round(gt.filter((tk) => tk.status === "done").length / gt.length * 100) : 0;
  };
  const totalP = h.goals.length ? Math.round(h.goals.reduce((s, g) => s + calcGP(g) * (g.weight / 100), 0)) : 0;

  return (
    <div style={{ padding: "8px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", background: t.side, borderBottom: `1px solid ${t.cb}`, flexShrink: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <button onClick={onExit} style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 14px", borderRadius: 9, border: `1px solid ${t.ibr}`, background: t.ib, color: t.ts, cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}>{I.back(14, t.ts)} Exit</button>
        <div style={{ width: 1, height: 22, background: t.cb }} />
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#22C55E", animation: "livePulse 2s infinite", boxShadow: "0 0 10px #22C55E60" }} />
        <span style={{ fontSize: 10, fontWeight: 700, color: "#22C55E", textTransform: "uppercase", letterSpacing: "0.06em" }}>LIVE</span>
        <span style={{ fontSize: 16, fontWeight: 700 }}>{h.name}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ padding: "5px 24px", borderRadius: 12, background: `${h.color}10`, border: `2px solid ${h.color}25` }}>
          <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 24, fontWeight: 700, color: h.color, letterSpacing: "0.06em" }}>{timer}</span>
        </div>
        <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 14, fontWeight: 700, color: totalP >= 100 ? "#22C55E" : t.ts }}>{totalP}%</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ display: "flex" }}>
          {parts.slice(0, 5).map((uu, i) => <HackAvatar key={uu.id} user={uu} size={28} style={{ marginLeft: i > 0 ? -7 : 0, border: `2px solid ${t.side}`, "--ring": t.side }} />)}
        </div>
      </div>
    </div>
  );
}
