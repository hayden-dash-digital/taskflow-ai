/* IdeaDetailModal.jsx — full idea view with vote, kill, comments */
import React from "react";
import I from "../../../icons";
import { IDEA_CATS } from "../../../constants";
import { u } from "../../../mockData";
import HackAvatar from "../../shared/HackAvatar";
import HackModal from "../../shared/HackModal";
import useHackathonStore from "../../../stores/hackathonStore";

export default function IdeaDetailModal({ t }) {
  const {
    ideas, openIdea, ideaCmt,
    setOpenIdea, setIdeaCmt, voteIdea, addIdeaCmt, moveIdeaCat, killIdea,
  } = useHackathonStore();

  const idea = ideas.find((i) => i.id === openIdea);
  if (!idea) return null;

  const iu = u(idea.user);

  const handleClose = () => { setOpenIdea(null); setIdeaCmt(""); };

  return (
    <HackModal t={t} onClose={handleClose} width={620}>
      <div style={{ padding: "28px 30px" }}>
        {/* Header — avatar + kill / close buttons */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <HackAvatar user={iu} size={32} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{iu?.name}</div>
              <div style={{ fontSize: 11, color: t.tm }}>{idea.cat}</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button
              onClick={() => killIdea(idea.id)}
              style={{
                display: "flex", alignItems: "center", gap: 4, padding: "6px 12px", borderRadius: 8,
                border: "1px solid #EF444430", background: "#EF444408", color: "#EF4444",
                fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
              }}
            >
              {I.trash(12, "#EF4444")} Graveyard
            </button>
            <button
              onClick={handleClose}
              style={{
                width: 30, height: 30, borderRadius: 8, border: `1px solid ${t.ibr}`,
                background: t.ib, color: t.tm, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              {I.close(16, t.tm)}
            </button>
          </div>
        </div>

        {/* Idea content in colored box */}
        <div style={{
          fontSize: 18, fontWeight: 600, lineHeight: 1.5, marginBottom: 14,
          padding: "16px 18px", borderRadius: 12,
          background: idea.color + "08", border: `1px solid ${idea.color}20`,
        }}>
          {idea.content}
        </div>

        {/* Vote button + category selectors */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
          <button
            onClick={() => voteIdea(idea.id)}
            style={{
              display: "flex", alignItems: "center", gap: 5, padding: "7px 16px", borderRadius: 9,
              border: "none", cursor: "pointer", background: t.al, color: t.acc,
              fontSize: 14, fontWeight: 700, fontFamily: "'Space Mono',monospace",
            }}
          >
            {I.thumbUp(15, t.acc)} {idea.votes}
          </button>
          {IDEA_CATS.map((cat) => (
            <button
              key={cat}
              onClick={() => moveIdeaCat(idea.id, cat)}
              style={{
                padding: "6px 12px", borderRadius: 8, cursor: "pointer", fontFamily: "inherit",
                border: `1px solid ${idea.cat === cat ? t.acc + "40" : t.ibr}`,
                background: idea.cat === cat ? t.al : "transparent",
                color: idea.cat === cat ? t.acc : t.tm,
                fontSize: 11, fontWeight: 600,
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Notes */}
        {idea.notes && (
          <div style={{
            padding: "12px 16px", borderRadius: 10, background: t.ib,
            border: `1px solid ${t.ibr}`, fontSize: 13, color: t.ts,
            lineHeight: 1.5, marginBottom: 14,
          }}>
            {idea.notes}
          </div>
        )}

        {/* Linked resources */}
        {idea.links.length > 0 && (
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: t.tm, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
              Linked Resources
            </div>
            {idea.links.map((l, li) => (
              <a
                key={li}
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: t.acc, marginBottom: 4, textDecoration: "none" }}
              >
                {I.link(13, t.acc)} {l.title}
              </a>
            ))}
          </div>
        )}

        {/* Discussion / comments */}
        <div style={{ fontSize: 11, fontWeight: 600, color: t.tm, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>
          Discussion ({idea.comments.length})
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
          {idea.comments.map((c, ci) => (
            <div key={ci} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
              <HackAvatar user={u(c.user)} size={24} />
              <div>
                <span style={{ fontSize: 12, fontWeight: 600 }}>{u(c.user)?.name.split(" ")[0]}</span>
                <div style={{ fontSize: 13, color: t.ts, marginTop: 2 }}>{c.text}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Comment input */}
        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={ideaCmt}
            onChange={(e) => setIdeaCmt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addIdeaCmt(idea.id)}
            placeholder="Add a comment..."
            style={{
              flex: 1, padding: "10px 14px", borderRadius: 10,
              border: `1px solid ${t.ibr}`, background: t.ib,
              color: t.text, fontSize: 13, fontFamily: "inherit", outline: "none",
            }}
          />
          <button
            onClick={() => addIdeaCmt(idea.id)}
            style={{
              padding: "0 18px", borderRadius: 10, border: "none",
              background: ideaCmt.trim() ? t.acc : t.ib,
              color: ideaCmt.trim() ? "#fff" : t.tm,
              cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: "inherit",
            }}
          >
            Post
          </button>
        </div>
      </div>
    </HackModal>
  );
}
