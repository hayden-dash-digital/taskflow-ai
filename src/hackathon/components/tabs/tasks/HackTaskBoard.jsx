/* HackTaskBoard.jsx — 3-column kanban board for hackathon tasks */
import React from "react";
import useHackathonStore from "../../../stores/hackathonStore";
import I from "../../../icons";
import HackTaskCard from "./HackTaskCard";
import CreateHackTaskModal from "./CreateHackTaskModal";
import HackTaskDetailModal from "./HackTaskDetailModal";

const COLS = [
  { id: "todo", label: "To Do", color: "#3B82F6" },
  { id: "progress", label: "In Progress", color: "#F97316" },
  { id: "done", label: "Done", color: "#22C55E" },
];

export default function HackTaskBoard({ h, t, dark }) {
  const {
    tasks, showAddTask, openTask, taskDragId,
    setShowAddTask, setOpenTask, setTaskDragId, moveTask,
  } = useHackathonStore();

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (status) => (e) => {
    e.preventDefault();
    if (taskDragId) {
      moveTask(taskDragId, status);
      setTaskDragId(null);
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {I.kanban(22, t.acc)}
          <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.03em" }}>Task Board</h2>
        </div>
        <button
          onClick={() => setShowAddTask(true)}
          style={{
            display: "flex", alignItems: "center", gap: 7,
            padding: "10px 20px", borderRadius: 12, border: "none",
            background: `linear-gradient(135deg,${t.acc},#818CF8)`,
            color: "#fff", fontSize: 13, fontWeight: 600,
            cursor: "pointer", fontFamily: "inherit",
            boxShadow: `0 4px 16px ${t.acc}30`,
          }}
        >
          {I.plus(14, "#fff")} Add Task
        </button>
      </div>

      {/* Columns */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, minHeight: 400 }}>
        {COLS.map((col) => {
          const colTasks = tasks.filter((tk) => tk.status === col.id);
          return (
            <div
              key={col.id}
              onDragOver={handleDragOver}
              onDrop={handleDrop(col.id)}
              style={{
                background: t.card, borderRadius: 16,
                border: `1px solid ${t.cb}`,
                padding: 14, display: "flex", flexDirection: "column",
                minHeight: 300,
              }}
            >
              {/* Column header */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, padding: "0 4px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: col.color }} />
                  <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: "-0.01em" }}>{col.label}</span>
                </div>
                <span style={{
                  fontSize: 11, fontWeight: 700,
                  background: col.color + "18", color: col.color,
                  padding: "3px 9px", borderRadius: 7, minWidth: 20, textAlign: "center",
                }}>
                  {colTasks.length}
                </span>
              </div>

              {/* Task cards */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
                {colTasks.map((tk) => (
                  <HackTaskCard key={tk.id} task={tk} t={t} dark={dark} />
                ))}

                {colTasks.length === 0 && (
                  <div style={{
                    flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 13, color: t.tm, borderRadius: 12,
                    border: `2px dashed ${t.ibr}`, minHeight: 80,
                  }}>
                    Drop tasks here
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modals */}
      {showAddTask && <CreateHackTaskModal h={h} t={t} dark={dark} />}
      {openTask && <HackTaskDetailModal task={openTask} h={h} t={t} dark={dark} />}
    </div>
  );
}
