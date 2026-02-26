/* CreateMeetingModal.jsx — form to schedule a new meeting */
import React from "react";
import useHackathonStore from "../../../stores/hackathonStore";
import I from "../../../icons";
import HackModal from "../../shared/HackModal";
import HackAvatar from "../../shared/HackAvatar";
import { TEAM } from "../../../mockData";

const DURATIONS = ["15 min", "30 min", "1 hr"];

export default function CreateMeetingModal({ h, t, dark }) {
  const { newMeet, setNewMeet, setShowMeeting, addMeeting } = useHackathonStore();

  return (
    <HackModal t={t} onClose={() => setShowMeeting(false)} width={520}>
      <div style={{ padding: "28px 30px" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ fontSize: 20, fontWeight: 700 }}>Schedule a Meeting</h3>
          <button
            onClick={() => setShowMeeting(false)}
            style={{
              width: 30, height: 30, borderRadius: 8,
              border: `1px solid ${t.ibr}`, background: t.ib,
              color: t.tm, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            {I.close(16, t.tm)}
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Title */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: t.tm, display: "block", marginBottom: 5 }}>Meeting Title</label>
            <input
              value={newMeet.title}
              onChange={(e) => setNewMeet((p) => ({ ...p, title: e.target.value }))}
              placeholder="e.g. Daily Standup"
              style={{
                width: "100%", padding: "11px 14px", borderRadius: 10,
                border: `1px solid ${t.ibr}`, background: t.ib,
                color: t.text, fontSize: 14, fontFamily: "inherit", outline: "none",
              }}
            />
          </div>

          {/* Time + Duration */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: t.tm, display: "block", marginBottom: 5 }}>Date & Time</label>
              <input
                type="datetime-local"
                value={newMeet.time}
                onChange={(e) => setNewMeet((p) => ({ ...p, time: e.target.value }))}
                style={{
                  width: "100%", padding: "11px 14px", borderRadius: 10,
                  border: `1px solid ${t.ibr}`, background: t.ib,
                  color: t.text, fontSize: 14, fontFamily: "inherit", outline: "none",
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: t.tm, display: "block", marginBottom: 5 }}>Duration</label>
              <div style={{ display: "flex", gap: 6 }}>
                {DURATIONS.map((d) => (
                  <button
                    key={d}
                    onClick={() => setNewMeet((p) => ({ ...p, duration: d }))}
                    style={{
                      flex: 1, padding: "10px 0", borderRadius: 10,
                      border: newMeet.duration === d ? `1.5px solid ${t.acc}` : `1px solid ${t.ibr}`,
                      background: newMeet.duration === d ? t.al : "transparent",
                      color: newMeet.duration === d ? t.acc : t.ts,
                      fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                    }}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Agenda */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: t.tm, display: "block", marginBottom: 5 }}>Agenda</label>
            <textarea
              value={newMeet.agenda}
              onChange={(e) => setNewMeet((p) => ({ ...p, agenda: e.target.value }))}
              placeholder="What will be discussed?"
              rows={3}
              style={{
                width: "100%", padding: "11px 14px", borderRadius: 10,
                border: `1px solid ${t.ibr}`, background: t.ib,
                color: t.text, fontSize: 14, fontFamily: "inherit", outline: "none",
                resize: "vertical",
              }}
            />
          </div>

          {/* Invite members */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: t.tm, display: "block", marginBottom: 8 }}>Invite Members</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {TEAM.filter((m) => m.id !== "u1").map((m) => {
                const inv = newMeet.invited.includes(m.id);
                return (
                  <div
                    key={m.id}
                    onClick={() =>
                      setNewMeet((p) => ({
                        ...p,
                        invited: inv
                          ? p.invited.filter((x) => x !== m.id)
                          : [...p.invited, m.id],
                      }))
                    }
                    style={{
                      display: "flex", alignItems: "center", gap: 7,
                      padding: "7px 12px", borderRadius: 10, cursor: "pointer",
                      border: `1.5px solid ${inv ? t.acc + "50" : t.ibr}`,
                      background: inv ? t.al : "transparent",
                      transition: "all 0.15s",
                    }}
                  >
                    <HackAvatar user={m} size={22} />
                    <span style={{ fontSize: 12, fontWeight: 600, color: inv ? t.acc : t.ts }}>
                      {m.name.split(" ")[0]}
                    </span>
                    {inv && <span style={{ color: t.acc }}>{I.check(12, t.acc)}</span>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={addMeeting}
            style={{
              marginTop: 6, padding: "12px 0", borderRadius: 12, border: "none",
              background: `linear-gradient(135deg,${t.acc},#818CF8)`,
              color: "#fff", fontSize: 14, fontWeight: 600,
              cursor: "pointer", fontFamily: "inherit", width: "100%",
              boxShadow: `0 4px 16px ${t.acc}30`,
            }}
          >
            Schedule Meeting
          </button>
        </div>
      </div>
    </HackModal>
  );
}
