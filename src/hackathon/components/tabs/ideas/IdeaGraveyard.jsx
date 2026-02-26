/* IdeaGraveyard.jsx — dead ideas list with revive */
import React from "react";
import I from "../../../icons";
import { u } from "../../../mockData";
import HackAvatar from "../../shared/HackAvatar";
import useHackathonStore from "../../../stores/hackathonStore";

export default function IdeaGraveyard({ t }) {
  const { graveyard, reviveIdea } = useHackathonStore();

  if (!graveyard.length) return null;

  return (
    <div style={{
      marginBottom: 18, padding: "16px 20px", borderRadius: 14,
      background: "#EF444408", border: "1px solid #EF444420",
      animation: "fadeIn 0.2s",
    }}>
      {/* Header */}
      <div style={{
        fontSize: 13, fontWeight: 700, color: "#EF4444",
        marginBottom: 10, display: "flex", alignItems: "center", gap: 5,
      }}>
        {I.skull(15, "#EF4444")} Idea Graveyard
      </div>

      {/* Dead idea rows */}
      {graveyard.map((gi) => (
        <div
          key={gi.id}
          style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            gap: 10, padding: "8px 0", borderBottom: "1px solid #EF444410",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: t.tm }}>
            <HackAvatar user={u(gi.user)} size={22} />
            <span style={{ textDecoration: "line-through" }}>{gi.content}</span>
          </div>
          <button
            onClick={() => reviveIdea(gi.id)}
            style={{
              fontSize: 11, color: t.acc, background: t.al, border: "none",
              padding: "4px 10px", borderRadius: 6, cursor: "pointer",
              fontWeight: 600, fontFamily: "inherit", whiteSpace: "nowrap",
            }}
          >
            Revive
          </button>
        </div>
      ))}
    </div>
  );
}
