/* HackathonRoom.jsx — full-screen overlay shell */
import React from "react";
import useHackathonStore from "../../stores/hackathonStore";
import RoomHeader from "./RoomHeader";
import RoomNav from "./RoomNav";
import RoomChat from "./RoomChat";
import ExitConfirmModal from "./ExitConfirmModal";
import Celebration from "./Celebration";
import IdeaBoard from "../tabs/ideas/IdeaBoard";
import HackTaskBoard from "../tabs/tasks/HackTaskBoard";
import HackSprintView from "../tabs/sprint/HackSprintView";
import HackGoals from "../tabs/goals/HackGoals";
import MeetingRoom from "../tabs/meetings/MeetingRoom";
import ResourcePanel from "../tabs/resources/ResourcePanel";
import PlaylistPanel from "../tabs/playlists/PlaylistPanel";
import BreakroomView from "../tabs/breakroom/BreakroomView";
import I from "../../icons";
import "../../animations.css";

export default function HackathonRoom({ h, t, dark, onExit, showExit, onYes, onNo }) {
  const { tab, celebration, setCelebration, onBreak, setOnBreak } = useHackathonStore();

  return (
    <div className="hackathon-room" style={{ position: "fixed", inset: 0, display: "flex", flexDirection: "column", background: t.rbg, color: t.text, fontFamily: "'DM Sans',sans-serif", animation: "roomEnter 0.35s ease", "--ring": t.rbg, zIndex: 100 }}>
      {celebration && <Celebration key={celebration.key} text={celebration.text} onDone={() => setCelebration(null)} />}

      <RoomHeader h={h} t={t} onExit={onExit} />

      {/* BREAK OVERLAY - only when not in breakroom tab */}
      {onBreak && tab !== "breakroom" && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 900, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(10px)", animation: "hackFadeIn 0.2s" }}>
          <div style={{ textAlign: "center" }}>
            <div className="coffeeFloat" style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>{I.coffee(72, "#F97316")}</div>
            <div style={{ position: "relative", display: "flex", justifyContent: "center", marginTop: -30, marginBottom: 12, height: 34 }}>
              <div className="steam s1" /><div className="steam s2" /><div className="steam s3" />
            </div>
            <div style={{ fontSize: 30, fontWeight: 700, color: "#fff", marginBottom: 8 }}>Taking a break</div>
            <div style={{ fontSize: 15, color: "#ffffff80", marginBottom: 28 }}>Recharging. Your team can see you're on break.</div>
            <button onClick={() => setOnBreak(false)} style={{ padding: "12px 32px", borderRadius: 12, border: "none", background: "#F97316", color: "#fff", fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>I'm Back</button>
          </div>
        </div>
      )}

      {/* BODY */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        <RoomNav h={h} t={t} />

        {/* MAIN CONTENT */}
        <div style={{ flex: 1, overflow: "auto", padding: "20px 26px" }}>
          {tab === "ideas" && <IdeaBoard h={h} t={t} dark={dark} />}
          {tab === "tasks" && <HackTaskBoard h={h} t={t} dark={dark} />}
          {tab === "sprint" && <HackSprintView h={h} t={t} dark={dark} />}
          {tab === "goals" && <HackGoals h={h} t={t} dark={dark} />}
          {tab === "meetings" && <MeetingRoom h={h} t={t} dark={dark} />}
          {tab === "resources" && <ResourcePanel h={h} t={t} dark={dark} />}
          {tab === "playlists" && <PlaylistPanel h={h} t={t} dark={dark} />}
          {tab === "breakroom" && <BreakroomView h={h} t={t} dark={dark} />}
        </div>

        <RoomChat t={t} />
      </div>

      {showExit && <ExitConfirmModal t={t} onYes={onYes} onNo={onNo} />}

      <style>{`
        .hackathon-room ::-webkit-scrollbar{width:5px}
        .hackathon-room ::-webkit-scrollbar-track{background:transparent}
        .hackathon-room ::-webkit-scrollbar-thumb{background:${t.scr};border-radius:3px}
        .hackathon-room input::placeholder,.hackathon-room textarea::placeholder{color:${t.tm}}
      `}</style>
    </div>
  );
}
