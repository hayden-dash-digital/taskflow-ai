/* mockData.js — TEAM and HACKS arrays from hackathon-v9.jsx */

export const TEAM = [
  { id: "u1", name: "You", initials: "YO", color: "#5B4AE4", role: "Lead", online: true },
  { id: "u2", name: "Sarah Chen", initials: "SC", color: "#EC4899", role: "Designer", online: true },
  { id: "u3", name: "Marcus Johnson", initials: "MJ", color: "#F97316", role: "Developer", online: true },
  { id: "u4", name: "Aisha Patel", initials: "AP", color: "#22C55E", role: "Marketing", online: true },
  { id: "u5", name: "David Kim", initials: "DK", color: "#3B82F6", role: "Developer", online: false },
  { id: "u6", name: "Lisa Müller", initials: "LM", color: "#A855F7", role: "PM", online: true },
];

export const u = (id) => TEAM.find((m) => m.id === id);

/* ═══ PULSE / ENERGY MOCK DATA ═══ */
export const PULSE_USERS = [
  { id: "u1", name: "Alex Chen", role: "Lead", color: "#5B4AE4", avatar: "AC" },
  { id: "u2", name: "Sarah Kim", role: "Designer", color: "#EC4899", avatar: "SK" },
  { id: "u3", name: "Marcus Johnson", role: "Backend", color: "#F97316", avatar: "MJ" },
  { id: "u4", name: "Aisha Patel", role: "Frontend", color: "#22C55E", avatar: "AP" },
  { id: "u5", name: "Jordan Lee", role: "PM", color: "#3B82F6", avatar: "JL" },
];

export const PRESET_PULSES = { u2: 4, u3: 5, u4: 2, u5: 3 };
export const PRESET_WORKLOAD = { u2: "balanced", u3: "heavy", u4: "overwhelming", u5: "balanced" };
export const PRESET_BLOCKERS = { u2: "none", u3: "none", u4: "waiting", u5: "none" };
export const PRESET_FOCUS = {
  u2: "Finishing the onboarding mockups",
  u3: "API endpoints for sprint view",
  u4: "Waiting on design tokens from Sarah",
  u5: "Sprint planning for next week",
};

export const genHistory = () => {
  const days = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const label = d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
    const short = d.toLocaleDateString("en-US", { weekday: "short" });
    const pulses = PULSE_USERS.map((pu) => ({
      userId: pu.id,
      value: Math.max(1, Math.min(5, Math.round(3 + (Math.random() - 0.4) * 2.5 + (i < 4 ? -0.8 : i > 10 ? 0.5 : 0)))),
    }));
    const avg = pulses.reduce((s, p) => s + p.value, 0) / pulses.length;
    const tasks = Math.round(3 + Math.random() * 6 + (avg > 3.5 ? 2 : avg < 2.5 ? -1 : 0));
    days.push({ date: label, short, pulses, avg: Math.round(avg * 10) / 10, tasks });
  }
  return days;
};

export const HACKS = [
  {
    id: "h1", name: "MVP Launch Blitz",
    description: "Ship the core dashboard — auth, board, card editing. Get it live on Vercel by end of day.",
    theme: "Engineering",
    start: new Date(Date.now() - 2.5 * 3600000).toISOString(),
    end: new Date(Date.now() + 5.5 * 3600000).toISOString(),
    status: "live", createdBy: "u1", color: "#5B4AE4",
    participants: ["u1", "u2", "u3", "u4", "u6"],
    ideas: [
      { id: "i1", content: "Right-click quick actions on cards — move, assign, set priority all in one context menu.", user: "u1", color: "#EAB308", votes: 4, cat: "Planning", comments: [{ user: "u3", text: "Love this, quick to implement" }, { user: "u2", text: "Let me mock up the context menu" }], links: [{ title: "Context Menu UX Patterns", url: "https://uxdesign.cc" }], notes: "Could reduce task management time by ~40%." },
      { id: "i2", content: "Focus Mode — hide everything except current task + a Pomodoro timer for deep work.", user: "u2", color: "#EC4899", votes: 7, cat: "In Review", comments: [{ user: "u1", text: "Premium feature potential" }, { user: "u4", text: "Love this for marketing sprints" }], links: [{ title: "Pomodoro Research", url: "https://todoist.com" }], notes: "Sarah designing the overlay." },
      { id: "i3", content: "Weekly email digest with sprint progress and AI insights for stakeholders.", user: "u6", color: "#A855F7", votes: 3, cat: "Workshopping", comments: [], links: [], notes: "" },
      { id: "i4", content: "Slack integration — turn any message into a TaskFlow card with an emoji reaction.", user: "u3", color: "#3B82F6", votes: 5, cat: "Planning", comments: [{ user: "u6", text: "High priority for the team" }], links: [{ title: "Slack API Docs", url: "https://api.slack.com" }], notes: "Marcus scoping the webhook architecture." },
      { id: "i5", content: "Gamification: XP for tasks, streak counters, team leaderboard.", user: "u4", color: "#22C55E", votes: 2, cat: "Workshopping", comments: [], links: [], notes: "" },
      { id: "i6", content: "Client portal — read-only view for clients to track progress.", user: "u1", color: "#F97316", votes: 8, cat: "In Review", comments: [{ user: "u4", text: "Marketing would love this" }, { user: "u6", text: "Scope for Q2?" }, { user: "u2", text: "I'll design the portal" }], links: [{ title: "Portal Wireframe", url: "https://figma.com" }], notes: "Highest voted. Lisa building business case." },
    ],
    graveyard: [{ id: "ig1", content: "Auto-assign tasks based on availability calendar.", user: "u6", reason: "Too complex for v1" }],
    tasks: [
      { id: "t1", title: "Set up Supabase schema", assignee: "u3", status: "done", priority: "urgent", desc: "Create all tables with RLS policies.", subtasks: [{ text: "Users table", done: true }, { text: "Cards table", done: true }, { text: "RLS policies", done: true }] },
      { id: "t2", title: "Auth flow — login & signup", assignee: "u5", status: "progress", priority: "high", desc: "Supabase Auth with email/password and Google OAuth.", subtasks: [{ text: "Login form", done: true }, { text: "Signup form", done: true }, { text: "OAuth redirect", done: false }] },
      { id: "t3", title: "Board column components", assignee: "u1", status: "done", priority: "high", desc: "5-column Kanban layout with headers.", subtasks: [{ text: "Column component", done: true }, { text: "Column header", done: true }] },
      { id: "t4", title: "Card drag & drop engine", assignee: "u3", status: "progress", priority: "urgent", desc: "@dnd-kit for card movement.", subtasks: [{ text: "DnD context", done: true }, { text: "Ghost preview", done: false }, { text: "Drop animation", done: false }] },
      { id: "t5", title: "Design card modal mockup", assignee: "u2", status: "done", priority: "medium", desc: "Two-column modal in Figma.", subtasks: [{ text: "Figma mockup", done: true }, { text: "Dark mode variant", done: true }] },
      { id: "t6", title: "Priority filter UI", assignee: "u1", status: "todo", priority: "medium", desc: "Dropdown to filter cards by priority.", subtasks: [{ text: "Filter component", done: false }, { text: "Filter logic", done: false }] },
      { id: "t7", title: "Deploy to Vercel staging", assignee: "u3", status: "todo", priority: "low", desc: "Vercel project setup and deploy.", subtasks: [] },
      { id: "t8", title: "Landing page copy", assignee: "u4", status: "progress", priority: "high", desc: "Hero, features, CTA copy.", subtasks: [{ text: "Hero copy", done: true }, { text: "Features section", done: false }, { text: "CTA & pricing", done: false }] },
    ],
    goals: [
      { id: "g1", title: "Database Live", taskIds: ["t1"], weight: 15, color: "#F97316" },
      { id: "g2", title: "Auth Working", taskIds: ["t2"], weight: 20, color: "#3B82F6" },
      { id: "g3", title: "Board Functional", taskIds: ["t3", "t4"], weight: 25, color: "#5B4AE4" },
      { id: "g4", title: "Card Modal Ready", taskIds: ["t5", "t6"], weight: 20, color: "#EC4899" },
      { id: "g5", title: "Deployed to Staging", taskIds: ["t7", "t8"], weight: 20, color: "#22C55E" },
    ],
    sprint: {
      members: ["u1", "u2", "u3", "u4"],
      tasks: [
        { id: "s1", title: "Supabase schema", assignee: "u3", status: "done", priority: "urgent", blockedBy: null, desc: "All tables created." },
        { id: "s2", title: "Auth flow", assignee: "u3", status: "blocked", priority: "high", blockedBy: "s1", desc: "Blocked until schema stable." },
        { id: "s3", title: "Board columns", assignee: "u1", status: "done", priority: "high", blockedBy: null, desc: "5-column layout done." },
        { id: "s4", title: "Drag & drop", assignee: "u3", status: "progress", priority: "urgent", blockedBy: "s3", desc: "Ghost preview WIP." },
        { id: "s5", title: "Card modal design", assignee: "u2", status: "review", priority: "medium", blockedBy: null, desc: "Figma mockup in review." },
        { id: "s6", title: "Card modal code", assignee: "u1", status: "blocked", priority: "high", blockedBy: "s5", desc: "Waiting on design approval." },
        { id: "s7", title: "Landing copy", assignee: "u4", status: "progress", priority: "medium", blockedBy: null, desc: "Marketing copy in progress." },
        { id: "s8", title: "Deploy pipeline", assignee: "u3", status: "todo", priority: "low", blockedBy: "s4", desc: "After DnD is stable." },
      ],
    },
    playlists: [
      { id: "pl1", title: "Lo-fi Coding Beats", by: "u2", url: "https://open.spotify.com/playlist/0vvXsWCC9xrXsKd4FyS8kM", platform: "Spotify" },
      { id: "pl2", title: "Late Night Synthwave", by: "u3", url: "https://www.youtube.com/watch?v=4xDzrJKXOOY", platform: "YouTube" },
      { id: "pl3", title: "Jazz & Focus", by: "u1", url: "https://open.spotify.com/playlist/37i9dQZF1DWV7EzJMK2FUI", platform: "Spotify" },
      { id: "pl4", title: "Ambient Workscapes", by: "u6", url: "https://www.youtube.com/watch?v=jfKfPfyJRdk", platform: "YouTube" },
    ],
    resources: [
      { id: "r1", type: "github", title: "taskflow/taskflow-app", url: "https://github.com/taskflow/taskflow-app", desc: "Main repo. React + Vite + Supabase." },
      { id: "r2", type: "figma", title: "TaskFlow Design System v2", url: "https://figma.com/file/taskflow", desc: "Tokens, components, and layouts." },
      { id: "r3", type: "doc", title: "TASKFLOW_BUILD_SPEC.md", url: "#spec", desc: "Full technical specification." },
      { id: "r4", type: "link", title: "Supabase Dashboard", url: "https://app.supabase.com", desc: "DB, auth, storage config." },
    ],
    messages: [
      { id: "m1", user: "u1", text: "Let's go team! Core board is the priority today.", time: Date.now() - 7200000, pinned: true },
      { id: "m2", user: "u3", text: "Schema deployed. All tables live.", time: Date.now() - 5400000 },
      { id: "m3", user: "u2", text: "Card modal mockup done — check Figma", time: Date.now() - 3600000 },
      { id: "m4", user: "u3", text: "@You DnD ghost preview is buggy.", time: Date.now() - 600000 },
      { id: "m5", user: "u1", text: "Take your time, quality matters.", time: Date.now() - 300000 },
    ],
  },
  {
    id: "h2", name: "Design System Overhaul",
    description: "Rebuild the component library. New tokens, dark mode polish, accessibility.",
    theme: "Design",
    start: new Date(Date.now() - 1 * 3600000).toISOString(),
    end: new Date(Date.now() + 7 * 3600000).toISOString(),
    status: "live", createdBy: "u2", color: "#EC4899",
    participants: ["u2", "u1", "u4"],
    ideas: [], graveyard: [], tasks: [], goals: [],
    sprint: { members: [], tasks: [] },
    playlists: [], resources: [], messages: [],
  },
  {
    id: "h3", name: "Q2 Roadmap Planning",
    description: "Next quarter — features, priorities, timeline, team allocation.",
    theme: "Strategy",
    start: new Date(Date.now() + 86400000 * 3).toISOString(),
    end: new Date(Date.now() + 86400000 * 3 + 14400000).toISOString(),
    status: "scheduled", createdBy: "u6", color: "#A855F7",
    participants: ["u6", "u1", "u2", "u3"],
    ideas: [], graveyard: [], tasks: [], goals: [],
    sprint: { members: [], tasks: [] },
    playlists: [], resources: [], messages: [],
  },
  {
    id: "h4", name: "Marketing Content Blitz",
    description: "Launch assets — blog posts, social media, demo videos.",
    theme: "Marketing",
    start: new Date(Date.now() + 86400000 * 7).toISOString(),
    end: new Date(Date.now() + 86400000 * 7 + 21600000).toISOString(),
    status: "scheduled", createdBy: "u4", color: "#22C55E",
    participants: ["u4", "u2"],
    ideas: [], graveyard: [], tasks: [], goals: [],
    sprint: { members: [], tasks: [] },
    playlists: [], resources: [], messages: [],
  },
];
