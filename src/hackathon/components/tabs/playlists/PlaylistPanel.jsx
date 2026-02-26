/* PlaylistPanel.jsx — glow cards with unique colors */
import React from "react";
import HackAvatar from "../../shared/HackAvatar";
import I from "../../../icons";
import { u } from "../../../mockData";
import { PL_MSGS, PL_GLOWS } from "../../../constants";
import useHackathonStore from "../../../stores/hackathonStore";
import SharePlaylistModal from "./SharePlaylistModal";

export default function PlaylistPanel({ h, t, dark }) {
  const { playlists, expPl, setExpPl, hoverPl, setHoverPl, showAddPl, setShowAddPl } = useHackathonStore();

  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Playlists</h2>
      <p style={{ fontSize: 14, color: t.ts, marginBottom: 20 }}>{PL_MSGS[Math.floor(Date.now() / 60000) % PL_MSGS.length]}</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {playlists.map((pl, pi) => {
          const pu = u(pl.by);
          const isE = expPl === pl.id;
          const gc = PL_GLOWS[pi % PL_GLOWS.length];
          const isHov = hoverPl === pl.id;
          return (
            <div key={pl.id} onClick={() => setExpPl(isE ? null : pl.id)} onMouseEnter={() => setHoverPl(pl.id)} onMouseLeave={() => setHoverPl(null)} className="hFloat" style={{ padding: "20px 22px", borderRadius: 16, cursor: "pointer", background: t.card, border: `1.5px solid ${isE ? gc + "40" : t.cb}`, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg,${gc}08,transparent)`, opacity: isHov ? 1 : 0, transition: "opacity 0.4s" }} />
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: isE ? 14 : 0, position: "relative" }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: isHov ? `linear-gradient(135deg,${gc}30,${gc}15)` : t.al, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.3s", transform: isHov ? "scale(1.15) rotate(-8deg)" : "none", boxShadow: isHov ? `0 0 24px ${gc}40` : "none" }}>{I.music(22, isHov ? gc : t.acc)}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>{pl.title}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: t.tm, marginTop: 2 }}>
                    {pu ? <><HackAvatar user={pu} size={16} /> {pu.name.split(" ")[0]}</> : pl.by} · {pl.platform}
                  </div>
                </div>
              </div>
              {isE && (
                <div style={{ animation: "hackFadeIn 0.15s", paddingTop: 14, borderTop: `1px solid ${t.cb}`, position: "relative" }}>
                  <a href={pl.url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 16px", borderRadius: 10, background: `${gc}12`, border: `1px solid ${gc}25`, color: gc, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
                    {I.ext(13, gc)} Open in {pl.platform}
                  </a>
                </div>
              )}
            </div>
          );
        })}
        <div onClick={() => setShowAddPl(true)} className="hFloat" style={{ padding: "20px 22px", borderRadius: 16, cursor: "pointer", border: `2px dashed ${t.cb}`, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, color: t.tm, minHeight: 90 }}>
          {I.plus(18, t.tm)} <span style={{ fontSize: 14, fontWeight: 500 }}>Share a playlist</span>
        </div>
      </div>
      {showAddPl && <SharePlaylistModal t={t} />}
    </div>
  );
}
