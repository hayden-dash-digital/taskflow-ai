/* IdeaBoard.jsx — 3-column drag-lane idea board */
import React from "react";
import I from "../../../icons";
import { IDEA_CATS, IDEA_MSGS } from "../../../constants";
import useHackathonStore from "../../../stores/hackathonStore";
import IdeaNote from "./IdeaNote";
import IdeaGraveyard from "./IdeaGraveyard";
import IdeaDetailModal from "./IdeaDetailModal";

const COL_COLORS = { Workshopping: "#EAB308", Planning: "#3B82F6", "In Review": "#22C55E" };

export default function IdeaBoard({ t }) {
  const {
    ideas, graveyard, openIdea, dragId, showGrave, graveAnim,
    setDragId, setShowGrave, setGraveAnim, moveIdeaCat,
  } = useHackathonStore();

  const quote = IDEA_MSGS[Math.floor(Date.now() / 120000) % IDEA_MSGS.length];

  return (
    <div>
      {/* Header row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700 }}>Idea Board</h2>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button
            onClick={() => { setShowGrave(!showGrave); setGraveAnim(true); setTimeout(() => setGraveAnim(false), 800); }}
            style={{
              display: "flex", alignItems: "center", gap: 5, padding: "8px 14px", borderRadius: 10,
              border: `1px solid ${t.ibr}`, background: showGrave ? "#EF444412" : t.ib,
              color: showGrave ? "#EF4444" : t.tm, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: "inherit",
            }}
          >
            <span className={graveAnim ? "graveShake" : ""}>{I.skull(14, showGrave ? "#EF4444" : t.tm)}</span>
            {" "}Graveyard
            {graveyard.length > 0 && (
              <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 10 }}>{graveyard.length}</span>
            )}
          </button>
        </div>
      </div>

      {/* Inspirational quote banner */}
      <div style={{
        fontSize: 15, color: t.acc, marginBottom: 18, fontWeight: 600,
        padding: "12px 18px", borderRadius: 12, background: `${t.acc}08`,
        border: `1px solid ${t.acc}15`, display: "flex", alignItems: "center", gap: 8,
      }}>
        <span style={{ color: "#EAB308" }}>{I.bulb(18, "#EAB308")}</span> {quote}
      </div>

      {/* Graveyard panel */}
      {showGrave && graveyard.length > 0 && <IdeaGraveyard t={t} />}

      {/* 3-column grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
        {IDEA_CATS.map((cat) => {
          const cc = COL_COLORS[cat];
          const ci = ideas.filter((i) => i.cat === cat).sort((a, b) => b.votes - a.votes);
          return (
            <div
              key={cat}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => dragId && moveIdeaCat(dragId, cat)}
              style={{ minHeight: 200 }}
            >
              {/* Column header */}
              <div style={{
                display: "flex", alignItems: "center", gap: 7, marginBottom: 12,
                padding: "10px 14px", borderRadius: 12, background: cc + "12",
                border: `1px solid ${cc}25`,
              }}>
                <div style={{ width: 9, height: 9, borderRadius: "50%", background: cc }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: cc }}>{cat}</span>
                <span style={{ fontSize: 11, fontFamily: "'Space Mono',monospace", color: t.tm, marginLeft: "auto" }}>{ci.length}</span>
              </div>

              {/* Idea cards */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {ci.map((idea) => (
                  <IdeaNote key={idea.id} idea={idea} t={t} />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail modal */}
      {openIdea && <IdeaDetailModal t={t} />}
    </div>
  );
}
