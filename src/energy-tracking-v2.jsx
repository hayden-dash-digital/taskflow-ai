import { useState, useEffect, useRef } from "react";

/* ═══ THEME — matches TaskFlow ═══ */
const t = {
  bg:"#F5F5F7", card:"#FFFFFF", text:"#1A1A2E", ts:"#6E6E82", tm:"#9E9EB5",
  acc:"#5B4AE4", al:"#5B4AE412", cb:"#E8E8ED", ib:"#F0F0F5", ibr:"#E0E0E8",
  shH:"0 8px 30px rgba(91,74,228,0.12)", mod:"#FFFFFF",
  green:"#22C55E", red:"#EF4444", orange:"#F97316", yellow:"#EAB308", blue:"#3B82F6",
};

/* ═══ MOCK DATA ═══ */
const USERS = [
  { id:"u1", name:"Alex Chen", role:"Lead", color:"#5B4AE4", avatar:"AC" },
  { id:"u2", name:"Sarah Kim", role:"Designer", color:"#EC4899", avatar:"SK" },
  { id:"u3", name:"Marcus Johnson", role:"Backend", color:"#F97316", avatar:"MJ" },
  { id:"u4", name:"Aisha Patel", role:"Frontend", color:"#22C55E", avatar:"AP" },
  { id:"u5", name:"Jordan Lee", role:"PM", color:"#3B82F6", avatar:"JL" },
];

const MOODS = [
  { emoji:"😤", label:"Struggling", value:1, color:"#EF4444" },
  { emoji:"😕", label:"Low", value:2, color:"#F97316" },
  { emoji:"😐", label:"Okay", value:3, color:"#EAB308" },
  { emoji:"🙂", label:"Good", value:4, color:"#3B82F6" },
  { emoji:"🔥", label:"On Fire", value:5, color:"#22C55E" },
];

// 14 days of mock pulse history
const genHistory = () => {
  const days = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const label = d.toLocaleDateString("en-US", { weekday:"short", month:"short", day:"numeric" });
    const short = d.toLocaleDateString("en-US", { weekday:"short" });
    const pulses = USERS.map(u => ({
      userId: u.id,
      value: Math.max(1, Math.min(5, Math.round(3 + (Math.random()-0.4)*2.5 + (i < 4 ? -0.8 : i > 10 ? 0.5 : 0)))),
    }));
    const avg = pulses.reduce((s,p) => s+p.value, 0) / pulses.length;
    const tasks = Math.round(3 + Math.random()*6 + (avg > 3.5 ? 2 : avg < 2.5 ? -1 : 0));
    days.push({ date: label, short, pulses, avg: Math.round(avg*10)/10, tasks });
  }
  return days;
};

// Today's preset pulses (before user logs theirs)
const PRESET_PULSES = { u2: 4, u3: 5, u4: 2, u5: 3 };
const PRESET_WORKLOAD = { u2: "balanced", u3: "heavy", u4: "overwhelming", u5: "balanced" };
const PRESET_BLOCKERS = { u2: "none", u3: "none", u4: "waiting", u5: "none" };
const PRESET_FOCUS = { u2: "Finishing the onboarding mockups", u3: "API endpoints for sprint view", u4: "Waiting on design tokens from Sarah", u5: "Sprint planning for next week" };
const WLOAD_LABELS = { light:{ emoji:"🌊", label:"Light", color:"#3B82F6" }, balanced:{ emoji:"⚖️", label:"Balanced", color:"#22C55E" }, heavy:{ emoji:"🏋️", label:"Heavy", color:"#F97316" }, overwhelming:{ emoji:"🆘", label:"Overwhelmed", color:"#EF4444" } };

const Av = ({ user, size=32 }) => (
  <div style={{ width:size, height:size, borderRadius:"50%", background:`linear-gradient(135deg,${user.color},${user.color}CC)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:size*0.36, fontWeight:700, color:"#fff", fontFamily:"'DM Sans',sans-serif", flexShrink:0 }}>
    {user.avatar}
  </div>
);

export default function EnergyTracking() {
  const [view, setView] = useState("dashboard"); // dashboard | hackathon
  const [myPulse, setMyPulse] = useState(null);
  const [hoverMood, setHoverMood] = useState(null);
  const [pulseLogged, setPulseLogged] = useState(false);
  const [checkStep, setCheckStep] = useState(0); // 0=energy, 1=workload, 2=blockers, 3=wins, 4=done
  const [workload, setWorkload] = useState(null);
  const [blocker, setBlocker] = useState(null);
  const [blockerText, setBlockerText] = useState("");
  const [win, setWin] = useState("");
  const [history] = useState(genHistory);
  const [showInsight, setShowInsight] = useState(false);
  const [hoverDay, setHoverDay] = useState(null);
  const [expandUser, setExpandUser] = useState(null);
  const [animate, setAnimate] = useState(false);

  useEffect(() => { setTimeout(() => setAnimate(true), 100); }, []);

  const logPulse = (val) => {
    setMyPulse(val);
    setCheckStep(1);
  };
  const logWorkload = (val) => {
    setWorkload(val);
    setCheckStep(2);
  };
  const logBlocker = (val) => {
    setBlocker(val);
    if (val === "none") setCheckStep(3);
    // if they pick a blocker type, they stay on step 2 to type details, then hit next
  };
  const submitBlockerText = () => { setCheckStep(3); };
  const finishCheckin = () => {
    setCheckStep(4);
    setPulseLogged(true);
    setTimeout(() => setShowInsight(true), 600);
  };

  const todayPulses = USERS.map(u => ({
    ...u,
    pulse: u.id === "u1" ? myPulse : PRESET_PULSES[u.id],
    mood: MOODS[(u.id === "u1" ? myPulse : PRESET_PULSES[u.id]) - 1] || null,
    wl: u.id === "u1" ? workload : PRESET_WORKLOAD[u.id],
    blk: u.id === "u1" ? blocker : PRESET_BLOCKERS[u.id],
    focus: u.id === "u1" ? win : PRESET_FOCUS[u.id],
  }));

  const todayAvg = todayPulses.filter(p=>p.pulse).reduce((s,p)=>s+p.pulse,0) / todayPulses.filter(p=>p.pulse).length || 0;
  const todayMoodObj = MOODS[Math.round(todayAvg)-1] || MOODS[2];

  const maxTasks = Math.max(...history.map(d=>d.tasks));

  // Insight detection
  const last3Avg = history.slice(-3).reduce((s,d)=>s+d.avg,0)/3;
  const last3Tasks = history.slice(-3).reduce((s,d)=>s+d.tasks,0)/3;
  const prev3Avg = history.slice(-6,-3).reduce((s,d)=>s+d.avg,0)/3;
  const energyTrend = last3Avg - prev3Avg;
  const aiInsight = last3Tasks > 7 && last3Avg < 3
    ? { type:"warning", text:"High output but energy is dropping — burnout risk. Consider pacing down." }
    : todayPulses.filter(p=>p.wl==="overwhelming").length >= 2
    ? { type:"warning", text:`${todayPulses.filter(p=>p.wl==="overwhelming").length} team members are overwhelmed. Time to redistribute tasks.` }
    : todayPulses.filter(p=>p.blk&&p.blk!=="none").length >= 2
    ? { type:"caution", text:`${todayPulses.filter(p=>p.blk&&p.blk!=="none").length} people are blocked. Clear these before they cascade.` }
    : last3Avg > 3.8 && last3Tasks > 6
    ? { type:"positive", text:"Team is energized and shipping. Ride the wave!" }
    : energyTrend < -0.5
    ? { type:"caution", text:"Energy has been trending down this week. Worth a team check-in." }
    : { type:"neutral", text:"Team energy is steady. Sustainable pace." };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes pulseGlow{0%,100%{box-shadow:0 0 0 0 rgba(91,74,228,0.2)}50%{box-shadow:0 0 20px 6px rgba(91,74,228,0.15)}}
        @keyframes emojiPop{0%{transform:scale(0.3) rotate(-10deg);opacity:0}50%{transform:scale(1.3) rotate(5deg)}100%{transform:scale(1) rotate(0deg);opacity:1}}
        @keyframes slideRight{from{width:0%}to{width:100%}}
        @keyframes moodFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
        @keyframes insightSlide{from{opacity:0;transform:translateY(10px) scale(0.97)}to{opacity:1;transform:translateY(0) scale(1)}}
        @keyframes barGrow{from{height:0}to{height:var(--h)}}
        @keyframes checkPop{0%{transform:scale(0)}60%{transform:scale(1.3)}100%{transform:scale(1)}}
        @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
        .hFloat{transition:all .25s cubic-bezier(.175,.885,.32,1.275)!important}
        .hFloat:hover{transform:translateY(-3px) scale(1.015)!important;box-shadow:0 8px 30px rgba(91,74,228,0.12)!important}
        .mood-btn{transition:all 0.2s cubic-bezier(.175,.885,.32,1.275)}
        .mood-btn:hover{transform:scale(1.35)!important}
        .bar-hover:hover{opacity:1!important;filter:brightness(1.1)}
        ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:#ddd;border-radius:3px}
      `}</style>

      <div style={{ minHeight:"100vh", background:t.bg, fontFamily:"'DM Sans',sans-serif", color:t.text }}>

        {/* NAV */}
        <div style={{ display:"flex", justifyContent:"center", gap:8, padding:"20px 0 0" }}>
          {["dashboard","hackathon"].map(v => (
            <button key={v} onClick={()=>setView(v)} style={{ padding:"8px 20px", borderRadius:10, border:`1.5px solid ${view===v?t.acc+"40":t.cb}`, background:view===v?t.al:"transparent", color:view===v?t.acc:t.tm, fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"inherit", textTransform:"capitalize" }}>{v === "dashboard" ? "📊 Dashboard View" : "⚡ Hackathon View"}</button>
          ))}
        </div>

        {view === "dashboard" ? (
          <div style={{ maxWidth:900, margin:"0 auto", padding:"24px 20px 60px" }}>

            {/* ═══ DAILY CHECK-IN ═══ */}
            {!pulseLogged ? (
              <div style={{ animation: animate?"fadeUp 0.5s ease both":"none", background:t.card, borderRadius:20, padding:"28px 34px", marginBottom:24, border:`1px solid ${t.cb}`, position:"relative", overflow:"hidden" }}>
                <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:`linear-gradient(90deg,${t.acc},#818CF8,#EC4899)`, borderRadius:"20px 20px 0 0" }} />
                
                {/* PROGRESS DOTS */}
                <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:20 }}>
                  {["Energy","Workload","Blockers","Wins"].map((label,i) => (
                    <div key={i} style={{ display:"flex", alignItems:"center", gap:6 }}>
                      <div style={{ width:8, height:8, borderRadius:"50%", background:checkStep>i?t.acc:checkStep===i?t.acc+"80":t.cb, transition:"all 0.3s" }} />
                      <span style={{ fontSize:11, fontWeight:checkStep===i?700:400, color:checkStep===i?t.acc:checkStep>i?t.ts:t.tm, transition:"all 0.3s" }}>{label}</span>
                      {i<3 && <div style={{ width:24, height:1.5, background:checkStep>i?t.acc:t.cb, borderRadius:1, transition:"all 0.3s" }} />}
                    </div>
                  ))}
                  <span style={{ marginLeft:"auto", fontSize:11, color:t.tm }}>~30 sec</span>
                </div>

                {/* STEP 0: ENERGY */}
                {checkStep === 0 && (
                  <div style={{ animation:"fadeUp 0.3s ease both" }}>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                      <div>
                        <div style={{ fontSize:17, fontWeight:700, marginBottom:4 }}>How are you feeling today?</div>
                        <div style={{ fontSize:13, color:t.tm }}>Tap your energy level</div>
                      </div>
                      <div style={{ display:"flex", gap:8 }}>
                        {MOODS.map(m => (
                          <button key={m.value} className="mood-btn" onClick={()=>logPulse(m.value)}
                            onMouseEnter={()=>setHoverMood(m.value)} onMouseLeave={()=>setHoverMood(null)}
                            style={{ width:52, height:52, borderRadius:14, border:`2px solid ${hoverMood===m.value?m.color+"50":"transparent"}`, background:hoverMood===m.value?m.color+"12":"transparent", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:2, cursor:"pointer", transform:"scale(1)" }}>
                            <span style={{ fontSize:26, lineHeight:1 }}>{m.emoji}</span>
                            <span style={{ fontSize:9, fontWeight:600, color:hoverMood===m.value?m.color:t.tm }}>{m.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 1: WORKLOAD */}
                {checkStep === 1 && (
                  <div style={{ animation:"fadeUp 0.3s ease both" }}>
                    <div style={{ fontSize:17, fontWeight:700, marginBottom:4 }}>How's your workload?</div>
                    <div style={{ fontSize:13, color:t.tm, marginBottom:18 }}>Be honest — this helps your team balance the load.</div>
                    <div style={{ display:"flex", gap:10 }}>
                      {[
                        { id:"light", label:"Light", desc:"I have bandwidth", emoji:"🌊", color:"#3B82F6" },
                        { id:"balanced", label:"Balanced", desc:"Right amount", emoji:"⚖️", color:"#22C55E" },
                        { id:"heavy", label:"Heavy", desc:"Pushing through", emoji:"🏋️", color:"#F97316" },
                        { id:"overwhelming", label:"Overwhelming", desc:"Need help", emoji:"🆘", color:"#EF4444" },
                      ].map(w => (
                        <button key={w.id} className="hFloat" onClick={()=>logWorkload(w.id)}
                          style={{ flex:1, padding:"18px 14px", borderRadius:14, border:`2px solid ${workload===w.id?w.color+"50":t.cb}`, background:workload===w.id?w.color+"08":t.card, cursor:"pointer", textAlign:"center", fontFamily:"inherit" }}>
                          <div style={{ fontSize:28, marginBottom:6 }}>{w.emoji}</div>
                          <div style={{ fontSize:13, fontWeight:700, color:w.color }}>{w.label}</div>
                          <div style={{ fontSize:11, color:t.tm, marginTop:2 }}>{w.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 2: BLOCKERS */}
                {checkStep === 2 && (
                  <div style={{ animation:"fadeUp 0.3s ease both" }}>
                    <div style={{ fontSize:17, fontWeight:700, marginBottom:4 }}>Any blockers slowing you down?</div>
                    <div style={{ fontSize:13, color:t.tm, marginBottom:18 }}>This flags friction for the team to see and act on.</div>
                    {!blocker ? (
                      <div style={{ display:"flex", gap:10 }}>
                        {[
                          { id:"none", label:"All clear", desc:"Nothing blocking me", emoji:"✅", color:"#22C55E" },
                          { id:"waiting", label:"Waiting on someone", desc:"Dependency is holding me up", emoji:"⏳", color:"#F97316" },
                          { id:"stuck", label:"Stuck on a problem", desc:"Need help or a second opinion", emoji:"🧱", color:"#EF4444" },
                          { id:"tooling", label:"Tooling / access issue", desc:"Can't access what I need", emoji:"🔑", color:"#A855F7" },
                        ].map(b => (
                          <button key={b.id} className="hFloat" onClick={()=>logBlocker(b.id)}
                            style={{ flex:1, padding:"18px 14px", borderRadius:14, border:`2px solid ${t.cb}`, background:t.card, cursor:"pointer", textAlign:"center", fontFamily:"inherit" }}>
                            <div style={{ fontSize:28, marginBottom:6 }}>{b.emoji}</div>
                            <div style={{ fontSize:13, fontWeight:700, color:b.color }}>{b.label}</div>
                            <div style={{ fontSize:11, color:t.tm, marginTop:2 }}>{b.desc}</div>
                          </button>
                        ))}
                      </div>
                    ) : blocker !== "none" && checkStep === 2 ? (
                      <div style={{ animation:"fadeUp 0.2s ease both" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
                          <span style={{ fontSize:13, fontWeight:600, color:blocker==="waiting"?"#F97316":blocker==="stuck"?"#EF4444":"#A855F7" }}>
                            {blocker==="waiting"?"⏳ Waiting on someone":blocker==="stuck"?"🧱 Stuck on a problem":"🔑 Tooling / access issue"}
                          </span>
                          <button onClick={()=>setBlocker(null)} style={{ fontSize:11, color:t.tm, background:"none", border:"none", cursor:"pointer", fontFamily:"inherit", textDecoration:"underline" }}>Change</button>
                        </div>
                        <div style={{ fontSize:14, fontWeight:600, marginBottom:8 }}>Quick note — what's blocking you?</div>
                        <div style={{ display:"flex", gap:8 }}>
                          <input value={blockerText} onChange={e=>setBlockerText(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submitBlockerText()}
                            placeholder={blocker==="waiting"?"e.g. Waiting on Marcus for the API keys...":blocker==="stuck"?"e.g. Can't figure out the auth redirect flow...":"e.g. No access to the staging database..."}
                            style={{ flex:1, padding:"12px 16px", borderRadius:12, border:`1.5px solid ${t.ibr}`, background:t.ib, color:t.text, fontSize:14, fontFamily:"inherit", outline:"none" }} />
                          <button onClick={submitBlockerText}
                            style={{ padding:"0 22px", borderRadius:12, border:"none", background:t.acc, color:"#fff", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>Next</button>
                        </div>
                        <button onClick={submitBlockerText} style={{ marginTop:8, fontSize:12, color:t.tm, background:"none", border:"none", cursor:"pointer", fontFamily:"inherit" }}>Skip details →</button>
                      </div>
                    ) : null}
                  </div>
                )}

                {/* STEP 3: WINS / FOCUS */}
                {checkStep === 3 && (
                  <div style={{ animation:"fadeUp 0.3s ease both" }}>
                    <div style={{ fontSize:17, fontWeight:700, marginBottom:4 }}>What's your main focus today?</div>
                    <div style={{ fontSize:13, color:t.tm, marginBottom:18 }}>Or share a quick win from yesterday. Hype yourself up.</div>
                    <div style={{ display:"flex", gap:8, marginBottom:12 }}>
                      <input value={win} onChange={e=>setWin(e.target.value)} onKeyDown={e=>e.key==="Enter"&&finishCheckin()}
                        placeholder="e.g. Finishing the auth flow 🚀 or Shipped the sidebar yesterday!"
                        style={{ flex:1, padding:"12px 16px", borderRadius:12, border:`1.5px solid ${t.ibr}`, background:t.ib, color:t.text, fontSize:14, fontFamily:"inherit", outline:"none" }} />
                      <button onClick={finishCheckin}
                        style={{ padding:"0 22px", borderRadius:12, border:"none", background:t.acc, color:"#fff", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>Done</button>
                    </div>
                    <button onClick={finishCheckin} style={{ fontSize:12, color:t.tm, background:"none", border:"none", cursor:"pointer", fontFamily:"inherit" }}>Skip →</button>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ animation:"fadeUp 0.4s ease both", background:t.card, borderRadius:20, padding:"22px 34px", marginBottom:24, border:`1px solid ${t.acc}25`, position:"relative", overflow:"hidden" }}>
                <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:MOODS[myPulse-1]?.color }} />
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                    <div style={{ animation:"checkPop 0.4s ease both", width:36, height:36, borderRadius:10, background:"#22C55E15", display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                    <div>
                      <div style={{ fontSize:15, fontWeight:700 }}>Check-in complete — {MOODS[myPulse-1]?.label} {MOODS[myPulse-1]?.emoji}</div>
                      <div style={{ fontSize:12, color:t.tm }}>
                        {workload && <span style={{ marginRight:8 }}>{workload==="light"?"🌊 Light":workload==="balanced"?"⚖️ Balanced":workload==="heavy"?"🏋️ Heavy":"🆘 Overwhelming"}</span>}
                        {blocker && blocker!=="none" && <span style={{ marginRight:8, color:"#F97316" }}>{blocker==="waiting"?"⏳ Blocked":blocker==="stuck"?"🧱 Stuck":"🔑 Access issue"}</span>}
                        · 4 of 5 checked in
                      </div>
                    </div>
                  </div>
                  <button onClick={()=>{setPulseLogged(false);setMyPulse(null);setShowInsight(false);setCheckStep(0);setWorkload(null);setBlocker(null);setBlockerText("");setWin("");}} style={{ fontSize:12, color:t.tm, background:"none", border:"none", cursor:"pointer", fontFamily:"inherit", textDecoration:"underline" }}>Redo</button>
                </div>
                {/* SUMMARY ROW */}
                <div style={{ display:"flex", gap:10, marginTop:14, paddingTop:14, borderTop:`1px solid ${t.cb}` }}>
                  {blocker && blocker !== "none" && blockerText && (
                    <div style={{ flex:1, padding:"10px 14px", borderRadius:10, background:blocker==="waiting"?"#F9731608":blocker==="stuck"?"#EF444408":"#A855F708", border:`1px solid ${blocker==="waiting"?"#F9731620":blocker==="stuck"?"#EF444420":"#A855F720"}` }}>
                      <div style={{ fontSize:10, fontWeight:700, color:blocker==="waiting"?"#F97316":blocker==="stuck"?"#EF4444":"#A855F7", textTransform:"uppercase", marginBottom:3 }}>Blocker</div>
                      <div style={{ fontSize:13, color:t.ts }}>{blockerText}</div>
                    </div>
                  )}
                  {win && (
                    <div style={{ flex:1, padding:"10px 14px", borderRadius:10, background:"#22C55E08", border:"1px solid #22C55E20" }}>
                      <div style={{ fontSize:10, fontWeight:700, color:"#22C55E", textTransform:"uppercase", marginBottom:3 }}>Today's Focus</div>
                      <div style={{ fontSize:13, color:t.ts }}>{win}</div>
                    </div>
                  )}
                  {!blockerText && !win && (
                    <div style={{ fontSize:12, color:t.tm }}>No blockers reported · No focus set</div>
                  )}
                </div>
              </div>
            )}

            {/* ═══ TEAM PULSE + AI INSIGHT ROW ═══ */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:20, animation: animate?"fadeUp 0.5s 0.1s ease both":"none" }}>
              
              {/* TEAM PULSE */}
              <div style={{ background:t.card, borderRadius:18, padding:"24px 26px", border:`1px solid ${t.cb}` }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
                  <div style={{ fontSize:14, fontWeight:700 }}>Team Pulse</div>
                  <div style={{ fontSize:11, color:t.tm, fontFamily:"'Space Mono',monospace" }}>Today</div>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                  {todayPulses.map(u => {
                    const wlObj = u.wl ? WLOAD_LABELS[u.wl] : null;
                    const hasBlocker = u.blk && u.blk !== "none";
                    return (
                    <div key={u.id} onClick={()=>setExpandUser(expandUser===u.id?null:u.id)} style={{ padding:"10px 12px", borderRadius:12, cursor:"pointer", background:expandUser===u.id?`${u.color}06`:hasBlocker?"#EF444404":"transparent", border:`1px solid ${expandUser===u.id?u.color+"25":hasBlocker?"#EF444415":"transparent"}`, transition:"all 0.2s" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                        <Av user={u} size={32} />
                        <div style={{ flex:1 }}>
                          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                            <span style={{ fontSize:13, fontWeight:600 }}>{u.name.split(" ")[0]}</span>
                            {wlObj && <span style={{ fontSize:9, fontWeight:700, color:wlObj.color, background:wlObj.color+"12", padding:"2px 7px", borderRadius:5 }}>{wlObj.emoji} {wlObj.label}</span>}
                            {hasBlocker && <span style={{ fontSize:9, fontWeight:700, color:"#EF4444", background:"#EF444412", padding:"2px 7px", borderRadius:5 }}>Blocked</span>}
                          </div>
                          <div style={{ fontSize:11, color:t.tm }}>{u.role}</div>
                        </div>
                        {u.pulse ? (
                          <div style={{ display:"flex", alignItems:"center", gap:5, animation: u.id==="u1" && pulseLogged ? "emojiPop 0.4s ease both" : "none" }}>
                            <span style={{ fontSize:22 }}>{u.mood?.emoji}</span>
                          </div>
                        ) : (
                          <span style={{ fontSize:11, color:t.tm, background:t.ib, padding:"4px 12px", borderRadius:6 }}>Pending</span>
                        )}
                      </div>
                      {/* EXPANDED DETAIL */}
                      {expandUser===u.id && u.pulse && (
                        <div style={{ marginTop:10, paddingTop:10, borderTop:`1px solid ${t.cb}`, animation:"fadeUp 0.2s ease both" }}>
                          {u.focus && <div style={{ fontSize:12, color:t.ts, marginBottom:6 }}>📌 <strong>Focus:</strong> {u.focus}</div>}
                          {hasBlocker && <div style={{ fontSize:12, color:"#F97316", marginBottom:6 }}>⏳ <strong>Blocked:</strong> {u.id==="u1"?blockerText:"Waiting on dependency"}</div>}
                          <div style={{ display:"flex", gap:6 }}>
                            <span style={{ fontSize:11, color:u.mood?.color, fontWeight:600 }}>{u.mood?.label}</span>
                            <span style={{ fontSize:11, color:t.tm }}>·</span>
                            {wlObj && <span style={{ fontSize:11, color:wlObj.color, fontWeight:600 }}>{wlObj.label} workload</span>}
                          </div>
                        </div>
                      )}
                    </div>
                    );
                  })}
                </div>
                {todayAvg > 0 && (
                  <div style={{ marginTop:14, paddingTop:12, borderTop:`1px solid ${t.cb}`, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <span style={{ fontSize:12, color:t.tm }}>Team avg</span>
                      <span style={{ fontSize:18 }}>{todayMoodObj.emoji}</span>
                      <span style={{ fontSize:14, fontWeight:700, fontFamily:"'Space Mono',monospace", color:todayMoodObj.color }}>{todayAvg.toFixed(1)}</span>
                    </div>
                    <div style={{ display:"flex", gap:4 }}>
                      {todayPulses.filter(p=>p.wl==="overwhelming"||p.wl==="heavy").length > 0 && (
                        <span style={{ fontSize:10, fontWeight:700, color:"#F97316", background:"#F9731610", padding:"3px 10px", borderRadius:6 }}>
                          {todayPulses.filter(p=>p.wl==="overwhelming"||p.wl==="heavy").length} overloaded
                        </span>
                      )}
                      {todayPulses.filter(p=>p.blk&&p.blk!=="none").length > 0 && (
                        <span style={{ fontSize:10, fontWeight:700, color:"#EF4444", background:"#EF444410", padding:"3px 10px", borderRadius:6 }}>
                          {todayPulses.filter(p=>p.blk&&p.blk!=="none").length} blocked
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* AI INSIGHT CARD */}
              <div style={{ background:t.card, borderRadius:18, padding:"24px 26px", border:`1px solid ${t.cb}`, display:"flex", flexDirection:"column" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
                  <div style={{ fontSize:14, fontWeight:700 }}>Energy Insight</div>
                  <div style={{ width:28, height:28, borderRadius:8, background:t.al, display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={t.acc} strokeWidth="2" strokeLinecap="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                  </div>
                </div>
                {showInsight || myPulse === null ? (
                  <div style={{ animation:"insightSlide 0.4s ease both", flex:1, display:"flex", flexDirection:"column", justifyContent:"space-between" }}>
                    <div>
                      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
                        <div style={{ width:8, height:8, borderRadius:"50%", background:aiInsight.type==="warning"?"#EF4444":aiInsight.type==="positive"?"#22C55E":aiInsight.type==="caution"?"#EAB308":t.tm }} />
                        <span style={{ fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.06em", color:aiInsight.type==="warning"?"#EF4444":aiInsight.type==="positive"?"#22C55E":aiInsight.type==="caution"?"#EAB308":t.tm }}>
                          {aiInsight.type==="warning"?"Attention needed":aiInsight.type==="positive"?"Looking great":aiInsight.type==="caution"?"Heads up":"Steady"}
                        </span>
                      </div>
                      <div style={{ fontSize:15, fontWeight:600, lineHeight:1.6, marginBottom:16 }}>{aiInsight.text}</div>
                    </div>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10 }}>
                      <div style={{ padding:"10px 12px", borderRadius:10, background:t.ib }}>
                        <div style={{ fontSize:10, fontWeight:600, color:t.tm, marginBottom:2 }}>3-Day Avg</div>
                        <div style={{ fontSize:18, fontWeight:800, fontFamily:"'Space Mono',monospace", color:last3Avg>3.5?t.green:last3Avg<2.5?t.red:t.text }}>{last3Avg.toFixed(1)}</div>
                      </div>
                      <div style={{ padding:"10px 12px", borderRadius:10, background:t.ib }}>
                        <div style={{ fontSize:10, fontWeight:600, color:t.tm, marginBottom:2 }}>Trend</div>
                        <div style={{ fontSize:18, fontWeight:800, fontFamily:"'Space Mono',monospace", color:energyTrend>0?t.green:energyTrend<-0.3?t.red:t.text }}>{energyTrend>0?"+":""}{energyTrend.toFixed(1)}</div>
                      </div>
                      <div style={{ padding:"10px 12px", borderRadius:10, background:t.ib }}>
                        <div style={{ fontSize:10, fontWeight:600, color:t.tm, marginBottom:2 }}>Velocity</div>
                        <div style={{ fontSize:18, fontWeight:800, fontFamily:"'Space Mono',monospace" }}>{last3Tasks.toFixed(0)}<span style={{ fontSize:11, color:t.tm }}>/d</span></div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", color:t.tm, fontSize:13 }}>
                    Log your pulse to unlock today's insight
                  </div>
                )}
              </div>
            </div>

            {/* ═══ ENERGY × VELOCITY TIMELINE ═══ */}
            <div style={{ background:t.card, borderRadius:18, padding:"24px 28px", border:`1px solid ${t.cb}`, marginBottom:20, animation: animate?"fadeUp 0.5s 0.2s ease both":"none" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                <div style={{ fontSize:14, fontWeight:700 }}>Energy × Velocity</div>
                <div style={{ display:"flex", alignItems:"center", gap:16 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:5 }}><div style={{ width:10, height:10, borderRadius:3, background:`linear-gradient(135deg,${t.acc},#818CF8)` }} /><span style={{ fontSize:11, color:t.tm }}>Energy</span></div>
                  <div style={{ display:"flex", alignItems:"center", gap:5 }}><div style={{ width:10, height:10, borderRadius:3, background:"#22C55E" }} /><span style={{ fontSize:11, color:t.tm }}>Tasks</span></div>
                </div>
              </div>
              <div style={{ fontSize:12, color:t.tm, marginBottom:20 }}>When these lines diverge, something's off.</div>
              
              {/* CHART */}
              <div style={{ position:"relative", height:200 }}>
                {/* Y-axis labels */}
                <div style={{ position:"absolute", left:0, top:0, bottom:30, width:30, display:"flex", flexDirection:"column", justifyContent:"space-between" }}>
                  <span style={{ fontSize:10, color:t.tm, fontFamily:"'Space Mono',monospace" }}>5</span>
                  <span style={{ fontSize:10, color:t.tm, fontFamily:"'Space Mono',monospace" }}>3</span>
                  <span style={{ fontSize:10, color:t.tm, fontFamily:"'Space Mono',monospace" }}>1</span>
                </div>
                {/* Grid lines */}
                <div style={{ position:"absolute", left:35, right:0, top:0, bottom:30 }}>
                  {[0,1,2].map(i => <div key={i} style={{ position:"absolute", left:0, right:0, top:`${i*50}%`, height:1, background:t.cb }} />)}
                </div>
                {/* Bars + Line overlay */}
                <div style={{ position:"absolute", left:40, right:0, top:0, bottom:30, display:"flex", alignItems:"flex-end", gap:4 }}>
                  {history.map((day,i) => {
                    const barH = (day.tasks / maxTasks) * 100;
                    const energyY = 100 - ((day.avg - 1) / 4) * 100;
                    const isHov = hoverDay === i;
                    return (
                      <div key={i} onMouseEnter={()=>setHoverDay(i)} onMouseLeave={()=>setHoverDay(null)}
                        style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", position:"relative", height:"100%", justifyContent:"flex-end", cursor:"pointer" }}>
                        {/* Tooltip */}
                        {isHov && (
                          <div style={{ position:"absolute", top:-8, left:"50%", transform:"translateX(-50%)", background:"#1A1A2E", color:"#fff", padding:"8px 12px", borderRadius:10, fontSize:11, whiteSpace:"nowrap", zIndex:10, animation:"fadeIn 0.15s" }}>
                            <div style={{ fontWeight:700, marginBottom:3 }}>{day.date}</div>
                            <div>Energy: <span style={{ color:MOODS[Math.round(day.avg)-1]?.color }}>{day.avg} {MOODS[Math.round(day.avg)-1]?.emoji}</span></div>
                            <div>Tasks: <span style={{ fontWeight:700 }}>{day.tasks}</span></div>
                          </div>
                        )}
                        {/* Task bar */}
                        <div className="bar-hover" style={{ width:"70%", height:`${barH}%`, borderRadius:"6px 6px 2px 2px", background:isHov?"#22C55E":`linear-gradient(to top,#22C55E40,#22C55E20)`, opacity:isHov?1:0.7, transition:"all 0.2s" }} />
                        {/* Energy dot */}
                        <div style={{ position:"absolute", bottom:`${((day.avg-1)/4)*100}%`, width:isHov?10:7, height:isHov?10:7, borderRadius:"50%", background:t.acc, border:`2px solid ${t.card}`, boxShadow:isHov?`0 0 10px ${t.acc}40`:"none", transition:"all 0.2s", zIndex:5 }} />
                        {/* X label */}
                        <div style={{ marginTop:8, fontSize:10, color:isHov?t.text:t.tm, fontWeight:isHov?700:400, fontFamily:"'Space Mono',monospace" }}>{day.short.slice(0,2)}</div>
                      </div>
                    );
                  })}
                </div>
                {/* Energy line connecting dots */}
                <svg style={{ position:"absolute", left:40, right:0, top:0, bottom:30, width:"calc(100% - 40px)", height:"calc(100% - 30px)", pointerEvents:"none", overflow:"visible" }}>
                  <polyline
                    fill="none" stroke={t.acc} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    points={history.map((day,i) => {
                      const x = (i / (history.length-1)) * 100;
                      const y = 100 - ((day.avg - 1) / 4) * 100;
                      return `${x}%,${y}%`;
                    }).join(" ")}
                    style={{ filter:`drop-shadow(0 2px 4px ${t.acc}30)` }}
                  />
                </svg>
              </div>
            </div>

            {/* ═══ INDIVIDUAL PULSE HISTORY ═══ */}
            <div style={{ background:t.card, borderRadius:18, padding:"24px 28px", border:`1px solid ${t.cb}`, animation: animate?"fadeUp 0.5s 0.3s ease both":"none" }}>
              <div style={{ fontSize:14, fontWeight:700, marginBottom:4 }}>Individual Trends</div>
              <div style={{ fontSize:12, color:t.tm, marginBottom:18 }}>Click a team member to see their pulse history.</div>
              <div style={{ display:"flex", gap:10, marginBottom:expandUser ? 18 : 0 }}>
                {USERS.map(u => {
                  const isExp = expandUser === u.id;
                  const last7 = history.slice(-7).map(d => d.pulses.find(p=>p.userId===u.id)?.value || 3);
                  const avg = last7.reduce((s,v)=>s+v,0)/7;
                  const moodObj = MOODS[Math.round(avg)-1];
                  return (
                    <div key={u.id} onClick={()=>setExpandUser(isExp?null:u.id)} className="hFloat"
                      style={{ flex:1, padding:"16px 14px", borderRadius:14, background:isExp?`${u.color}08`:t.ib, border:`1.5px solid ${isExp?u.color+"40":"transparent"}`, cursor:"pointer", textAlign:"center", transition:"all 0.2s" }}>
                      <Av user={u} size={36} />
                      <div style={{ fontSize:12, fontWeight:700, marginTop:8 }}>{u.name.split(" ")[0]}</div>
                      <div style={{ fontSize:20, marginTop:4 }}>{moodObj?.emoji}</div>
                      <div style={{ fontSize:10, fontFamily:"'Space Mono',monospace", color:moodObj?.color, fontWeight:700 }}>{avg.toFixed(1)}</div>
                      {/* Mini sparkline */}
                      <div style={{ display:"flex", alignItems:"flex-end", gap:2, justifyContent:"center", marginTop:8, height:20 }}>
                        {last7.map((v,i) => (
                          <div key={i} style={{ width:4, height:`${(v/5)*100}%`, borderRadius:2, background:i===6?u.color:`${u.color}40` }} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
              {/* Expanded detail */}
              {expandUser && (() => {
                const eu = USERS.find(u=>u.id===expandUser);
                const userHistory = history.map(d => ({ ...d, pulse: d.pulses.find(p=>p.userId===expandUser)?.value || 3 }));
                return (
                  <div style={{ animation:"insightSlide 0.3s ease both", padding:"20px 22px", borderRadius:14, background:`${eu.color}06`, border:`1px solid ${eu.color}20` }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
                      <Av user={eu} size={28} />
                      <div><div style={{ fontSize:14, fontWeight:700 }}>{eu.name}</div><div style={{ fontSize:11, color:t.tm }}>{eu.role} · 14-day history</div></div>
                    </div>
                    <div style={{ display:"flex", alignItems:"flex-end", gap:6, height:60, marginBottom:12 }}>
                      {userHistory.map((d,i) => {
                        const mObj = MOODS[d.pulse-1];
                        return (
                          <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
                            <span style={{ fontSize:12 }}>{mObj?.emoji}</span>
                            <div style={{ width:"100%", height:`${(d.pulse/5)*40}px`, borderRadius:4, background:`linear-gradient(to top,${mObj?.color}60,${mObj?.color}25)`, transition:"height 0.3s" }} />
                            <span style={{ fontSize:8, color:t.tm, fontFamily:"'Space Mono',monospace" }}>{d.short.slice(0,2)}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        ) : (
          /* ═══ HACKATHON ROOM VIEW ═══ */
          <div style={{ maxWidth:900, margin:"0 auto", padding:"24px 20px 60px" }}>
            
            {/* ROOM HEADER PULSE BAR */}
            <div style={{ animation:"fadeUp 0.4s ease both", background:t.card, borderRadius:18, padding:"20px 26px", border:`1px solid ${t.cb}`, marginBottom:20 }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ width:10, height:10, borderRadius:"50%", background:"#22C55E", animation:"pulseGlow 2s infinite" }} />
                  <span style={{ fontSize:16, fontWeight:700 }}>MVP Launch Blitz</span>
                  <span style={{ fontSize:11, fontWeight:700, background:"#22C55E", color:"#fff", padding:"3px 10px", borderRadius:6 }}>LIVE</span>
                </div>
                <div style={{ fontFamily:"'Space Mono',monospace", fontSize:14, fontWeight:700, color:t.acc }}>02:34:17</div>
              </div>
              
              {/* INLINE TEAM PULSE */}
              <div style={{ display:"flex", alignItems:"center", gap:6, padding:"12px 16px", borderRadius:12, background:t.ib }}>
                <span style={{ fontSize:11, fontWeight:700, color:t.tm, textTransform:"uppercase", letterSpacing:"0.06em", marginRight:8 }}>Team Vibe</span>
                {todayPulses.map(u => (
                  <div key={u.id} style={{ display:"flex", alignItems:"center", gap:4, padding:"4px 10px", borderRadius:8, background:t.card, border:`1px solid ${t.cb}` }}>
                    <Av user={u} size={20} />
                    {u.pulse ? <span style={{ fontSize:16 }}>{u.mood?.emoji}</span> : <span style={{ fontSize:11, color:t.tm }}>—</span>}
                  </div>
                ))}
                <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:6 }}>
                  <span style={{ fontSize:11, color:t.tm }}>Avg</span>
                  <span style={{ fontSize:20 }}>{todayMoodObj?.emoji}</span>
                  <span style={{ fontSize:14, fontWeight:800, fontFamily:"'Space Mono',monospace", color:todayMoodObj?.color }}>{todayAvg.toFixed(1)}</span>
                </div>
              </div>
            </div>

            {/* QUICK PULSE (in room) */}
            {!pulseLogged && (
              <div style={{ animation:"fadeUp 0.4s 0.1s ease both", background:`linear-gradient(135deg,${t.acc}08,#818CF808)`, borderRadius:16, padding:"18px 24px", marginBottom:20, border:`1px solid ${t.acc}20`, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={t.acc} strokeWidth="2" strokeLinecap="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                  <span style={{ fontSize:14, fontWeight:600 }}>How's your energy right now?</span>
                </div>
                <div style={{ display:"flex", gap:6 }}>
                  {MOODS.map(m => (
                    <button key={m.value} className="mood-btn" onClick={()=>logPulse(m.value)}
                      onMouseEnter={()=>setHoverMood(m.value)} onMouseLeave={()=>setHoverMood(null)}
                      style={{ width:42, height:42, borderRadius:10, border:`2px solid ${hoverMood===m.value?m.color+"50":"transparent"}`, background:hoverMood===m.value?m.color+"12":"transparent", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
                      <span style={{ fontSize:22 }}>{m.emoji}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ENERGY OVER SESSION */}
            <div style={{ animation:"fadeUp 0.4s 0.2s ease both", background:t.card, borderRadius:18, padding:"22px 26px", border:`1px solid ${t.cb}`, marginBottom:20 }}>
              <div style={{ fontSize:14, fontWeight:700, marginBottom:14 }}>Session Energy</div>
              <div style={{ display:"flex", alignItems:"center", gap:16 }}>
                {[
                  { time:"Start", emoji:"🔥", avg:4.2 },
                  { time:"1h", emoji:"🙂", avg:3.8 },
                  { time:"2h", emoji:"🙂", avg:3.6 },
                  { time:"Now", emoji:"😐", avg:3.2 },
                ].map((snap,i,arr) => (
                  <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", position:"relative" }}>
                    {i < arr.length-1 && <div style={{ position:"absolute", top:18, left:"60%", right:"-40%", height:2, background:t.cb }} />}
                    <span style={{ fontSize:28, marginBottom:4, position:"relative", zIndex:1 }}>{snap.emoji}</span>
                    <span style={{ fontSize:12, fontWeight:700, fontFamily:"'Space Mono',monospace", color:MOODS[Math.round(snap.avg)-1]?.color }}>{snap.avg}</span>
                    <span style={{ fontSize:10, color:t.tm, marginTop:2 }}>{snap.time}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop:16, padding:"12px 16px", borderRadius:10, background:"#EAB30808", border:"1px solid #EAB30820", display:"flex", alignItems:"center", gap:8, fontSize:12 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#EAB308" strokeWidth="2" strokeLinecap="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                <span style={{ color:"#92710A", fontWeight:600 }}>Energy dropping — might be a good time for a break or playlist switch</span>
              </div>
            </div>

            {/* AI INSIGHT IN ROOM */}
            <div style={{ animation:"fadeUp 0.4s 0.3s ease both", display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
              <div style={{ background:t.card, borderRadius:18, padding:"22px 26px", border:`1px solid ${t.cb}` }}>
                <div style={{ fontSize:14, fontWeight:700, marginBottom:14 }}>Individual Check-in</div>
                {todayPulses.map(u => {
                  const isLow = u.pulse && u.pulse <= 2;
                  const hasBlocker = u.blk && u.blk !== "none";
                  const wlObj = u.wl ? WLOAD_LABELS[u.wl] : null;
                  const isHeavy = u.wl === "heavy" || u.wl === "overwhelming";
                  return (
                    <div key={u.id} style={{ padding:"8px 0", borderBottom:`1px solid ${t.cb}` }}>
                      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                        <Av user={u} size={28} />
                        <div style={{ flex:1 }}>
                          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                            <span style={{ fontSize:13, fontWeight:600 }}>{u.name.split(" ")[0]}</span>
                            {wlObj && <span style={{ fontSize:9, fontWeight:700, color:wlObj.color, background:wlObj.color+"12", padding:"1px 6px", borderRadius:4 }}>{wlObj.emoji}</span>}
                          </div>
                        </div>
                        <span style={{ fontSize:20 }}>{u.pulse ? u.mood?.emoji : "⏳"}</span>
                        {isLow && <span style={{ fontSize:10, fontWeight:700, color:"#F97316", background:"#F9731612", padding:"3px 8px", borderRadius:5 }}>Low energy</span>}
                        {hasBlocker && <span style={{ fontSize:10, fontWeight:700, color:"#EF4444", background:"#EF444412", padding:"3px 8px", borderRadius:5 }}>Blocked</span>}
                        {isHeavy && !isLow && !hasBlocker && <span style={{ fontSize:10, fontWeight:700, color:"#F97316", background:"#F9731612", padding:"3px 8px", borderRadius:5 }}>Heavy load</span>}
                      </div>
                      {u.focus && <div style={{ fontSize:11, color:t.tm, marginLeft:38, marginTop:3 }}>📌 {u.focus}</div>}
                    </div>
                  );
                })}
              </div>
              <div style={{ background:t.card, borderRadius:18, padding:"22px 26px", border:`1px solid ${t.cb}`, display:"flex", flexDirection:"column" }}>
                <div style={{ fontSize:14, fontWeight:700, marginBottom:14 }}>Actionable Signals</div>
                <div style={{ display:"flex", flexDirection:"column", gap:10, flex:1 }}>
                  {todayPulses.filter(p=>p.pulse&&p.pulse>=4).map(u => (
                    <div key={u.id} style={{ padding:"12px 16px", borderRadius:12, background:"#22C55E08", border:"1px solid #22C55E20" }}>
                      <div style={{ fontSize:12, fontWeight:700, color:"#22C55E", marginBottom:2 }}>{u.name.split(" ")[0]} is {u.mood?.label.toLowerCase()} {u.mood?.emoji}</div>
                      <div style={{ fontSize:11, color:t.ts }}>{u.wl==="light"?"Has bandwidth — good candidate for extra tasks":"High energy — great for critical path work"}</div>
                    </div>
                  ))}
                  {todayPulses.filter(p=>p.blk&&p.blk!=="none").map(u => (
                    <div key={u.id+"b"} style={{ padding:"12px 16px", borderRadius:12, background:"#EF444408", border:"1px solid #EF444420" }}>
                      <div style={{ fontSize:12, fontWeight:700, color:"#EF4444", marginBottom:2 }}>{u.name.split(" ")[0]} is blocked {u.blk==="waiting"?"⏳":"🧱"}</div>
                      <div style={{ fontSize:11, color:t.ts }}>{u.focus || "Clear this before it cascades to others"}</div>
                    </div>
                  ))}
                  {todayPulses.filter(p=>p.wl==="overwhelming").map(u => (
                    <div key={u.id+"w"} style={{ padding:"12px 16px", borderRadius:12, background:"#F9731608", border:"1px solid #F9731620" }}>
                      <div style={{ fontSize:12, fontWeight:700, color:"#F97316", marginBottom:2 }}>{u.name.split(" ")[0]} is overwhelmed 🆘</div>
                      <div style={{ fontSize:11, color:t.ts }}>Consider redistributing tasks or pairing up</div>
                    </div>
                  ))}
                  {todayPulses.filter(p=>p.pulse&&p.pulse<=2&&(!p.blk||p.blk==="none")).map(u => (
                    <div key={u.id+"l"} style={{ padding:"12px 16px", borderRadius:12, background:"#EAB30808", border:"1px solid #EAB30820" }}>
                      <div style={{ fontSize:12, fontWeight:700, color:"#92710A", marginBottom:2 }}>{u.name.split(" ")[0]} is low energy {u.mood?.emoji}</div>
                      <div style={{ fontSize:11, color:t.ts }}>Suggest lighter tasks or a break</div>
                    </div>
                  ))}
                  <div style={{ padding:"10px 14px", borderRadius:10, background:t.ib, border:`1px solid ${t.cb}`, marginTop:"auto" }}>
                    <div style={{ fontSize:11, color:t.tm, display:"flex", alignItems:"center", gap:5 }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={t.tm} strokeWidth="2" strokeLinecap="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                      Signals generated from today's check-ins · Updated live
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
