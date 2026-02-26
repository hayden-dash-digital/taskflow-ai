/* SprintTaskModal.jsx — sprint task detail overlay */
import React from "react";
import HackModal from "../../shared/HackModal";
import HackAvatar from "../../shared/HackAvatar";
import I from "../../../icons";
import { u } from "../../../mockData";
import { PC } from "../../../constants";
import useHackathonStore from "../../../stores/hackathonStore";

const STATUS_LABELS = {
  todo: { label: "To Do", color: "#3B82F6" },
  progress: { label: "In Progress", color: "#F97316" },
  blocked: { label: "Blocked", color: "#EF4444" },
  review: { label: "Review", color: "#A855F7" },
  done: { label: "Done", color: "#22C55E" },
};

export default function SprintTaskModal({ task, h, t, dark }) {
  const { setOpenSprint } = useHackathonStore();

  const assignee = u(task.assignee);
  const statusInfo = STATUS_LABELS[task.status] || STATUS_LABELS.todo;
  const sprintTasks = h.sprint.tasks || [];
  const blocker = task.blockedBy
    ? sprintTasks.find((bt) => bt.id === task.blockedBy)
    : null;
  const blockerAssignee = blocker ? u(blocker.assignee) : null;

  return (
    <HackModal onClose={() => setOpenSprint(null)} t={t} width={520}>
      <div style={{ padding: "28px 30px" }}>
        {/* Top row: priority badge + close */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginBottom: 16,
        }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "4px 12px", borderRadius: 8,
            background: PC[task.priority] + "18",
          }}>
            {I.flag(11, PC[task.priority])}
            <span style={{
              fontSize: 12, fontWeight: 700, color: PC[task.priority],
              textTransform: "capitalize",
            }}>
              {task.priority}
            </span>
          </div>
          <button
            onClick={() => setOpenSprint(null)}
            style={{
              width: 30, height: 30, borderRadius: 8, border: "none",
              background: t.ib, color: t.tm, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            {I.close(16, t.tm)}
          </button>
        </div>

        {/* Title */}
        <h2 style={{
          fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em",
          marginBottom: 14, lineHeight: 1.3,
        }}>
          {task.title}
        </h2>

        {/* Description */}
        {task.desc && (
          <div style={{
            fontSize: 13, color: t.ts, lineHeight: 1.6,
            marginBottom: 20, padding: "14px 16px", borderRadius: 12,
            background: t.ib, border: `1px solid ${t.ibr}`,
          }}>
            {task.desc}
          </div>
        )}

        {/* Assignee + Status row */}
        <div style={{
          display: "flex", alignItems: "center", gap: 20, marginBottom: 20,
        }}>
          {/* Assignee */}
          {assignee && (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <HackAvatar user={assignee} size={30} />
              <div>
                <div style={{ fontSize: 10, color: t.tm, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Assignee
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, marginTop: 1 }}>
                  {assignee.name}
                </div>
              </div>
            </div>
          )}

          {/* Status */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 10, height: 10, borderRadius: "50%",
              background: statusInfo.color,
            }} />
            <div>
              <div style={{ fontSize: 10, color: t.tm, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Status
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: statusInfo.color, marginTop: 1 }}>
                {statusInfo.label}
              </div>
            </div>
          </div>
        </div>

        {/* Blocker info */}
        {blocker && (
          <div style={{
            padding: "14px 16px", borderRadius: 12,
            background: "#EF444408", border: `1px solid #EF444425`,
          }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 6, marginBottom: 10,
            }}>
              {I.warn(14, "#EF4444")}
              <span style={{ fontSize: 12, fontWeight: 700, color: "#EF4444" }}>
                Blocked by
              </span>
            </div>
            <div style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "10px 12px", borderRadius: 10,
              background: t.ib, border: `1px solid ${t.ibr}`,
            }}>
              <div style={{
                width: 3, height: 28, borderRadius: 2,
                background: PC[blocker.priority],
              }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{blocker.title}</div>
                <div style={{
                  fontSize: 11, color: t.tm, marginTop: 2,
                  display: "flex", alignItems: "center", gap: 4,
                }}>
                  {I.flag(9, PC[blocker.priority])}
                  <span style={{ color: PC[blocker.priority], fontWeight: 600 }}>
                    {blocker.priority}
                  </span>
                  <span style={{ margin: "0 2px" }}> -- </span>
                  {blockerAssignee ? blockerAssignee.name : "Unassigned"}
                  <span style={{ margin: "0 2px" }}> -- </span>
                  <span style={{ color: (STATUS_LABELS[blocker.status] || {}).color }}>
                    {(STATUS_LABELS[blocker.status] || {}).label || blocker.status}
                  </span>
                </div>
              </div>
              {blockerAssignee && <HackAvatar user={blockerAssignee} size={24} />}
            </div>
          </div>
        )}
      </div>
    </HackModal>
  );
}
