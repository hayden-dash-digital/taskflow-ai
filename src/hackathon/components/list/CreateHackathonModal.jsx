/* CreateHackathonModal.jsx — schedule form */
import React from "react";
import HackModal from "../shared/HackModal";
import HackAvatar from "../shared/HackAvatar";
import I from "../../icons";
import { TEAM } from "../../mockData";
import useHackathonStore from "../../stores/hackathonStore";

export default function CreateHackathonModal({ t }) {
  const { schedForm, setSchedForm, setShowSchedule } = useHackathonStore();
  return (
    <HackModal t={t} onClose={() => setShowSchedule(false)} width={520}>
      <div style={{ padding: "28px 30px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ fontSize: 20, fontWeight: 700 }}>Schedule a Hackathon</h3>
          <button onClick={() => setShowSchedule(false)} style={{ width: 30, height: 30, borderRadius: 8, border: `1px solid ${t.ibr}`, background: t.ib, color: t.tm, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>{I.close(16, t.tm)}</button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: t.tm, display: "block", marginBottom: 5 }}>Hackathon Name</label>
            <input value={schedForm.name} onChange={(e) => setSchedForm((p) => ({ ...p, name: e.target.value }))} placeholder="e.g. MVP Launch Blitz" style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: `1px solid ${t.ibr}`, background: t.ib, color: t.text, fontSize: 14, fontFamily: "inherit", outline: "none" }} />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: t.tm, display: "block", marginBottom: 5 }}>Description</label>
            <textarea value={schedForm.desc} onChange={(e) => setSchedForm((p) => ({ ...p, desc: e.target.value }))} placeholder="What's the focus?" rows={3} style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: `1px solid ${t.ibr}`, background: t.ib, color: t.text, fontSize: 14, fontFamily: "inherit", outline: "none", resize: "vertical" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: t.tm, display: "block", marginBottom: 5 }}>Theme / Focus</label>
              <input value={schedForm.theme} onChange={(e) => setSchedForm((p) => ({ ...p, theme: e.target.value }))} placeholder="Engineering, Design..." style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: `1px solid ${t.ibr}`, background: t.ib, color: t.text, fontSize: 14, fontFamily: "inherit", outline: "none" }} />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: t.tm, display: "block", marginBottom: 5 }}>Date & Time</label>
              <input type="datetime-local" value={schedForm.date} onChange={(e) => setSchedForm((p) => ({ ...p, date: e.target.value }))} style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: `1px solid ${t.ibr}`, background: t.ib, color: t.text, fontSize: 14, fontFamily: "inherit", outline: "none" }} />
            </div>
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: t.tm, display: "block", marginBottom: 8 }}>Invite Team Members</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {TEAM.filter((m) => m.id !== "u1").map((m) => {
                const inv = schedForm.invited.includes(m.id);
                return (
                  <div key={m.id} onClick={() => setSchedForm((p) => ({ ...p, invited: inv ? p.invited.filter((x) => x !== m.id) : [...p.invited, m.id] }))} style={{ display: "flex", alignItems: "center", gap: 7, padding: "7px 12px", borderRadius: 10, cursor: "pointer", border: `1.5px solid ${inv ? t.acc + "50" : t.ibr}`, background: inv ? t.al : "transparent", transition: "all 0.15s" }}>
                    <HackAvatar user={m} size={22} />
                    <span style={{ fontSize: 12, fontWeight: 600, color: inv ? t.acc : t.ts }}>{m.name.split(" ")[0]}</span>
                    {inv && <span style={{ color: t.acc }}>{I.check(12, t.acc)}</span>}
                  </div>
                );
              })}
            </div>
          </div>
          <button onClick={() => setShowSchedule(false)} style={{ marginTop: 6, padding: "12px 0", borderRadius: 12, border: "none", background: `linear-gradient(135deg,${t.acc},#818CF8)`, color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", width: "100%" }}>Schedule Hackathon</button>
        </div>
      </div>
    </HackModal>
  );
}
