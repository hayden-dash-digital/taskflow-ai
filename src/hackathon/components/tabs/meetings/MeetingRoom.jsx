/* MeetingRoom.jsx — list/active toggle for meetings tab */
import React from "react";
import useHackathonStore from "../../../stores/hackathonStore";
import I from "../../../icons";
import MeetingCard from "./MeetingCard";
import ActiveMeetingView from "./ActiveMeetingView";
import CreateMeetingModal from "./CreateMeetingModal";

export default function MeetingRoom({ h, t, dark }) {
  const {
    meetings, showMeeting, activeMeeting,
    setShowMeeting, setActiveMeeting,
  } = useHackathonStore();

  /* ── Active meeting view ── */
  if (activeMeeting) {
    return <ActiveMeetingView h={h} t={t} dark={dark} />;
  }

  /* ── List view ── */
  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {I.users(22, t.acc)}
          <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.03em" }}>Meeting Room</h2>
        </div>
        <button
          onClick={() => setShowMeeting(true)}
          style={{
            display: "flex", alignItems: "center", gap: 7,
            padding: "10px 20px", borderRadius: 12, border: "none",
            background: `linear-gradient(135deg,${t.acc},#818CF8)`,
            color: "#fff", fontSize: 13, fontWeight: 600,
            cursor: "pointer", fontFamily: "inherit",
            boxShadow: `0 4px 16px ${t.acc}30`,
          }}
        >
          {I.plus(14, "#fff")} New Meeting
        </button>
      </div>

      {/* Subtitle */}
      <p style={{ fontSize: 13, color: t.ts, marginBottom: 20, lineHeight: 1.5 }}>
        Schedule syncs, join live sessions, and keep everyone aligned.
      </p>

      {/* Meeting list */}
      {meetings.length === 0 ? (
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          padding: "60px 0", borderRadius: 16, border: `2px dashed ${t.ibr}`, background: t.card,
        }}>
          {I.cal(40, t.tm)}
          <span style={{ fontSize: 15, fontWeight: 600, color: t.tm, marginTop: 14 }}>No meetings yet</span>
          <span style={{ fontSize: 12, color: t.tm, marginTop: 4 }}>Schedule one to get started.</span>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {meetings.map((m) => (
            <MeetingCard key={m.id} meeting={m} h={h} t={t} dark={dark} />
          ))}
        </div>
      )}

      {/* Create modal */}
      {showMeeting && <CreateMeetingModal h={h} t={t} dark={dark} />}
    </div>
  );
}
