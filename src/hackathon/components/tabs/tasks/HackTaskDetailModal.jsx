/* HackTaskDetailModal.jsx — task detail overlay with subtask management */
import React from "react";
import useHackathonStore from "../../../stores/hackathonStore";
import HackModal from "../../shared/HackModal";
import HackAvatar from "../../shared/HackAvatar";
import I from "../../../icons";
import { PC } from "../../../constants";
import { u } from "../../../mockData";

export default function HackTaskDetailModal({ task, h, t, dark }) {
  const { setOpenTask, moveTask, setTasks } = useHackathonStore();
  const assignee = u(task.assignee);
  const pColor = PC[task.priority] || PC.medium;
  const done = task.status === "done";
  const totalSub = task.subtasks?.length || 0;
  const doneSub = task.subtasks?.filter((s) => s.done).length || 0;
  const pct = totalSub > 0 ? Math.round((doneSub / totalSub) * 100) : 0;

  const statusLabel = task.status === "todo" ? "To Do" : task.status === "progress" ? "In Progress" : "Done";
  const statusColor = task.status === "todo" ? "#3B82F6" : task.status === "progress" ? "#F97316" : "#22C55E";

  const toggleSubtask = (idx) => {
    setTasks((prev) =>
      prev.map((tk) =>
        tk.id === task.id
          ? {
              ...tk,
              subtasks: tk.subtasks.map((s, i) =>
                i === idx ? { ...s, done: !s.done } : s
              ),
            }
          : tk
      )
    );
    // Update local openTask view
    const updated = {
      ...task,
      subtasks: task.subtasks.map((s, i) =>
        i === idx ? { ...s, done: !s.done } : s
      ),
    };
    setOpenTask(updated);
  };

  const handleAction = () => {
    if (task.status === "todo") moveTask(task.id, "progress");
    else if (task.status === "progress") moveTask(task.id, "done");
    setOpenTask(null);
  };

  return (
    <HackModal t={t} onClose={() => setOpenTask(null)} width={520}>
      <div style={{ padding: "28px 30px" }}>
        {/* Header row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            {/* Priority badge */}
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              fontSize: 11, fontWeight: 700, textTransform: "uppercase",
              letterSpacing: "0.04em",
              color: pColor, background: pColor + "18",
              padding: "5px 12px", borderRadius: 8,
            }}>
              {I.flag(10, pColor)} {task.priority}
            </span>
            {/* Status badge */}
            <span style={{
              fontSize: 11, fontWeight: 700,
              color: statusColor, background: statusColor + "18",
              padding: "5px 12px", borderRadius: 8,
            }}>
              {statusLabel}
            </span>
          </div>
          <button
            onClick={() => setOpenTask(null)}
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

        {/* Title */}
        <h3 style={{
          fontSize: 20, fontWeight: 700, letterSpacing: "-0.03em",
          marginBottom: 8, lineHeight: 1.3,
          textDecoration: done ? "line-through" : "none",
          color: done ? t.tm : t.text,
        }}>
          {task.title}
        </h3>

        {/* Description */}
        {task.desc && (
          <p style={{ fontSize: 14, color: t.ts, lineHeight: 1.55, marginBottom: 20 }}>
            {task.desc}
          </p>
        )}

        {/* Assignee */}
        {assignee && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22, padding: "12px 14px", borderRadius: 12, background: t.ib, border: `1px solid ${t.ibr}` }}>
            <HackAvatar user={assignee} size={32} style={{ "--ring": t.ib }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{assignee.name}</div>
              <div style={{ fontSize: 11, color: t.tm }}>{assignee.role}</div>
            </div>
          </div>
        )}

        {/* Subtasks */}
        {totalSub > 0 && (
          <div style={{ marginBottom: 22 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 700 }}>Subtasks</span>
              <span style={{ fontSize: 12, color: t.tm, fontWeight: 600 }}>{doneSub}/{totalSub} completed</span>
            </div>

            {/* Progress bar */}
            <div style={{ height: 6, borderRadius: 3, background: t.ibr, overflow: "hidden", marginBottom: 12 }}>
              <div style={{
                height: "100%", borderRadius: 3,
                background: done ? "#22C55E" : t.acc,
                width: `${pct}%`, transition: "width 0.3s",
              }} />
            </div>

            {/* Subtask list */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {task.subtasks.map((sub, idx) => (
                <div
                  key={idx}
                  onClick={() => toggleSubtask(idx)}
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "10px 12px", borderRadius: 10,
                    background: sub.done ? (dark ? "#0F291820" : "#F0FDF430") : "transparent",
                    border: `1px solid ${sub.done ? "#22C55E30" : t.ibr}`,
                    cursor: "pointer", transition: "all 0.15s",
                  }}
                >
                  <div style={{
                    width: 20, height: 20, borderRadius: 6, flexShrink: 0,
                    border: sub.done ? "none" : `2px solid ${t.ibr}`,
                    background: sub.done ? "#22C55E" : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.15s",
                  }}>
                    {sub.done && I.check(12, "#fff")}
                  </div>
                  <span style={{
                    fontSize: 13, fontWeight: 500,
                    color: sub.done ? t.tm : t.text,
                    textDecoration: sub.done ? "line-through" : "none",
                  }}>
                    {sub.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action button */}
        {!done && (
          <button
            onClick={handleAction}
            style={{
              width: "100%", padding: "12px 0", borderRadius: 12,
              border: "none", fontSize: 14, fontWeight: 600,
              cursor: "pointer", fontFamily: "inherit",
              color: "#fff",
              background: task.status === "todo"
                ? "linear-gradient(135deg, #3B82F6, #60A5FA)"
                : "linear-gradient(135deg, #22C55E, #4ADE80)",
              boxShadow: task.status === "todo"
                ? "0 4px 16px #3B82F630"
                : "0 4px 16px #22C55E30",
            }}
          >
            {task.status === "todo" ? "Start Task" : "Mark Done"}
          </button>
        )}

        {done && (
          <div style={{
            width: "100%", padding: "12px 0", borderRadius: 12,
            background: "#22C55E15", color: "#22C55E",
            fontSize: 14, fontWeight: 600, textAlign: "center",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          }}>
            {I.check(14, "#22C55E")} Completed
          </div>
        )}
      </div>
    </HackModal>
  );
}
