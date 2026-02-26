/* hackathonStore.js — Zustand store for all hackathon state */
import { create } from "zustand";
import { HACKS, TEAM } from "../mockData";
import { CHEERS } from "../constants";

const useHackathonStore = create((set, get) => ({
  // ── List view ──
  hackathons: HACKS,
  team: TEAM,

  // ── Active room ──
  activeRoom: null,
  showExit: false,
  enterRoom: (h) => set({ activeRoom: h, tab: "ideas", tasks: h.tasks, ideas: h.ideas, graveyard: h.graveyard || [], msgs: h.messages, playlists: h.playlists, meetings: [
    { id:"mt1", title:"Daily Standup", time:"Today, 3:00 PM", duration:"15 min", agenda:"Quick sync on blockers and progress.", invited:["u1","u2","u3","u4"], status:"live" },
    { id:"mt2", title:"Design Review", time:"Today, 5:00 PM", duration:"30 min", agenda:"Review card modal mockup and dark mode.", invited:["u1","u2","u6"], status:"scheduled" },
  ], celebration: null, onBreak: false, breakStart: null, showExit: false }),
  exitRoom: () => set({ activeRoom: null, showExit: false }),
  setShowExit: (v) => set({ showExit: v }),

  // ── Tab ──
  tab: "ideas",
  setTab: (t) => set({ tab: t }),

  // ── Tasks ──
  tasks: [],
  showAddTask: false,
  openTask: null,
  taskDragId: null,
  newTaskForm: { title: "", desc: "", priority: "medium", assignee: "u1" },
  setTasks: (fn) => set((s) => ({ tasks: typeof fn === "function" ? fn(s.tasks) : fn })),
  moveTask: (id, status) => {
    const prev = get().tasks.find((tk) => tk.id === id);
    set((s) => ({ tasks: s.tasks.map((tk) => (tk.id === id ? { ...tk, status } : tk)) }));
    if (status === "done" && prev?.status !== "done") {
      set({ celebration: null });
      setTimeout(() => set({ celebration: { text: CHEERS[Math.floor(Math.random() * CHEERS.length)], key: Date.now() } }), 50);
    }
  },
  addTask: () => {
    const { newTaskForm, tasks } = get();
    if (!newTaskForm.title.trim()) return;
    const parts = get().activeRoom?.participants || [];
    set({
      tasks: [...tasks, { id: `t${Date.now()}`, title: newTaskForm.title.trim(), desc: newTaskForm.desc, assignee: newTaskForm.assignee, status: "todo", priority: newTaskForm.priority, subtasks: [] }],
      newTaskForm: { title: "", desc: "", priority: "medium", assignee: "u1" },
      showAddTask: false,
    });
  },
  setShowAddTask: (v) => set({ showAddTask: v }),
  setOpenTask: (v) => set({ openTask: v }),
  setTaskDragId: (v) => set({ taskDragId: v }),
  setNewTaskForm: (fn) => set((s) => ({ newTaskForm: typeof fn === "function" ? fn(s.newTaskForm) : fn })),

  // ── Ideas ──
  ideas: [],
  graveyard: [],
  openIdea: null,
  ideaCmt: "",
  dragId: null,
  showGrave: false,
  graveAnim: false,
  setOpenIdea: (v) => set({ openIdea: v }),
  setIdeaCmt: (v) => set({ ideaCmt: v }),
  setDragId: (v) => set({ dragId: v }),
  setShowGrave: (v) => set({ showGrave: v }),
  setGraveAnim: (v) => set({ graveAnim: v }),
  voteIdea: (id) => set((s) => ({ ideas: s.ideas.map((i) => (i.id === id ? { ...i, votes: i.votes + 1 } : i)) })),
  addIdeaCmt: (id) => {
    const { ideaCmt } = get();
    if (!ideaCmt.trim()) return;
    set((s) => ({ ideas: s.ideas.map((i) => (i.id === id ? { ...i, comments: [...i.comments, { user: "u1", text: ideaCmt.trim() }] } : i)), ideaCmt: "" }));
  },
  moveIdeaCat: (id, cat) => set((s) => ({ ideas: s.ideas.map((i) => (i.id === id ? { ...i, cat } : i)), dragId: null })),
  killIdea: (id) => {
    const idea = get().ideas.find((i) => i.id === id);
    if (idea) {
      set((s) => ({
        graveyard: [...s.graveyard, { id: idea.id, content: idea.content, user: idea.user, reason: "Archived" }],
        ideas: s.ideas.filter((i) => i.id !== id),
        openIdea: null,
        graveAnim: true,
      }));
      setTimeout(() => set({ graveAnim: false }), 800);
    }
  },
  reviveIdea: (id) => {
    const gi = get().graveyard.find((g) => g.id === id);
    if (gi) {
      set((s) => ({
        ideas: [...s.ideas, { id: gi.id, content: gi.content, user: gi.user, color: "#EAB308", votes: 0, cat: "Workshopping", comments: [], links: [], notes: "" }],
        graveyard: s.graveyard.filter((g) => g.id !== id),
      }));
    }
  },

  // ── Chat ──
  msgs: [],
  newMsg: "",
  setNewMsg: (v) => set({ newMsg: v }),
  sendMsg: () => {
    const { newMsg } = get();
    if (!newMsg.trim()) return;
    set((s) => ({ msgs: [...s.msgs, { id: `m${Date.now()}`, user: "u1", text: newMsg.trim(), time: Date.now() }], newMsg: "" }));
  },

  // ── Goals ──
  expGoal: null,
  setExpGoal: (v) => set({ expGoal: v }),

  // ── Sprint ──
  openSprint: null,
  hoverSprint: null,
  expFric: null,
  updateReqs: [],
  setOpenSprint: (v) => set({ openSprint: v }),
  setHoverSprint: (v) => set({ hoverSprint: v }),
  setExpFric: (v) => set({ expFric: v }),
  addUpdateReq: (id) => set((s) => ({ updateReqs: [...s.updateReqs, id] })),

  // ── Playlists ──
  playlists: [],
  expPl: null,
  hoverPl: null,
  showAddPl: false,
  newPl: { title: "", by: "", url: "", platform: "Spotify" },
  setExpPl: (v) => set({ expPl: v }),
  setHoverPl: (v) => set({ hoverPl: v }),
  setShowAddPl: (v) => set({ showAddPl: v }),
  setNewPl: (fn) => set((s) => ({ newPl: typeof fn === "function" ? fn(s.newPl) : fn })),
  addPlaylist: () => {
    const { newPl } = get();
    if (!newPl.title.trim() || !newPl.url.trim()) return;
    set((s) => ({
      playlists: [...s.playlists, { id: `pl${Date.now()}`, title: newPl.title.trim(), by: newPl.by.trim() || "You", url: newPl.url.trim(), platform: newPl.platform }],
      newPl: { title: "", by: "", url: "", platform: "Spotify" },
      showAddPl: false,
    }));
  },

  // ── Resources ──
  expRes: null,
  setExpRes: (v) => set({ expRes: v }),

  // ── Meetings ──
  meetings: [],
  showMeeting: false,
  newMeet: { title: "", time: "", duration: "30 min", agenda: "", invited: [] },
  activeMeeting: null,
  meetNote: "",
  meetNotes: [],
  handRaised: false,
  rsvps: [],
  setShowMeeting: (v) => set({ showMeeting: v }),
  setNewMeet: (fn) => set((s) => ({ newMeet: typeof fn === "function" ? fn(s.newMeet) : fn })),
  setActiveMeeting: (v) => set({ activeMeeting: v, meetNotes: [], handRaised: false }),
  setMeetNote: (v) => set({ meetNote: v }),
  setHandRaised: (v) => set({ handRaised: v }),
  addMeeting: () => {
    const { newMeet } = get();
    if (!newMeet.title.trim()) return;
    set((s) => ({
      meetings: [...s.meetings, { id: `mt${Date.now()}`, title: newMeet.title.trim(), time: newMeet.time || "TBD", duration: newMeet.duration, agenda: newMeet.agenda, invited: newMeet.invited.length ? newMeet.invited : ["u1"], status: "scheduled" }],
      newMeet: { title: "", time: "", duration: "30 min", agenda: "", invited: [] },
      showMeeting: false,
    }));
  },
  addMeetNote: () => {
    const { meetNote } = get();
    if (!meetNote.trim()) return;
    set((s) => ({
      meetNotes: [...s.meetNotes, { text: meetNote.trim(), time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }) }],
      meetNote: "",
    }));
  },
  rsvpMeeting: (id) => set((s) => ({ rsvps: [...s.rsvps, id] })),

  // ── Break ──
  onBreak: false,
  breakStart: null,
  breakAnim: false,
  toggleBreak: () => set((s) => {
    const next = !s.onBreak;
    return { onBreak: next, breakStart: next ? Date.now() : null, breakAnim: true };
  }),
  setBreakAnim: (v) => set({ breakAnim: v }),

  // ── Celebration ──
  celebration: null,
  setCelebration: (v) => set({ celebration: v }),

  // ── Schedule hackathon ──
  showSchedule: false,
  schedForm: { name: "", desc: "", theme: "", date: "", invited: [] },
  setShowSchedule: (v) => set({ showSchedule: v }),
  setSchedForm: (fn) => set((s) => ({ schedForm: typeof fn === "function" ? fn(s.schedForm) : fn })),

  // ── Computed helpers ──
  calcGP: (g) => {
    const tasks = get().tasks;
    const gt = g.taskIds.map((tid) => tasks.find((tk) => tk.id === tid)).filter(Boolean);
    return gt.length ? Math.round(gt.filter((tk) => tk.status === "done").length / gt.length * 100) : 0;
  },
}));

export default useHackathonStore;
