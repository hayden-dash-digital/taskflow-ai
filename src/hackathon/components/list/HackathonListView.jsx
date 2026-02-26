/* HackathonListView.jsx — main entry: live rooms + upcoming */
import React from "react";
import useHackathonStore from "../../stores/hackathonStore";
import { LiveCard, UpcomingCard } from "./HackathonCard";
import CreateHackathonModal from "./CreateHackathonModal";
import HackathonRoom from "../room/HackathonRoom";
import I from "../../icons";
import "../../animations.css";

export default function HackathonListView({ t, dark, teamMembers }) {
  const { hackathons, activeRoom, enterRoom, exitRoom, showExit, setShowExit, showSchedule, setShowSchedule } = useHackathonStore();

  const live = hackathons.filter((h) => h.status === "live");
  const up = hackathons.filter((h) => h.status === "scheduled");

  if (activeRoom) {
    return (
      <HackathonRoom
        h={activeRoom}
        t={t}
        dark={dark}
        onExit={() => setShowExit(true)}
        showExit={showExit}
        onYes={() => exitRoom()}
        onNo={() => setShowExit(false)}
      />
    );
  }

  return (
    <div className="hackathon-room" style={{ flex: 1, overflow: "auto", background: t.bg, color: t.text, fontFamily: "'DM Sans',sans-serif", "--ring": t.bg }}>
      <div style={{ maxWidth: 1060, margin: "0 auto", padding: "36px 28px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 13, background: `linear-gradient(135deg,${t.acc},#818CF8)`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 20, fontFamily: "'Space Mono',monospace" }}>T</div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.03em" }}>Hackathons</div>
              <div style={{ fontSize: 13, color: t.tm }}>TaskFlow Collaboration Rooms</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setShowSchedule(true)} style={{ padding: "9px 22px", borderRadius: 10, border: "none", background: `linear-gradient(135deg,${t.acc},#818CF8)`, color: "#fff", cursor: "pointer", fontSize: 13, fontFamily: "inherit", fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>{I.plus(14, "#fff")} Schedule Hackathon</button>
          </div>
        </div>

        {/* LIVE */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#22C55E", animation: "livePulse 2s infinite" }} />
            <span style={{ fontSize: 14, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#22C55E" }}>Live Rooms</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(live.length, 2)}, 1fr)`, gap: 16 }}>
            {live.map((h) => <LiveCard key={h.id} h={h} t={t} dark={dark} onClick={() => enterRoom(h)} />)}
          </div>
        </div>

        {/* UPCOMING */}
        {up.length > 0 && (
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: t.tm, marginBottom: 16 }}>Upcoming</div>
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(up.length, 2)}, 1fr)`, gap: 16 }}>
              {up.map((h) => <UpcomingCard key={h.id} h={h} t={t} dark={dark} />)}
            </div>
          </div>
        )}
      </div>

      {showSchedule && <CreateHackathonModal t={t} />}

      <style>{`
        .hackathon-room ::-webkit-scrollbar{width:5px}
        .hackathon-room ::-webkit-scrollbar-track{background:transparent}
        .hackathon-room ::-webkit-scrollbar-thumb{background:${t.scr};border-radius:3px}
        .hackathon-room input::placeholder,.hackathon-room textarea::placeholder{color:${t.tm}}
      `}</style>
    </div>
  );
}
