/* HackTaskCard.jsx — draggable task card for kanban columns */
import React from "react";
import useHackathonStore from "../../../stores/hackathonStore";
import I from "../../../icons";
import { PC } from "../../../constants";
import { u } from "../../../mockData";
import HackAvatar from "../../shared/HackAvatar";

export default function HackTaskCard({ task, t, dark }) {
  const { setTaskDragId, setOpenTask, moveTask } = useHackathonStore();
  const assignee = u(task.assignee);
  const done = task.status === "done";
  const pColor = PC[task.priority] || PC.medium;
  const totalSub = task.subtasks?.length || 0;
  const doneSub = task.subtasks?.filter((s) => s.done).length || 0;
  const pct = totalSub > 0 ? Math.round((doneSub / totalSub) * 100) : 0;

  const handleAction = (e) => {
    e.stopPropagation();
    if (task.status === "todo") moveTask(task.id, "progress");
    else if (task.status === "progress") moveTask(task.id, "done");
  };

  return (
    <div
      draggable
      onDragStart={() => setTaskDragId(task.id)}
      onDragEnd={() => setTaskDragId(null)}
      onClick={() => setOpenTask(task)}
      style={{
        background: t.ib,
        borderRadius: 13,
        border: `1px solid ${t.ibr}`,
        borderLeft: `4px solid ${pColor}`,
        padding: "14px 15px",
        cursor: "grab",
        transition: "box-shadow 0.15s, transform 0.15s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = t.shH;
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Title */}
      <div style={{
        fontSize: 13, fontWeight: 600, marginBottom: 10,
        lineHeight: 1.35, letterSpacing: "-0.01em",
        textDecoration: done ? "line-through" : "none",
        color: done ? t.tm : t.text,
      }}>
        {task.title}
      </div>

      {/* Subtask progress */}
      {totalSub > 0 && (
        <div style={{ marginBottom: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
            <span style={{ fontSize: 11, color: t.tm }}>{doneSub}/{totalSub} subtasks</span>
            <span style={{ fontSize: 11, color: t.tm, fontWeight: 600 }}>{pct}%</span>
          </div>
          <div style={{ height: 4, borderRadius: 2, background: t.ibr, overflow: "hidden" }}>
            <div style={{
              height: "100%", borderRadius: 2,
              background: done ? "#22C55E" : t.acc,
              width: `${pct}%`, transition: "width 0.3s",
            }} />
          </div>
        </div>
      )}

      {/* Footer: priority badge, action, avatar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* Priority badge */}
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            fontSize: 10, fontWeight: 700, textTransform: "uppercase",
            letterSpacing: "0.04em",
            color: pColor, background: pColor + "18",
            padding: "3px 8px", borderRadius: 6,
          }}>
            {I.flag(9, pColor)} {task.priority}
          </span>

          {/* Action button */}
          {!done && (
            <button
              onClick={handleAction}
              style={{
                display: "inline-flex", alignItems: "center", gap: 4,
                fontSize: 10, fontWeight: 600,
                color: task.status === "todo" ? "#3B82F6" : "#22C55E",
                background: (task.status === "todo" ? "#3B82F6" : "#22C55E") + "15",
                border: "none", padding: "3px 9px", borderRadius: 6,
                cursor: "pointer", fontFamily: "inherit",
              }}
            >
              {task.status === "todo" ? (
                <>{I.chevR(10, "#3B82F6")} Start</>
              ) : (
                <>{I.check(10, "#22C55E")} Done</>
              )}
            </button>
          )}
        </div>

        {/* Assignee */}
        {assignee && (
          <HackAvatar user={assignee} size={24} style={{ "--ring": t.ib }} />
        )}
      </div>
    </div>
  );
}
