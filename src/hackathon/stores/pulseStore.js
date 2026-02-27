/* pulseStore.js — Zustand store for energy/pulse tracking */
import { create } from "zustand";
import { MOODS } from "../constants";
import { PULSE_USERS, PRESET_PULSES, PRESET_WORKLOAD, PRESET_BLOCKERS, PRESET_FOCUS, genHistory } from "../mockData";
import { supabase } from "../lib/supabase";

const usePulseStore = create((set, get) => ({
  // ── Check-in state ──
  myPulse: null,
  pulseLogged: false,
  checkStep: 0, // 0=energy, 1=workload, 2=blockers, 3=focus, 4=done
  workload: null,
  blocker: null,
  blockerText: "",
  win: "",
  hoverMood: null,
  showInsight: false,
  expandUser: null,
  hoverDay: null,
  animate: false,

  // ── History ──
  history: genHistory(),

  // ── Actions ──
  setAnimate: (v) => set({ animate: v }),
  setHoverMood: (v) => set({ hoverMood: v }),
  setHoverDay: (v) => set({ hoverDay: v }),
  setExpandUser: (v) => set({ expandUser: v }),

  logPulse: (val) => set({ myPulse: val, checkStep: 1 }),
  logWorkload: (val) => set({ workload: val, checkStep: 2 }),
  logBlocker: (val) => {
    set({ blocker: val });
    if (val === "none") set({ checkStep: 3 });
  },
  setBlockerText: (v) => set({ blockerText: v }),
  submitBlockerText: () => set({ checkStep: 3 }),
  setWin: (v) => set({ win: v }),

  finishCheckin: () => {
    set({ checkStep: 4, pulseLogged: true });
    setTimeout(() => set({ showInsight: true }), 600);
    // If supabase is configured, insert the checkin
    const { myPulse, workload, blocker, blockerText, win } = get();
    if (supabase) {
      supabase.from("pulse_checkins").insert({
        energy: myPulse,
        workload,
        blocker,
        blocker_detail: blockerText || null,
        focus: win || null,
      }).then(() => {});
    }
  },

  redoCheckin: () => set({
    pulseLogged: false, myPulse: null, showInsight: false,
    checkStep: 0, workload: null, blocker: null, blockerText: "", win: "",
  }),

  // ── Computed ──
  getTodayPulses: () => {
    const { myPulse, workload, blocker, win } = get();
    return PULSE_USERS.map((pu) => ({
      ...pu,
      pulse: pu.id === "u1" ? myPulse : PRESET_PULSES[pu.id],
      mood: MOODS[(pu.id === "u1" ? myPulse : PRESET_PULSES[pu.id]) - 1] || null,
      wl: pu.id === "u1" ? workload : PRESET_WORKLOAD[pu.id],
      blk: pu.id === "u1" ? blocker : PRESET_BLOCKERS[pu.id],
      focus: pu.id === "u1" ? win : PRESET_FOCUS[pu.id],
    }));
  },

  getTodayAvg: () => {
    const pulses = get().getTodayPulses();
    const withPulse = pulses.filter((p) => p.pulse);
    return withPulse.length ? withPulse.reduce((s, p) => s + p.pulse, 0) / withPulse.length : 0;
  },

  getAiInsight: () => {
    const { history } = get();
    const todayPulses = get().getTodayPulses();
    const last3Avg = history.slice(-3).reduce((s, d) => s + d.avg, 0) / 3;
    const last3Tasks = history.slice(-3).reduce((s, d) => s + d.tasks, 0) / 3;
    const prev3Avg = history.slice(-6, -3).reduce((s, d) => s + d.avg, 0) / 3;
    const energyTrend = last3Avg - prev3Avg;

    if (last3Tasks > 7 && last3Avg < 3)
      return { type: "warning", text: "High output but energy is dropping — burnout risk. Consider pacing down.", last3Avg, energyTrend, last3Tasks };
    if (todayPulses.filter((p) => p.wl === "overwhelming").length >= 2)
      return { type: "warning", text: `${todayPulses.filter((p) => p.wl === "overwhelming").length} team members are overwhelmed. Time to redistribute tasks.`, last3Avg, energyTrend, last3Tasks };
    if (todayPulses.filter((p) => p.blk && p.blk !== "none").length >= 2)
      return { type: "caution", text: `${todayPulses.filter((p) => p.blk && p.blk !== "none").length} people are blocked. Clear these before they cascade.`, last3Avg, energyTrend, last3Tasks };
    if (last3Avg > 3.8 && last3Tasks > 6)
      return { type: "positive", text: "Team is energized and shipping. Ride the wave!", last3Avg, energyTrend, last3Tasks };
    if (energyTrend < -0.5)
      return { type: "caution", text: "Energy has been trending down this week. Worth a team check-in.", last3Avg, energyTrend, last3Tasks };
    return { type: "neutral", text: "Team energy is steady. Sustainable pace.", last3Avg, energyTrend, last3Tasks };
  },
}));

export default usePulseStore;
