/* HackathonCard.jsx — live/upcoming card variants */
import React from "react";
import HackAvatar from "../shared/HackAvatar";
import TimerDisplay from "../shared/TimerDisplay";
import I from "../../icons";
import { u } from "../../mockData";

export function LiveCard({ h, t, dark, onClick }) {
  const parts = h.participants.map((id) => u(id)).filter(Boolean);
  return (
    <div onClick={onClick} className="hFloat" style={{ aspectRatio: "1/0.82", borderRadius: 20, cursor: "pointer", position: "relative", overflow: "hidden", background: `linear-gradient(160deg,${h.color}15,${h.color}05,${t.card})`, border: `2px solid ${h.color}35`, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "26px 28px" }}>
      <div style={{ position: "absolute", top: -50, right: -50, width: 140, height: 140, borderRadius: "50%", background: h.color, opacity: 0.06, filter: "blur(40px)" }} />
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <span style={{ fontSize: 11, fontWeight: 700, background: "#22C55E", color: "#fff", padding: "4px 12px", borderRadius: 7, textTransform: "uppercase", letterSpacing: "0.06em" }}>LIVE</span>
          <span style={{ fontSize: 11, color: t.tm, background: t.ib, padding: "4px 10px", borderRadius: 6, fontWeight: 500 }}>{h.theme}</span>
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 8, lineHeight: 1.2 }}>{h.name}</h2>
        <p style={{ fontSize: 14, color: t.ts, lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{h.description}</p>
      </div>
      <div>
        <TimerDisplay start={h.start} color={h.color} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 12, color: t.tm }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>{I.users(14, t.tm)} {parts.length}</span>
            {h.tasks.length > 0 && <span>{h.tasks.length} tasks</span>}
            {h.ideas.length > 0 && <span>{h.ideas.length} ideas</span>}
          </div>
          <div style={{ display: "flex" }}>
            {parts.slice(0, 4).map((uu, i) => <HackAvatar key={uu.id} user={uu} size={30} style={{ marginLeft: i > 0 ? -8 : 0, border: `2px solid ${t.card}`, "--ring": t.card }} />)}
          </div>
        </div>
        <div style={{ marginTop: 16, padding: "12px 0", borderTop: `1px solid ${t.cb}`, textAlign: "center", fontSize: 14, fontWeight: 600, color: h.color }}>Enter Room {I.chevR(14, h.color)}</div>
      </div>
    </div>
  );
}

export function UpcomingCard({ h, t, dark }) {
  const parts = h.participants.map((id) => u(id)).filter(Boolean);
  const my = h.participants.includes("u1");
  return (
    <div className="hFloat" style={{ borderRadius: 20, background: t.card, border: `1px solid ${t.cb}`, padding: "24px 26px", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: 190 }}>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <div style={{ width: 12, height: 12, borderRadius: 5, background: h.color }} />
          <span style={{ fontSize: 11, color: t.tm, background: t.ib, padding: "4px 10px", borderRadius: 6, fontWeight: 500 }}>{h.theme}</span>
        </div>
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 5, letterSpacing: "-0.02em" }}>{h.name}</h3>
        <p style={{ fontSize: 13, color: t.ts, lineHeight: 1.45 }}>{h.description}</p>
      </div>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 12, color: t.tm, marginBottom: 14 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>{I.cal(14, t.tm)} {new Date(h.start).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>{I.users(14, t.tm)} {parts.length} invited</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex" }}>
            {parts.slice(0, 4).map((uu, i) => <HackAvatar key={uu.id} user={uu} size={26} style={{ marginLeft: i > 0 ? -6 : 0, border: `2px solid ${t.card}`, "--ring": t.card }} />)}
          </div>
          {my
            ? <span style={{ fontSize: 12, fontWeight: 600, color: "#22C55E", background: dark ? "#0F2918" : "#F0FDF4", padding: "6px 14px", borderRadius: 8, display: "flex", alignItems: "center", gap: 4 }}>{I.check(11, "#22C55E")} Accepted</span>
            : <button style={{ padding: "6px 16px", borderRadius: 8, border: "none", background: dark ? "#0F2918" : "#F0FDF4", color: "#22C55E", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Accept</button>
          }
        </div>
      </div>
    </div>
  );
}
