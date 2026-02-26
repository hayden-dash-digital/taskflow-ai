/* IdeaNote.jsx — draggable sticky card for a single idea */
import React from "react";
import I from "../../../icons";
import { u } from "../../../mockData";
import HackAvatar from "../../shared/HackAvatar";
import useHackathonStore from "../../../stores/hackathonStore";

export default function IdeaNote({ idea, t }) {
  const { setOpenIdea, setDragId, voteIdea } = useHackathonStore();
  const iu = u(idea.user);

  return (
    <div
      draggable
      onDragStart={() => setDragId(idea.id)}
      onClick={() => setOpenIdea(idea.id)}
      className="ideaCard"
      style={{
        padding: "18px 20px", borderRadius: 12, cursor: "pointer",
        background: idea.color + "10", border: `1.5px solid ${idea.color}30`,
        transition: "all 0.25s cubic-bezier(0.175,0.885,0.32,1.275)",
        animation: "fadeIn 0.2s",
      }}
    >
      {/* Content */}
      <div style={{ fontSize: 14.5, lineHeight: 1.55, color: t.text, marginBottom: 12 }}>
        {idea.content}
      </div>

      {/* Footer — avatar, comments, vote */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <HackAvatar user={iu} size={22} />
          <span style={{ fontSize: 12, color: t.tm }}>{iu?.name.split(" ")[0]}</span>
          {idea.comments.length > 0 && (
            <span style={{
              display: "flex", alignItems: "center", gap: 3, fontSize: 11,
              color: t.ts, background: t.ib, padding: "2px 7px", borderRadius: 5,
            }}>
              {I.comment(12, t.ts)} {idea.comments.length}
            </span>
          )}
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); voteIdea(idea.id); }}
          style={{
            display: "flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 8,
            border: "none", cursor: "pointer",
            background: idea.votes > 0 ? t.al : t.ib,
            color: idea.votes > 0 ? t.acc : t.tm,
            fontSize: 13, fontWeight: 700, fontFamily: "'Space Mono',monospace",
          }}
        >
          {I.thumbUp(13, idea.votes > 0 ? t.acc : t.tm)} {idea.votes}
        </button>
      </div>
    </div>
  );
}
