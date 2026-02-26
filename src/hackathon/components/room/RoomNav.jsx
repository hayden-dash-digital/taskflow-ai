/* RoomNav.jsx — left 80px icon sidebar (8 tabs) */
import React from "react";
import HackAvatar from "../shared/HackAvatar";
import I from "../../icons";
import { u } from "../../mockData";
import useHackathonStore from "../../stores/hackathonStore";

const TABS = [
  { id: "ideas", label: "Ideas", icon: I.bulb },
  { id: "tasks", label: "Tasks", icon: I.kanban },
  { id: "sprint", label: "Sprint", icon: I.sprint },
  { id: "meetings", label: "Meetings", icon: I.users },
  { id: "goals", label: "Goals", icon: I.target },
  { id: "resources", label: "Resources", icon: I.link },
  { id: "playlists", label: "Playlists", icon: I.music },
  { id: "breakroom", label: "Breakroom", icon: I.coffee },
];

export default function RoomNav({ h, t }) {
  const { tab, setTab } = useHackathonStore();
  const parts = h.participants.map((id) => u(id)).filter(Boolean);

  return (
    <div style={{ width: 80, background: t.side, borderRight: `1px solid ${t.cb}`, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 12, gap: 4 }}>
      {TABS.map((tb) => {
        const active = tab === tb.id;
        const isIdeas = tb.id === "ideas";
        const isBreak = tb.id === "breakroom";
        return (
          <div key={tb.id} onClick={() => setTab(tb.id)} title={tb.label} style={{
            width: 62, padding: "10px 0", borderRadius: 13, display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
            cursor: "pointer", transition: "all 0.2s",
            background: active ? (isBreak ? "#F9731620" : `${t.acc}30`) : "transparent",
            color: active ? (isBreak ? "#F97316" : t.acc) : t.tm,
            border: active ? `2px solid ${isBreak ? "#F9731640" : t.acc + "50"}` : "2px solid transparent",
            boxShadow: active ? `0 0 12px ${isBreak ? "#F9731615" : t.acc + "20"}` : "none",
          }}>
            <div style={{ position: "relative" }}>
              {tb.icon(20, active ? (isBreak ? "#F97316" : t.acc) : (isIdeas ? "#EAB308" : t.tm))}
              {isIdeas && !active && <div style={{ position: "absolute", inset: -3, borderRadius: "50%", background: "#EAB30815" }} />}
            </div>
            <span style={{ fontSize: 10, fontWeight: active ? 700 : 500 }}>{tb.label}</span>
          </div>
        );
      })}
      <div style={{ flex: 1 }} />
      <div style={{ padding: "4px 0 10px", display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
        {parts.slice(0, 3).map((uu) => <HackAvatar key={uu.id} user={uu} size={24} style={{ "--ring": t.side }} />)}
      </div>
    </div>
  );
}
