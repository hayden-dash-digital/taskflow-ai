/* MeetingCard.jsx — join/RSVP card for a single meeting */
import React from "react";
import useHackathonStore from "../../../stores/hackathonStore";
import I from "../../../icons";
import HackAvatar from "../../shared/HackAvatar";
import { u } from "../../../mockData";

export default function MeetingCard({ meeting, h, t, dark }) {
  const { rsvps, setActiveMeeting, rsvpMeeting } = useHackathonStore();
  const isLive = meeting.status === "live";
  const hasRsvp = rsvps.includes(meeting.id);

  return (
    <div
      className="hFloat"
      style={{
        borderRadius: 16, background: t.card,
        border: `1.5px solid ${isLive ? t.acc + "50" : t.cb}`,
        padding: "20px 22px", display: "flex", flexDirection: "column", gap: 12,
        transition: "border-color 0.15s",
      }}
    >
      {/* Top row — title + live badge */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 16, fontWeight: 700 }}>{meeting.title}</span>
        {isLive && (
          <span style={{
            fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em",
            padding: "3px 10px", borderRadius: 20, color: "#fff",
            background: "#EF4444", animation: "hackFadeIn 0.3s",
            display: "flex", alignItems: "center", gap: 5,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff", display: "inline-block" }} />
            LIVE
          </span>
        )}
        {!isLive && (
          <span style={{
            fontSize: 10, fontWeight: 600, padding: "3px 10px", borderRadius: 20,
            background: t.al, color: t.acc,
          }}>
            Scheduled
          </span>
        )}
      </div>

      {/* Time & duration */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 12, color: t.ts }}>
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
          {I.cal(13, t.tm)} {meeting.time}
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
          {I.sprint ? I.sprint(13, t.tm) : null} {meeting.duration}
        </span>
      </div>

      {/* Agenda */}
      {meeting.agenda && (
        <p style={{ fontSize: 13, color: t.ts, lineHeight: 1.45, margin: 0 }}>
          {meeting.agenda}
        </p>
      )}

      {/* Participants */}
      <div style={{ display: "flex", alignItems: "center", gap: -4 }}>
        {(meeting.invited || []).slice(0, 5).map((uid, i) => {
          const user = u(uid);
          return user ? (
            <HackAvatar
              key={uid}
              user={user}
              size={24}
              style={{ marginLeft: i > 0 ? -6 : 0, border: `2px solid ${t.card}`, zIndex: 5 - i }}
            />
          ) : null;
        })}
        {(meeting.invited || []).length > 5 && (
          <span style={{ fontSize: 11, color: t.tm, marginLeft: 6, fontWeight: 600 }}>
            +{meeting.invited.length - 5}
          </span>
        )}
      </div>

      {/* Action button */}
      {isLive ? (
        <button
          onClick={() => setActiveMeeting(meeting)}
          style={{
            marginTop: 4, padding: "10px 0", borderRadius: 12, border: "none",
            background: `linear-gradient(135deg,${t.acc},#818CF8)`,
            color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer",
            fontFamily: "inherit", width: "100%",
            boxShadow: `0 4px 16px ${t.acc}30`,
          }}
        >
          Join Now
        </button>
      ) : (
        <button
          onClick={() => !hasRsvp && rsvpMeeting(meeting.id)}
          style={{
            marginTop: 4, padding: "10px 0", borderRadius: 12,
            border: hasRsvp ? `1.5px solid #22C55E40` : `1.5px solid ${t.ibr}`,
            background: hasRsvp ? "#22C55E12" : "transparent",
            color: hasRsvp ? "#22C55E" : t.ts,
            fontSize: 13, fontWeight: 600, cursor: hasRsvp ? "default" : "pointer",
            fontFamily: "inherit", width: "100%",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          }}
        >
          {hasRsvp ? <>{I.check(13, "#22C55E")} Going</> : "RSVP"}
        </button>
      )}
    </div>
  );
}
