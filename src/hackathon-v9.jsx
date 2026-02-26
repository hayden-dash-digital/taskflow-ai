import { useState, useRef, useEffect, useCallback } from "react";

/* ══════════════ TEAM ══════════════ */
const TEAM = [
  { id: "u1", name: "You", initials: "YO", color: "#5B4AE4", role: "Lead", online: true },
  { id: "u2", name: "Sarah Chen", initials: "SC", color: "#EC4899", role: "Designer", online: true },
  { id: "u3", name: "Marcus Johnson", initials: "MJ", color: "#F97316", role: "Developer", online: true },
  { id: "u4", name: "Aisha Patel", initials: "AP", color: "#22C55E", role: "Marketing", online: true },
  { id: "u5", name: "David Kim", initials: "DK", color: "#3B82F6", role: "Developer", online: false },
  { id: "u6", name: "Lisa Müller", initials: "LM", color: "#A855F7", role: "PM", online: true },
];
const u = id => TEAM.find(m => m.id === id);
const IDEA_CATS = ["Workshopping", "Planning", "In Review"];
const PC = { urgent: "#EF4444", high: "#F97316", medium: "#EAB308", low: "#22C55E" };
const PL_MSGS = ["Lock in.", "Let's jam.", "Vibe check.", "Deep focus.", "In the zone.", "Flow state."];
const IDEA_MSGS = ["Every great product starts with a spark.", "No idea is too wild — post it.", "Think big, ship small.", "The best ideas come from the team."];
const CHEERS = ["Hooray!", "Nice work!", "Crushed it!", "Let's go!", "Ship it!"];
const PL_GLOWS = ["#EC4899","#F97316","#22C55E","#3B82F6","#A855F7","#EAB308","#EF4444"];

/* ══════════════ DATA ══════════════ */
const HACKS = [
  {
    id: "h1", name: "MVP Launch Blitz", description: "Ship the core dashboard — auth, board, card editing. Get it live on Vercel by end of day.", theme: "Engineering",
    start: new Date(Date.now() - 2.5 * 3600000).toISOString(), end: new Date(Date.now() + 5.5 * 3600000).toISOString(),
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
    id: "h2", name: "Design System Overhaul", description: "Rebuild the component library. New tokens, dark mode polish, accessibility.", theme: "Design",
    start: new Date(Date.now() - 1 * 3600000).toISOString(), end: new Date(Date.now() + 7 * 3600000).toISOString(),
    status: "live", createdBy: "u2", color: "#EC4899", participants: ["u2", "u1", "u4"],
    ideas: [], graveyard: [], tasks: [], goals: [], sprint: { members: [], tasks: [] }, playlists: [], resources: [], messages: [],
  },
  {
    id: "h3", name: "Q2 Roadmap Planning", description: "Next quarter — features, priorities, timeline, team allocation.", theme: "Strategy",
    start: new Date(Date.now() + 86400000 * 3).toISOString(), end: new Date(Date.now() + 86400000 * 3 + 14400000).toISOString(),
    status: "scheduled", createdBy: "u6", color: "#A855F7", participants: ["u6", "u1", "u2", "u3"],
    ideas: [], graveyard: [], tasks: [], goals: [], sprint: { members: [], tasks: [] }, playlists: [], resources: [], messages: [],
  },
  {
    id: "h4", name: "Marketing Content Blitz", description: "Launch assets — blog posts, social media, demo videos.", theme: "Marketing",
    start: new Date(Date.now() + 86400000 * 7).toISOString(), end: new Date(Date.now() + 86400000 * 7 + 21600000).toISOString(),
    status: "scheduled", createdBy: "u4", color: "#22C55E", participants: ["u4", "u2"],
    ideas: [], graveyard: [], tasks: [], goals: [], sprint: { members: [], tasks: [] }, playlists: [], resources: [], messages: [],
  },
];

/* ══════════════ ICONS (SVG line icons, no emojis) ══════════════ */
const I = {
  back: (s=18,c="currentColor") => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
  check: (s=14,c="currentColor") => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>,
  close: (s=18,c="currentColor") => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  send: (s=14,c="currentColor") => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  kanban: (s=18,c="currentColor") => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="15"/></svg>,
  bulb: (s=18,c="currentColor") => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18h6M10 22h4M12 2a7 7 0 00-4 12.73V17a1 1 0 001 1h6a1 1 0 001-1v-2.27A7 7 0 0012 2z"/></svg>,
  target: (s=18,c="currentColor") => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  link: (s=18,c="currentColor") => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>,
  chat: (s=18,c="currentColor") => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
  plus: (s=16,c="currentColor") => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  pin: (s=12,c="currentColor") => <svg width={s} height={s} viewBox="0 0 24 24" fill={c} stroke={c} strokeWidth="1.5"><path d="M12 2c-1.1 0-2 .9-2 2v6.5L7 13v2h4v5l1 2 1-2v-5h4v-2l-3-2.5V4c0-1.1-.9-2-2-2z"/></svg>,
  thumbUp: (s=14,c="currentColor") => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14z"/><path d="M7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3"/></svg>,
  music: (s=16,c="currentColor") => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>,
  figma: (s=16,c="currentColor") => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 5.5A3.5 3.5 0 018.5 2H12v7H8.5A3.5 3.5 0 015 5.5z"/><path d="M12 2h3.5a3.5 3.5 0 110 7H12V2z"/><path d="M12 12.5a3.5 3.5 0 117 0 3.5 3.5 0 11-7 0z"/><path d="M5 19.5A3.5 3.5 0 018.5 16H12v3.5a3.5 3.5 0 11-7 0z"/><path d="M5 12.5A3.5 3.5 0 018.5 9H12v7H8.5A3.5 3.5 0 015 12.5z"/></svg>,
  github: (s=16,c="currentColor") => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/></svg>,
  doc: (s=16,c="currentColor") => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  flag: (s=11,c="currentColor") => <svg width={s} height={s} viewBox="0 0 24 24" fill={c} stroke={c} strokeWidth="1.5"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>,
  users: (s=16,c="currentColor") => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
  cal: (s=16,c="currentColor") => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  sprint: (s=16,c="currentColor") => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>,
  coffee: (s=16,c="currentColor") => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>,
  warn: (s=14,c="currentColor") => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  comment: (s=13,c="currentColor") => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>,
  chevR: (s=14,c="currentColor") => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
  ext: (s=12,c="currentColor") => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>,
  trash: (s=14,c="currentColor") => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>,
  skull: (s=16,c="currentColor") => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="11" r="8"/><path d="M9 15h6"/><circle cx="9" cy="10" r="1.2" fill={c}/><circle cx="15" cy="10" r="1.2" fill={c}/><path d="M10 19v3m4-3v3"/></svg>,
  party: (s=16,c="currentColor") => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5.8 11.3L2 22l10.7-3.8M4.2 4.2l7.2 7.2"/><path d="M15 4l-3.5 3.5M18 7l-3 3"/><circle cx="19" cy="5" r="2" fill={c}/><circle cx="15" cy="3" r="1" fill={c}/></svg>,
};
const RI = { figma: I.figma, github: I.github, doc: I.doc, link: I.link };

/* ══════════════ THEMES ══════════════ */
const TH = {
  light: { bg:"#F5F5F7",side:"#FFFFFF",card:"#FFFFFF",cb:"#E8E8ED",text:"#1A1A2E",ts:"#6B6B80",tm:"#9CA3AF",acc:"#5B4AE4",al:"#E8E5FF",ib:"#F5F5F7",ibr:"#E0E0E5",mod:"#FFFFFF",sh:"0 1px 3px rgba(0,0,0,0.06)",shH:"0 10px 25px rgba(0,0,0,0.1)",rbg:"#EEEEF2",cbg:"#F8F8FA",mbg:"#FFFFFF",scr:"#D1D1D6" },
  dark: { bg:"#0F0F14",side:"#16161E",card:"#1A1A24",cb:"#2A2A35",text:"#E8E8F0",ts:"#8888A0",tm:"#555566",acc:"#9B8AFB",al:"#1E1D30",ib:"#141419",ibr:"#2A2A35",mod:"#1A1A24",sh:"0 1px 3px rgba(0,0,0,0.3)",shH:"0 10px 25px rgba(0,0,0,0.4)",rbg:"#0C0C10",cbg:"#16161E",mbg:"#1A1A24",scr:"#2A2A35" },
};

/* ══════════════ HELPERS ══════════════ */
const Av = ({ user, size=26, style={} }) => user ? <div style={{ width:size, height:size, borderRadius:"50%", background:user.color, display:"inline-flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:size*0.37, fontWeight:700, fontFamily:"'Space Mono',monospace", flexShrink:0, position:"relative", ...style }}>{user.initials}{user.online && <div style={{ position:"absolute", bottom:-1, right:-1, width:Math.max(6,size*0.25), height:Math.max(6,size*0.25), borderRadius:"50%", background:"#22C55E", border:"2px solid var(--ring,#16161E)" }} />}</div> : null;

function useTimer(s) { const [e,setE]=useState(0); useEffect(() => { const st=new Date(s).getTime(); const tick=()=>setE(Math.max(0,Math.floor((Date.now()-st)/1000))); tick(); const id=setInterval(tick,1000); return ()=>clearInterval(id); },[s]); return `${String(Math.floor(e/3600)).padStart(2,"0")}:${String(Math.floor((e%3600)/60)).padStart(2,"0")}:${String(e%60).padStart(2,"0")}`; }

function BreakTimer({ start }) {
  const [e,setE]=useState(0);
  useEffect(()=>{if(!start)return;const tick=()=>setE(Math.max(0,Math.floor((Date.now()-start)/1000)));tick();const id=setInterval(tick,1000);return()=>clearInterval(id);},[start]);
  if(!start) return null;
  const m=Math.floor(e/60); const s=e%60;
  return <span style={{ fontSize:10, fontFamily:"'Space Mono',monospace", color:"#F97316", background:"#F9731610", padding:"2px 8px", borderRadius:5 }}>{m}:{String(s).padStart(2,"0")}</span>;
}

function Modal({ children, onClose, t, width=600 }) {
  return <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.55)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:999, backdropFilter:"blur(6px)", animation:"fadeIn 0.15s" }}>
    <div onClick={e=>e.stopPropagation()} style={{ background:t.mod, borderRadius:18, width, maxHeight:"85vh", overflow:"auto", boxShadow:"0 24px 60px rgba(0,0,0,0.3)", border:`1px solid ${t.cb}`, animation:"modalIn 0.2s ease" }}>{children}</div>
  </div>;
}

/* ═══ Celebration overlay ═══ */
function Celebration({ text, onDone }) {
  useEffect(() => { const id = setTimeout(onDone, 2500); return () => clearTimeout(id); }, []);
  const particles = Array.from({ length: 24 }, (_, i) => ({ id: i, x: 50 + (Math.random()-0.5)*60, color: ["#5B4AE4","#EC4899","#F97316","#22C55E","#3B82F6","#EAB308","#A855F7","#EF4444"][i%8], delay: Math.random()*0.3, size: 4+Math.random()*6 }));
  return <div style={{ position:"fixed", inset:0, zIndex:1000, pointerEvents:"none", display:"flex", alignItems:"center", justifyContent:"center", animation:"celebFade 2.5s ease forwards" }}>
    {particles.map(p => <div key={p.id} style={{ position:"absolute", left:`${p.x}%`, top:"45%", width:p.size, height:p.size, borderRadius: p.id%3===0 ? "50%" : "1px", background:p.color, animation:`confettiFall 1.8s ease-out ${p.delay}s both` }} />)}
    <div style={{ fontSize:28, fontWeight:700, color:"#5B4AE4", textShadow:"0 2px 20px rgba(91,74,228,0.3)", animation:"cheerPop 0.4s cubic-bezier(0.175,0.885,0.32,1.275) both", fontFamily:"'DM Sans',sans-serif" }}>{text}</div>
  </div>;
}

/* ══════════════ MAIN APP ══════════════ */
export default function App() {
  const dark = false;
  const t = TH.light;
  const [room, setRoom] = useState(null);
  const [showExit, setShowExit] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [schedForm, setSchedForm] = useState({ name:"", desc:"", theme:"", date:"", invited:[] });

  if (room) return <Room h={room} t={t} dark={false} onExit={()=>setShowExit(true)} showExit={showExit} onYes={()=>{setRoom(null);setShowExit(false);}} onNo={()=>setShowExit(false)} />;

  const live = HACKS.filter(h=>h.status==="live");
  const up = HACKS.filter(h=>h.status==="scheduled");

  return (
    <div style={{ minHeight:"100vh", background:t.bg, color:t.text, fontFamily:"'DM Sans',sans-serif", "--ring":t.bg }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
      <div style={{ maxWidth:1060, margin:"0 auto", padding:"36px 28px" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:32 }}>
          <div style={{ display:"flex", alignItems:"center", gap:14 }}>
            <div style={{ width:44, height:44, borderRadius:13, background:`linear-gradient(135deg,${t.acc},#818CF8)`, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:700, fontSize:20, fontFamily:"'Space Mono',monospace" }}>T</div>
            <div><div style={{ fontSize:22, fontWeight:700, letterSpacing:"-0.03em" }}>Hackathons</div><div style={{ fontSize:13, color:t.tm }}>TaskFlow Collaboration Rooms</div></div>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={()=>setShowSchedule(true)} style={{ padding:"9px 22px", borderRadius:10, border:"none", background:`linear-gradient(135deg,${t.acc},#818CF8)`, color:"#fff", cursor:"pointer", fontSize:13, fontFamily:"inherit", fontWeight:600, display:"flex", alignItems:"center", gap:6 }}>{I.plus(14,"#fff")} Schedule Hackathon</button>
          </div>
        </div>
        {/* LIVE */}
        <div style={{ marginBottom:36 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:16 }}>
            <div style={{ width:10, height:10, borderRadius:"50%", background:"#22C55E", animation:"livePulse 2s infinite" }} />
            <span style={{ fontSize:14, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.06em", color:"#22C55E" }}>Live Rooms</span>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:`repeat(${Math.min(live.length,2)},1fr)`, gap:16 }}>
            {live.map(h => { const timer = <TimerDisplay start={h.start} color={h.color} />; const parts=h.participants.map(id=>u(id)).filter(Boolean); return (
              <div key={h.id} onClick={()=>setRoom(h)} className="hFloat" style={{ aspectRatio:"1/0.82", borderRadius:20, cursor:"pointer", position:"relative", overflow:"hidden", background:`linear-gradient(160deg,${h.color}15,${h.color}05,${t.card})`, border:`2px solid ${h.color}35`, display:"flex", flexDirection:"column", justifyContent:"space-between", padding:"26px 28px" }}>
                <div style={{ position:"absolute", top:-50, right:-50, width:140, height:140, borderRadius:"50%", background:h.color, opacity:0.06, filter:"blur(40px)" }} />
                <div>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
                    <span style={{ fontSize:11, fontWeight:700, background:"#22C55E", color:"#fff", padding:"4px 12px", borderRadius:7, textTransform:"uppercase", letterSpacing:"0.06em" }}>LIVE</span>
                    <span style={{ fontSize:11, color:t.tm, background:t.ib, padding:"4px 10px", borderRadius:6, fontWeight:500 }}>{h.theme}</span>
                  </div>
                  <h2 style={{ fontSize:22, fontWeight:700, letterSpacing:"-0.03em", marginBottom:8, lineHeight:1.2 }}>{h.name}</h2>
                  <p style={{ fontSize:14, color:t.ts, lineHeight:1.5, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>{h.description}</p>
                </div>
                <div>
                  {timer}
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginTop:14 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:16, fontSize:12, color:t.tm }}>
                      <span style={{ display:"flex", alignItems:"center", gap:4 }}>{I.users(14,t.tm)} {parts.length}</span>
                      {h.tasks.length>0 && <span>{h.tasks.length} tasks</span>}
                      {h.ideas.length>0 && <span>{h.ideas.length} ideas</span>}
                    </div>
                    <div style={{ display:"flex" }}>{parts.slice(0,4).map((uu,i)=><Av key={uu.id} user={uu} size={30} style={{ marginLeft:i>0?-8:0, border:`2px solid ${t.card}`, "--ring":t.card }} />)}</div>
                  </div>
                  <div style={{ marginTop:16, padding:"12px 0", borderTop:`1px solid ${t.cb}`, textAlign:"center", fontSize:14, fontWeight:600, color:h.color }}>Enter Room {I.chevR(14,h.color)}</div>
                </div>
              </div>
            ); })}
          </div>
        </div>
        {/* UPCOMING */}
        {up.length>0 && <div>
          <div style={{ fontSize:14, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.06em", color:t.tm, marginBottom:16 }}>Upcoming</div>
          <div style={{ display:"grid", gridTemplateColumns:`repeat(${Math.min(up.length,2)},1fr)`, gap:16 }}>
            {up.map(h => { const parts=h.participants.map(id=>u(id)).filter(Boolean); const my=h.participants.includes("u1"); return (
              <div key={h.id} className="hFloat" style={{ borderRadius:20, background:t.card, border:`1px solid ${t.cb}`, padding:"24px 26px", display:"flex", flexDirection:"column", justifyContent:"space-between", minHeight:190 }}>
                <div>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}><div style={{ width:12, height:12, borderRadius:5, background:h.color }} /><span style={{ fontSize:11, color:t.tm, background:t.ib, padding:"4px 10px", borderRadius:6, fontWeight:500 }}>{h.theme}</span></div>
                  <h3 style={{ fontSize:18, fontWeight:700, marginBottom:5, letterSpacing:"-0.02em" }}>{h.name}</h3>
                  <p style={{ fontSize:13, color:t.ts, lineHeight:1.45 }}>{h.description}</p>
                </div>
                <div>
                  <div style={{ display:"flex", alignItems:"center", gap:12, fontSize:12, color:t.tm, marginBottom:14 }}>
                    <span style={{ display:"flex", alignItems:"center", gap:4 }}>{I.cal(14,t.tm)} {new Date(h.start).toLocaleDateString("en-US",{ month:"short",day:"numeric" })}</span>
                    <span style={{ display:"flex", alignItems:"center", gap:4 }}>{I.users(14,t.tm)} {parts.length} invited</span>
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <div style={{ display:"flex" }}>{parts.slice(0,4).map((uu,i)=><Av key={uu.id} user={uu} size={26} style={{ marginLeft:i>0?-6:0, border:`2px solid ${t.card}`, "--ring":t.card }} />)}</div>
                    {my ? <span style={{ fontSize:12, fontWeight:600, color:"#22C55E", background:dark?"#0F2918":"#F0FDF4", padding:"6px 14px", borderRadius:8, display:"flex", alignItems:"center", gap:4 }}>{I.check(11,"#22C55E")} Accepted</span> : <button style={{ padding:"6px 16px", borderRadius:8, border:"none", background:dark?"#0F2918":"#F0FDF4", color:"#22C55E", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>Accept</button>}
                  </div>
                </div>
              </div>
            ); })}
          </div>
        </div>}
      </div>
      {/* SCHEDULE MODAL */}
      {showSchedule && <Modal t={t} onClose={()=>setShowSchedule(false)} width={520}>
        <div style={{ padding:"28px 30px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
            <h3 style={{ fontSize:20, fontWeight:700 }}>Schedule a Hackathon</h3>
            <button onClick={()=>setShowSchedule(false)} style={{ width:30, height:30, borderRadius:8, border:`1px solid ${t.ibr}`, background:t.ib, color:t.tm, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>{I.close(16,t.tm)}</button>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <div><label style={{ fontSize:12, fontWeight:600, color:t.tm, display:"block", marginBottom:5 }}>Hackathon Name</label><input value={schedForm.name} onChange={e=>setSchedForm(p=>({...p,name:e.target.value}))} placeholder="e.g. MVP Launch Blitz" style={{ width:"100%", padding:"11px 14px", borderRadius:10, border:`1px solid ${t.ibr}`, background:t.ib, color:t.text, fontSize:14, fontFamily:"inherit", outline:"none" }} /></div>
            <div><label style={{ fontSize:12, fontWeight:600, color:t.tm, display:"block", marginBottom:5 }}>Description</label><textarea value={schedForm.desc} onChange={e=>setSchedForm(p=>({...p,desc:e.target.value}))} placeholder="What's the focus?" rows={3} style={{ width:"100%", padding:"11px 14px", borderRadius:10, border:`1px solid ${t.ibr}`, background:t.ib, color:t.text, fontSize:14, fontFamily:"inherit", outline:"none", resize:"vertical" }} /></div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              <div><label style={{ fontSize:12, fontWeight:600, color:t.tm, display:"block", marginBottom:5 }}>Theme / Focus</label><input value={schedForm.theme} onChange={e=>setSchedForm(p=>({...p,theme:e.target.value}))} placeholder="Engineering, Design..." style={{ width:"100%", padding:"11px 14px", borderRadius:10, border:`1px solid ${t.ibr}`, background:t.ib, color:t.text, fontSize:14, fontFamily:"inherit", outline:"none" }} /></div>
              <div><label style={{ fontSize:12, fontWeight:600, color:t.tm, display:"block", marginBottom:5 }}>Date & Time</label><input type="datetime-local" value={schedForm.date} onChange={e=>setSchedForm(p=>({...p,date:e.target.value}))} style={{ width:"100%", padding:"11px 14px", borderRadius:10, border:`1px solid ${t.ibr}`, background:t.ib, color:t.text, fontSize:14, fontFamily:"inherit", outline:"none" }} /></div>
            </div>
            <div><label style={{ fontSize:12, fontWeight:600, color:t.tm, display:"block", marginBottom:8 }}>Invite Team Members</label>
              <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                {TEAM.filter(m=>m.id!=="u1").map(m => { const inv = schedForm.invited.includes(m.id); return (
                  <div key={m.id} onClick={()=>setSchedForm(p=>({...p,invited:inv?p.invited.filter(x=>x!==m.id):[...p.invited,m.id]}))} style={{ display:"flex", alignItems:"center", gap:7, padding:"7px 12px", borderRadius:10, cursor:"pointer", border:`1.5px solid ${inv?t.acc+"50":t.ibr}`, background:inv?t.al:"transparent", transition:"all 0.15s" }}>
                    <Av user={m} size={22} /><span style={{ fontSize:12, fontWeight:600, color:inv?t.acc:t.ts }}>{m.name.split(" ")[0]}</span>
                    {inv && <span style={{ color:t.acc }}>{I.check(12,t.acc)}</span>}
                  </div>
                ); })}
              </div>
            </div>
            <button onClick={()=>setShowSchedule(false)} style={{ marginTop:6, padding:"12px 0", borderRadius:12, border:"none", background:`linear-gradient(135deg,${t.acc},#818CF8)`, color:"#fff", fontSize:14, fontWeight:600, cursor:"pointer", fontFamily:"inherit", width:"100%" }}>Schedule Hackathon</button>
          </div>
        </div>
      </Modal>}
      <Styles t={t} />
    </div>
  );
}

function TimerDisplay({ start, color }) {
  const timer = useTimer(start);
  return <div style={{ fontFamily:"'Space Mono',monospace", fontSize:32, fontWeight:700, color, letterSpacing:"0.04em" }}>{timer}</div>;
}

/* ══════════════ ROOM ══════════════ */
function Room({ h, t, dark, onExit, showExit, onYes, onNo }) {
  const [tab, setTab] = useState("ideas");
  const [tasks, setTasks] = useState(h.tasks);
  const [ideas, setIdeas] = useState(h.ideas);
  const [graveyard, setGraveyard] = useState(h.graveyard||[]);
  const [msgs, setMsgs] = useState(h.messages);
  const [newMsg, setNewMsg] = useState("");
  const [openIdea, setOpenIdea] = useState(null);
  const [openTask, setOpenTask] = useState(null);
  const [openSprint, setOpenSprint] = useState(null);
  const [ideaCmt, setIdeaCmt] = useState("");
  const [expGoal, setExpGoal] = useState(null);
  const [onBreak, setOnBreak] = useState(false);
  const [dragId, setDragId] = useState(null);
  const [taskDragId, setTaskDragId] = useState(null);
  const [showGrave, setShowGrave] = useState(false);
  const [graveAnim, setGraveAnim] = useState(false);
  const [expPl, setExpPl] = useState(null);
  const [hoverPl, setHoverPl] = useState(null);
  const [expRes, setExpRes] = useState(null);
  const [hoverSprint, setHoverSprint] = useState(null);
  const [celebration, setCelebration] = useState(null);
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskForm, setNewTaskForm] = useState({ title:"", desc:"", priority:"medium", assignee:"u1" });
  const [meetings, setMeetings] = useState([
    { id:"mt1", title:"Daily Standup", time:"Today, 3:00 PM", duration:"15 min", agenda:"Quick sync on blockers and progress.", invited:["u1","u2","u3","u4"], status:"live" },
    { id:"mt2", title:"Design Review", time:"Today, 5:00 PM", duration:"30 min", agenda:"Review card modal mockup and dark mode.", invited:["u1","u2","u6"], status:"scheduled" },
  ]);
  const [showMeeting, setShowMeeting] = useState(false);
  const [newMeet, setNewMeet] = useState({ title:"", time:"", duration:"30 min", agenda:"", invited:[] });
  const [breakAnim, setBreakAnim] = useState(false);
  const [expFric, setExpFric] = useState(null);
  const [showAddPl, setShowAddPl] = useState(false);
  const [newPl, setNewPl] = useState({ title:"", by:"", url:"", platform:"Spotify" });
  const [playlists, setPlaylists] = useState(h.playlists);
  const [breakStart, setBreakStart] = useState(null);
  const [updateReqs, setUpdateReqs] = useState([]);
  const [activeMeeting, setActiveMeeting] = useState(null);
  const [meetNote, setMeetNote] = useState("");
  const [meetNotes, setMeetNotes] = useState([]);
  const [handRaised, setHandRaised] = useState(false);
  const [rsvps, setRsvps] = useState([]);
  const chatEnd = useRef(null);
  const timer = useTimer(h.start);
  const parts = h.participants.map(id=>({...u(id)})).filter(Boolean);

  useEffect(()=>{ chatEnd.current?.scrollIntoView({ behavior:"smooth" }); },[msgs]);

  const sendMsg = () => { if (!newMsg.trim()) return; setMsgs(p=>[...p,{ id:`m${Date.now()}`, user:"u1", text:newMsg.trim(), time:Date.now() }]); setNewMsg(""); };
  const addTask = () => { if (!newTaskForm.title.trim()) return; setTasks(p=>[...p,{ id:`t${Date.now()}`, title:newTaskForm.title.trim(), desc:newTaskForm.desc, assignee:newTaskForm.assignee, status:"todo", priority:newTaskForm.priority, subtasks:[] }]); setNewTaskForm({ title:"", desc:"", priority:"medium", assignee:"u1" }); setShowAddTask(false); };
  const moveTask = (id, status) => {
    const prev = tasks.find(tk=>tk.id===id);
    setTasks(p=>p.map(tk=>tk.id===id?{...tk, status}:tk));
    if (status === "done" && prev?.status !== "done") { setCelebration(null); setTimeout(()=>setCelebration({ text: CHEERS[Math.floor(Math.random()*CHEERS.length)], key: Date.now() }), 50); }
  };
  const voteIdea = (id) => setIdeas(p=>p.map(i=>i.id===id?{...i, votes:i.votes+1}:i));
  const addIdeaCmt = (id) => { if (!ideaCmt.trim()) return; setIdeas(p=>p.map(i=>i.id===id?{...i, comments:[...i.comments,{ user:"u1", text:ideaCmt.trim() }]}:i)); setIdeaCmt(""); };
  const moveIdeaCat = (id, cat) => { setIdeas(p=>p.map(i=>i.id===id?{...i, cat}:i)); setDragId(null); };
  const killIdea = (id) => { const idea=ideas.find(i=>i.id===id); if(idea){ setGraveyard(p=>[...p,{ id:idea.id, content:idea.content, user:idea.user, reason:"Archived" }]); setIdeas(p=>p.filter(i=>i.id!==id)); setOpenIdea(null); setGraveAnim(true); setTimeout(()=>setGraveAnim(false),800); } };
  const reviveIdea = (id) => { const gi=graveyard.find(g=>g.id===id); if(gi){ setIdeas(p=>[...p,{ id:gi.id, content:gi.content, user:gi.user, color:"#EAB308", votes:0, cat:"Workshopping", comments:[], links:[], notes:"" }]); setGraveyard(p=>p.filter(g=>g.id!==id)); } };

  const calcGP = g => { const gt=g.taskIds.map(tid=>tasks.find(tk=>tk.id===tid)).filter(Boolean); return gt.length ? Math.round(gt.filter(tk=>tk.status==="done").length/gt.length*100) : 0; };
  const totalP = h.goals.length ? Math.round(h.goals.reduce((s,g)=>s+calcGP(g)*(g.weight/100),0)) : 0;

  const tabs = [
    { id:"ideas", label:"Ideas", icon:I.bulb },
    { id:"tasks", label:"Tasks", icon:I.kanban },
    { id:"sprint", label:"Sprint", icon:I.sprint },
    { id:"meetings", label:"Meetings", icon:I.users },
    { id:"goals", label:"Goals", icon:I.target },
    { id:"resources", label:"Resources", icon:I.link },
    { id:"playlists", label:"Playlists", icon:I.music },
    { id:"breakroom", label:"Breakroom", icon:I.coffee },
  ];

  const openIdeaData = ideas.find(i=>i.id===openIdea);
  const openTaskData = tasks.find(tk=>tk.id===openTask);
  const openSprintData = h.sprint.tasks.find(tk=>tk.id===openSprint);

  return (
    <div style={{ height:"100vh", display:"flex", flexDirection:"column", background:t.rbg, color:t.text, fontFamily:"'DM Sans',sans-serif", animation:"roomEnter 0.35s ease", "--ring":t.rbg }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />

      {celebration && <Celebration key={celebration.key} text={celebration.text} onDone={()=>setCelebration(null)} />}

      {/* HEADER */}
      <div style={{ padding:"8px 20px", display:"flex", alignItems:"center", justifyContent:"space-between", background:t.side, borderBottom:`1px solid ${t.cb}`, flexShrink:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          <button onClick={onExit} style={{ display:"flex", alignItems:"center", gap:5, padding:"7px 14px", borderRadius:9, border:`1px solid ${t.ibr}`, background:t.ib, color:t.ts, cursor:"pointer", fontSize:13, fontFamily:"inherit" }}>{I.back(14,t.ts)} Exit</button>
          <div style={{ width:1, height:22, background:t.cb }} />
          <div style={{ width:10, height:10, borderRadius:"50%", background:"#22C55E", animation:"livePulse 2s infinite", boxShadow:"0 0 10px #22C55E60" }} />
          <span style={{ fontSize:10, fontWeight:700, color:"#22C55E", textTransform:"uppercase", letterSpacing:"0.06em" }}>LIVE</span>
          <span style={{ fontSize:16, fontWeight:700 }}>{h.name}</span>
        </div>
        {/* TIMER — inline center */}
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ padding:"5px 24px", borderRadius:12, background:`${h.color}10`, border:`2px solid ${h.color}25` }}>
            <span style={{ fontFamily:"'Space Mono',monospace", fontSize:24, fontWeight:700, color:h.color, letterSpacing:"0.06em" }}>{timer}</span>
          </div>
          <div style={{ fontFamily:"'Space Mono',monospace", fontSize:14, fontWeight:700, color:totalP>=100?"#22C55E":t.ts }}>{totalP}%</div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ display:"flex" }}>{parts.slice(0,5).map((uu,i)=><Av key={uu.id} user={uu} size={28} style={{ marginLeft:i>0?-7:0, border:`2px solid ${t.side}`, "--ring":t.side }} />)}</div>
        </div>
      </div>

      {/* BREAK OVERLAY - only when not in breakroom tab */}
      {onBreak && tab!=="breakroom" && <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", zIndex:900, display:"flex", alignItems:"center", justifyContent:"center", backdropFilter:"blur(10px)", animation:"fadeIn 0.2s" }}>
        <div style={{ textAlign:"center" }}>
          <div className="coffeeFloat" style={{ display:"flex", justifyContent:"center", marginBottom:20 }}>{I.coffee(72,"#F97316")}</div>
          <div style={{ position:"relative", display:"flex", justifyContent:"center", marginTop:-30, marginBottom:12, height:34 }}><div className="steam s1" /><div className="steam s2" /><div className="steam s3" /></div>
          <div style={{ fontSize:30, fontWeight:700, color:"#fff", marginBottom:8 }}>Taking a break</div>
          <div style={{ fontSize:15, color:"#ffffff80", marginBottom:28 }}>Recharging. Your team can see you're on break.</div>
          <button onClick={()=>setOnBreak(false)} style={{ padding:"12px 32px", borderRadius:12, border:"none", background:"#F97316", color:"#fff", fontSize:15, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>I'm Back</button>
        </div>
      </div>}

      {/* BODY */}
      <div style={{ flex:1, display:"flex", overflow:"hidden" }}>
        {/* SIDEBAR */}
        <div style={{ width:80, background:t.side, borderRight:`1px solid ${t.cb}`, display:"flex", flexDirection:"column", alignItems:"center", paddingTop:12, gap:4 }}>
          {tabs.map(tb => {
            const active = tab===tb.id;
            const isIdeas = tb.id==="ideas";
            const isBreak = tb.id==="breakroom";
            return (
              <div key={tb.id} onClick={()=>setTab(tb.id)} title={tb.label} style={{
                width:62, padding:"10px 0", borderRadius:13, display:"flex", flexDirection:"column", alignItems:"center", gap:4,
                cursor:"pointer", transition:"all 0.2s",
                background: active ? (isBreak ? "#F9731620" : `${t.acc}30`) : "transparent",
                color: active ? (isBreak ? "#F97316" : t.acc) : t.tm,
                border: active ? `2px solid ${isBreak ? "#F9731640" : t.acc+"50"}` : "2px solid transparent",
                boxShadow: active ? `0 0 12px ${isBreak ? "#F9731615" : t.acc+"20"}` : "none",
              }}>
                <div style={{ position:"relative" }}>
                  {tb.icon(20, active ? (isBreak ? "#F97316" : t.acc) : (isIdeas ? "#EAB308" : t.tm))}
                  {isIdeas && !active && <div style={{ position:"absolute", inset:-3, borderRadius:"50%", background:"#EAB30815" }} />}
                </div>
                <span style={{ fontSize:10, fontWeight: active ? 700 : 500 }}>{tb.label}</span>
              </div>
            );
          })}
          <div style={{ flex:1 }} />
          <div style={{ padding:"4px 0 10px", display:"flex", flexDirection:"column", alignItems:"center", gap:5 }}>
            {parts.slice(0,3).map(uu=><Av key={uu.id} user={uu} size={24} style={{ "--ring":t.side }} />)}
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div style={{ flex:1, overflow:"auto", padding:"20px 26px" }}>

          {/* ════ IDEAS ════ */}
          {tab==="ideas" && <div>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:6 }}>
              <h2 style={{ fontSize:20, fontWeight:700 }}>Idea Board</h2>
              <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                <button onClick={()=>{setShowGrave(!showGrave);setGraveAnim(true);setTimeout(()=>setGraveAnim(false),800);}} style={{ display:"flex", alignItems:"center", gap:5, padding:"8px 14px", borderRadius:10, border:`1px solid ${t.ibr}`, background:showGrave?"#EF444412":t.ib, color:showGrave?"#EF4444":t.tm, cursor:"pointer", fontSize:12, fontWeight:600, fontFamily:"inherit" }}><span className={graveAnim?"graveShake":""}>{I.skull(14,showGrave?"#EF4444":t.tm)}</span> Graveyard {graveyard.length>0 && <span style={{ fontFamily:"'Space Mono',monospace", fontSize:10 }}>{graveyard.length}</span>}</button>
              </div>
            </div>
            <div style={{ fontSize:15, color:t.acc, marginBottom:18, fontWeight:600, padding:"12px 18px", borderRadius:12, background:`${t.acc}08`, border:`1px solid ${t.acc}15`, display:"flex", alignItems:"center", gap:8 }}><span style={{ color:"#EAB308" }}>{I.bulb(18,"#EAB308")}</span> {IDEA_MSGS[Math.floor(Date.now()/120000)%IDEA_MSGS.length]}</div>
            {showGrave && graveyard.length>0 && <div style={{ marginBottom:18, padding:"16px 20px", borderRadius:14, background:"#EF444408", border:`1px solid #EF444420`, animation:"fadeIn 0.2s" }}>
              <div style={{ fontSize:13, fontWeight:700, color:"#EF4444", marginBottom:10, display:"flex", alignItems:"center", gap:5 }}>{I.skull(15,"#EF4444")} Idea Graveyard</div>
              {graveyard.map(gi => <div key={gi.id} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:10, padding:"8px 0", borderBottom:`1px solid #EF444410` }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, fontSize:13, color:t.tm }}><Av user={u(gi.user)} size={22} /><span style={{ textDecoration:"line-through" }}>{gi.content}</span></div>
                <button onClick={()=>reviveIdea(gi.id)} style={{ fontSize:11, color:t.acc, background:t.al, border:"none", padding:"4px 10px", borderRadius:6, cursor:"pointer", fontWeight:600, fontFamily:"inherit", whiteSpace:"nowrap" }}>Revive</button>
              </div>)}
            </div>}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:16 }}>
              {IDEA_CATS.map(cat => {
                const cc = cat==="Workshopping"?"#EAB308":cat==="Planning"?"#3B82F6":"#22C55E";
                const ci = ideas.filter(i=>i.cat===cat).sort((a,b)=>b.votes-a.votes);
                return <div key={cat} onDragOver={e=>e.preventDefault()} onDrop={()=>dragId&&moveIdeaCat(dragId,cat)} style={{ minHeight:200 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:12, padding:"10px 14px", borderRadius:12, background:cc+"12", border:`1px solid ${cc}25` }}>
                    <div style={{ width:9, height:9, borderRadius:"50%", background:cc }} />
                    <span style={{ fontSize:13, fontWeight:700, color:cc }}>{cat}</span>
                    <span style={{ fontSize:11, fontFamily:"'Space Mono',monospace", color:t.tm, marginLeft:"auto" }}>{ci.length}</span>
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                    {ci.map(idea => { const iu=u(idea.user); return (
                      <div key={idea.id} draggable onDragStart={()=>setDragId(idea.id)} onClick={()=>setOpenIdea(idea.id)} className="ideaCard" style={{ padding:"18px 20px", borderRadius:12, cursor:"pointer", background:idea.color+(dark?"14":"10"), border:`1.5px solid ${idea.color}30`, transition:"all 0.25s cubic-bezier(0.175,0.885,0.32,1.275)", animation:"fadeIn 0.2s" }}>
                        <div style={{ fontSize:14.5, lineHeight:1.55, color:t.text, marginBottom:12 }}>{idea.content}</div>
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                          <div style={{ display:"flex", alignItems:"center", gap:7 }}><Av user={iu} size={22} /><span style={{ fontSize:12, color:t.tm }}>{iu?.name.split(" ")[0]}</span>{idea.comments.length>0&&<span style={{ display:"flex", alignItems:"center", gap:3, fontSize:11, color:t.ts, background:t.ib, padding:"2px 7px", borderRadius:5 }}>{I.comment(12,t.ts)} {idea.comments.length}</span>}</div>
                          <button onClick={e=>{e.stopPropagation();voteIdea(idea.id);}} style={{ display:"flex", alignItems:"center", gap:5, padding:"5px 12px", borderRadius:8, border:"none", cursor:"pointer", background:idea.votes>0?t.al:t.ib, color:idea.votes>0?t.acc:t.tm, fontSize:13, fontWeight:700, fontFamily:"'Space Mono',monospace" }}>{I.thumbUp(13,idea.votes>0?t.acc:t.tm)} {idea.votes}</button>
                        </div>
                      </div>
                    ); })}
                  </div>
                </div>;
              })}
            </div>
          </div>}

          {/* ════ TASKS ════ */}
          {tab==="tasks" && <div>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
              <h2 style={{ fontSize:20, fontWeight:700 }}>Task Board</h2>
              <div style={{ display:"flex", gap:8 }}>
                <button onClick={()=>setShowAddTask(true)} style={{ padding:"8px 18px", borderRadius:10, border:"none", background:t.acc, color:"#fff", cursor:"pointer", fontSize:13, fontWeight:600, fontFamily:"inherit", display:"flex", alignItems:"center", gap:5 }}>{I.plus(14,"#fff")} Add Task</button>
              </div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:16 }}>
              {["todo","progress","done"].map(status => {
                const label = status==="todo"?"To Do":status==="progress"?"In Progress":"Done";
                const col = status==="done"?"#22C55E":status==="progress"?"#3B82F6":t.tm;
                return <div key={status} onDragOver={e=>e.preventDefault()} onDrop={()=>{if(taskDragId){moveTask(taskDragId,status);setTaskDragId(null);}}}>
                  <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:12, padding:"10px 14px", borderRadius:12, background:t.card, border:`1px solid ${t.cb}` }}>
                    <div style={{ width:9, height:9, borderRadius:"50%", background:col }} />
                    <span style={{ fontSize:13, fontWeight:700 }}>{label}</span>
                    <span style={{ fontSize:11, fontFamily:"'Space Mono',monospace", color:t.tm, marginLeft:"auto" }}>{tasks.filter(tk=>tk.status===status).length}</span>
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", gap:8, minHeight:80 }}>
                    {tasks.filter(tk=>tk.status===status).map(tk => { const a=u(tk.assignee); const done=tk.subtasks?.filter(s=>s.done).length||0; const total=tk.subtasks?.length||0; return (
                      <div key={tk.id} draggable onDragStart={()=>setTaskDragId(tk.id)} onDragEnd={()=>setTaskDragId(null)} onClick={()=>setOpenTask(tk.id)} className="hFloat" style={{ padding:"14px 16px", borderRadius:14, background:t.card, border:`1px solid ${t.cb}`, borderLeft:`4px solid ${PC[tk.priority]}`, cursor:"pointer", animation:"fadeIn 0.2s" }}>
                        <div style={{ fontSize:14.5, fontWeight:600, marginBottom:8, color:tk.status==="done"?t.tm:t.text, textDecoration:tk.status==="done"?"line-through":"none" }}>{tk.title}</div>
                        {total>0 && <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:8 }}><div style={{ flex:1, height:4, borderRadius:2, background:t.ib }}><div style={{ height:"100%", borderRadius:2, width:`${total?done/total*100:0}%`, background:done===total?"#22C55E":t.acc, transition:"width 0.3s" }} /></div><span style={{ fontSize:10, fontFamily:"'Space Mono',monospace", color:t.tm }}>{done}/{total}</span></div>}
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                          <span style={{ fontSize:11, fontWeight:600, color:PC[tk.priority] }}>{I.flag(9,PC[tk.priority])} {tk.priority}</span>
                          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                            {status!=="done" && <button onClick={e=>{e.stopPropagation();moveTask(tk.id,status==="todo"?"progress":"done");}} style={{ fontSize:11, color:t.acc, background:t.al, border:"none", padding:"4px 12px", borderRadius:7, cursor:"pointer", fontWeight:600, fontFamily:"inherit" }}>{status==="todo"?"Start":"Done"}</button>}
                            {a && <Av user={a} size={24} />}
                          </div>
                        </div>
                      </div>
                    ); })}
                  </div>
                </div>;
              })}
            </div>
          </div>}

          {/* ════ SPRINT ════ */}
          {tab==="sprint" && <div>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
              <h2 style={{ fontSize:20, fontWeight:700 }}>Hackathon Sprint</h2>
              <div style={{ display:"flex", gap:14, fontSize:13 }}>
                <span style={{ color:t.ts }}>Progress: <strong style={{ color:t.text, fontFamily:"'Space Mono',monospace" }}>{h.sprint.tasks.length>0?Math.round(h.sprint.tasks.filter(tk=>tk.status==="done").length/h.sprint.tasks.length*100):0}%</strong></span>
                {h.sprint.tasks.some(tk=>tk.status==="blocked") && <span style={{ color:"#EF4444", fontWeight:600, display:"flex", alignItems:"center", gap:4 }}>{I.warn(13,"#EF4444")} {h.sprint.tasks.filter(tk=>tk.status==="blocked").length} blocked</span>}
              </div>
            </div>
            <div style={{ borderRadius:16, overflow:"hidden", border:`2px solid ${t.cb}` }}>
              <div style={{ display:"grid", gridTemplateColumns:"170px 1fr 1fr 1fr 1fr 1fr", background:t.card, borderBottom:`2px solid ${t.cb}` }}>
                <div style={{ padding:"14px 16px", fontSize:14, fontWeight:700, color:t.text }}>Member</div>
                {["To Do","In Progress","Blocked","Review","Done"].map(col => {
                  const ck = col==="To Do"?"todo":col==="In Progress"?"progress":col==="Blocked"?"blocked":col==="Review"?"review":"done";
                  const cnt = h.sprint.tasks.filter(tk=>tk.status===ck).length;
                  const colC = col==="Blocked"?"#EF4444":col==="Done"?"#22C55E":col==="In Progress"?"#3B82F6":col==="Review"?"#A855F7":t.ts;
                  return <div key={col} style={{ padding:"14px 14px", fontSize:14, fontWeight:700, color:colC, display:"flex", alignItems:"center", gap:6, borderLeft:`2px solid ${t.cb}` }}>{col} {cnt>=3 && <span style={{ fontSize:9, fontWeight:700, background:"#EF4444", color:"#fff", padding:"2px 7px", borderRadius:5 }}>Friction</span>}</div>;
                })}
              </div>
              {h.sprint.members.map(uid => { const m=u(uid); if(!m) return null; const mt=h.sprint.tasks.filter(tk=>tk.assignee===uid); return (
                <div key={uid} style={{ display:"grid", gridTemplateColumns:"170px 1fr 1fr 1fr 1fr 1fr", borderBottom:`2px solid ${t.cb}`, minHeight:100 }}>
                  <div style={{ padding:"16px 16px", display:"flex", alignItems:"center", gap:10, background:t.card }}>
                    <Av user={m} size={34} /><div><div style={{ fontSize:15, fontWeight:700 }}>{m.name.split(" ")[0]}</div><div style={{ fontSize:12, color:t.tm, fontFamily:"'Space Mono',monospace" }}>{mt.filter(tk=>tk.status==="done").length}/{mt.length}</div></div>
                  </div>
                  {["todo","progress","blocked","review","done"].map(status => (
                    <div key={status} style={{ padding:"10px 12px", display:"flex", flexDirection:"column", gap:8, background:status==="blocked"?"#EF444408":"transparent", borderLeft:`2px solid ${t.cb}` }}>
                      {mt.filter(tk=>tk.status===status).map(tk => {
                        const bl=tk.blockedBy?h.sprint.tasks.find(b=>b.id===tk.blockedBy):null;
                        const bu=bl?u(bl.assignee):null;
                        const isH=hoverSprint===tk.id;
                        return <div key={tk.id} onClick={()=>setOpenSprint(tk.id)} onMouseEnter={()=>setHoverSprint(tk.id)} onMouseLeave={()=>setHoverSprint(null)}
                          style={{ padding:"14px 16px", borderRadius:12, fontSize:14, fontWeight:600, background:t.card, border:`1.5px solid ${status==="blocked"?"#EF444430":isH?t.acc+"50":t.cb}`, borderLeft:`4px solid ${PC[tk.priority]}`, cursor:"pointer", transform:isH?"scale(1.04)":"none", transition:"all 0.2s cubic-bezier(0.175,0.885,0.32,1.275)", boxShadow:isH?t.shH:"none", zIndex:isH?2:0, position:"relative" }}>
                          <div style={{ lineHeight:1.4 }}>{tk.title}</div>
                          {status==="blocked"&&bl && <div style={{ fontSize:11, color:"#EF4444", display:"flex", alignItems:"center", gap:3, marginTop:6 }}>{I.warn(11,"#EF4444")} Waiting on {bu&&<Av user={bu} size={18} />} {bl.title}</div>}
                        </div>;
                      })}
                    </div>
                  ))}
                </div>
              ); })}
            </div>
            {h.sprint.tasks.some(tk=>tk.status==="blocked") && <div style={{ marginTop:16 }}>
              <div style={{ fontSize:14, fontWeight:700, color:"#EF4444", marginBottom:12, display:"flex", alignItems:"center", gap:6 }}>{I.warn(15,"#EF4444")} Friction Report</div>
              <div style={{ display:"grid", gridTemplateColumns:`repeat(${Math.min(h.sprint.tasks.filter(tk=>tk.status==="blocked").length,3)},1fr)`, gap:12 }}>
                {h.sprint.tasks.filter(tk=>tk.status==="blocked").map(tk => { const a=u(tk.assignee); const bl=h.sprint.tasks.find(b=>b.id===tk.blockedBy); const bu=bl?u(bl.assignee):null; const isExp=expFric===tk.id; const wasReqd=updateReqs.includes(tk.id); return (
                  <div key={tk.id} onClick={()=>setExpFric(isExp?null:tk.id)} className="hFloat" style={{ padding:"14px 16px", borderRadius:14, background:t.card, border:`1.5px solid ${isExp?"#EF444450":"#EF444425"}`, cursor:"pointer", transition:"all 0.25s" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:6 }}>
                      <div style={{ width:7, height:7, borderRadius:"50%", background:"#EF4444", animation:"livePulse 2s infinite" }} />
                      <span style={{ fontSize:10, fontWeight:700, color:"#EF4444", textTransform:"uppercase", letterSpacing:"0.06em" }}>Blocked</span>
                      {!isExp && <div style={{ marginLeft:"auto", fontSize:10, color:"#EF4444", background:"#EF444412", padding:"3px 10px", borderRadius:6, fontWeight:700, display:"flex", alignItems:"center", gap:3 }}>{I.chevR(10,"#EF4444")} Details</div>}
                    </div>
                    <div style={{ fontSize:14, fontWeight:700, lineHeight:1.3, marginBottom:6 }}>{tk.title}</div>
                    <div style={{ display:"flex", alignItems:"center", gap:5 }}>{a&&<Av user={a} size={20} />}<span style={{ fontSize:11, color:t.tm }}>{a?.name?.split(" ")[0]}</span></div>
                    {isExp && <div style={{ marginTop:10, paddingTop:10, borderTop:"1px solid #EF444420", animation:"fadeIn 0.15s" }}>
                      <div style={{ fontSize:12, color:t.ts, marginBottom:8 }}>{tk.desc}</div>
                      <div style={{ fontSize:10, fontWeight:700, color:t.tm, textTransform:"uppercase", marginBottom:6 }}>Blocked by</div>
                      {bl ? <div style={{ padding:"8px 12px", borderRadius:10, background:"#F9731608", border:"1px solid #F9731620", display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
                        {bu&&<Av user={bu} size={22} />}
                        <div><div style={{ fontSize:12, fontWeight:600, color:"#F97316" }}>{bl.title}</div><div style={{ fontSize:10, color:t.tm }}>{bu?.name} · <span style={{ textTransform:"capitalize" }}>{bl.status}</span></div></div>
                      </div> : <div style={{ fontSize:12, color:t.tm, marginBottom:10 }}>Unknown dependency</div>}
                      <button onClick={e=>{e.stopPropagation();if(!wasReqd){setUpdateReqs(p=>[...p,tk.id]);}}} style={{ width:"100%", padding:"8px 0", borderRadius:8, border:"none", background:wasReqd?"#22C55E15":"#3B82F6", color:wasReqd?"#22C55E":"#fff", fontSize:12, fontWeight:700, cursor:wasReqd?"default":"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", justifyContent:"center", gap:5 }}>{wasReqd ? <>{I.check(12,"#22C55E")} Update Requested</> : <>{I.send(12,"#fff")} Request Update from {bu?.name?.split(" ")[0]||"owner"}</>}</button>
                    </div>}
                  </div>
                ); })}
              </div>
            </div>}
          </div>}

          {/* ════ GOALS ════ */}
          {tab==="goals" && <div>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
              <h2 style={{ fontSize:20, fontWeight:700 }}>Session Goals</h2>
              <span style={{ fontFamily:"'Space Mono',monospace", fontSize:26, fontWeight:700, color:totalP>=100?"#22C55E":t.acc }}>{totalP}%</span>
            </div>
            <div style={{ height:16, borderRadius:10, background:t.ib, overflow:"hidden", marginBottom:24 }}><div style={{ height:"100%", borderRadius:10, width:`${totalP}%`, background:totalP>=100?"#22C55E":`linear-gradient(90deg,${t.acc},#818CF8)`, transition:"width 0.5s ease" }} /></div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
              {h.goals.map(g => { const p=calcGP(g); const gt=g.taskIds.map(tid=>tasks.find(tk=>tk.id===tid)).filter(Boolean); const isE=expGoal===g.id; return (
                <div key={g.id} onClick={()=>setExpGoal(isE?null:g.id)} className="hFloat" style={{ borderRadius:16, background:t.card, border:`1.5px solid ${isE?g.color+"50":t.cb}`, cursor:"pointer", overflow:"hidden" }}>
                  <div style={{ height:6, background:t.ib }}><div style={{ height:"100%", width:`${p}%`, background:p>=100?"#22C55E":g.color, transition:"width 0.4s" }} /></div>
                  <div style={{ padding:"18px 20px" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}><div style={{ width:12, height:12, borderRadius:"50%", background:g.color }} /><span style={{ fontSize:16, fontWeight:700 }}>{g.title}</span></div>
                      <span style={{ fontFamily:"'Space Mono',monospace", fontSize:16, fontWeight:700, color:p>=100?"#22C55E":g.color }}>{p}%</span>
                    </div>
                    {gt.map(tk => { const a=u(tk.assignee); return (
                      <div key={tk.id} style={{ display:"flex", alignItems:"center", gap:8, padding:"6px 0" }}>
                        <div style={{ width:2, height:22, background:g.color+"40", borderRadius:1, marginLeft:5 }} />
                        <div style={{ width:18, height:18, borderRadius:5, background:tk.status==="done"?"#22C55E":"transparent", border:tk.status==="done"?"none":`2px solid ${t.tm}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{tk.status==="done"&&I.check(11,"#fff")}</div>
                        <span style={{ flex:1, fontSize:13, fontWeight:500, color:tk.status==="done"?t.tm:t.text, textDecoration:tk.status==="done"?"line-through":"none" }}>{tk.title}</span>
                        {a && <Av user={a} size={20} />}
                      </div>
                    ); })}
                    {isE && <div style={{ marginTop:10, paddingTop:10, borderTop:`1px solid ${t.cb}`, animation:"fadeIn 0.15s" }}>
                      <div style={{ fontSize:11, color:t.tm, fontWeight:600 }}>Weight: {g.weight}%</div>
                      {gt.map(tk => <div key={tk.id} style={{ fontSize:12, color:t.ts, marginTop:4 }}>{u(tk.assignee)?.name} — <span style={{ color:PC[tk.priority] }}>{tk.priority}</span> — {tk.status}</div>)}
                    </div>}
                  </div>
                </div>
              ); })}
            </div>
          </div>}

          {/* ════ RESOURCES ════ */}
          {tab==="resources" && <div>
            <h2 style={{ fontSize:20, fontWeight:700, marginBottom:4 }}>Project Resources</h2>
            <p style={{ fontSize:14, color:t.ts, marginBottom:20 }}>Repos, docs, and everything the team needs.</p>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {h.resources.map(r => { const Ic=RI[r.type]||I.link; const rc=r.type==="figma"?"#A855F7":r.type==="github"?(dark?"#E8E8F0":"#1A1A2E"):r.type==="doc"?"#3B82F6":t.ts; const isE=expRes===r.id; return (
                <div key={r.id} onClick={()=>setExpRes(isE?null:r.id)} className="hFloat" style={{ padding:"18px 22px", borderRadius:16, background:t.card, border:`1.5px solid ${isE?rc+"40":t.cb}`, cursor:"pointer" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                    <div style={{ width:46, height:46, borderRadius:12, background:rc+"15", display:"flex", alignItems:"center", justifyContent:"center" }}>{Ic(22,rc)}</div>
                    <div style={{ flex:1 }}><div style={{ fontSize:15, fontWeight:700 }}>{r.title}</div><div style={{ fontSize:12, color:t.tm, textTransform:"uppercase", fontWeight:600, letterSpacing:"0.04em", marginTop:2 }}>{r.type}</div></div>
                    <div style={{ color:t.tm, transition:"transform 0.2s", transform:isE?"rotate(90deg)":"none" }}>{I.chevR(16,t.tm)}</div>
                  </div>
                  {isE && <div style={{ animation:"fadeIn 0.15s", marginTop:14, paddingTop:14, borderTop:`1px solid ${t.cb}` }}>
                    <p style={{ fontSize:13, color:t.ts, marginBottom:12, lineHeight:1.5 }}>{r.desc}</p>
                    <a href={r.url} target="_blank" rel="noopener noreferrer" onClick={e=>e.stopPropagation()} style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"9px 18px", borderRadius:10, background:rc+"15", border:`1px solid ${rc}25`, color:rc, fontSize:13, fontWeight:600, textDecoration:"none" }}>{I.ext(13,rc)} Open {r.type==="github"?"Repository":r.type==="figma"?"in Figma":"Resource"}</a>
                  </div>}
                </div>
              ); })}
            </div>
          </div>}

          {/* ════ PLAYLISTS ════ */}
          {tab==="playlists" && <div>
            <h2 style={{ fontSize:20, fontWeight:700, marginBottom:4 }}>Playlists</h2>
            <p style={{ fontSize:14, color:t.ts, marginBottom:20 }}>{PL_MSGS[Math.floor(Date.now()/60000)%PL_MSGS.length]}</p>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
              {playlists.map((pl,pi) => { const pu=u(pl.by); const isE=expPl===pl.id; const gc=PL_GLOWS[pi%PL_GLOWS.length]; const isHov=hoverPl===pl.id; return (
                <div key={pl.id} onClick={()=>setExpPl(isE?null:pl.id)} onMouseEnter={()=>setHoverPl(pl.id)} onMouseLeave={()=>setHoverPl(null)} className="hFloat" style={{ padding:"20px 22px", borderRadius:16, cursor:"pointer", background:t.card, border:`1.5px solid ${isE?gc+"40":t.cb}`, position:"relative", overflow:"hidden" }}>
                  <div style={{ position:"absolute", inset:0, background:`linear-gradient(135deg,${gc}08,transparent)`, opacity:isHov?1:0, transition:"opacity 0.4s" }} />
                  <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:isE?14:0, position:"relative" }}>
                    <div style={{ width:44, height:44, borderRadius:12, background:isHov?`linear-gradient(135deg,${gc}30,${gc}15)`:t.al, display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.3s", transform:isHov?"scale(1.15) rotate(-8deg)":"none", boxShadow:isHov?`0 0 24px ${gc}40`:"none" }}>{I.music(22,isHov?gc:t.acc)}</div>
                    <div style={{ flex:1 }}><div style={{ fontSize:15, fontWeight:700 }}>{pl.title}</div><div style={{ display:"flex", alignItems:"center", gap:5, fontSize:12, color:t.tm, marginTop:2 }}>{pu ? <><Av user={pu} size={16} /> {pu.name.split(" ")[0]}</> : pl.by} · {pl.platform}</div></div>
                  </div>
                  {isE && <div style={{ animation:"fadeIn 0.15s", paddingTop:14, borderTop:`1px solid ${t.cb}`, position:"relative" }}>
                    <a href={pl.url} target="_blank" rel="noopener noreferrer" onClick={e=>e.stopPropagation()} style={{ display:"flex", alignItems:"center", gap:6, padding:"10px 16px", borderRadius:10, background:`${gc}12`, border:`1px solid ${gc}25`, color:gc, fontSize:13, fontWeight:600, textDecoration:"none" }}>{I.ext(13,gc)} Open in {pl.platform}</a>
                  </div>}
                </div>
              ); })}
              <div onClick={()=>setShowAddPl(true)} className="hFloat" style={{ padding:"20px 22px", borderRadius:16, cursor:"pointer", border:`2px dashed ${t.cb}`, display:"flex", alignItems:"center", justifyContent:"center", gap:8, color:t.tm, minHeight:90 }}>{I.plus(18,t.tm)} <span style={{ fontSize:14, fontWeight:500 }}>Share a playlist</span></div>
            </div>
          </div>}

          {/* ════ MEETINGS ════ */}
          {tab==="meetings" && <div>
            {!activeMeeting ? <>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
              <h2 style={{ fontSize:20, fontWeight:700 }}>Meeting Room</h2>
              <button onClick={()=>setShowMeeting(true)} style={{ padding:"8px 18px", borderRadius:10, border:"none", background:t.acc, color:"#fff", cursor:"pointer", fontSize:13, fontWeight:600, fontFamily:"inherit", display:"flex", alignItems:"center", gap:5 }}>{I.plus(14,"#fff")} New Meeting</button>
            </div>
            <p style={{ fontSize:14, color:t.ts, marginBottom:20 }}>Schedule sync-ups, standups, and check-ins without leaving the hackathon.</p>
            {meetings.length===0 && <div style={{ textAlign:"center", padding:"48px 0", color:t.tm }}>
              <div style={{ marginBottom:8 }}>{I.users(32,t.tm)}</div>
              <div style={{ fontSize:15, fontWeight:600, marginBottom:4 }}>No meetings yet</div>
              <div style={{ fontSize:13 }}>Schedule your first meeting to get aligned.</div>
            </div>}
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {meetings.map(mt => {
                const mParts = mt.invited.map(id=>u(id)).filter(Boolean);
                const isNow = mt.status==="live";
                const isRsvpd = rsvps.includes(mt.id);
                return <div key={mt.id} className="hFloat" style={{ padding:"18px 22px", borderRadius:16, background:t.card, border:`1.5px solid ${isNow?"#22C55E40":t.cb}`, cursor:"pointer" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                    <div>
                      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                        {isNow && <span style={{ fontSize:10, fontWeight:700, background:"#22C55E", color:"#fff", padding:"3px 10px", borderRadius:6, textTransform:"uppercase" }}>LIVE</span>}
                        <span style={{ fontSize:16, fontWeight:700 }}>{mt.title}</span>
                      </div>
                      <div style={{ display:"flex", alignItems:"center", gap:10, fontSize:12, color:t.tm }}>
                        <span style={{ display:"flex", alignItems:"center", gap:4 }}>{I.cal(13,t.tm)} {mt.time}</span>
                        <span>{mt.duration}</span>
                      </div>
                      {mt.agenda && <div style={{ fontSize:13, color:t.ts, marginTop:8, lineHeight:1.5 }}>{mt.agenda}</div>}
                    </div>
                    <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:8 }}>
                      <div style={{ display:"flex" }}>{mParts.slice(0,4).map((uu,i)=><Av key={uu.id} user={uu} size={24} style={{ marginLeft:i>0?-6:0, border:`2px solid ${t.card}`, "--ring":t.card }} />)}</div>
                      <button onClick={e=>{e.stopPropagation();if(isNow){setActiveMeeting(mt);setMeetNotes([]);setHandRaised(false);}else if(!isRsvpd){setRsvps(p=>[...p,mt.id]);}}} style={{ padding:"6px 16px", borderRadius:8, border:"none", background:isNow?"#22C55E":isRsvpd?"#22C55E20":"#3B82F6", color:isNow?"#fff":isRsvpd?"#22C55E":"#fff", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", gap:4 }}>{isNow?"Join Now":isRsvpd?<>{I.check(11,"#22C55E")} Going</>:"RSVP"}</button>
                    </div>
                  </div>
                </div>;
              })}
            </div>
            </> : <>
            {/* ACTIVE MEETING ROOM */}
            <div style={{ animation:"fadeIn 0.2s" }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <button onClick={()=>setActiveMeeting(null)} style={{ display:"flex", alignItems:"center", gap:5, padding:"7px 14px", borderRadius:9, border:`1px solid ${t.ibr}`, background:t.ib, color:t.ts, cursor:"pointer", fontSize:12, fontFamily:"inherit" }}>{I.back(13,t.ts)} Leave</button>
                  <div style={{ width:10, height:10, borderRadius:"50%", background:"#22C55E", animation:"livePulse 2s infinite" }} />
                  <span style={{ fontSize:18, fontWeight:700 }}>{activeMeeting.title}</span>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ fontSize:12, color:t.tm }}>{activeMeeting.duration}</span>
                  <button onClick={()=>setHandRaised(!handRaised)} style={{ padding:"6px 14px", borderRadius:8, border:`1.5px solid ${handRaised?"#EAB30850":t.ibr}`, background:handRaised?"#EAB30815":"transparent", color:handRaised?"#EAB308":t.tm, fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>{handRaised?"✋ Hand Raised":"✋ Raise Hand"}</button>
                  <button onClick={()=>setActiveMeeting(null)} style={{ padding:"6px 14px", borderRadius:8, border:"none", background:"#EF4444", color:"#fff", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>End Meeting</button>
                </div>
              </div>

              {/* PARTICIPANT VIDEO GRID */}
              <div style={{ display:"grid", gridTemplateColumns:`repeat(${Math.min(activeMeeting.invited.length,3)},1fr)`, gap:12, marginBottom:20 }}>
                {activeMeeting.invited.map(id => { const mu=u(id); if(!mu) return null; const isMe=id==="u1"; return (
                  <div key={id} style={{ aspectRatio:"16/10", borderRadius:16, background:`linear-gradient(160deg,${mu.color}15,${mu.color}06)`, border:`2px solid ${isMe?mu.color+"60":t.cb}`, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:10, position:"relative", overflow:"hidden" }}>
                    <div style={{ position:"absolute", top:-30, right:-30, width:80, height:80, borderRadius:"50%", background:mu.color, opacity:0.06, filter:"blur(25px)" }} />
                    <Av user={mu} size={52} style={{ "--ring":t.rbg }} />
                    <div style={{ textAlign:"center" }}>
                      <div style={{ fontSize:14, fontWeight:700 }}>{isMe?"You":mu.name}</div>
                      <div style={{ fontSize:11, color:t.tm }}>{mu.role}</div>
                    </div>
                    {isMe && <div style={{ position:"absolute", bottom:10, left:"50%", transform:"translateX(-50%)", display:"flex", gap:8 }}>
                      <div style={{ width:32, height:32, borderRadius:"50%", background:t.card, border:`1px solid ${t.cb}`, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={t.ts} strokeWidth="2" strokeLinecap="round"><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/></svg></div>
                      <div style={{ width:32, height:32, borderRadius:"50%", background:t.card, border:`1px solid ${t.cb}`, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={t.ts} strokeWidth="2" strokeLinecap="round"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg></div>
                    </div>}
                    {mu.online && <div style={{ position:"absolute", top:10, right:10, width:8, height:8, borderRadius:"50%", background:"#22C55E", boxShadow:"0 0 6px #22C55E" }} />}
                  </div>
                );})}
              </div>

              {/* AGENDA + NOTES */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                <div style={{ padding:"20px 22px", borderRadius:16, background:t.card, border:`1px solid ${t.cb}` }}>
                  <div style={{ fontSize:13, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.06em", color:t.tm, marginBottom:12 }}>Agenda</div>
                  <div style={{ fontSize:14, color:t.ts, lineHeight:1.65 }}>{activeMeeting.agenda || "No agenda set."}</div>
                  <div style={{ marginTop:14, paddingTop:14, borderTop:`1px solid ${t.cb}` }}>
                    <div style={{ fontSize:12, color:t.tm, marginBottom:6 }}>Participants ({activeMeeting.invited.length})</div>
                    <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                      {activeMeeting.invited.map(id=>{ const mu=u(id); return mu ? <div key={id} style={{ display:"flex", alignItems:"center", gap:5, padding:"4px 10px", borderRadius:8, background:t.ib, fontSize:12 }}><Av user={mu} size={18} />{mu.name.split(" ")[0]}</div> : null; })}
                    </div>
                  </div>
                </div>
                <div style={{ padding:"20px 22px", borderRadius:16, background:t.card, border:`1px solid ${t.cb}`, display:"flex", flexDirection:"column" }}>
                  <div style={{ fontSize:13, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.06em", color:t.tm, marginBottom:12 }}>Meeting Notes</div>
                  <div style={{ flex:1, overflowY:"auto", marginBottom:10 }}>
                    {meetNotes.length===0 && <div style={{ fontSize:13, color:t.tm, fontStyle:"italic" }}>No notes yet — jot something down.</div>}
                    {meetNotes.map((n,i) => <div key={i} style={{ fontSize:13, color:t.text, padding:"6px 0", borderBottom:`1px solid ${t.cb}`, display:"flex", gap:6 }}>
                      <span style={{ color:t.tm, fontSize:11, flexShrink:0 }}>{n.time}</span>
                      <span>{n.text}</span>
                    </div>)}
                  </div>
                  <div style={{ display:"flex", gap:6 }}>
                    <input value={meetNote} onChange={e=>setMeetNote(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&meetNote.trim()){setMeetNotes(p=>[...p,{text:meetNote.trim(),time:new Date().toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit"})}]);setMeetNote("");}}} placeholder="Type a note..." style={{ flex:1, padding:"9px 12px", borderRadius:10, border:`1px solid ${t.ibr}`, background:t.ib, color:t.text, fontSize:13, fontFamily:"inherit", outline:"none" }} />
                    <button onClick={()=>{if(meetNote.trim()){setMeetNotes(p=>[...p,{text:meetNote.trim(),time:new Date().toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit"})}]);setMeetNote("");}}} style={{ padding:"0 14px", borderRadius:10, border:"none", background:meetNote.trim()?t.acc:t.ib, color:meetNote.trim()?"#fff":t.tm, cursor:"pointer", fontSize:12, fontWeight:600, fontFamily:"inherit" }}>Add</button>
                  </div>
                </div>
              </div>
            </div>
            </>}
          </div>}

          {/* ════ BREAKROOM ════ */}
          {tab==="breakroom" && <div>
            <h2 style={{ fontSize:20, fontWeight:700, marginBottom:4 }}>Breakroom</h2>
            <p style={{ fontSize:14, color:t.ts, marginBottom:24 }}>Step away, recharge, and see who else is taking a breather.</p>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
              <div onClick={()=>{const next=!onBreak;setOnBreak(next);setBreakStart(next?Date.now():null);setBreakAnim(true);setTimeout(()=>setBreakAnim(false),700);}} className={`hFloat ${breakAnim?"breakPop":""}`} style={{ padding:"28px 24px", borderRadius:18, cursor:"pointer", background:onBreak?"#F9731612":t.card, border:`2px solid ${onBreak?"#F9731640":t.cb}`, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center", minHeight:180, transition:"all 0.3s" }}>
                <div style={{ position:"relative", marginBottom:14 }}>
                  <div className={onBreak?"coffeeFloat":""}>{I.coffee(40,onBreak?"#F97316":t.tm)}</div>
                  {onBreak && <div style={{ position:"absolute", top:-8, left:"50%", marginLeft:-20, height:30, width:40, display:"flex", justifyContent:"center" }}><div className="steam s1"/><div className="steam s2"/><div className="steam s3"/></div>}
                </div>
                <div style={{ fontSize:16, fontWeight:700, marginBottom:4, color:onBreak?"#F97316":t.text }}>{onBreak?"You're on break":"Take a Break"}</div>
                <div style={{ fontSize:13, color:t.tm }}>{onBreak?"Click to get back to work":"Let your team know you're recharging"}</div>
              </div>
              <div style={{ padding:"24px", borderRadius:18, background:t.card, border:`1px solid ${t.cb}` }}>
                <div style={{ fontSize:13, fontWeight:600, color:t.tm, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:14 }}>Team Status</div>
                {parts.map(uu => {
                  const isOnBreak = uu.id==="u1" ? onBreak : (uu.id==="u4");
                  return <div key={uu.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 0", borderBottom:`1px solid ${t.cb}` }}>
                    <Av user={uu} size={28} />
                    <div style={{ flex:1 }}><div style={{ fontSize:13, fontWeight:600 }}>{uu.name}</div><div style={{ fontSize:11, color:t.tm }}>{uu.role}</div></div>
                    <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                      {isOnBreak && <BreakTimer start={uu.id==="u1"?breakStart:(Date.now()-420000)} />}
                      <span style={{ fontSize:11, fontWeight:600, padding:"4px 10px", borderRadius:6, background:isOnBreak?"#F9731612":"#22C55E12", color:isOnBreak?"#F97316":"#22C55E" }}>{isOnBreak?"On Break":"Working"}</span>
                    </div>
                  </div>;
                })}
              </div>
            </div>
            {/* VIBES SECTION */}
            <div style={{ marginTop:24 }}>
              <div style={{ fontSize:14, fontWeight:700, marginBottom:4 }}>Vibes Corner</div>
              <p style={{ fontSize:13, color:t.tm, marginBottom:14 }}>Decompress with something lighthearted.</p>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12 }}>
                {[
                  { title:"Keyboard Cat", desc:"The OG internet classic", url:"https://www.youtube.com/watch?v=J---aiyznGQ", thumb:"#EAB308" },
                  { title:"Dog Reviews Food", desc:"Very serious food critic", url:"https://www.youtube.com/watch?v=ig8CModJanM", thumb:"#3B82F6" },
                  { title:"Lofi Girl", desc:"Chill beats to relax to", url:"https://www.youtube.com/watch?v=jfKfPfyJRdk", thumb:"#EC4899" },
                  { title:"Cat vs Cucumber", desc:"Instant serotonin boost", url:"https://www.youtube.com/watch?v=cNycdfFEgBc", thumb:"#22C55E" },
                  { title:"Dramatic Chipmunk", desc:"3 seconds of pure drama", url:"https://www.youtube.com/watch?v=a1Y73sPHKxw", thumb:"#F97316" },
                  { title:"How Animals Eat", desc:"MisterEpicMann classic", url:"https://www.youtube.com/watch?v=qnydFmqHuVo", thumb:"#A855F7" },
                ].map((v,i) => (
                  <a key={i} href={v.url} target="_blank" rel="noopener noreferrer" onClick={e=>e.stopPropagation()} className="hFloat" style={{ padding:"16px 18px", borderRadius:14, background:t.card, border:`1px solid ${t.cb}`, textDecoration:"none", color:t.text, cursor:"pointer", display:"block" }}>
                    <div style={{ width:"100%", height:48, borderRadius:10, background:`linear-gradient(135deg,${v.thumb}20,${v.thumb}08)`, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:10 }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill={v.thumb} stroke="none"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                    </div>
                    <div style={{ fontSize:13, fontWeight:700, marginBottom:2 }}>{v.title}</div>
                    <div style={{ fontSize:11, color:t.tm }}>{v.desc}</div>
                  </a>
                ))}
              </div>
            </div>
          </div>}
        </div>
        <div style={{ width:290, background:t.cbg, borderLeft:`1px solid ${t.cb}`, display:"flex", flexDirection:"column" }}>
          <div style={{ padding:"12px 14px", borderBottom:`1px solid ${t.cb}`, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div style={{ display:"flex", alignItems:"center", gap:5, fontSize:14, fontWeight:600 }}>{I.chat(15,t.acc)} Chat</div>
            <span style={{ fontSize:10, color:t.tm, fontFamily:"'Space Mono',monospace" }}>{msgs.length}</span>
          </div>
          {msgs.filter(m=>m.pinned).map(m => <div key={m.id+"p"} style={{ padding:"8px 12px", background:t.al, borderBottom:`1px solid ${t.cb}`, display:"flex", alignItems:"flex-start", gap:5, fontSize:12 }}><span style={{ color:t.acc, flexShrink:0, marginTop:1 }}>{I.pin(10,t.acc)}</span><span style={{ color:t.ts }}><strong style={{ color:t.text }}>{u(m.user)?.name.split(" ")[0]}:</strong> {m.text}</span></div>)}
          <div style={{ flex:1, overflowY:"auto", padding:"8px 12px", display:"flex", flexDirection:"column", gap:8 }}>
            {msgs.map(m => { const mu=u(m.user); const me=m.user==="u1"; return (
              <div key={m.id} style={{ display:"flex", gap:7, alignItems:"flex-start", animation:"fadeIn 0.15s" }}>
                {!me && <Av user={mu} size={24} style={{ marginTop:2, "--ring":t.cbg }} />}
                <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:me?"flex-end":"flex-start" }}>
                  {!me && <span style={{ fontSize:10, fontWeight:600, color:mu?.color, marginBottom:1 }}>{mu?.name.split(" ")[0]}</span>}
                  <div style={{ fontSize:13, lineHeight:1.4, padding:"8px 12px", borderRadius:me?"12px 2px 12px 12px":"2px 12px 12px 12px", background:me?t.acc+"15":t.mbg, border:`1px solid ${me?t.acc+"20":t.cb}`, color:t.text, maxWidth:"88%" }}>{m.text}</div>
                  <span style={{ fontSize:9, color:t.tm, marginTop:1 }}>{new Date(m.time).toLocaleTimeString("en-US",{ hour:"numeric", minute:"2-digit" })}</span>
                </div>
              </div>
            ); })}
            <div ref={chatEnd} />
          </div>
          <div style={{ padding:"8px 10px", borderTop:`1px solid ${t.cb}`, display:"flex", gap:6 }}>
            <input value={newMsg} onChange={e=>setNewMsg(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendMsg()} placeholder="Message..." style={{ flex:1, padding:"9px 12px", borderRadius:10, border:`1px solid ${t.ibr}`, background:t.ib, color:t.text, fontSize:13, fontFamily:"inherit", outline:"none" }} />
            <button onClick={sendMsg} style={{ width:34, height:34, borderRadius:10, border:"none", background:newMsg.trim()?t.acc:"transparent", color:newMsg.trim()?"#fff":t.tm, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>{I.send(14)}</button>
          </div>
        </div>
      </div>

      {/* ═══ MODALS ═══ */}

      {/* ADD TASK */}
      {showAddTask && <Modal t={t} onClose={()=>setShowAddTask(false)} width={520}>
        <div style={{ padding:"28px 30px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
            <h3 style={{ fontSize:20, fontWeight:700 }}>Create Task</h3>
            <button onClick={()=>setShowAddTask(false)} style={{ width:30, height:30, borderRadius:8, border:`1px solid ${t.ibr}`, background:t.ib, color:t.tm, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>{I.close(16,t.tm)}</button>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <div><label style={{ fontSize:12, fontWeight:600, color:t.tm, display:"block", marginBottom:5 }}>Task Title</label><input value={newTaskForm.title} onChange={e=>setNewTaskForm(p=>({...p,title:e.target.value}))} placeholder="What needs to be done?" style={{ width:"100%", padding:"11px 14px", borderRadius:10, border:`1px solid ${t.ibr}`, background:t.ib, color:t.text, fontSize:14, fontFamily:"inherit", outline:"none" }} /></div>
            <div><label style={{ fontSize:12, fontWeight:600, color:t.tm, display:"block", marginBottom:5 }}>Description</label><textarea value={newTaskForm.desc} onChange={e=>setNewTaskForm(p=>({...p,desc:e.target.value}))} placeholder="Add details..." rows={3} style={{ width:"100%", padding:"11px 14px", borderRadius:10, border:`1px solid ${t.ibr}`, background:t.ib, color:t.text, fontSize:14, fontFamily:"inherit", outline:"none", resize:"vertical" }} /></div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              <div><label style={{ fontSize:12, fontWeight:600, color:t.tm, display:"block", marginBottom:5 }}>Priority</label>
                <div style={{ display:"flex", gap:6 }}>
                  {["urgent","high","medium","low"].map(p => <button key={p} onClick={()=>setNewTaskForm(prev=>({...prev,priority:p}))} style={{ flex:1, padding:"8px 0", borderRadius:8, border:`1.5px solid ${newTaskForm.priority===p?PC[p]+"50":t.ibr}`, background:newTaskForm.priority===p?PC[p]+"12":"transparent", color:newTaskForm.priority===p?PC[p]:t.tm, fontSize:11, fontWeight:600, cursor:"pointer", fontFamily:"inherit", textTransform:"capitalize" }}>{p}</button>)}
                </div>
              </div>
              <div><label style={{ fontSize:12, fontWeight:600, color:t.tm, display:"block", marginBottom:5 }}>Assignee</label>
                <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
                  {parts.map(m => <div key={m.id} onClick={()=>setNewTaskForm(prev=>({...prev,assignee:m.id}))} style={{ padding:"5px 8px", borderRadius:8, cursor:"pointer", border:`1.5px solid ${newTaskForm.assignee===m.id?t.acc+"50":t.ibr}`, background:newTaskForm.assignee===m.id?t.al:"transparent", display:"flex", alignItems:"center", gap:4 }}><Av user={m} size={18} /><span style={{ fontSize:11, fontWeight:500, color:newTaskForm.assignee===m.id?t.acc:t.tm }}>{m.name?.split(" ")[0]}</span></div>)}
                </div>
              </div>
            </div>
            <button onClick={addTask} disabled={!newTaskForm.title.trim()} style={{ marginTop:6, padding:"12px 0", borderRadius:12, border:"none", background:newTaskForm.title.trim()?t.acc:t.ib, color:newTaskForm.title.trim()?"#fff":t.tm, fontSize:14, fontWeight:600, cursor:newTaskForm.title.trim()?"pointer":"default", fontFamily:"inherit", width:"100%" }}>Create Task</button>
          </div>
        </div>
      </Modal>}

      {/* CREATE MEETING */}
      {showMeeting && <Modal t={t} onClose={()=>setShowMeeting(false)} width={520}>
        <div style={{ padding:"28px 30px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
            <h3 style={{ fontSize:20, fontWeight:700 }}>Schedule Meeting</h3>
            <button onClick={()=>setShowMeeting(false)} style={{ width:30, height:30, borderRadius:8, border:`1px solid ${t.ibr}`, background:t.ib, color:t.tm, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>{I.close(16,t.tm)}</button>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <div><label style={{ fontSize:12, fontWeight:600, color:t.tm, display:"block", marginBottom:5 }}>Meeting Title</label><input value={newMeet.title} onChange={e=>setNewMeet(p=>({...p,title:e.target.value}))} placeholder="e.g. Daily Standup" style={{ width:"100%", padding:"11px 14px", borderRadius:10, border:`1px solid ${t.ibr}`, background:t.ib, color:t.text, fontSize:14, fontFamily:"inherit", outline:"none" }} /></div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              <div><label style={{ fontSize:12, fontWeight:600, color:t.tm, display:"block", marginBottom:5 }}>Time</label><input type="datetime-local" value={newMeet.time} onChange={e=>setNewMeet(p=>({...p,time:e.target.value}))} style={{ width:"100%", padding:"11px 14px", borderRadius:10, border:`1px solid ${t.ibr}`, background:t.ib, color:t.text, fontSize:14, fontFamily:"inherit", outline:"none" }} /></div>
              <div><label style={{ fontSize:12, fontWeight:600, color:t.tm, display:"block", marginBottom:5 }}>Duration</label>
                <div style={{ display:"flex", gap:6 }}>
                  {["15 min","30 min","1 hr"].map(d => <button key={d} onClick={()=>setNewMeet(p=>({...p,duration:d}))} style={{ flex:1, padding:"8px 0", borderRadius:8, border:`1.5px solid ${newMeet.duration===d?t.acc+"50":t.ibr}`, background:newMeet.duration===d?t.al:"transparent", color:newMeet.duration===d?t.acc:t.tm, fontSize:11, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>{d}</button>)}
                </div>
              </div>
            </div>
            <div><label style={{ fontSize:12, fontWeight:600, color:t.tm, display:"block", marginBottom:5 }}>Agenda</label><textarea value={newMeet.agenda} onChange={e=>setNewMeet(p=>({...p,agenda:e.target.value}))} placeholder="What's the meeting about?" rows={2} style={{ width:"100%", padding:"11px 14px", borderRadius:10, border:`1px solid ${t.ibr}`, background:t.ib, color:t.text, fontSize:14, fontFamily:"inherit", outline:"none", resize:"vertical" }} /></div>
            <div><label style={{ fontSize:12, fontWeight:600, color:t.tm, display:"block", marginBottom:8 }}>Invite Members</label>
              <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                {parts.map(m => { const inv=newMeet.invited.includes(m.id); return (
                  <div key={m.id} onClick={()=>setNewMeet(p=>({...p,invited:inv?p.invited.filter(x=>x!==m.id):[...p.invited,m.id]}))} style={{ display:"flex", alignItems:"center", gap:7, padding:"7px 12px", borderRadius:10, cursor:"pointer", border:`1.5px solid ${inv?t.acc+"50":t.ibr}`, background:inv?t.al:"transparent" }}>
                    <Av user={m} size={22} /><span style={{ fontSize:12, fontWeight:600, color:inv?t.acc:t.ts }}>{m.name?.split(" ")[0]}</span>
                    {inv && <span style={{ color:t.acc }}>{I.check(12,t.acc)}</span>}
                  </div>
                ); })}
              </div>
            </div>
            <button onClick={()=>{if(newMeet.title.trim()){setMeetings(p=>[...p,{id:`mt${Date.now()}`,title:newMeet.title.trim(),time:newMeet.time||"TBD",duration:newMeet.duration,agenda:newMeet.agenda,invited:newMeet.invited.length?newMeet.invited:["u1"],status:"scheduled"}]);setNewMeet({title:"",time:"",duration:"30 min",agenda:"",invited:[]});setShowMeeting(false);}}} style={{ marginTop:6, padding:"12px 0", borderRadius:12, border:"none", background:newMeet.title.trim()?t.acc:t.ib, color:newMeet.title.trim()?"#fff":t.tm, fontSize:14, fontWeight:600, cursor:newMeet.title.trim()?"pointer":"default", fontFamily:"inherit", width:"100%" }}>Schedule Meeting</button>
          </div>
        </div>
      </Modal>}

      {/* IDEA DETAIL */}
      {openIdeaData && <Modal t={t} onClose={()=>{setOpenIdea(null);setIdeaCmt("");}} width={620}>
        <div style={{ padding:"28px 30px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}><Av user={u(openIdeaData.user)} size={32} /><div><div style={{ fontSize:13, fontWeight:600 }}>{u(openIdeaData.user)?.name}</div><div style={{ fontSize:11, color:t.tm }}>{openIdeaData.cat}</div></div></div>
            <div style={{ display:"flex", gap:6 }}>
              <button onClick={()=>killIdea(openIdeaData.id)} style={{ display:"flex", alignItems:"center", gap:4, padding:"6px 12px", borderRadius:8, border:`1px solid #EF444430`, background:"#EF444408", color:"#EF4444", fontSize:11, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>{I.trash(12,"#EF4444")} Graveyard</button>
              <button onClick={()=>{setOpenIdea(null);setIdeaCmt("");}} style={{ width:30, height:30, borderRadius:8, border:`1px solid ${t.ibr}`, background:t.ib, color:t.tm, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>{I.close(16,t.tm)}</button>
            </div>
          </div>
          <div style={{ fontSize:18, fontWeight:600, lineHeight:1.5, marginBottom:14, padding:"16px 18px", borderRadius:12, background:openIdeaData.color+(dark?"12":"08"), border:`1px solid ${openIdeaData.color}20` }}>{openIdeaData.content}</div>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16, flexWrap:"wrap" }}>
            <button onClick={()=>voteIdea(openIdeaData.id)} style={{ display:"flex", alignItems:"center", gap:5, padding:"7px 16px", borderRadius:9, border:"none", cursor:"pointer", background:t.al, color:t.acc, fontSize:14, fontWeight:700, fontFamily:"'Space Mono',monospace" }}>{I.thumbUp(15,t.acc)} {openIdeaData.votes}</button>
            {IDEA_CATS.map(cat => <button key={cat} onClick={()=>moveIdeaCat(openIdeaData.id,cat)} style={{ padding:"6px 12px", borderRadius:8, border:`1px solid ${openIdeaData.cat===cat?t.acc+"40":t.ibr}`, background:openIdeaData.cat===cat?t.al:"transparent", color:openIdeaData.cat===cat?t.acc:t.tm, fontSize:11, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>{cat}</button>)}
          </div>
          {openIdeaData.notes && <div style={{ padding:"12px 16px", borderRadius:10, background:t.ib, border:`1px solid ${t.ibr}`, fontSize:13, color:t.ts, lineHeight:1.5, marginBottom:14 }}>{openIdeaData.notes}</div>}
          {openIdeaData.links.length>0 && <div style={{ marginBottom:14 }}>
            <div style={{ fontSize:11, fontWeight:600, color:t.tm, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:8 }}>Linked Resources</div>
            {openIdeaData.links.map((l,li) => <a key={li} href={l.url} target="_blank" rel="noopener noreferrer" style={{ display:"flex", alignItems:"center", gap:5, fontSize:13, color:t.acc, marginBottom:4, textDecoration:"none" }}>{I.link(13,t.acc)} {l.title}</a>)}
          </div>}
          <div style={{ fontSize:11, fontWeight:600, color:t.tm, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:10 }}>Discussion ({openIdeaData.comments.length})</div>
          <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:12 }}>
            {openIdeaData.comments.map((c,ci) => <div key={ci} style={{ display:"flex", gap:8, alignItems:"flex-start" }}><Av user={u(c.user)} size={24} /><div><span style={{ fontSize:12, fontWeight:600 }}>{u(c.user)?.name.split(" ")[0]}</span><div style={{ fontSize:13, color:t.ts, marginTop:2 }}>{c.text}</div></div></div>)}
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <input value={ideaCmt} onChange={e=>setIdeaCmt(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addIdeaCmt(openIdeaData.id)} placeholder="Add a comment..." style={{ flex:1, padding:"10px 14px", borderRadius:10, border:`1px solid ${t.ibr}`, background:t.ib, color:t.text, fontSize:13, fontFamily:"inherit", outline:"none" }} />
            <button onClick={()=>addIdeaCmt(openIdeaData.id)} style={{ padding:"0 18px", borderRadius:10, border:"none", background:ideaCmt.trim()?t.acc:t.ib, color:ideaCmt.trim()?"#fff":t.tm, cursor:"pointer", fontSize:12, fontWeight:600, fontFamily:"inherit" }}>Post</button>
          </div>
        </div>
      </Modal>}

      {/* TASK DETAIL */}
      {openTaskData && <Modal t={t} onClose={()=>setOpenTask(null)} width={560}>
        <div style={{ padding:"28px 30px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}><span style={{ fontSize:12, fontWeight:700, color:PC[openTaskData.priority], background:PC[openTaskData.priority]+"15", padding:"4px 10px", borderRadius:7 }}>{I.flag(10,PC[openTaskData.priority])} {openTaskData.priority}</span><span style={{ fontSize:12, color:t.tm, background:t.ib, padding:"4px 10px", borderRadius:7 }}>{openTaskData.status}</span></div>
            <button onClick={()=>setOpenTask(null)} style={{ width:30, height:30, borderRadius:8, border:`1px solid ${t.ibr}`, background:t.ib, color:t.tm, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>{I.close(16,t.tm)}</button>
          </div>
          <h3 style={{ fontSize:20, fontWeight:700, marginBottom:8 }}>{openTaskData.title}</h3>
          {openTaskData.desc && <p style={{ fontSize:14, color:t.ts, lineHeight:1.55, marginBottom:16 }}>{openTaskData.desc}</p>}
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}><span style={{ fontSize:12, color:t.tm }}>Assigned to</span><Av user={u(openTaskData.assignee)} size={26} /><span style={{ fontSize:13, fontWeight:600 }}>{u(openTaskData.assignee)?.name}</span></div>
          {openTaskData.subtasks?.length>0 && <div>
            <div style={{ fontSize:11, fontWeight:600, color:t.tm, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:10 }}>Subtasks ({openTaskData.subtasks.filter(s=>s.done).length}/{openTaskData.subtasks.length})</div>
            <div style={{ height:6, borderRadius:4, background:t.ib, overflow:"hidden", marginBottom:12 }}><div style={{ height:"100%", borderRadius:4, width:`${openTaskData.subtasks.length?openTaskData.subtasks.filter(s=>s.done).length/openTaskData.subtasks.length*100:0}%`, background:t.acc }} /></div>
            {openTaskData.subtasks.map((s,si) => <div key={si} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 0", borderBottom:`1px solid ${t.cb}` }}><div style={{ width:20, height:20, borderRadius:6, background:s.done?"#22C55E":"transparent", border:s.done?"none":`2px solid ${t.tm}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{s.done&&I.check(12,"#fff")}</div><span style={{ fontSize:14, color:s.done?t.tm:t.text, textDecoration:s.done?"line-through":"none" }}>{s.text}</span></div>)}
          </div>}
          {openTaskData.status!=="done" && <div style={{ marginTop:16, display:"flex", gap:8 }}>
            <button onClick={()=>{moveTask(openTaskData.id,openTaskData.status==="todo"?"progress":"done");setOpenTask(null);}} style={{ padding:"10px 22px", borderRadius:10, border:"none", background:t.acc, color:"#fff", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>{openTaskData.status==="todo"?"Start Task":"Mark Done"}</button>
          </div>}
        </div>
      </Modal>}

      {/* SPRINT DETAIL */}
      {openSprintData && <Modal t={t} onClose={()=>setOpenSprint(null)} width={480}>
        <div style={{ padding:"24px 28px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
            <span style={{ fontSize:12, fontWeight:700, color:PC[openSprintData.priority], background:PC[openSprintData.priority]+"15", padding:"4px 10px", borderRadius:7 }}>{openSprintData.priority}</span>
            <button onClick={()=>setOpenSprint(null)} style={{ width:28, height:28, borderRadius:7, border:`1px solid ${t.ibr}`, background:t.ib, color:t.tm, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>{I.close(14,t.tm)}</button>
          </div>
          <h3 style={{ fontSize:18, fontWeight:700, marginBottom:8 }}>{openSprintData.title}</h3>
          <p style={{ fontSize:14, color:t.ts, lineHeight:1.5, marginBottom:14 }}>{openSprintData.desc}</p>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}><Av user={u(openSprintData.assignee)} size={28} /><span style={{ fontSize:14, fontWeight:600 }}>{u(openSprintData.assignee)?.name}</span><span style={{ fontSize:12, color:t.tm, marginLeft:"auto", background:t.ib, padding:"4px 10px", borderRadius:7 }}>{openSprintData.status}</span></div>
          {openSprintData.blockedBy && (()=>{ const bl=h.sprint.tasks.find(b=>b.id===openSprintData.blockedBy); return bl?<div style={{ padding:"12px 16px", borderRadius:10, background:"#EF444408", border:`1px solid #EF444420`, display:"flex", alignItems:"center", gap:8, fontSize:13 }}>{I.warn(14,"#EF4444")} <span style={{ color:"#EF4444", fontWeight:600 }}>Blocked by:</span> <Av user={u(bl.assignee)} size={20} /> <span style={{ fontWeight:600 }}>{bl.title}</span></div>:null; })()}
        </div>
      </Modal>}

      {/* SHARE PLAYLIST */}
      {showAddPl && <Modal t={t} onClose={()=>setShowAddPl(false)} width={480}>
        <div style={{ padding:"28px 30px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
            <h3 style={{ fontSize:20, fontWeight:700 }}>Share a Playlist</h3>
            <button onClick={()=>setShowAddPl(false)} style={{ width:30, height:30, borderRadius:8, border:`1px solid ${t.ibr}`, background:t.ib, color:t.tm, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>{I.close(16,t.tm)}</button>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <div><label style={{ fontSize:12, fontWeight:600, color:t.tm, display:"block", marginBottom:5 }}>Playlist Name</label><input value={newPl.title} onChange={e=>setNewPl(p=>({...p,title:e.target.value}))} placeholder="e.g. Deep Focus Beats" style={{ width:"100%", padding:"11px 14px", borderRadius:10, border:`1px solid ${t.ibr}`, background:t.ib, color:t.text, fontSize:14, fontFamily:"inherit", outline:"none" }} /></div>
            <div><label style={{ fontSize:12, fontWeight:600, color:t.tm, display:"block", marginBottom:5 }}>Curated By</label><input value={newPl.by} onChange={e=>setNewPl(p=>({...p,by:e.target.value}))} placeholder="Artist or curator name" style={{ width:"100%", padding:"11px 14px", borderRadius:10, border:`1px solid ${t.ibr}`, background:t.ib, color:t.text, fontSize:14, fontFamily:"inherit", outline:"none" }} /></div>
            <div><label style={{ fontSize:12, fontWeight:600, color:t.tm, display:"block", marginBottom:5 }}>Link</label><input value={newPl.url} onChange={e=>setNewPl(p=>({...p,url:e.target.value}))} placeholder="https://open.spotify.com/..." style={{ width:"100%", padding:"11px 14px", borderRadius:10, border:`1px solid ${t.ibr}`, background:t.ib, color:t.text, fontSize:14, fontFamily:"inherit", outline:"none" }} /></div>
            <div><label style={{ fontSize:12, fontWeight:600, color:t.tm, display:"block", marginBottom:5 }}>Platform</label>
              <div style={{ display:"flex", gap:8 }}>
                {["Spotify","YouTube","Apple Music","SoundCloud"].map(p => <button key={p} onClick={()=>setNewPl(f=>({...f,platform:p}))} style={{ flex:1, padding:"8px 0", borderRadius:8, border:`1.5px solid ${newPl.platform===p?t.acc+"50":t.ibr}`, background:newPl.platform===p?t.al:"transparent", color:newPl.platform===p?t.acc:t.tm, fontSize:11, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>{p}</button>)}
              </div>
            </div>
            <button onClick={()=>{if(newPl.title.trim()&&newPl.url.trim()){setPlaylists(p=>[...p,{id:`pl${Date.now()}`,title:newPl.title.trim(),by:newPl.by.trim()||"You",url:newPl.url.trim(),platform:newPl.platform}]);setNewPl({title:"",by:"",url:"",platform:"Spotify"});setShowAddPl(false);}}} style={{ marginTop:6, padding:"12px 0", borderRadius:12, border:"none", background:newPl.title.trim()&&newPl.url.trim()?t.acc:t.ib, color:newPl.title.trim()&&newPl.url.trim()?"#fff":t.tm, fontSize:14, fontWeight:600, cursor:newPl.title.trim()&&newPl.url.trim()?"pointer":"default", fontFamily:"inherit", width:"100%" }}>Share Playlist</button>
          </div>
        </div>
      </Modal>}

      {/* EXIT */}
      {showExit && <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:999, backdropFilter:"blur(4px)" }}>
        <div style={{ background:t.mod, borderRadius:18, padding:"30px 34px", width:400, textAlign:"center", boxShadow:"0 24px 60px rgba(0,0,0,0.25)", border:`1px solid ${t.cb}`, animation:"modalIn 0.2s" }}>
          <div style={{ fontSize:18, fontWeight:700, marginBottom:8 }}>Leave the room?</div>
          <p style={{ fontSize:14, color:t.ts, marginBottom:22 }}>The hackathon is still live. You can rejoin anytime.</p>
          <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
            <button onClick={onNo} style={{ padding:"10px 22px", borderRadius:10, border:`1px solid ${t.ibr}`, background:"transparent", color:t.ts, fontSize:14, fontWeight:500, cursor:"pointer", fontFamily:"inherit" }}>Stay</button>
            <button onClick={onYes} style={{ padding:"10px 22px", borderRadius:10, border:"none", background:"#EF4444", color:"#fff", fontSize:14, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>Leave</button>
          </div>
        </div>
      </div>}

      <Styles t={t} />
    </div>
  );
}

function Styles({ t }) {
  return <style>{`
    *{box-sizing:border-box;margin:0;padding:0}
    @keyframes livePulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(1.5)}}
    @keyframes fadeIn{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}}
    @keyframes roomEnter{from{opacity:0;transform:scale(1.03)}to{opacity:1;transform:scale(1)}}
    @keyframes modalIn{from{opacity:0;transform:scale(.96) translateY(8px)}to{opacity:1;transform:scale(1) translateY(0)}}
    @keyframes coffeeFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
    @keyframes steamRise{0%{opacity:0;transform:translateY(0) scaleX(1)}50%{opacity:.5}100%{opacity:0;transform:translateY(-30px) scaleX(1.5)}}
    @keyframes confettiFall{0%{opacity:1;transform:translateY(0) rotate(0deg)}100%{opacity:0;transform:translateY(120px) rotate(720deg)}}
    @keyframes cheerPop{0%{opacity:0;transform:scale(.3)}60%{opacity:1;transform:scale(1.15)}100%{transform:scale(1)}}
    @keyframes celebFade{0%,60%{opacity:1}100%{opacity:0}}
    @keyframes graveShake{0%,100%{transform:rotate(0)}20%{transform:rotate(-12deg)}40%{transform:rotate(12deg)}60%{transform:rotate(-8deg)}80%{transform:rotate(8deg)}}
    @keyframes plPulse{0%,100%{box-shadow:0 0 0 0 ${t.acc}20}50%{box-shadow:0 0 16px 4px ${t.acc}15}}
    .hFloat{transition:all .25s cubic-bezier(.175,.885,.32,1.275)!important}
    .hFloat:hover{transform:translateY(-3px) scale(1.015)!important;box-shadow:${t.shH}!important}
    .ideaCard:hover{transform:translateY(-4px) scale(1.03)!important;z-index:2;box-shadow:${t.shH}!important}
    .coffeeFloat{animation:coffeeFloat 2s ease-in-out infinite}
    .steam{width:6px;height:18px;background:#F97316;border-radius:50%;opacity:0;position:absolute;animation:steamRise 2s ease-out infinite}
    .s1{left:calc(50% - 14px);animation-delay:0s}.s2{left:50%;animation-delay:.5s}.s3{left:calc(50% + 14px);animation-delay:1s}
    .graveShake{animation:graveShake .5s ease}
    .playlistCard:hover .plBg{opacity:1!important}
    .playlistCard:hover .plIcon{transform:scale(1.15) rotate(-8deg);box-shadow:0 0 24px #EC489940;background:linear-gradient(135deg,#5B4AE430,#EC489930)}
    .playlistCard:hover .plIcon svg{stroke:#EC4899}
    @keyframes breakPop{0%{transform:scale(1)}20%{transform:scale(1.15) rotate(-3deg)}40%{transform:scale(0.95) rotate(2deg)}60%{transform:scale(1.08)}80%{transform:scale(0.98)}100%{transform:scale(1)}}
    .breakPop{animation:breakPop 0.6s cubic-bezier(.175,.885,.32,1.275)}
    ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:${t.scr};border-radius:3px}
    input::placeholder,textarea::placeholder{color:${t.tm}}
  `}</style>;
}
