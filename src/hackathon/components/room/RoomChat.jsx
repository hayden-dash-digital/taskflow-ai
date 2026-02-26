/* RoomChat.jsx — right 290px chat panel */
import React, { useRef, useEffect } from "react";
import HackAvatar from "../shared/HackAvatar";
import I from "../../icons";
import { u } from "../../mockData";
import useHackathonStore from "../../stores/hackathonStore";

export default function RoomChat({ t }) {
  const { msgs, newMsg, setNewMsg, sendMsg } = useHackathonStore();
  const chatEnd = useRef(null);

  useEffect(() => {
    chatEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  return (
    <div style={{ width: 290, background: t.cbg, borderLeft: `1px solid ${t.cb}`, display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "12px 14px", borderBottom: `1px solid ${t.cb}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 14, fontWeight: 600 }}>{I.chat(15, t.acc)} Chat</div>
        <span style={{ fontSize: 10, color: t.tm, fontFamily: "'Space Mono',monospace" }}>{msgs.length}</span>
      </div>
      {msgs.filter((m) => m.pinned).map((m) => (
        <div key={m.id + "p"} style={{ padding: "8px 12px", background: t.al, borderBottom: `1px solid ${t.cb}`, display: "flex", alignItems: "flex-start", gap: 5, fontSize: 12 }}>
          <span style={{ color: t.acc, flexShrink: 0, marginTop: 1 }}>{I.pin(10, t.acc)}</span>
          <span style={{ color: t.ts }}><strong style={{ color: t.text }}>{u(m.user)?.name.split(" ")[0]}:</strong> {m.text}</span>
        </div>
      ))}
      <div style={{ flex: 1, overflowY: "auto", padding: "8px 12px", display: "flex", flexDirection: "column", gap: 8 }}>
        {msgs.map((m) => {
          const mu = u(m.user);
          const me = m.user === "u1";
          return (
            <div key={m.id} style={{ display: "flex", gap: 7, alignItems: "flex-start", animation: "hackFadeIn 0.15s" }}>
              {!me && <HackAvatar user={mu} size={24} style={{ marginTop: 2, "--ring": t.cbg }} />}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: me ? "flex-end" : "flex-start" }}>
                {!me && <span style={{ fontSize: 10, fontWeight: 600, color: mu?.color, marginBottom: 1 }}>{mu?.name.split(" ")[0]}</span>}
                <div style={{ fontSize: 13, lineHeight: 1.4, padding: "8px 12px", borderRadius: me ? "12px 2px 12px 12px" : "2px 12px 12px 12px", background: me ? t.acc + "15" : t.mbg, border: `1px solid ${me ? t.acc + "20" : t.cb}`, color: t.text, maxWidth: "88%" }}>{m.text}</div>
                <span style={{ fontSize: 9, color: t.tm, marginTop: 1 }}>{new Date(m.time).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}</span>
              </div>
            </div>
          );
        })}
        <div ref={chatEnd} />
      </div>
      <div style={{ padding: "8px 10px", borderTop: `1px solid ${t.cb}`, display: "flex", gap: 6 }}>
        <input value={newMsg} onChange={(e) => setNewMsg(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendMsg()} placeholder="Message..." style={{ flex: 1, padding: "9px 12px", borderRadius: 10, border: `1px solid ${t.ibr}`, background: t.ib, color: t.text, fontSize: 13, fontFamily: "inherit", outline: "none" }} />
        <button onClick={sendMsg} style={{ width: 34, height: 34, borderRadius: 10, border: "none", background: newMsg.trim() ? t.acc : "transparent", color: newMsg.trim() ? "#fff" : t.tm, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>{I.send(14)}</button>
      </div>
    </div>
  );
}
