/* CreateHackTaskModal.jsx — form to add a new task */
import React from "react";
import useHackathonStore from "../../../stores/hackathonStore";
import HackModal from "../../shared/HackModal";
import HackAvatar from "../../shared/HackAvatar";
import I from "../../../icons";
import { PC } from "../../../constants";
import { u } from "../../../mockData";

const PRIORITIES = ["urgent", "high", "medium", "low"];

export default function CreateHackTaskModal({ h, t, dark }) {
  const { newTaskForm, setNewTaskForm, addTask, setShowAddTask } = useHackathonStore();
  const participants = (h.participants || []).map((id) => u(id)).filter(Boolean);

  const handleSubmit = () => {
    addTask();
  };

  return (
    <HackModal t={t} onClose={() => setShowAddTask(false)} width={520}>
      <div style={{ padding: "28px 30px" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.03em" }}>Create Task</h3>
          <button
            onClick={() => setShowAddTask(false)}
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

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Title */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: t.tm, display: "block", marginBottom: 5 }}>Task Title</label>
            <input
              value={newTaskForm.title}
              onChange={(e) => setNewTaskForm((p) => ({ ...p, title: e.target.value }))}
              placeholder="e.g. Build auth flow"
              style={{
                width: "100%", padding: "11px 14px", borderRadius: 10,
                border: `1px solid ${t.ibr}`, background: t.ib,
                color: t.text, fontSize: 14, fontFamily: "inherit", outline: "none",
              }}
            />
          </div>

          {/* Description */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: t.tm, display: "block", marginBottom: 5 }}>Description</label>
            <textarea
              value={newTaskForm.desc}
              onChange={(e) => setNewTaskForm((p) => ({ ...p, desc: e.target.value }))}
              placeholder="What needs to be done?"
              rows={3}
              style={{
                width: "100%", padding: "11px 14px", borderRadius: 10,
                border: `1px solid ${t.ibr}`, background: t.ib,
                color: t.text, fontSize: 14, fontFamily: "inherit",
                outline: "none", resize: "vertical",
              }}
            />
          </div>

          {/* Priority selector */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: t.tm, display: "block", marginBottom: 8 }}>Priority</label>
            <div style={{ display: "flex", gap: 8 }}>
              {PRIORITIES.map((p) => {
                const active = newTaskForm.priority === p;
                const pColor = PC[p];
                return (
                  <button
                    key={p}
                    onClick={() => setNewTaskForm((prev) => ({ ...prev, priority: p }))}
                    style={{
                      flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                      padding: "9px 0", borderRadius: 10,
                      border: `1.5px solid ${active ? pColor + "60" : t.ibr}`,
                      background: active ? pColor + "18" : "transparent",
                      color: active ? pColor : t.ts,
                      fontSize: 11, fontWeight: 700, textTransform: "capitalize",
                      cursor: "pointer", fontFamily: "inherit",
                      transition: "all 0.15s",
                    }}
                  >
                    {I.flag(9, active ? pColor : t.ts)} {p}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Assignee selector */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: t.tm, display: "block", marginBottom: 8 }}>Assign To</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {participants.map((member) => {
                const active = newTaskForm.assignee === member.id;
                return (
                  <div
                    key={member.id}
                    onClick={() => setNewTaskForm((prev) => ({ ...prev, assignee: member.id }))}
                    style={{
                      display: "flex", alignItems: "center", gap: 7,
                      padding: "7px 12px", borderRadius: 10,
                      cursor: "pointer",
                      border: `1.5px solid ${active ? t.acc + "50" : t.ibr}`,
                      background: active ? t.al : "transparent",
                      transition: "all 0.15s",
                    }}
                  >
                    <HackAvatar user={member} size={22} />
                    <span style={{ fontSize: 12, fontWeight: 600, color: active ? t.acc : t.ts }}>
                      {member.name.split(" ")[0]}
                    </span>
                    {active && <span style={{ color: t.acc }}>{I.check(12, t.acc)}</span>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            style={{
              marginTop: 6, padding: "12px 0", borderRadius: 12,
              border: "none",
              background: `linear-gradient(135deg,${t.acc},#818CF8)`,
              color: "#fff", fontSize: 14, fontWeight: 600,
              cursor: "pointer", fontFamily: "inherit", width: "100%",
              boxShadow: `0 4px 16px ${t.acc}30`,
              opacity: newTaskForm.title.trim() ? 1 : 0.5,
            }}
          >
            Create Task
          </button>
        </div>
      </div>
    </HackModal>
  );
}
