/* ResourcePanel.jsx — expandable resource cards */
import React from "react";
import I, { RI } from "../../../icons";
import useHackathonStore from "../../../stores/hackathonStore";

export default function ResourcePanel({ h, t, dark }) {
  const { expRes, setExpRes } = useHackathonStore();

  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Project Resources</h2>
      <p style={{ fontSize: 14, color: t.ts, marginBottom: 20 }}>Repos, docs, and everything the team needs.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {h.resources.map((r) => {
          const Ic = RI[r.type] || I.link;
          const rc = r.type === "figma" ? "#A855F7" : r.type === "github" ? (dark ? "#E8E8F0" : "#1A1A2E") : r.type === "doc" ? "#3B82F6" : t.ts;
          const isE = expRes === r.id;
          return (
            <div key={r.id} onClick={() => setExpRes(isE ? null : r.id)} className="hFloat" style={{ padding: "18px 22px", borderRadius: 16, background: t.card, border: `1.5px solid ${isE ? rc + "40" : t.cb}`, cursor: "pointer" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 46, height: 46, borderRadius: 12, background: rc + "15", display: "flex", alignItems: "center", justifyContent: "center" }}>{Ic(22, rc)}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>{r.title}</div>
                  <div style={{ fontSize: 12, color: t.tm, textTransform: "uppercase", fontWeight: 600, letterSpacing: "0.04em", marginTop: 2 }}>{r.type}</div>
                </div>
                <div style={{ color: t.tm, transition: "transform 0.2s", transform: isE ? "rotate(90deg)" : "none" }}>{I.chevR(16, t.tm)}</div>
              </div>
              {isE && (
                <div style={{ animation: "hackFadeIn 0.15s", marginTop: 14, paddingTop: 14, borderTop: `1px solid ${t.cb}` }}>
                  <p style={{ fontSize: 13, color: t.ts, marginBottom: 12, lineHeight: 1.5 }}>{r.desc}</p>
                  <a href={r.url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 18px", borderRadius: 10, background: rc + "15", border: `1px solid ${rc}25`, color: rc, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
                    {I.ext(13, rc)} Open {r.type === "github" ? "Repository" : r.type === "figma" ? "in Figma" : "Resource"}
                  </a>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
