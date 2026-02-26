/* BreakroomView.jsx — break toggle, team status, vibes corner */
import React from "react";
import HackAvatar from "../../shared/HackAvatar";
import BreakTimer from "../../shared/BreakTimer";
import I from "../../../icons";
import { u } from "../../../mockData";
import { VIBES } from "../../../constants";
import useHackathonStore from "../../../stores/hackathonStore";

export default function BreakroomView({ h, t, dark }) {
  const { onBreak, breakStart, breakAnim, toggleBreak, setBreakAnim } = useHackathonStore();
  const parts = h.participants.map((id) => u(id)).filter(Boolean);

  const handleToggle = () => {
    toggleBreak();
    setTimeout(() => setBreakAnim(false), 700);
  };

  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Breakroom</h2>
      <p style={{ fontSize: 14, color: t.ts, marginBottom: 24 }}>Step away, recharge, and see who else is taking a breather.</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div onClick={handleToggle} className={`hFloat ${breakAnim ? "breakPop" : ""}`} style={{ padding: "28px 24px", borderRadius: 18, cursor: "pointer", background: onBreak ? "#F9731612" : t.card, border: `2px solid ${onBreak ? "#F9731640" : t.cb}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", minHeight: 180, transition: "all 0.3s" }}>
          <div style={{ position: "relative", marginBottom: 14 }}>
            <div className={onBreak ? "coffeeFloat" : ""}>{I.coffee(40, onBreak ? "#F97316" : t.tm)}</div>
            {onBreak && (
              <div style={{ position: "absolute", top: -8, left: "50%", marginLeft: -20, height: 30, width: 40, display: "flex", justifyContent: "center" }}>
                <div className="steam s1" /><div className="steam s2" /><div className="steam s3" />
              </div>
            )}
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4, color: onBreak ? "#F97316" : t.text }}>{onBreak ? "You're on break" : "Take a Break"}</div>
          <div style={{ fontSize: 13, color: t.tm }}>{onBreak ? "Click to get back to work" : "Let your team know you're recharging"}</div>
        </div>
        <div style={{ padding: "24px", borderRadius: 18, background: t.card, border: `1px solid ${t.cb}` }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: t.tm, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 14 }}>Team Status</div>
          {parts.map((uu) => {
            const isOnBreak = uu.id === "u1" ? onBreak : uu.id === "u4";
            return (
              <div key={uu.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: `1px solid ${t.cb}` }}>
                <HackAvatar user={uu} size={28} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{uu.name}</div>
                  <div style={{ fontSize: 11, color: t.tm }}>{uu.role}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  {isOnBreak && <BreakTimer start={uu.id === "u1" ? breakStart : Date.now() - 420000} />}
                  <span style={{ fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 6, background: isOnBreak ? "#F9731612" : "#22C55E12", color: isOnBreak ? "#F97316" : "#22C55E" }}>{isOnBreak ? "On Break" : "Working"}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* VIBES SECTION */}
      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>Vibes Corner</div>
        <p style={{ fontSize: 13, color: t.tm, marginBottom: 14 }}>Decompress with something lighthearted.</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          {VIBES.map((v, i) => (
            <a key={i} href={v.url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="hFloat" style={{ padding: "16px 18px", borderRadius: 14, background: t.card, border: `1px solid ${t.cb}`, textDecoration: "none", color: t.text, cursor: "pointer", display: "block" }}>
              <div style={{ width: "100%", height: 48, borderRadius: 10, background: `linear-gradient(135deg,${v.thumb}20,${v.thumb}08)`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill={v.thumb} stroke="none"><polygon points="5 3 19 12 5 21 5 3" /></svg>
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 2 }}>{v.title}</div>
              <div style={{ fontSize: 11, color: t.tm }}>{v.desc}</div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
