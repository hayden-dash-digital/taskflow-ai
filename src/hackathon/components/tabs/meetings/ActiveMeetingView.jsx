/* ActiveMeetingView.jsx — video grid + agenda + notes */
import React from "react";
import useHackathonStore from "../../../stores/hackathonStore";
import I from "../../../icons";
import HackAvatar from "../../shared/HackAvatar";
import { u } from "../../../mockData";

export default function ActiveMeetingView({ h, t, dark }) {
  const {
    activeMeeting, meetNote, meetNotes, handRaised,
    setActiveMeeting, setMeetNote, setHandRaised, addMeetNote,
  } = useHackathonStore();

  const participants = (activeMeeting.invited || []).map((uid) => u(uid)).filter(Boolean);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* ── Top bar ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            onClick={() => setActiveMeeting(null)}
            style={{
              width: 32, height: 32, borderRadius: 10, border: `1px solid ${t.ibr}`,
              background: t.ib, color: t.tm, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            {I.back(16, t.tm)}
          </button>
          <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em" }}>{activeMeeting.title}</h2>
          <span style={{
            fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em",
            padding: "3px 10px", borderRadius: 20, color: "#fff", background: "#EF4444",
            display: "flex", alignItems: "center", gap: 5,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff", display: "inline-block" }} />
            LIVE
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* Raise hand toggle */}
          <button
            onClick={() => setHandRaised(!handRaised)}
            style={{
              padding: "8px 16px", borderRadius: 10,
              border: handRaised ? `1.5px solid #EAB308` : `1px solid ${t.ibr}`,
              background: handRaised ? "#EAB30815" : t.ib,
              color: handRaised ? "#EAB308" : t.ts,
              fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
              display: "flex", alignItems: "center", gap: 6,
            }}
          >
            <span style={{ fontSize: 16 }}>&#9995;</span>
            {handRaised ? "Hand Raised" : "Raise Hand"}
          </button>

          {/* End meeting */}
          <button
            onClick={() => setActiveMeeting(null)}
            style={{
              padding: "8px 18px", borderRadius: 10, border: "none",
              background: "#EF4444", color: "#fff",
              fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
            }}
          >
            End Meeting
          </button>
        </div>
      </div>

      {/* ── Video grid ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: `repeat(${Math.min(participants.length, 4)}, 1fr)`,
        gap: 12, marginBottom: 20,
      }}>
        {participants.map((p) => {
          const isYou = p.id === "u1";
          return (
            <div
              key={p.id}
              style={{
                borderRadius: 16, background: t.card, border: `1.5px solid ${isYou ? t.acc + "40" : t.cb}`,
                padding: "24px 16px", display: "flex", flexDirection: "column",
                alignItems: "center", gap: 10, position: "relative",
              }}
            >
              {/* Online dot */}
              <div style={{
                position: "absolute", top: 12, right: 12,
                width: 8, height: 8, borderRadius: "50%",
                background: p.online ? "#22C55E" : t.tm,
              }} />

              <HackAvatar user={p} size={52} style={{ "--ring": t.card }} />
              <span style={{ fontSize: 14, fontWeight: 700 }}>
                {isYou ? "You" : p.name.split(" ")[0]}
              </span>
              <span style={{ fontSize: 11, color: t.ts }}>{p.role}</span>

              {/* Mic / camera controls for "You" */}
              {isYou && (
                <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                  <button
                    style={{
                      width: 34, height: 34, borderRadius: 10,
                      border: `1px solid ${t.ibr}`, background: t.ib,
                      color: t.text, cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 15,
                    }}
                    title="Toggle Mic"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
                      <path d="M19 10v2a7 7 0 01-14 0v-2" />
                      <line x1="12" y1="19" x2="12" y2="23" />
                      <line x1="8" y1="23" x2="16" y2="23" />
                    </svg>
                  </button>
                  <button
                    style={{
                      width: 34, height: 34, borderRadius: 10,
                      border: `1px solid ${t.ibr}`, background: t.ib,
                      color: t.text, cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 15,
                    }}
                    title="Toggle Camera"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="23 7 16 12 23 17 23 7" />
                      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                    </svg>
                  </button>
                </div>
              )}

              {/* Hand raised indicator */}
              {isYou && handRaised && (
                <span style={{
                  position: "absolute", top: 10, left: 12,
                  fontSize: 18, animation: "hackFadeIn 0.2s",
                }}>
                  &#9995;
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Leave button */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
        <button
          onClick={() => setActiveMeeting(null)}
          style={{
            padding: "10px 28px", borderRadius: 12, border: `1.5px solid #EF444440`,
            background: "#EF444412", color: "#EF4444",
            fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
            display: "flex", alignItems: "center", gap: 7,
          }}
        >
          {I.close(14, "#EF4444")} Leave Meeting
        </button>
      </div>

      {/* ── Bottom two columns: Agenda + Notes ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, flex: 1, minHeight: 0 }}>
        {/* Agenda */}
        <div style={{
          borderRadius: 16, background: t.card, border: `1px solid ${t.cb}`,
          padding: "18px 20px", display: "flex", flexDirection: "column",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: t.acc }} />
            <span style={{ fontSize: 14, fontWeight: 700 }}>Agenda</span>
          </div>
          <p style={{ fontSize: 13, color: t.ts, lineHeight: 1.6, margin: 0, flex: 1 }}>
            {activeMeeting.agenda || "No agenda set."}
          </p>
          <div style={{ fontSize: 11, color: t.tm, marginTop: 10 }}>
            {activeMeeting.duration} &middot; {activeMeeting.time}
          </div>
        </div>

        {/* Meeting Notes */}
        <div style={{
          borderRadius: 16, background: t.card, border: `1px solid ${t.cb}`,
          padding: "18px 20px", display: "flex", flexDirection: "column",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#22C55E" }} />
            <span style={{ fontSize: 14, fontWeight: 700 }}>Meeting Notes</span>
          </div>

          {/* Notes list */}
          <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8, marginBottom: 12, minHeight: 60 }}>
            {meetNotes.length === 0 && (
              <span style={{ fontSize: 12, color: t.tm }}>No notes yet. Add one below.</span>
            )}
            {meetNotes.map((n, i) => (
              <div key={i} style={{
                padding: "8px 12px", borderRadius: 10, background: t.ib,
                border: `1px solid ${t.ibr}`, fontSize: 13, color: t.text,
                display: "flex", justifyContent: "space-between", alignItems: "flex-start",
                animation: "hackFadeIn 0.15s",
              }}>
                <span style={{ flex: 1, lineHeight: 1.4 }}>{n.text}</span>
                <span style={{ fontSize: 10, color: t.tm, flexShrink: 0, marginLeft: 10, marginTop: 2 }}>{n.time}</span>
              </div>
            ))}
          </div>

          {/* Note input */}
          <div style={{ display: "flex", gap: 6 }}>
            <input
              value={meetNote}
              onChange={(e) => setMeetNote(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addMeetNote()}
              placeholder="Add a note..."
              style={{
                flex: 1, padding: "9px 12px", borderRadius: 10,
                border: `1px solid ${t.ibr}`, background: t.ib,
                color: t.text, fontSize: 13, fontFamily: "inherit", outline: "none",
              }}
            />
            <button
              onClick={addMeetNote}
              style={{
                padding: "0 14px", borderRadius: 10, border: "none",
                background: meetNote.trim() ? t.acc : "transparent",
                color: meetNote.trim() ? "#fff" : t.tm,
                fontSize: 12, fontWeight: 600, cursor: "pointer",
                fontFamily: "inherit", display: "flex", alignItems: "center", gap: 5,
              }}
            >
              {I.send(12)} Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
