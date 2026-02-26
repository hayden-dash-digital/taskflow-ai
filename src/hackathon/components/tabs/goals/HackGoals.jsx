/* HackGoals.jsx — progress bars + task checklists */
import React from "react";
import HackAvatar from "../../shared/HackAvatar";
import I from "../../../icons";
import { u } from "../../../mockData";
import { PC } from "../../../constants";
import useHackathonStore from "../../../stores/hackathonStore";

export default function HackGoals({ h, t, dark }) {
  const { tasks, expGoal, setExpGoal, calcGP } = useHackathonStore();
  const totalP = h.goals.length ? Math.round(h.goals.reduce((s, g) => s + calcGP(g) * (g.weight / 100), 0)) : 0;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700 }}>Session Goals</h2>
        <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 26, fontWeight: 700, color: totalP >= 100 ? "#22C55E" : t.acc }}>{totalP}%</span>
      </div>
      <div style={{ height: 16, borderRadius: 10, background: t.ib, overflow: "hidden", marginBottom: 24 }}>
        <div style={{ height: "100%", borderRadius: 10, width: `${totalP}%`, background: totalP >= 100 ? "#22C55E" : `linear-gradient(90deg,${t.acc},#818CF8)`, transition: "width 0.5s ease" }} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {h.goals.map((g) => {
          const p = calcGP(g);
          const gt = g.taskIds.map((tid) => tasks.find((tk) => tk.id === tid)).filter(Boolean);
          const isE = expGoal === g.id;
          return (
            <div key={g.id} onClick={() => setExpGoal(isE ? null : g.id)} className="hFloat" style={{ borderRadius: 16, background: t.card, border: `1.5px solid ${isE ? g.color + "50" : t.cb}`, cursor: "pointer", overflow: "hidden" }}>
              <div style={{ height: 6, background: t.ib }}>
                <div style={{ height: "100%", width: `${p}%`, background: p >= 100 ? "#22C55E" : g.color, transition: "width 0.4s" }} />
              </div>
              <div style={{ padding: "18px 20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 12, height: 12, borderRadius: "50%", background: g.color }} />
                    <span style={{ fontSize: 16, fontWeight: 700 }}>{g.title}</span>
                  </div>
                  <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 16, fontWeight: 700, color: p >= 100 ? "#22C55E" : g.color }}>{p}%</span>
                </div>
                {gt.map((tk) => {
                  const a = u(tk.assignee);
                  return (
                    <div key={tk.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0" }}>
                      <div style={{ width: 2, height: 22, background: g.color + "40", borderRadius: 1, marginLeft: 5 }} />
                      <div style={{ width: 18, height: 18, borderRadius: 5, background: tk.status === "done" ? "#22C55E" : "transparent", border: tk.status === "done" ? "none" : `2px solid ${t.tm}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {tk.status === "done" && I.check(11, "#fff")}
                      </div>
                      <span style={{ flex: 1, fontSize: 13, fontWeight: 500, color: tk.status === "done" ? t.tm : t.text, textDecoration: tk.status === "done" ? "line-through" : "none" }}>{tk.title}</span>
                      {a && <HackAvatar user={a} size={20} />}
                    </div>
                  );
                })}
                {isE && (
                  <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${t.cb}`, animation: "hackFadeIn 0.15s" }}>
                    <div style={{ fontSize: 11, color: t.tm, fontWeight: 600 }}>Weight: {g.weight}%</div>
                    {gt.map((tk) => (
                      <div key={tk.id} style={{ fontSize: 12, color: t.ts, marginTop: 4 }}>
                        {u(tk.assignee)?.name} — <span style={{ color: PC[tk.priority] }}>{tk.priority}</span> — {tk.status}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
