/* HackFrictionReport.jsx — expandable blocked-task cards with update requests */
import React from "react";
import HackAvatar from "../../shared/HackAvatar";
import I from "../../../icons";
import { u } from "../../../mockData";
import { PC } from "../../../constants";
import useHackathonStore from "../../../stores/hackathonStore";

export default function HackFrictionReport({ h, t, dark }) {
  const { expFric, updateReqs, setExpFric, addUpdateReq } = useHackathonStore();

  const tasks = h.sprint.tasks || [];
  const blocked = tasks.filter((tk) => tk.status === "blocked");

  if (blocked.length === 0) return null;

  return (
    <div>
      {/* Section header */}
      <div style={{
        display: "flex", alignItems: "center", gap: 8, marginBottom: 14,
      }}>
        {I.warn(18, "#EF4444")}
        <h3 style={{ fontSize: 16, fontWeight: 700 }}>Friction Report</h3>
        <span style={{
          fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 7,
          background: "#EF444418", color: "#EF4444",
        }}>
          {blocked.length} blocked
        </span>
      </div>

      {/* Grid of blocked cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
        {blocked.map((tk) => {
          const isExp = expFric === tk.id;
          const assignee = u(tk.assignee);
          const blocker = tk.blockedBy ? tasks.find((bt) => bt.id === tk.blockedBy) : null;
          const blockerAssignee = blocker ? u(blocker.assignee) : null;
          const requested = updateReqs.includes(tk.id);

          return (
            <div
              key={tk.id}
              onClick={() => setExpFric(isExp ? null : tk.id)}
              style={{
                borderRadius: 14, background: t.card,
                border: `1.5px solid ${isExp ? "#EF444440" : t.cb}`,
                cursor: "pointer", overflow: "hidden",
                transition: "border-color 0.15s ease",
              }}
            >
              {/* Card header */}
              <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 10 }}>
                {/* Blocked pulse dot */}
                <div style={{
                  width: 10, height: 10, borderRadius: "50%", background: "#EF4444",
                  boxShadow: "0 0 0 3px #EF444430",
                  animation: "hackPulse 2s ease-in-out infinite",
                  flexShrink: 0,
                }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {tk.title}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                    {I.flag(9, PC[tk.priority])}
                    <span style={{ fontSize: 10, color: PC[tk.priority], fontWeight: 600 }}>{tk.priority}</span>
                  </div>
                </div>
                {assignee && <HackAvatar user={assignee} size={24} />}
                <div style={{
                  transform: isExp ? "rotate(90deg)" : "rotate(0deg)",
                  transition: "transform 0.2s ease", color: t.tm, flexShrink: 0,
                }}>
                  {I.chevR(12, t.tm)}
                </div>
              </div>

              {/* Expanded content */}
              {isExp && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    padding: "0 16px 16px", borderTop: `1px solid ${t.cb}`,
                    animation: "hackFadeIn 0.15s",
                  }}
                >
                  {/* Description */}
                  {tk.desc && (
                    <div style={{
                      fontSize: 12, color: t.ts, lineHeight: 1.5,
                      padding: "12px 0 10px",
                    }}>
                      {tk.desc}
                    </div>
                  )}

                  {/* Blocked by section */}
                  {blocker && (
                    <div style={{ marginTop: 4 }}>
                      <div style={{
                        fontSize: 10, fontWeight: 700, color: t.tm,
                        textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8,
                      }}>
                        Blocked by
                      </div>
                      <div style={{
                        padding: "10px 12px", borderRadius: 10,
                        background: t.ib, border: `1px solid ${t.ibr}`,
                        display: "flex", alignItems: "center", gap: 10,
                      }}>
                        <div style={{
                          width: 3, height: 28, borderRadius: 2,
                          background: PC[blocker.priority],
                        }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 12, fontWeight: 600 }}>{blocker.title}</div>
                          <div style={{ fontSize: 10, color: t.tm, marginTop: 2 }}>
                            {blockerAssignee ? blockerAssignee.name : "Unassigned"} — {blocker.status}
                          </div>
                        </div>
                        {blockerAssignee && <HackAvatar user={blockerAssignee} size={22} />}
                      </div>
                    </div>
                  )}

                  {/* Request Update button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!requested) addUpdateReq(tk.id);
                    }}
                    style={{
                      marginTop: 12, width: "100%", padding: "9px 0",
                      borderRadius: 10, border: "none",
                      background: requested
                        ? "#22C55E18"
                        : `linear-gradient(135deg,${t.acc},#818CF8)`,
                      color: requested ? "#22C55E" : "#fff",
                      fontSize: 12, fontWeight: 600, cursor: requested ? "default" : "pointer",
                      fontFamily: "inherit",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                      transition: "all 0.2s ease",
                    }}
                  >
                    {requested ? (
                      <>
                        {I.check(12, "#22C55E")} Update Requested
                      </>
                    ) : (
                      <>
                        {I.send(12, "#fff")} Request Update
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes hackPulse {
          0%, 100% { box-shadow: 0 0 0 3px #EF444430; }
          50% { box-shadow: 0 0 0 6px #EF444415; }
        }
      `}</style>
    </div>
  );
}
