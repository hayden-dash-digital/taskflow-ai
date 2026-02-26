/* HackSprintView.jsx — member x status grid with friction reporting */
import React from "react";
import HackAvatar from "../../shared/HackAvatar";
import I from "../../../icons";
import { u } from "../../../mockData";
import { PC } from "../../../constants";
import useHackathonStore from "../../../stores/hackathonStore";
import HackFrictionReport from "./HackFrictionReport";
import SprintTaskModal from "./SprintTaskModal";

const STATUSES = [
  { id: "todo", label: "To Do", color: "#3B82F6" },
  { id: "progress", label: "In Progress", color: "#F97316" },
  { id: "blocked", label: "Blocked", color: "#EF4444" },
  { id: "review", label: "Review", color: "#A855F7" },
  { id: "done", label: "Done", color: "#22C55E" },
];

export default function HackSprintView({ h, t, dark }) {
  const {
    openSprint, hoverSprint,
    setOpenSprint, setHoverSprint,
  } = useHackathonStore();

  const sprint = h.sprint;
  const tasks = sprint.tasks || [];
  const members = sprint.members || [];

  const doneCount = tasks.filter((tk) => tk.status === "done").length;
  const totalCount = tasks.length;
  const progressPct = totalCount ? Math.round((doneCount / totalCount) * 100) : 0;
  const blockedCount = tasks.filter((tk) => tk.status === "blocked").length;

  const statusCounts = {};
  STATUSES.forEach((s) => {
    statusCounts[s.id] = tasks.filter((tk) => tk.status === s.id).length;
  });

  const memberTasks = (memberId, statusId) =>
    tasks.filter((tk) => tk.assignee === memberId && tk.status === statusId);

  const memberDone = (memberId) =>
    tasks.filter((tk) => tk.assignee === memberId && tk.status === "done").length;

  const memberTotal = (memberId) =>
    tasks.filter((tk) => tk.assignee === memberId).length;

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {I.sprint(22, t.acc)}
          <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.03em" }}>Hackathon Sprint</h2>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {blockedCount > 0 && (
            <div style={{
              display: "flex", alignItems: "center", gap: 5,
              padding: "5px 12px", borderRadius: 8,
              background: "#EF444418", color: "#EF4444",
              fontSize: 12, fontWeight: 700,
            }}>
              {I.warn(13, "#EF4444")} {blockedCount} blocked
            </div>
          )}
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "5px 14px", borderRadius: 8,
            background: progressPct >= 100 ? "#22C55E18" : t.acc + "15",
          }}>
            <span style={{
              fontFamily: "'Space Mono',monospace", fontSize: 18, fontWeight: 700,
              color: progressPct >= 100 ? "#22C55E" : t.acc,
            }}>
              {progressPct}%
            </span>
            <span style={{ fontSize: 11, color: t.tm, fontWeight: 500 }}>complete</span>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 8, borderRadius: 6, background: t.ib, overflow: "hidden", marginBottom: 24 }}>
        <div style={{
          height: "100%", borderRadius: 6,
          width: `${progressPct}%`,
          background: progressPct >= 100 ? "#22C55E" : `linear-gradient(90deg,${t.acc},#818CF8)`,
          transition: "width 0.5s ease",
        }} />
      </div>

      {/* Grid table */}
      {totalCount > 0 ? (
        <div style={{
          borderRadius: 16, border: `1px solid ${t.cb}`,
          overflow: "hidden", background: t.card, marginBottom: 28,
        }}>
          {/* Column headers */}
          <div style={{
            display: "grid", gridTemplateColumns: "200px repeat(5, 1fr)",
            borderBottom: `1px solid ${t.cb}`,
          }}>
            <div style={{
              padding: "12px 16px", fontSize: 11, fontWeight: 700,
              color: t.tm, textTransform: "uppercase", letterSpacing: "0.06em",
            }}>
              Member
            </div>
            {STATUSES.map((s) => (
              <div key={s.id} style={{
                padding: "12px 10px", fontSize: 11, fontWeight: 700,
                color: t.tm, textTransform: "uppercase", letterSpacing: "0.06em",
                borderLeft: `1px solid ${t.cb}`,
                display: "flex", alignItems: "center", gap: 6,
              }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: s.color }} />
                {s.label}
                <span style={{
                  fontSize: 10, fontWeight: 700, background: s.color + "18",
                  color: s.color, padding: "2px 7px", borderRadius: 6, marginLeft: "auto",
                }}>
                  {statusCounts[s.id]}
                </span>
                {statusCounts[s.id] >= 3 && (
                  <span style={{
                    fontSize: 9, fontWeight: 700, padding: "2px 6px",
                    borderRadius: 5, background: "#EF444420", color: "#EF4444",
                  }}>
                    Friction
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Member rows */}
          {members.map((mid) => {
            const member = u(mid);
            if (!member) return null;
            const mDone = memberDone(mid);
            const mTotal = memberTotal(mid);
            return (
              <div key={mid} style={{
                display: "grid", gridTemplateColumns: "200px repeat(5, 1fr)",
                borderBottom: `1px solid ${t.cb}`,
              }}>
                {/* Member cell */}
                <div style={{
                  padding: "14px 16px", display: "flex", alignItems: "center", gap: 10,
                }}>
                  <HackAvatar user={member} size={28} />
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{member.name}</span>
                    <span style={{
                      fontSize: 10, color: t.tm, fontFamily: "'Space Mono',monospace",
                    }}>
                      {mDone}/{mTotal} done
                    </span>
                  </div>
                </div>

                {/* Status cells */}
                {STATUSES.map((s) => {
                  const cellTasks = memberTasks(mid, s.id);
                  return (
                    <div key={s.id} style={{
                      padding: "10px 8px", borderLeft: `1px solid ${t.cb}`,
                      display: "flex", flexDirection: "column", gap: 6,
                    }}>
                      {cellTasks.map((tk) => {
                        const isHover = hoverSprint === tk.id;
                        const blocker = tk.blockedBy
                          ? tasks.find((bt) => bt.id === tk.blockedBy)
                          : null;
                        return (
                          <div
                            key={tk.id}
                            onClick={() => setOpenSprint(tk)}
                            onMouseEnter={() => setHoverSprint(tk.id)}
                            onMouseLeave={() => setHoverSprint(null)}
                            style={{
                              padding: "8px 10px", borderRadius: 10,
                              background: isHover ? t.ib : "transparent",
                              border: `1px solid ${isHover ? t.ibr : "transparent"}`,
                              borderLeft: `3px solid ${PC[tk.priority]}`,
                              cursor: "pointer",
                              transform: isHover ? "scale(1.02)" : "scale(1)",
                              transition: "all 0.15s ease",
                            }}
                          >
                            <div style={{ fontSize: 12, fontWeight: 600, lineHeight: 1.3 }}>
                              {tk.title}
                            </div>
                            {tk.status === "blocked" && blocker && (
                              <div style={{
                                display: "flex", alignItems: "center", gap: 4,
                                marginTop: 4, fontSize: 10, color: "#EF4444",
                              }}>
                                {I.warn(10, "#EF4444")}
                                <span>by: {blocker.title}</span>
                              </div>
                            )}
                            <div style={{
                              display: "flex", alignItems: "center", gap: 4, marginTop: 4,
                            }}>
                              {I.flag(9, PC[tk.priority])}
                              <span style={{
                                fontSize: 10, color: PC[tk.priority], fontWeight: 600,
                              }}>
                                {tk.priority}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{
          textAlign: "center", padding: "60px 0", color: t.tm, fontSize: 14,
          borderRadius: 16, border: `2px dashed ${t.ibr}`, marginBottom: 28,
        }}>
          No sprint tasks yet
        </div>
      )}

      {/* Friction Report */}
      {blockedCount > 0 && <HackFrictionReport h={h} t={t} dark={dark} />}

      {/* Task detail modal */}
      {openSprint && <SprintTaskModal task={openSprint} h={h} t={t} dark={dark} />}
    </div>
  );
}
