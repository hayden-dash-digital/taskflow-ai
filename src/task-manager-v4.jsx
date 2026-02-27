import { useState, useRef, useEffect, useCallback } from "react";
import { HackathonListView } from "./hackathon";
import { mapTheme } from "./hackathon/themeMap";
import EnergyDashboard from "./hackathon/components/pulse/EnergyDashboard";

/* ══════════════ DATA ══════════════ */
const TEAM_MEMBERS = [
  { id: "u1", name: "You", initials: "YO", color: "#5B4AE4", role: "Lead", online: true },
  { id: "u2", name: "Sarah Chen", initials: "SC", color: "#EC4899", role: "Designer", online: true },
  { id: "u3", name: "Marcus Johnson", initials: "MJ", color: "#F97316", role: "Developer", online: false },
  { id: "u4", name: "Aisha Patel", initials: "AP", color: "#22C55E", role: "Marketing", online: true },
  { id: "u5", name: "David Kim", initials: "DK", color: "#3B82F6", role: "Developer", online: false },
  { id: "u6", name: "Lisa Müller", initials: "LM", color: "#A855F7", role: "PM", online: true },
];

const DEPARTMENTS = [
  { id: "all", name: "All Teams", icon: "users" },
  { id: "design", name: "Design", icon: "palette" },
  { id: "dev", name: "Engineering", icon: "code" },
  { id: "marketing", name: "Marketing", icon: "megaphone" },
];

const INITIAL_COLUMNS = [
  { id: "backlog", title: "Backlog", icon: "inbox" },
  { id: "todo", title: "To Do", icon: "circle" },
  { id: "progress", title: "In Progress", icon: "loader" },
  { id: "review", title: "Review", icon: "eye" },
  { id: "done", title: "Done", icon: "checkCircle" },
];

const COLORS = [
  { name: "Red", value: "#EF4444", bg: "#FEE2E2" },
  { name: "Orange", value: "#F97316", bg: "#FFEDD5" },
  { name: "Yellow", value: "#EAB308", bg: "#FEF9C3" },
  { name: "Green", value: "#22C55E", bg: "#DCFCE7" },
  { name: "Blue", value: "#3B82F6", bg: "#DBEAFE" },
  { name: "Purple", value: "#A855F7", bg: "#F3E8FF" },
  { name: "Pink", value: "#EC4899", bg: "#FCE7F3" },
  { name: "Teal", value: "#14B8A6", bg: "#CCFBF1" },
];

const PRIORITY_CONFIG = {
  urgent: { label: "Urgent", color: "#EF4444", bg: "#FEE2E2", bgDark: "#3B1515" },
  high: { label: "High", color: "#F97316", bg: "#FFF7ED", bgDark: "#3B2010" },
  medium: { label: "Medium", color: "#EAB308", bg: "#FEFCE8", bgDark: "#352A08" },
  low: { label: "Low", color: "#22C55E", bg: "#F0FDF4", bgDark: "#0F2918" },
};

const SAMPLE_CARDS = [
  { id: "c1", title: "Define product requirements", description: "Write up the core features and user stories for the MVP launch", column: "done", color: COLORS[4], priority: "high", dueDate: "2026-02-20", createdAt: Date.now() - 500000000, assignees: ["u1", "u6"], subtasks: [{ id: "s1", text: "User stories", done: true }, { id: "s2", text: "Feature matrix", done: true }], messages: [{ user: "u6", text: "Requirements doc is finalized and approved.", time: Date.now() - 400000000 }] },
  { id: "c2", title: "Design system & component library", description: "Create reusable UI components, color tokens, and typography scale", column: "done", color: COLORS[5], priority: "high", dueDate: "2026-02-22", createdAt: Date.now() - 400000000, assignees: ["u2"], subtasks: [{ id: "s3", text: "Color tokens", done: true }, { id: "s4", text: "Typography scale", done: true }, { id: "s5", text: "Button components", done: true }], messages: [] },
  { id: "c3", title: "Set up project repo & CI/CD", description: "Initialize React project, configure Vite, set up GitHub Actions pipeline", column: "progress", color: COLORS[7], priority: "medium", dueDate: "2026-02-28", createdAt: Date.now() - 300000000, assignees: ["u3", "u5"], subtasks: [{ id: "s6", text: "Init repo", done: true }, { id: "s7", text: "Vite config", done: true }, { id: "s8", text: "GitHub Actions", done: false }], messages: [{ user: "u3", text: "Repo is live. Working on CI pipeline now.", time: Date.now() - 100000000 }, { user: "u5", text: "I'll handle deployment config once CI is ready.", time: Date.now() - 50000000 }] },
  { id: "c4", title: "Build board view with drag & drop", description: "Core Kanban board with columns, card movement, and smooth animations", column: "progress", color: COLORS[4], priority: "urgent", dueDate: "2026-02-26", createdAt: Date.now() - 200000000, assignees: ["u1", "u3"], subtasks: [{ id: "s9", text: "Column layout", done: true }, { id: "s10", text: "Card components", done: true }, { id: "s11", text: "Drag & drop logic", done: false }, { id: "s12", text: "Animations", done: false }], messages: [{ user: "u1", text: "Columns and cards are rendering. Starting on DnD.", time: Date.now() - 30000000 }] },
  { id: "c5", title: "Implement user authentication", description: "Clerk or Supabase Auth integration with client login flows", column: "todo", color: COLORS[0], priority: "high", dueDate: "2026-03-05", createdAt: Date.now() - 100000000, assignees: ["u5"], subtasks: [{ id: "s13", text: "Auth provider research", done: true }, { id: "s14", text: "Login/signup flow", done: false }, { id: "s15", text: "Session management", done: false }], messages: [] },
  { id: "c6", title: "Card detail modal with editing", description: "Click a card to open full detail view with title, description, labels, dates", column: "todo", color: COLORS[3], priority: "medium", dueDate: "2026-03-08", createdAt: Date.now() - 80000000, assignees: ["u1", "u2"], subtasks: [], messages: [] },
  { id: "c7", title: "Goals feature — progress tracking", description: "Create goals, attach tasks, visual progress bar that fills as tasks complete", column: "backlog", color: COLORS[2], priority: "medium", dueDate: "2026-03-15", createdAt: Date.now() - 60000000, assignees: ["u1"], subtasks: [], messages: [] },
  { id: "c8", title: "Sprint collaboration view", description: "Two-lane sprint board showing your tasks vs teammate tasks with dependency mapping", column: "backlog", color: COLORS[6], priority: "low", dueDate: "2026-03-20", createdAt: Date.now() - 40000000, assignees: [], subtasks: [], messages: [] },
  { id: "c9", title: "AI assistant — ambient nudges", description: "Smart suggestions for task prioritization, deferred task warnings, velocity insights", column: "backlog", color: COLORS[5], priority: "low", dueDate: "2026-04-01", createdAt: Date.now() - 20000000, assignees: [], subtasks: [], messages: [] },
  { id: "c10", title: "Landing page copy review", description: "Review and finalize all copy for the marketing launch page", column: "review", color: COLORS[1], priority: "high", dueDate: "2026-03-02", createdAt: Date.now() - 5000000, assignees: ["u4", "u2"], subtasks: [{ id: "s16", text: "Hero section", done: true }, { id: "s17", text: "Features section", done: false }], messages: [{ user: "u4", text: "First draft is ready for design review.", time: Date.now() - 3000000 }, { user: "u2", text: "Looking at it now — will have feedback by EOD.", time: Date.now() - 1000000 }] },
];

/* ═══ SPRINT DATA ═══ */
const SPRINT_STATUSES = ["todo", "progress", "blocked", "review", "done"];
const SPRINT_STATUS_META = {
  todo: { label: "To Do", color: "#6B6B80", icon: "circle" },
  progress: { label: "In Progress", color: "#3B82F6", icon: "loader" },
  blocked: { label: "Blocked", color: "#EF4444", icon: "blocked" },
  review: { label: "In Review", color: "#A855F7", icon: "eye" },
  done: { label: "Done", color: "#22C55E", icon: "checkCircle" },
};

const SAMPLE_SPRINTS = [
  {
    id: "sp1", name: "Sprint 1 — MVP Core", goal: "Ship the board view, auth, and card editing",
    startDate: "2026-02-17", endDate: "2026-03-03", members: ["u1", "u2", "u3", "u5"],
    tasks: [
      { id: "st1", title: "Set up React project + Vite config", assignee: "u3", status: "done", priority: "high", blockedBy: null, daysInStatus: 0, stalled: false },
      { id: "st2", title: "Design token system & color palette", assignee: "u2", status: "done", priority: "high", blockedBy: null, daysInStatus: 0, stalled: false },
      { id: "st3", title: "Build column layout component", assignee: "u1", status: "done", priority: "urgent", blockedBy: null, daysInStatus: 0, stalled: false },
      { id: "st4", title: "Implement drag & drop engine", assignee: "u3", status: "progress", priority: "urgent", blockedBy: null, daysInStatus: 3, stalled: true },
      { id: "st5", title: "Card component with all states", assignee: "u2", status: "done", priority: "high", blockedBy: null, daysInStatus: 0, stalled: false },
      { id: "st6", title: "CI/CD pipeline — GitHub Actions", assignee: "u5", status: "blocked", priority: "high", blockedBy: "st4", daysInStatus: 2, stalled: true },
      { id: "st7", title: "Auth provider integration (Clerk)", assignee: "u5", status: "blocked", priority: "high", blockedBy: "st6", daysInStatus: 2, stalled: true },
      { id: "st8", title: "Card detail modal — edit mode", assignee: "u1", status: "progress", priority: "medium", blockedBy: null, daysInStatus: 1, stalled: false },
      { id: "st9", title: "Responsive sidebar navigation", assignee: "u2", status: "review", priority: "medium", blockedBy: null, daysInStatus: 1, stalled: false },
      { id: "st10", title: "Priority filter & search", assignee: "u1", status: "todo", priority: "medium", blockedBy: "st8", daysInStatus: 0, stalled: false },
      { id: "st11", title: "Deploy to Vercel staging", assignee: "u5", status: "todo", priority: "low", blockedBy: "st7", daysInStatus: 0, stalled: false },
      { id: "st12", title: "Dark mode theming", assignee: "u2", status: "progress", priority: "medium", blockedBy: null, daysInStatus: 1, stalled: false },
    ],
  },
];

/* ══════════════ SVG ICONS ══════════════ */
const I = {
  inbox: (s=16,c="currentColor") => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z"/></svg>,
  circle: (s=16,c="currentColor") => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5"><circle cx="12" cy="12" r="9"/></svg>,
  loader: (s=16,c="currentColor") => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>,
  eye: (s=16,c="currentColor") => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  checkCircle: (s=16,c="currentColor") => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  sun: (s=18,c="currentColor") => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
  moon: (s=18,c="currentColor") => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>,
  plus: (s=16,c="currentColor") => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  close: (s=18,c="currentColor") => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  calendar: (s=14,c="currentColor") => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  board: (s=18,c="currentColor") => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></svg>,
  goal: (s=18,c="currentColor") => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  sprint: (s=18,c="currentColor") => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  ai: (s=18,c="currentColor") => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>,
  search: (s=16,c="currentColor") => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  grip: (s=10) => <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" opacity="0.25"><circle cx="8" cy="4" r="2"/><circle cx="16" cy="4" r="2"/><circle cx="8" cy="12" r="2"/><circle cx="16" cy="12" r="2"/><circle cx="8" cy="20" r="2"/><circle cx="16" cy="20" r="2"/></svg>,
  check: (s=14,c="currentColor") => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>,
  trash: (s=14,c="currentColor") => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>,
  users: (s=16,c="currentColor") => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
  palette: (s=16,c="currentColor") => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r="2"/><circle cx="17.5" cy="10.5" r="2"/><circle cx="8.5" cy="7.5" r="2"/><circle cx="6.5" cy="12.5" r="2"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.93 0 1.5-.67 1.5-1.5 0-.38-.15-.74-.39-1.02-.24-.28-.38-.63-.38-1.02 0-.83.67-1.5 1.5-1.5H16c3.31 0 6-2.69 6-6 0-5.5-4.5-9.96-10-9.96z"/></svg>,
  code: (s=16,c="currentColor") => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
  megaphone: (s=16,c="currentColor") => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11l18-5v12L3 13v-2z"/><path d="M11.6 16.8a3 3 0 11-5.8-1.6"/></svg>,
  send: (s=14,c="currentColor") => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  subtask: (s=14,c="currentColor") => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3v12"/><circle cx="18" cy="6" r="3"/><circle cx="18" cy="18" r="3"/><path d="M6 15a6 6 0 006 6h3"/><path d="M6 9a6 6 0 016-6h3"/></svg>,
  message: (s=14,c="currentColor") => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
  flag: (s=12,c="currentColor") => <svg width={s} height={s} viewBox="0 0 24 24" fill={c} stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>,
  chevDown: (s=14,c="currentColor") => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>,
  filter: (s=16,c="currentColor") => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
  blocked: (s=16,c="currentColor") => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>,
  arrowRight: (s=14,c="currentColor") => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  alert: (s=14,c="currentColor") => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  clock: (s=14,c="currentColor") => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  link: (s=12,c="currentColor") => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>,
  party: (s=18,c="currentColor") => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5.8 11.3L2 22l10.7-3.8M4.2 4.2l7.2 7.2"/><path d="M15 4l-3.5 3.5M18 7l-3 3"/><circle cx="19" cy="5" r="2" fill={c}/><circle cx="15" cy="3" r="1" fill={c}/></svg>,
  pulse: (s=18,c="currentColor") => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
};

/* ══════════════ THEMES ══════════════ */
const themes = {
  light: {
    bg: "#F5F5F7", sidebar: "#FFFFFF", sidebarBorder: "#E8E8ED",
    sidebarText: "#6B6B80", sidebarActive: "#F0EEFF", sidebarActiveText: "#5B4AE4",
    card: "#FFFFFF", cardHover: "#FAFAFF", cardBorder: "#E8E8ED",
    columnBg: "#EDEDF0", columnBorder: "#E0E0E5",
    text: "#1A1A2E", textSecondary: "#6B6B80", textMuted: "#9CA3AF",
    accent: "#5B4AE4", accentLight: "#E8E5FF", accentGlow: "rgba(91,74,228,0.15)",
    modalOverlay: "rgba(0,0,0,0.35)", modalBg: "#FFFFFF",
    inputBg: "#F5F5F7", inputBorder: "#E0E0E5",
    shadow: "0 1px 3px rgba(0,0,0,0.06)", shadowHover: "0 8px 25px rgba(0,0,0,0.08)",
    shadowCard: "0 1px 3px rgba(0,0,0,0.04)",
    scrollbar: "#D1D1D6", badge: "#F0EEFF", badgeText: "#5B4AE4", online: "#22C55E",
    messageBg: "#F5F5F7", laneBg: "#FAFAFF", laneAlt: "#F5F5F7",
  },
  dark: {
    bg: "#0F0F14", sidebar: "#16161E", sidebarBorder: "#2A2A35",
    sidebarText: "#8888A0", sidebarActive: "#1E1D30", sidebarActiveText: "#9B8AFB",
    card: "#1A1A24", cardHover: "#1E1E2A", cardBorder: "#2A2A35",
    columnBg: "#141419", columnBorder: "#2A2A35",
    text: "#E8E8F0", textSecondary: "#8888A0", textMuted: "#555566",
    accent: "#9B8AFB", accentLight: "#1E1D30", accentGlow: "rgba(155,138,251,0.15)",
    modalOverlay: "rgba(0,0,0,0.6)", modalBg: "#1A1A24",
    inputBg: "#141419", inputBorder: "#2A2A35",
    shadow: "0 1px 3px rgba(0,0,0,0.3)", shadowHover: "0 8px 25px rgba(0,0,0,0.4)",
    shadowCard: "0 1px 3px rgba(0,0,0,0.2)",
    scrollbar: "#2A2A35", badge: "#1E1D30", badgeText: "#9B8AFB", online: "#22C55E",
    messageBg: "#141419", laneBg: "#16161E", laneAlt: "#141419",
  },
};

/* ══════════════ CONFETTI ══════════════ */
function Confetti({ show, onDone }) {
  const [particles, setParticles] = useState([]);
  useEffect(() => {
    if (!show) return;
    const colors = ["#EF4444","#F97316","#EAB308","#22C55E","#3B82F6","#A855F7","#EC4899","#5B4AE4"];
    const p = Array.from({ length: 40 }, (_, i) => ({
      id: i, x: 50 + (Math.random() - 0.5) * 30, y: 40,
      color: colors[i % colors.length], size: 6 + Math.random() * 6,
      shape: Math.random() > 0.5 ? "rect" : "circle",
    }));
    setParticles(p);
    const timer = setTimeout(() => { setParticles([]); onDone?.(); }, 2000);
    return () => clearTimeout(timer);
  }, [show]);
  if (!particles.length) return null;
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9999 }}>
      {particles.map(p => (
        <div key={p.id} style={{
          position: "absolute", left: `${p.x}%`, top: `${p.y}%`,
          width: p.size, height: p.shape === "rect" ? p.size * 0.6 : p.size,
          borderRadius: p.shape === "circle" ? "50%" : 2,
          background: p.color,
          animation: `confettiFall 1.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`,
          animationDelay: `${Math.random() * 0.3}s`,
          "--dx": `${(Math.random() - 0.5) * 320}px`, "--dy": `${-(Math.random() * 60 + 120)}px`,
        }} />
      ))}
    </div>
  );
}

/* ══════════════ AVATAR ══════════════ */
function Avatar({ user, size = 26, showOnline = false, style = {} }) {
  if (!user) return null;
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: user.color, display: "flex", alignItems: "center", justifyContent: "center",
      color: "#fff", fontSize: size * 0.38, fontWeight: 700, letterSpacing: "-0.02em",
      fontFamily: "'Space Mono', monospace", position: "relative", flexShrink: 0, ...style,
    }}>
      {user.initials}
      {showOnline && <div style={{ position: "absolute", bottom: -1, right: -1, width: 8, height: 8, borderRadius: "50%", background: user.online ? "#22C55E" : "#9CA3AF", border: "2px solid var(--avatar-ring, #fff)" }} />}
    </div>
  );
}

function AvatarStack({ userIds, size = 24, max = 3 }) {
  const users = userIds.map(id => TEAM_MEMBERS.find(m => m.id === id)).filter(Boolean);
  const shown = users.slice(0, max); const extra = users.length - max;
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {shown.map((u, i) => <Avatar key={u.id} user={u} size={size} style={{ marginLeft: i > 0 ? -8 : 0, border: "2px solid var(--card-bg, #fff)", zIndex: max - i }} />)}
      {extra > 0 && <div style={{ width: size, height: size, borderRadius: "50%", marginLeft: -8, background: "#6B6B80", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 9, fontWeight: 700, border: "2px solid var(--card-bg, #fff)", fontFamily: "'Space Mono', monospace" }}>+{extra}</div>}
    </div>
  );
}

function PriorityBadge({ priority, dark }) {
  const cfg = PRIORITY_CONFIG[priority]; if (!cfg) return null;
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600, background: dark ? cfg.bgDark : cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}30`, letterSpacing: "0.02em" }}>
      {I.flag(10, cfg.color)} {cfg.label}
    </div>
  );
}

/* ══════════════════════════════════════════════════
   ═══ SPRINT VIEW COMPONENT ═══
   ══════════════════════════════════════════════════ */
function SprintView({ sprint, t, dark }) {
  const [hoveredTask, setHoveredTask] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const statusCols = SPRINT_STATUSES;
  const tasks = sprint.tasks;
  const members = sprint.members.map(id => TEAM_MEMBERS.find(m => m.id === id)).filter(Boolean);

  const doneTasks = tasks.filter(tk => tk.status === "done").length;
  const blockedTasks = tasks.filter(tk => tk.status === "blocked").length;
  const stalledTasks = tasks.filter(tk => tk.stalled).length;
  const progress = Math.round((doneTasks / tasks.length) * 100);

  const startD = new Date(sprint.startDate);
  const endD = new Date(sprint.endDate);
  const now = new Date();
  const totalDays = Math.max(1, (endD - startD) / 86400000);
  const elapsed = Math.min(totalDays, Math.max(0, (now - startD) / 86400000));
  const timeProgress = Math.round((elapsed / totalDays) * 100);

  const getBlockerChain = (taskId, visited = new Set()) => {
    if (visited.has(taskId)) return [];
    visited.add(taskId);
    const tk = tasks.find(t => t.id === taskId);
    if (!tk || !tk.blockedBy) return [];
    const blocker = tasks.find(t => t.id === tk.blockedBy);
    if (!blocker) return [];
    return [blocker, ...getBlockerChain(blocker.id, visited)];
  };

  const tasksByMemberAndStatus = {};
  members.forEach(m => {
    tasksByMemberAndStatus[m.id] = {};
    statusCols.forEach(s => {
      tasksByMemberAndStatus[m.id][s] = tasks.filter(tk => tk.assignee === m.id && tk.status === s);
    });
  });

  // Friction detection: which status columns have the most tasks piled up?
  const statusLoad = {};
  statusCols.forEach(s => { statusLoad[s] = tasks.filter(tk => tk.status === s).length; });
  const maxLoad = Math.max(...Object.values(statusLoad));
  const frictionStatus = Object.entries(statusLoad).filter(([s, c]) => c === maxLoad && s !== "done" && s !== "todo" && c > 1).map(([s]) => s);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* Sprint Header */}
      <div style={{ padding: "20px 28px 0", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
              <span style={{ color: t.accent }}>{I.sprint(22, t.accent)}</span>
              <h1 style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.03em" }}>{sprint.name}</h1>
            </div>
            <p style={{ fontSize: 13, color: t.textSecondary }}>{sprint.goal}</p>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {members.map((m, i) => <Avatar key={m.id} user={m} size={32} showOnline style={{ marginLeft: i > 0 ? -6 : 0, border: `2px solid ${t.bg}`, "--avatar-ring": t.bg }} />)}
          </div>
        </div>

        {/* Metrics row */}
        <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
          {[
            { label: "Progress", value: `${progress}%`, sub: `${doneTasks}/${tasks.length} done`, color: "#22C55E", icon: I.checkCircle(14, "#22C55E") },
            { label: "Time Elapsed", value: `${timeProgress}%`, sub: `${Math.round(elapsed)}/${Math.round(totalDays)} days`, color: timeProgress > progress + 15 ? "#EF4444" : "#3B82F6", icon: I.clock(14, timeProgress > progress + 15 ? "#EF4444" : "#3B82F6") },
            { label: "Blocked", value: blockedTasks, sub: blockedTasks > 0 ? "needs attention" : "all clear", color: blockedTasks > 0 ? "#EF4444" : "#22C55E", icon: I.blocked(14, blockedTasks > 0 ? "#EF4444" : "#22C55E") },
            { label: "Stalled", value: stalledTasks, sub: stalledTasks > 0 ? "no progress" : "on track", color: stalledTasks > 0 ? "#F97316" : "#22C55E", icon: I.alert(14, stalledTasks > 0 ? "#F97316" : "#22C55E") },
          ].map(m => (
            <div key={m.label} style={{
              flex: "1 1 140px", padding: "12px 16px", borderRadius: 12,
              background: t.card, border: `1px solid ${t.cardBorder}`,
              display: "flex", alignItems: "center", gap: 12,
            }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: m.color + "15", display: "flex", alignItems: "center", justifyContent: "center" }}>{m.icon}</div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700, fontFamily: "'Space Mono', monospace", color: m.color, lineHeight: 1 }}>{m.value}</div>
                <div style={{ fontSize: 11, color: t.textMuted, marginTop: 2 }}>{m.label} · {m.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Sprint timeline bar */}
        <div style={{ marginBottom: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
            <span style={{ fontSize: 11, color: t.textMuted }}>{new Date(sprint.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
            <span style={{ fontSize: 11, color: t.textMuted }}>{new Date(sprint.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
          </div>
          <div style={{ height: 6, borderRadius: 4, background: t.inputBg, overflow: "hidden", position: "relative" }}>
            <div style={{ position: "absolute", height: "100%", width: `${progress}%`, borderRadius: 4, background: `linear-gradient(90deg, ${t.accent}, #22C55E)`, transition: "width 0.5s", zIndex: 2 }} />
            <div style={{ position: "absolute", height: "100%", width: `${timeProgress}%`, borderRadius: 4, background: timeProgress > progress + 15 ? "#EF444430" : t.accent + "15", transition: "width 0.5s", zIndex: 1 }} />
            <div style={{ position: "absolute", left: `${timeProgress}%`, top: -3, width: 2, height: 12, background: dark ? "#fff" : "#1A1A2E", borderRadius: 1, zIndex: 3 }} />
          </div>
        </div>
      </div>

      {/* Swim Lane Board */}
      <div style={{ flex: 1, overflow: "auto", padding: "12px 28px 20px" }}>
        {/* Status column headers */}
        <div style={{ display: "flex", gap: 0, marginBottom: 2, position: "sticky", top: 0, zIndex: 5, paddingLeft: 160 }}>
          {statusCols.map(s => {
            const meta = SPRINT_STATUS_META[s];
            const isFriction = frictionStatus.includes(s);
            const count = statusLoad[s];
            return (
              <div key={s} style={{
                flex: 1, minWidth: 150, padding: "10px 12px",
                display: "flex", alignItems: "center", gap: 6,
                background: isFriction ? (dark ? "#2A1515" : "#FFF5F5") : t.bg,
                borderRadius: "10px 10px 0 0",
                borderBottom: isFriction ? "2px solid #EF4444" : `1px solid ${t.columnBorder}`,
                transition: "all 0.2s",
              }}>
                {I[meta.icon](14, meta.color)}
                <span style={{ fontSize: 12, fontWeight: 600, color: meta.color }}>{meta.label}</span>
                <span style={{ fontSize: 10, fontWeight: 700, fontFamily: "'Space Mono', monospace", color: t.textMuted, background: t.card, padding: "1px 6px", borderRadius: 5 }}>{count}</span>
                {isFriction && (
                  <span style={{
                    fontSize: 9, fontWeight: 700, color: "#EF4444", background: dark ? "#3B1515" : "#FEE2E2",
                    padding: "2px 6px", borderRadius: 5, marginLeft: "auto", textTransform: "uppercase",
                    letterSpacing: "0.05em", animation: "urgentPulse 2s infinite",
                  }}>Friction</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Member lanes */}
        {members.map((member, mi) => {
          const memberTasks = tasks.filter(tk => tk.assignee === member.id);
          const memberDone = memberTasks.filter(tk => tk.status === "done").length;
          const memberBlocked = memberTasks.filter(tk => tk.status === "blocked").length;
          const memberProgress = memberTasks.length ? Math.round((memberDone / memberTasks.length) * 100) : 0;

          return (
            <div key={member.id} style={{
              display: "flex", gap: 0,
              background: mi % 2 === 0 ? t.laneBg : t.laneAlt,
              borderRadius: mi === 0 ? "0" : mi === members.length - 1 ? "0 0 12px 12px" : "0",
              border: `1px solid ${t.columnBorder}`, borderTop: mi > 0 ? "none" : undefined,
              minHeight: 110, transition: "all 0.2s",
            }}>
              {/* Member info column */}
              <div style={{
                width: 160, minWidth: 160, padding: "14px 14px",
                display: "flex", flexDirection: "column", gap: 6,
                borderRight: `1px solid ${t.columnBorder}`,
                background: mi % 2 === 0 ? t.laneBg : t.laneAlt,
                position: "sticky", left: 0, zIndex: 2,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Avatar user={member} size={30} showOnline style={{ "--avatar-ring": mi % 2 === 0 ? t.laneBg : t.laneAlt }} />
                  <div>
                    <div style={{ fontSize: 12.5, fontWeight: 600, color: t.text }}>{member.name}</div>
                    <div style={{ fontSize: 10, color: t.textMuted }}>{member.role}</div>
                  </div>
                </div>
                <div style={{ height: 3, borderRadius: 2, background: t.inputBg, overflow: "hidden" }}>
                  <div style={{ height: "100%", borderRadius: 2, width: `${memberProgress}%`, background: memberBlocked > 0 ? "#EF4444" : "#22C55E", transition: "width 0.3s" }} />
                </div>
                <div style={{ fontSize: 10, color: t.textMuted }}>
                  {memberDone}/{memberTasks.length} done
                  {memberBlocked > 0 && <span style={{ color: "#EF4444", fontWeight: 600 }}> · {memberBlocked} blocked</span>}
                </div>
              </div>

              {/* Status cells */}
              {statusCols.map(s => {
                const cellTasks = tasksByMemberAndStatus[member.id][s] || [];
                const isFriction = frictionStatus.includes(s);
                return (
                  <div key={s} style={{
                    flex: 1, minWidth: 150, padding: "8px 8px",
                    display: "flex", flexDirection: "column", gap: 6,
                    borderRight: `1px solid ${t.columnBorder}22`,
                    background: isFriction ? (dark ? "#1A111140" : "#FFF5F520") : "transparent",
                  }}>
                    {cellTasks.map(tk => {
                      const isBlocked = tk.status === "blocked";
                      const isStalled = tk.stalled;
                      const blocker = tk.blockedBy ? tasks.find(bt => bt.id === tk.blockedBy) : null;
                      const blockerUser = blocker ? TEAM_MEMBERS.find(m => m.id === blocker.assignee) : null;
                      const priCfg = PRIORITY_CONFIG[tk.priority];
                      const isHovered = hoveredTask === tk.id;
                      const isSelected = selectedTask === tk.id;

                      // Highlight tasks that block or are blocked by hovered task
                      const hoveredTaskData = hoveredTask ? tasks.find(t => t.id === hoveredTask) : null;
                      const isRelated = hoveredTask && (tk.blockedBy === hoveredTask || (hoveredTaskData && hoveredTaskData.blockedBy === tk.id));

                      return (
                        <div key={tk.id}
                          onMouseEnter={() => setHoveredTask(tk.id)}
                          onMouseLeave={() => setHoveredTask(null)}
                          onClick={() => setSelectedTask(isSelected ? null : tk.id)}
                          style={{
                            padding: "10px 11px", borderRadius: 10, cursor: "pointer",
                            background: isSelected ? t.accentLight : isHovered ? t.cardHover : t.card,
                            border: `1.5px solid ${isBlocked ? "#EF444460" : isRelated ? t.accent + "60" : isStalled ? "#F9731640" : t.cardBorder}`,
                            borderLeft: `4px solid ${isBlocked ? "#EF4444" : isStalled ? "#F97316" : tk.status === "done" ? "#22C55E" : priCfg.color}`,
                            boxShadow: isHovered ? t.shadowHover : t.shadowCard,
                            transform: isHovered ? "translateY(-2px) scale(1.02)" : "scale(1)",
                            transition: "all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                            animation: isBlocked ? "none" : "fadeIn 0.3s ease",
                            opacity: tk.status === "done" ? 0.65 : 1,
                            position: "relative",
                          }}>
                          {/* Stalled / blocked banner */}
                          {(isBlocked || isStalled) && (
                            <div style={{
                              display: "flex", alignItems: "center", gap: 4,
                              fontSize: 9, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase",
                              color: isBlocked ? "#EF4444" : "#F97316",
                              marginBottom: 5,
                              animation: isBlocked ? "urgentPulse 2s infinite" : "none",
                            }}>
                              {isBlocked ? I.blocked(10, "#EF4444") : I.clock(10, "#F97316")}
                              {isBlocked ? "BLOCKED" : `STALLED ${tk.daysInStatus}d`}
                            </div>
                          )}
                          <div style={{ fontSize: 12, fontWeight: 600, color: t.text, lineHeight: 1.3, marginBottom: 4, textDecoration: tk.status === "done" ? "line-through" : "none" }}>
                            {tk.title}
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                            <div style={{ display: "inline-flex", alignItems: "center", gap: 3, padding: "1px 5px", borderRadius: 4, fontSize: 9.5, fontWeight: 600, background: dark ? priCfg.bgDark : priCfg.bg, color: priCfg.color }}>
                              {I.flag(8, priCfg.color)} {priCfg.label}
                            </div>
                          </div>

                          {/* Blocker chain */}
                          {isBlocked && blocker && (
                            <div style={{
                              marginTop: 6, padding: "5px 8px", borderRadius: 6,
                              background: dark ? "#1F111860" : "#FEF2F2",
                              border: `1px solid #EF444425`, fontSize: 10, color: "#EF4444",
                              display: "flex", alignItems: "center", gap: 5,
                            }}>
                              {I.link(9, "#EF4444")}
                              <span style={{ fontWeight: 500 }}>Waiting on</span>
                              {blockerUser && <Avatar user={blockerUser} size={14} />}
                              <span style={{ fontWeight: 600, color: t.text, maxWidth: 90, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{blocker.title}</span>
                            </div>
                          )}

                          {/* Expanded detail on select */}
                          {isSelected && (
                            <div style={{ marginTop: 8, paddingTop: 8, borderTop: `1px solid ${t.inputBorder}`, animation: "fadeIn 0.2s ease" }}>
                              {tk.blockedBy && (
                                <div style={{ marginBottom: 6 }}>
                                  <span style={{ fontSize: 10, fontWeight: 600, color: t.textMuted }}>Dependency Chain:</span>
                                  <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 4, flexWrap: "wrap" }}>
                                    {getBlockerChain(tk.id).map((bt, ci) => {
                                      const bu = TEAM_MEMBERS.find(m => m.id === bt.assignee);
                                      return (
                                        <div key={bt.id} style={{ display: "flex", alignItems: "center", gap: 3 }}>
                                          {ci > 0 && <span style={{ color: t.textMuted }}>{I.arrowRight(10, t.textMuted)}</span>}
                                          <div style={{
                                            display: "flex", alignItems: "center", gap: 4, padding: "3px 7px",
                                            borderRadius: 6, background: bt.status === "blocked" ? (dark ? "#3B1515" : "#FEE2E2") : bt.status === "done" ? (dark ? "#0F2918" : "#F0FDF4") : t.inputBg,
                                            border: `1px solid ${bt.status === "blocked" ? "#EF444430" : t.inputBorder}`,
                                            fontSize: 10, fontWeight: 500, color: t.text,
                                          }}>
                                            {bu && <Avatar user={bu} size={12} />}
                                            <span style={{ maxWidth: 80, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{bt.title}</span>
                                            <span style={{ color: SPRINT_STATUS_META[bt.status].color }}>{I[SPRINT_STATUS_META[bt.status].icon](9, SPRINT_STATUS_META[bt.status].color)}</span>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                              <div style={{ fontSize: 10, color: t.textMuted, display: "flex", gap: 10 }}>
                                <span>Days in status: <strong style={{ color: tk.daysInStatus > 2 ? "#F97316" : t.text }}>{tk.daysInStatus}</strong></span>
                                <span>Assignee: <strong style={{ color: t.text }}>{TEAM_MEMBERS.find(m => m.id === tk.assignee)?.name}</strong></span>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                    {cellTasks.length === 0 && (
                      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 50 }}>
                        <div style={{ width: 24, height: 2, borderRadius: 1, background: t.columnBorder }} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}

        {/* Friction Summary */}
        {(blockedTasks > 0 || stalledTasks > 0) && (
          <div style={{
            marginTop: 16, padding: "16px 20px", borderRadius: 14,
            background: dark ? "#1A1115" : "#FFF5F7",
            border: `1px solid ${dark ? "#3B151540" : "#FCA5A540"}`,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              {I.alert(16, "#EF4444")}
              <span style={{ fontSize: 14, fontWeight: 700, color: "#EF4444" }}>Friction Report</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {tasks.filter(tk => tk.status === "blocked").map(tk => {
                const blocker = tk.blockedBy ? tasks.find(bt => bt.id === tk.blockedBy) : null;
                const assignee = TEAM_MEMBERS.find(m => m.id === tk.assignee);
                const blockerUser = blocker ? TEAM_MEMBERS.find(m => m.id === blocker.assignee) : null;
                return (
                  <div key={tk.id} style={{
                    display: "flex", alignItems: "center", gap: 10, padding: "10px 14px",
                    borderRadius: 10, background: t.card, border: `1px solid ${t.cardBorder}`,
                  }}>
                    {I.blocked(14, "#EF4444")}
                    <Avatar user={assignee} size={22} />
                    <span style={{ fontSize: 12.5, fontWeight: 600, color: t.text, flex: 1 }}>{tk.title}</span>
                    <span style={{ color: t.textMuted, fontSize: 11, display: "flex", alignItems: "center", gap: 4 }}>
                      {I.arrowRight(10, t.textMuted)} blocked by
                    </span>
                    {blockerUser && <Avatar user={blockerUser} size={22} />}
                    <span style={{ fontSize: 12, fontWeight: 500, color: t.textSecondary, maxWidth: 150, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {blocker?.title || "Unknown"}
                    </span>
                    <span style={{ fontSize: 10, fontWeight: 600, color: "#EF4444", background: dark ? "#3B1515" : "#FEE2E2", padding: "2px 7px", borderRadius: 5 }}>{tk.daysInStatus}d</span>
                  </div>
                );
              })}
              {tasks.filter(tk => tk.stalled && tk.status !== "blocked").map(tk => {
                const assignee = TEAM_MEMBERS.find(m => m.id === tk.assignee);
                return (
                  <div key={tk.id} style={{
                    display: "flex", alignItems: "center", gap: 10, padding: "10px 14px",
                    borderRadius: 10, background: t.card, border: `1px solid ${t.cardBorder}`,
                  }}>
                    {I.clock(14, "#F97316")}
                    <Avatar user={assignee} size={22} />
                    <span style={{ fontSize: 12.5, fontWeight: 600, color: t.text, flex: 1 }}>{tk.title}</span>
                    <span style={{ fontSize: 10, fontWeight: 600, color: "#F97316", background: dark ? "#3B2010" : "#FFF7ED", padding: "2px 7px", borderRadius: 5 }}>stalled {tk.daysInStatus}d — no progress</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════ APP ══════════════ */
export default function TaskManager() {
  const [dark, setDark] = useState(false);
  const t = dark ? themes.dark : themes.light;
  const [cards, setCards] = useState(SAMPLE_CARDS);
  const [columns] = useState(INITIAL_COLUMNS);
  const [showModal, setShowModal] = useState(false);
  const [modalColumn, setModalColumn] = useState("todo");
  const [editCard, setEditCard] = useState(null);
  const [dragCard, setDragCard] = useState(null);
  const [dragOverCol, setDragOverCol] = useState(null);
  const [activeNav, setActiveNav] = useState("board");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDept, setActiveDept] = useState("all");
  const [teamExpanded, setTeamExpanded] = useState(true);
  const [filterAssignee, setFilterAssignee] = useState(null);
  const [filterPriority, setFilterPriority] = useState(null);
  const [showPriorityFilter, setShowPriorityFilter] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [movedCard, setMovedCard] = useState(null);

  const filteredCards = cards.filter(c => {
    const matchSearch = !searchQuery || c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchAssignee = !filterAssignee || c.assignees?.includes(filterAssignee);
    const matchPriority = !filterPriority || c.priority === filterPriority;
    return matchSearch && matchAssignee && matchPriority;
  });

  const openNew = (colId) => { setEditCard(null); setModalColumn(colId); setShowModal(true); };
  const openEdit = (card) => { setEditCard(card); setModalColumn(card.column); setShowModal(true); };

  const saveCard = (data) => {
    if (editCard) {
      const oldCol = editCard.column; const newCol = data.column;
      setCards(prev => prev.map(c => c.id === editCard.id ? { ...c, ...data } : c));
      if (oldCol !== newCol) { setMovedCard(editCard.id); setTimeout(() => setMovedCard(null), 600); if (newCol === "done") setConfetti(true); }
    } else {
      setCards(prev => [...prev, { ...data, id: `c${Date.now()}`, column: modalColumn, createdAt: Date.now(), assignees: data.assignees || [], subtasks: data.subtasks || [], messages: data.messages || [] }]);
    }
    setShowModal(false); setEditCard(null);
  };

  const deleteCard = (id) => { setCards(prev => prev.filter(c => c.id !== id)); setShowModal(false); setEditCard(null); };
  const handleDragStart = (e, card) => { setDragCard(card); e.dataTransfer.effectAllowed = "move"; e.target.style.opacity = "0.35"; };
  const handleDragEnd = (e) => {
    e.target.style.opacity = "1";
    if (dragCard && dragOverCol && dragCard.column !== dragOverCol) {
      setCards(prev => prev.map(c => c.id === dragCard.id ? { ...c, column: dragOverCol } : c));
      setMovedCard(dragCard.id); setTimeout(() => setMovedCard(null), 600);
      if (dragOverCol === "done") setConfetti(true);
    }
    setDragCard(null); setDragOverCol(null);
  };
  const handleDragOver = (e, colId) => { e.preventDefault(); setDragOverCol(colId); };

  const totalTasks = cards.length;
  const completedTasks = cards.filter(c => c.column === "done").length;
  const inProgressTasks = cards.filter(c => c.column === "progress").length;
  const urgentTasks = cards.filter(c => c.priority === "urgent" && c.column !== "done").length;

  const navItems = [
    { id: "board", label: "Board", icon: "board" },
    { id: "goals", label: "Goals", icon: "goal", badge: "Soon" },
    { id: "sprints", label: "Sprints", icon: "sprint" },
    { id: "assistant", label: "AI Assistant", icon: "ai", badge: "Soon" },
    { id: "hackathons", label: "Hackathons", icon: "party" },
    { id: "pulse", label: "Pulse", icon: "pulse" },
  ];

  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw", background: t.bg, color: t.text, fontFamily: "'DM Sans', -apple-system, sans-serif", transition: "background 0.3s, color 0.3s", overflow: "hidden", "--card-bg": t.card, "--avatar-ring": t.card }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
      <Confetti show={confetti} onDone={() => setConfetti(false)} />

      {/* ═══ SIDEBAR ═══ */}
      <aside style={{ width: 260, minWidth: 260, background: t.sidebar, borderRight: `1px solid ${t.sidebarBorder}`, display: "flex", flexDirection: "column", transition: "all 0.3s" }}>
        <div style={{ padding: "18px 20px 20px", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: `linear-gradient(135deg, ${t.accent}, ${dark ? "#C4B5FD" : "#818CF8"})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 16, fontFamily: "'Space Mono', monospace", boxShadow: `0 2px 12px ${t.accentGlow}` }}>T</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, letterSpacing: "-0.02em", color: t.text }}>TaskFlow</div>
            <div style={{ fontSize: 11, color: t.textMuted, marginTop: 1 }}>Phase 1 — MVP</div>
          </div>
        </div>
        <div style={{ padding: "0 12px", marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderRadius: 8, background: t.inputBg, border: `1px solid ${t.inputBorder}` }}>
            <span style={{ color: t.textMuted, flexShrink: 0 }}>{I.search()}</span>
            <input placeholder="Search tasks..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ border: "none", outline: "none", background: "transparent", color: t.text, fontSize: 13, width: "100%", fontFamily: "inherit" }} />
            {searchQuery && <span style={{ cursor: "pointer", color: t.textMuted, flexShrink: 0 }} onClick={() => setSearchQuery("")}>{I.close(14)}</span>}
          </div>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "0 8px" }}>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: t.textMuted, padding: "0 12px 8px" }}>Workspace</div>
            {navItems.map(item => (
              <div key={item.id} onClick={() => setActiveNav(item.id)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 8, cursor: "pointer", marginBottom: 2, background: activeNav === item.id ? t.sidebarActive : "transparent", color: activeNav === item.id ? t.sidebarActiveText : t.sidebarText, fontWeight: activeNav === item.id ? 600 : 400, fontSize: 13.5, transition: "all 0.15s" }}>
                <span style={{ opacity: activeNav === item.id ? 1 : 0.6 }}>{I[item.icon](18)}</span>
                <span>{item.label}</span>
                {item.badge && <span style={{ marginLeft: "auto", fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 6, background: t.badge, color: t.badgeText }}>{item.badge}</span>}
                {item.id === "board" && urgentTasks > 0 && <span style={{ marginLeft: "auto", fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 6, background: dark ? "#3B1515" : "#FEE2E2", color: "#EF4444", fontFamily: "'Space Mono', monospace" }}>{urgentTasks}</span>}
                {item.id === "sprints" && <span style={{ marginLeft: "auto", fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 6, background: dark ? "#3B1515" : "#FEE2E2", color: "#EF4444", fontFamily: "'Space Mono', monospace" }}>{SAMPLE_SPRINTS[0].tasks.filter(tk => tk.status === "blocked").length}</span>}
              </div>
            ))}
          </div>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: t.textMuted, padding: "0 12px 8px" }}>Departments</div>
            {DEPARTMENTS.map(dept => (
              <div key={dept.id} onClick={() => setActiveDept(dept.id)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderRadius: 8, cursor: "pointer", marginBottom: 1, background: activeDept === dept.id ? t.sidebarActive : "transparent", color: activeDept === dept.id ? t.sidebarActiveText : t.sidebarText, fontWeight: activeDept === dept.id ? 600 : 400, fontSize: 13, transition: "all 0.15s" }}>
                <span style={{ opacity: activeDept === dept.id ? 1 : 0.6 }}>{I[dept.icon](16)}</span><span>{dept.name}</span>
              </div>
            ))}
          </div>
          <div style={{ marginBottom: 16 }}>
            <div onClick={() => setTeamExpanded(!teamExpanded)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 12px 8px", cursor: "pointer" }}>
              <span style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: t.textMuted }}>Team</span>
              <span style={{ color: t.textMuted, transform: teamExpanded ? "rotate(0)" : "rotate(-90deg)", transition: "transform 0.2s" }}>{I.chevDown(12)}</span>
            </div>
            {teamExpanded && TEAM_MEMBERS.map(member => (
              <div key={member.id} onClick={() => setFilterAssignee(filterAssignee === member.id ? null : member.id)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 12px", borderRadius: 8, cursor: "pointer", marginBottom: 1, transition: "all 0.15s", background: filterAssignee === member.id ? t.sidebarActive : "transparent", color: filterAssignee === member.id ? t.sidebarActiveText : t.sidebarText }}>
                <Avatar user={member} size={24} showOnline style={{ "--avatar-ring": t.sidebar }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{member.name}</div>
                  <div style={{ fontSize: 10, color: t.textMuted }}>{member.role}</div>
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, color: t.textMuted, fontFamily: "'Space Mono', monospace" }}>{cards.filter(c => c.assignees?.includes(member.id) && c.column !== "done").length}</span>
              </div>
            ))}
            {filterAssignee && <div onClick={() => setFilterAssignee(null)} style={{ padding: "6px 12px", fontSize: 11, color: t.accent, cursor: "pointer", fontWeight: 500, display: "flex", alignItems: "center", gap: 4 }}>{I.close(12, t.accent)} Clear filter</div>}
          </div>
        </div>
        <div style={{ padding: "14px 18px", borderTop: `1px solid ${t.sidebarBorder}` }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {[{ label: "Total", val: totalTasks, color: t.accent }, { label: "In Progress", val: inProgressTasks, color: "#F97316" }, { label: "Completed", val: completedTasks, color: "#22C55E" }].map(s => (
              <div key={s.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12, color: t.textSecondary }}>{s.label}</span>
                <span style={{ fontSize: 12.5, fontWeight: 700, color: s.color, fontFamily: "'Space Mono', monospace" }}>{s.val}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 8, height: 4, borderRadius: 4, background: t.inputBg, overflow: "hidden" }}>
            <div style={{ height: "100%", borderRadius: 4, width: `${totalTasks ? (completedTasks / totalTasks * 100) : 0}%`, background: `linear-gradient(90deg, ${t.accent}, #22C55E)`, transition: "width 0.5s ease" }} />
          </div>
          <div style={{ fontSize: 11, color: t.textMuted, marginTop: 4 }}>{totalTasks ? Math.round(completedTasks / totalTasks * 100) : 0}% complete</div>
        </div>
        <div style={{ padding: "10px 16px", borderTop: `1px solid ${t.sidebarBorder}` }}>
          <button onClick={() => setDark(!dark)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "8px 0", borderRadius: 8, border: `1px solid ${t.inputBorder}`, background: t.inputBg, color: t.textSecondary, cursor: "pointer", fontSize: 12.5, fontWeight: 500, fontFamily: "inherit", transition: "all 0.2s" }}>
            {dark ? I.sun() : I.moon()} {dark ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      </aside>

      {/* ═══ MAIN ═══ */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {activeNav === "board" && <>
          <header style={{ padding: "16px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${t.sidebarBorder}`, background: t.sidebar, transition: "all 0.3s" }}>
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.03em", margin: 0 }}>Project Board</h1>
              <p style={{ fontSize: 12.5, color: t.textSecondary, margin: "2px 0 0", display: "flex", alignItems: "center", gap: 8 }}>
                <span>{totalTasks} tasks</span><span style={{ color: t.textMuted }}>·</span><span>{inProgressTasks} in progress</span><span style={{ color: t.textMuted }}>·</span><span>{completedTasks} done</span>
                {urgentTasks > 0 && <><span style={{ color: t.textMuted }}>·</span><span style={{ color: "#EF4444", fontWeight: 600 }}>{urgentTasks} urgent</span></>}
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ position: "relative" }}>
                <button onClick={() => setShowPriorityFilter(!showPriorityFilter)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 9, border: `1px solid ${filterPriority ? PRIORITY_CONFIG[filterPriority].color + "50" : t.inputBorder}`, background: filterPriority ? (dark ? PRIORITY_CONFIG[filterPriority].bgDark : PRIORITY_CONFIG[filterPriority].bg) : t.inputBg, color: filterPriority ? PRIORITY_CONFIG[filterPriority].color : t.textSecondary, cursor: "pointer", fontSize: 12.5, fontWeight: 500, fontFamily: "inherit" }}>
                  {I.filter(14)} {filterPriority ? PRIORITY_CONFIG[filterPriority].label : "Filter"}
                  {filterPriority && <span onClick={(e) => { e.stopPropagation(); setFilterPriority(null); setShowPriorityFilter(false); }} style={{ marginLeft: 2 }}>{I.close(12)}</span>}
                </button>
                {showPriorityFilter && (
                  <div style={{ position: "absolute", top: "calc(100% + 6px)", right: 0, zIndex: 50, background: t.modalBg, border: `1px solid ${t.cardBorder}`, borderRadius: 12, boxShadow: "0 12px 32px rgba(0,0,0,0.15)", padding: 6, minWidth: 160, animation: "fadeIn 0.15s ease" }}>
                    {Object.entries(PRIORITY_CONFIG).map(([key, cfg]) => (
                      <div key={key} onClick={() => { setFilterPriority(filterPriority === key ? null : key); setShowPriorityFilter(false); }} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 500, color: t.text, background: filterPriority === key ? t.accentLight : "transparent" }}>
                        {I.flag(12, cfg.color)}<span>{cfg.label}</span>
                        <span style={{ marginLeft: "auto", fontSize: 11, color: t.textMuted, fontFamily: "'Space Mono', monospace" }}>{cards.filter(c => c.priority === key && c.column !== "done").length}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div style={{ display: "flex", marginRight: 4 }}>
                {TEAM_MEMBERS.slice(0, 4).map((m, i) => <Avatar key={m.id} user={m} size={30} showOnline style={{ marginLeft: i > 0 ? -8 : 0, border: `2px solid ${t.sidebar}`, "--avatar-ring": t.sidebar }} />)}
                <div style={{ width: 30, height: 30, borderRadius: "50%", marginLeft: -8, background: t.inputBg, border: `2px solid ${t.sidebar}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: t.textMuted, fontFamily: "'Space Mono', monospace" }}>+{TEAM_MEMBERS.length - 4}</div>
              </div>
              <button onClick={() => openNew("todo")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 18px", borderRadius: 10, border: "none", background: `linear-gradient(135deg, ${t.accent}, ${dark ? "#C4B5FD" : "#818CF8"})`, color: "#fff", cursor: "pointer", fontWeight: 600, fontSize: 13, fontFamily: "inherit", boxShadow: `0 2px 12px ${t.accentGlow}` }}>
                {I.plus(14, "#fff")} New Task
              </button>
            </div>
          </header>
          <div style={{ flex: 1, display: "flex", gap: 14, padding: "18px 20px", overflowX: "auto", overflowY: "hidden" }}>
            {columns.map(col => {
              const colCards = filteredCards.filter(c => c.column === col.id);
              const isOver = dragOverCol === col.id && dragCard?.column !== col.id;
              const colUrgent = colCards.filter(c => c.priority === "urgent").length;
              return (
                <div key={col.id} onDragOver={(e) => handleDragOver(e, col.id)} onDragLeave={() => setDragOverCol(null)} onDrop={() => {}} style={{ minWidth: 290, width: 290, display: "flex", flexDirection: "column", background: isOver ? t.accentLight : t.columnBg, borderRadius: 14, border: `1px solid ${isOver ? t.accent : t.columnBorder}`, transition: "all 0.2s", overflow: "hidden" }}>
                  <div style={{ padding: "13px 14px 10px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ color: col.id === "done" ? "#22C55E" : col.id === "progress" ? "#F97316" : t.textMuted }}>{I[col.icon](15, col.id === "done" ? "#22C55E" : col.id === "progress" ? "#F97316" : t.textMuted)}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: t.text }}>{col.title}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: t.textMuted, background: t.card, padding: "1px 7px", borderRadius: 6, fontFamily: "'Space Mono', monospace" }}>{colCards.length}</span>
                      {colUrgent > 0 && col.id !== "done" && <span style={{ fontSize: 10, fontWeight: 700, color: "#EF4444", background: dark ? "#3B1515" : "#FEE2E2", padding: "1px 6px", borderRadius: 6, fontFamily: "'Space Mono', monospace" }}>{colUrgent}</span>}
                    </div>
                    <button onClick={() => openNew(col.id)} style={{ width: 30, height: 30, borderRadius: 8, border: `1.5px dashed ${t.textMuted}60`, background: "transparent", color: t.textMuted, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s", fontSize: 0 }}
                      onMouseEnter={e => { e.currentTarget.style.background = t.accent; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = t.accent; e.currentTarget.style.borderStyle = "solid"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = t.textMuted; e.currentTarget.style.borderColor = t.textMuted + "60"; e.currentTarget.style.borderStyle = "dashed"; }}
                    >{I.plus(15)}</button>
                  </div>
                  <div style={{ flex: 1, padding: "4px 8px 8px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 7 }}>
                    {colCards.map(card => <TaskCard key={card.id} card={card} t={t} dark={dark} onDragStart={handleDragStart} onDragEnd={handleDragEnd} onClick={() => openEdit(card)} isMoved={movedCard === card.id} />)}
                    {colCards.length === 0 && !isOver && <div style={{ padding: "20px 14px", textAlign: "center", color: t.textMuted, fontSize: 12, border: `2px dashed ${t.columnBorder}`, borderRadius: 10, opacity: 0.6 }}>No tasks yet</div>}
                    {isOver && <div style={{ padding: 14, borderRadius: 10, border: `2px dashed ${t.accent}`, background: t.accentGlow, textAlign: "center", color: t.accent, fontSize: 12, fontWeight: 500 }}>Drop here</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </>}

        {activeNav === "sprints" && <SprintView sprint={SAMPLE_SPRINTS[0]} t={t} dark={dark} />}

        {activeNav === "hackathons" && <HackathonListView t={mapTheme(t)} dark={dark} teamMembers={TEAM_MEMBERS} />}

        {activeNav === "pulse" && <EnergyDashboard t={mapTheme(t)} dark={dark} />}

        {activeNav !== "board" && activeNav !== "sprints" && activeNav !== "hackathons" && activeNav !== "pulse" && (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12 }}>
            <div style={{ width: 64, height: 64, borderRadius: 16, background: t.accentLight, display: "flex", alignItems: "center", justifyContent: "center" }}>{I[navItems.find(n => n.id === activeNav)?.icon || "board"](32, t.accent)}</div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: t.text }}>{navItems.find(n => n.id === activeNav)?.label}</h2>
            <p style={{ fontSize: 13, color: t.textMuted }}>Coming soon — stay tuned</p>
          </div>
        )}
      </main>

      {showModal && <CardModal t={t} dark={dark} card={editCard} column={modalColumn} columns={columns} onSave={saveCard} onDelete={editCard ? () => deleteCard(editCard.id) : null} onClose={() => { setShowModal(false); setEditCard(null); }} />}
      {showPriorityFilter && <div onClick={() => setShowPriorityFilter(false)} style={{ position: "fixed", inset: 0, zIndex: 40 }} />}

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${t.scrollbar}; border-radius: 3px; }
        input::placeholder, textarea::placeholder { color: ${t.textMuted}; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideIn { from { opacity: 0; transform: scale(0.96) translateY(12px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        @keyframes urgentPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }
        @keyframes cardLand { 0% { transform: scale(0.9) translateY(-10px); opacity: 0.5; } 50% { transform: scale(1.04); } 100% { transform: scale(1) translateY(0); opacity: 1; } }
        @keyframes doneBounce { 0% { transform: scale(0.85); opacity: 0.4; } 40% { transform: scale(1.08); } 70% { transform: scale(0.97); } 100% { transform: scale(1); opacity: 1; } }
        @keyframes confettiFall { 0% { transform: translate(0, 0) rotate(0deg); opacity: 1; } 100% { transform: translate(var(--dx), calc(var(--dy) + 500px)) rotate(720deg); opacity: 0; } }
      `}</style>
    </div>
  );
}

/* ══════════════ TASK CARD (Board) ══════════════ */
function TaskCard({ card, t, dark, onDragStart, onDragEnd, onClick, isMoved }) {
  const [hovered, setHovered] = useState(false);
  const cfg = PRIORITY_CONFIG[card.priority];
  const isOverdue = card.dueDate && new Date(card.dueDate) < new Date() && card.column !== "done";
  const isDone = card.column === "done";
  const isUrgent = card.priority === "urgent" && !isDone;
  const isHigh = card.priority === "high" && !isDone;
  const subtasksDone = card.subtasks?.filter(s => s.done).length || 0;
  const subtasksTotal = card.subtasks?.length || 0;
  const landAnim = isMoved ? (isDone ? "doneBounce 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)" : "cardLand 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)") : "fadeIn 0.25s ease";

  return (
    <div draggable onDragStart={(e) => onDragStart(e, card)} onDragEnd={onDragEnd} onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        padding: "12px 14px", background: isUrgent ? (dark ? "#1F1118" : "#FFF5F5") : isHigh ? (dark ? "#1F1710" : "#FFFAF5") : hovered ? t.cardHover : t.card,
        borderRadius: 12, cursor: "grab",
        transition: "transform 0.22s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.22s ease, background 0.15s",
        transform: hovered ? "translateY(-4px) scale(1.02)" : "translateY(0) scale(1)",
        boxShadow: hovered ? (isUrgent ? `0 14px 30px ${cfg.color}20, 0 4px 10px rgba(0,0,0,0.08)` : `0 14px 30px rgba(0,0,0,0.12), 0 4px 10px rgba(0,0,0,0.06)`) : (isUrgent ? `0 0 0 1px ${cfg.color}30, 0 2px 8px ${cfg.color}12` : t.shadowCard),
        animation: landAnim, opacity: isDone ? 0.6 : 1,
        borderLeft: `4px solid ${isUrgent ? cfg.color : isHigh ? PRIORITY_CONFIG.high.color : card.color ? card.color.value : t.cardBorder}`,
        border: isUrgent ? `1px solid ${cfg.color}40` : isHigh ? `1px solid ${PRIORITY_CONFIG.high.color}25` : `1px solid ${t.cardBorder}`,
        borderLeftWidth: 4, borderLeftColor: isUrgent ? cfg.color : isHigh ? PRIORITY_CONFIG.high.color : card.color ? card.color.value : t.cardBorder,
        zIndex: hovered ? 10 : 1, position: "relative",
      }}>
      {isUrgent && <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 8px", margin: "-12px -14px 8px", marginLeft: -10, borderRadius: "0 8px 0 0", background: dark ? "linear-gradient(90deg, #3B1515, #2A1010)" : "linear-gradient(90deg, #FEE2E2, #FFF5F5)", fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: cfg.color, animation: "urgentPulse 2s ease-in-out infinite" }}>{I.flag(9, cfg.color)} URGENT</div>}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 7 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {!isUrgent && <PriorityBadge priority={card.priority} dark={dark} />}
          {card.color && <div style={{ width: 18, height: 4, borderRadius: 2, background: card.color.value }} />}
        </div>
        <div style={{ opacity: hovered ? 0.6 : 0, transition: "opacity 0.15s" }}>{I.grip()}</div>
      </div>
      <div style={{ fontSize: 13.5, fontWeight: 600, lineHeight: 1.35, color: t.text, marginBottom: card.description ? 5 : 0, textDecoration: isDone ? "line-through" : "none", letterSpacing: "-0.01em" }}>{card.title}</div>
      {card.description && <div style={{ fontSize: 12, color: t.textSecondary, lineHeight: 1.4, marginBottom: 8, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{card.description}</div>}
      {subtasksTotal > 0 && (
        <div style={{ marginBottom: 8 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 3, marginBottom: 5 }}>
            {card.subtasks.slice(0, 3).map(st => (
              <div key={st.id} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11.5, color: st.done ? t.textMuted : t.textSecondary }}>
                <div style={{ width: 14, height: 14, borderRadius: 4, flexShrink: 0, border: st.done ? "none" : `1.5px solid ${t.textMuted}`, background: st.done ? "#22C55E" : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>{st.done && I.check(8, "#fff")}</div>
                <span style={{ textDecoration: st.done ? "line-through" : "none", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{st.text}</span>
              </div>
            ))}
            {subtasksTotal > 3 && <div style={{ fontSize: 11, color: t.textMuted, paddingLeft: 20 }}>+{subtasksTotal - 3} more</div>}
          </div>
          <div style={{ height: 3, borderRadius: 2, background: t.inputBg, overflow: "hidden" }}>
            <div style={{ height: "100%", borderRadius: 2, width: `${(subtasksDone / subtasksTotal) * 100}%`, background: subtasksDone === subtasksTotal ? "#22C55E" : t.accent, transition: "width 0.3s ease" }} />
          </div>
        </div>
      )}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {card.dueDate && <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 500, color: isOverdue ? "#EF4444" : isDone ? "#22C55E" : t.textMuted }}>{I.calendar(11, isOverdue ? "#EF4444" : isDone ? "#22C55E" : t.textMuted)}{new Date(card.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</div>}
          {card.messages?.length > 0 && <div style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, fontWeight: 600, color: t.accent, background: t.accentLight, padding: "1px 6px", borderRadius: 5 }}>{I.message(11, t.accent)} {card.messages.length}</div>}
        </div>
        {card.assignees?.length > 0 && <AvatarStack userIds={card.assignees} size={22} max={3} />}
      </div>
    </div>
  );
}

/* ══════════════ CARD MODAL ══════════════ */
function CardModal({ t, dark, card, column, columns, onSave, onDelete, onClose }) {
  const [title, setTitle] = useState(card?.title || "");
  const [description, setDescription] = useState(card?.description || "");
  const [color, setColor] = useState(card?.color || null);
  const [priority, setPriority] = useState(card?.priority || "medium");
  const [dueDate, setDueDate] = useState(card?.dueDate || "");
  const [selectedCol, setSelectedCol] = useState(card?.column || column);
  const [assignees, setAssignees] = useState(card?.assignees || []);
  const [subtasks, setSubtasks] = useState(card?.subtasks || []);
  const [newSubtask, setNewSubtask] = useState("");
  const [messages, setMessages] = useState(card?.messages || []);
  const [newMessage, setNewMessage] = useState("");
  const [assigneeMessage, setAssigneeMessage] = useState("");
  const [showAssigneeMsg, setShowAssigneeMsg] = useState(null);
  const msgEndRef = useRef(null);

  const toggleAssignee = (id) => { if (assignees.includes(id)) { setAssignees(prev => prev.filter(a => a !== id)); setShowAssigneeMsg(null); } else { setAssignees(prev => [...prev, id]); setShowAssigneeMsg(id); setAssigneeMessage(""); } };
  const sendAssigneeMsg = () => { if (assigneeMessage.trim() && showAssigneeMsg) { const member = TEAM_MEMBERS.find(m => m.id === showAssigneeMsg); setMessages(prev => [...prev, { user: "u1", text: `@${member?.name.split(" ")[0]}: ${assigneeMessage.trim()}`, time: Date.now() }]); setAssigneeMessage(""); } setShowAssigneeMsg(null); };
  const addSubtask = () => { if (!newSubtask.trim()) return; setSubtasks(prev => [...prev, { id: `st${Date.now()}`, text: newSubtask.trim(), done: false }]); setNewSubtask(""); };
  const toggleSubtask = (id) => setSubtasks(prev => prev.map(s => s.id === id ? { ...s, done: !s.done } : s));
  const removeSubtask = (id) => setSubtasks(prev => prev.filter(s => s.id !== id));
  const addMessage = () => { if (!newMessage.trim()) return; setMessages(prev => [...prev, { user: "u1", text: newMessage.trim(), time: Date.now() }]); setNewMessage(""); };
  const handleSave = () => { if (!title.trim()) return; onSave({ title: title.trim(), description: description.trim(), color, priority, dueDate, column: selectedCol, assignees, subtasks, messages }); };

  const inputStyle = { width: "100%", padding: "11px 14px", borderRadius: 10, border: `1px solid ${t.inputBorder}`, background: t.inputBg, color: t.text, fontSize: 14, fontFamily: "inherit", outline: "none" };
  const stDone = subtasks.filter(s => s.done).length;

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: t.modalOverlay, display: "flex", alignItems: "flex-start", justifyContent: "center", zIndex: 999, backdropFilter: "blur(5px)", paddingTop: "4vh", overflowY: "auto" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: 740, background: t.modalBg, borderRadius: 18, boxShadow: "0 24px 80px rgba(0,0,0,0.25)", animation: "slideIn 0.25s ease", border: `1px solid ${t.cardBorder}`, overflow: "hidden", marginBottom: "4vh" }}>
        <div style={{ padding: "24px 30px 18px", borderBottom: `1px solid ${t.inputBorder}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ flex: 1 }}>
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Task title..." style={{ width: "100%", fontSize: 20, fontWeight: 700, border: "none", outline: "none", background: "transparent", color: t.text, fontFamily: "inherit", letterSpacing: "-0.02em", padding: 0, marginBottom: 8 }} autoFocus />
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Add a description..." rows={2} style={{ width: "100%", fontSize: 14, border: "none", outline: "none", background: "transparent", color: t.textSecondary, fontFamily: "inherit", lineHeight: 1.5, padding: 0, resize: "none" }} />
            </div>
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: t.textMuted, padding: 4, marginLeft: 12, flexShrink: 0 }}>{I.close()}</button>
          </div>
        </div>
        <div style={{ display: "flex", minHeight: 420 }}>
          <div style={{ flex: 1, padding: "22px 30px", overflowY: "auto", borderRight: `1px solid ${t.inputBorder}` }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 24 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <span style={{ fontSize: 10, fontWeight: 600, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.05em" }}>Status</span>
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                  {columns.map(col => <button key={col.id} onClick={() => setSelectedCol(col.id)} style={{ padding: "5px 10px", borderRadius: 7, display: "flex", alignItems: "center", gap: 5, border: `1px solid ${selectedCol === col.id ? t.accent : t.inputBorder}`, background: selectedCol === col.id ? t.accentLight : "transparent", color: selectedCol === col.id ? t.accent : t.textSecondary, fontSize: 11.5, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>{I[col.icon](11, selectedCol === col.id ? t.accent : t.textMuted)} {col.title}</button>)}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 20, marginBottom: 24 }}>
              <div>
                <span style={{ fontSize: 10, fontWeight: 600, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 6 }}>Priority</span>
                <div style={{ display: "flex", gap: 5 }}>
                  {Object.entries(PRIORITY_CONFIG).map(([key, cfg]) => <button key={key} onClick={() => setPriority(key)} style={{ padding: "6px 10px", borderRadius: 7, display: "flex", alignItems: "center", gap: 5, border: `1.5px solid ${priority === key ? cfg.color : t.inputBorder}`, background: priority === key ? (dark ? cfg.bgDark : cfg.bg) : "transparent", color: priority === key ? cfg.color : t.textSecondary, fontSize: 11.5, fontWeight: priority === key ? 700 : 500, cursor: "pointer", fontFamily: "inherit" }}>{I.flag(10, priority === key ? cfg.color : t.textMuted)} {cfg.label}</button>)}
                </div>
              </div>
              <div>
                <span style={{ fontSize: 10, fontWeight: 600, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 6 }}>Due Date</span>
                <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} style={{ ...inputStyle, width: 180, fontSize: 13, padding: "6px 10px" }} />
              </div>
            </div>
            <div style={{ marginBottom: 24 }}>
              <span style={{ fontSize: 10, fontWeight: 600, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 6 }}>Label</span>
              <div style={{ display: "flex", gap: 8 }}>
                {COLORS.map(c => <div key={c.name} onClick={() => setColor(color?.name === c.name ? null : c)} style={{ width: 28, height: 28, borderRadius: 8, background: c.value, cursor: "pointer", border: color?.name === c.name ? `2.5px solid ${t.text}` : "2.5px solid transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}>{color?.name === c.name && I.check(12, "#fff")}</div>)}
              </div>
            </div>
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, color: t.textSecondary, textTransform: "uppercase", letterSpacing: "0.06em" }}>{I.subtask(13, t.textSecondary)} Subtasks</div>
                {subtasks.length > 0 && <span style={{ fontSize: 11, fontWeight: 700, color: stDone === subtasks.length ? "#22C55E" : t.accent, fontFamily: "'Space Mono', monospace" }}>{stDone}/{subtasks.length}</span>}
              </div>
              {subtasks.length > 0 && <div style={{ height: 4, borderRadius: 3, background: t.inputBg, overflow: "hidden", marginBottom: 10 }}><div style={{ height: "100%", borderRadius: 3, width: `${(stDone / subtasks.length * 100)}%`, background: stDone === subtasks.length ? "#22C55E" : `linear-gradient(90deg, ${t.accent}, #818CF8)`, transition: "width 0.3s" }} /></div>}
              <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 8 }}>
                {subtasks.map(st => (
                  <div key={st.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 8, background: t.inputBg }}>
                    <div onClick={() => toggleSubtask(st.id)} style={{ width: 20, height: 20, borderRadius: 6, flexShrink: 0, border: st.done ? "none" : `2px solid ${t.textMuted}`, background: st.done ? "#22C55E" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>{st.done && I.check(12, "#fff")}</div>
                    <span style={{ flex: 1, fontSize: 13.5, color: st.done ? t.textMuted : t.text, textDecoration: st.done ? "line-through" : "none" }}>{st.text}</span>
                    <button onClick={() => removeSubtask(st.id)} style={{ background: "none", border: "none", cursor: "pointer", color: t.textMuted, opacity: 0.4, padding: 2 }}>{I.close(12)}</button>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <input value={newSubtask} onChange={(e) => setNewSubtask(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addSubtask()} placeholder="Add a subtask..." style={{ ...inputStyle, flex: 1, fontSize: 13 }} />
                <button onClick={addSubtask} style={{ padding: "0 16px", borderRadius: 10, border: "none", background: newSubtask.trim() ? t.accent : t.inputBg, color: newSubtask.trim() ? "#fff" : t.textMuted, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: "inherit", transition: "all 0.15s" }}>Add</button>
              </div>
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, color: t.textSecondary, textTransform: "uppercase", letterSpacing: "0.06em" }}>{I.message(13, t.textSecondary)} Activity</div>
                {messages.length > 0 && <div style={{ display: "flex", alignItems: "center", gap: 4, background: t.accent, color: "#fff", padding: "2px 8px", borderRadius: 10, fontSize: 10, fontWeight: 700, fontFamily: "'Space Mono', monospace" }}>{messages.length} {messages.length === 1 ? "update" : "updates"}</div>}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 12, maxHeight: 240, overflowY: "auto" }}>
                {messages.length === 0 && <div style={{ textAlign: "center", padding: 16, color: t.textMuted, fontSize: 13 }}>No updates yet</div>}
                {messages.map((msg, i) => { const user = TEAM_MEMBERS.find(m => m.id === msg.user); return (
                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <Avatar user={user} size={28} style={{ marginTop: 2 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 3 }}>
                        <span style={{ fontSize: 12.5, fontWeight: 600, color: t.text }}>{user?.name || "Unknown"}</span>
                        <span style={{ fontSize: 10.5, color: t.textMuted }}>{new Date(msg.time).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                      </div>
                      <div style={{ fontSize: 13, color: t.textSecondary, lineHeight: 1.45, background: t.messageBg, padding: "8px 12px", borderRadius: "2px 10px 10px 10px", border: `1px solid ${t.inputBorder}` }}>{msg.text}</div>
                    </div>
                  </div>
                ); })}
              </div>
              <div style={{ display: "flex", gap: 8, padding: "10px 12px", background: t.inputBg, borderRadius: 10, border: `1px solid ${t.inputBorder}`, alignItems: "flex-end" }}>
                <Avatar user={TEAM_MEMBERS[0]} size={26} />
                <input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addMessage()} placeholder="Write an update..." style={{ flex: 1, border: "none", outline: "none", background: "transparent", color: t.text, fontSize: 13, fontFamily: "inherit", padding: "4px 0" }} />
                <button onClick={addMessage} style={{ width: 32, height: 32, borderRadius: 8, border: "none", background: newMessage.trim() ? t.accent : "transparent", color: newMessage.trim() ? "#fff" : t.textMuted, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}>{I.send(14)}</button>
              </div>
            </div>
          </div>
          <div style={{ width: 240, padding: "22px 20px", overflowY: "auto", flexShrink: 0 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12, display: "flex", alignItems: "center", gap: 5 }}>{I.users(13, t.textMuted)} Collaborators</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {TEAM_MEMBERS.map(member => { const selected = assignees.includes(member.id); return (
                <div key={member.id}>
                  <div onClick={() => toggleAssignee(member.id)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 8px", borderRadius: 9, cursor: "pointer", transition: "all 0.15s", background: selected ? t.accentLight : "transparent", border: `1px solid ${selected ? t.accent + "40" : "transparent"}` }}>
                    <Avatar user={member} size={26} showOnline style={{ "--avatar-ring": selected ? t.accentLight : t.modalBg }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12.5, fontWeight: selected ? 600 : 400, color: selected ? t.text : t.textSecondary, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{member.name}</div>
                      <div style={{ fontSize: 10, color: t.textMuted }}>{member.role}</div>
                    </div>
                    {selected && <span style={{ color: t.accent, flexShrink: 0 }}>{I.check(12, t.accent)}</span>}
                  </div>
                  {showAssigneeMsg === member.id && (
                    <div style={{ margin: "4px 0 6px 8px", padding: 10, borderRadius: 10, background: t.inputBg, border: `1px solid ${t.inputBorder}`, animation: "fadeIn 0.15s ease" }}>
                      <div style={{ fontSize: 11, color: t.textMuted, marginBottom: 6, fontWeight: 500 }}>Send {member.name.split(" ")[0]} a note:</div>
                      <textarea value={assigneeMessage} onChange={(e) => setAssigneeMessage(e.target.value)} placeholder={`Hey ${member.name.split(" ")[0]}, adding you to this task...`} rows={2} style={{ ...inputStyle, fontSize: 12.5, padding: "8px 10px", minHeight: 50, resize: "none", marginBottom: 6 }} autoFocus />
                      <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                        <button onClick={() => setShowAssigneeMsg(null)} style={{ padding: "4px 10px", borderRadius: 6, border: `1px solid ${t.inputBorder}`, background: "transparent", color: t.textMuted, fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>Skip</button>
                        <button onClick={sendAssigneeMsg} style={{ padding: "4px 10px", borderRadius: 6, border: "none", background: t.accent, color: "#fff", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Send</button>
                      </div>
                    </div>
                  )}
                </div>
              ); })}
            </div>
          </div>
        </div>
        <div style={{ padding: "16px 30px", borderTop: `1px solid ${t.inputBorder}`, display: "flex", justifyContent: "space-between" }}>
          <div>{onDelete && <button onClick={onDelete} style={{ padding: "9px 16px", borderRadius: 10, border: `1px solid ${dark ? "#5C2020" : "#FCA5A5"}`, background: dark ? "#2D1515" : "#FEF2F2", color: "#EF4444", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6 }}>{I.trash(14, "#EF4444")} Delete</button>}</div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={onClose} style={{ padding: "9px 18px", borderRadius: 10, border: `1px solid ${t.inputBorder}`, background: "transparent", color: t.textSecondary, fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
            <button onClick={handleSave} style={{ padding: "9px 24px", borderRadius: 10, border: "none", background: `linear-gradient(135deg, ${t.accent}, ${dark ? "#C4B5FD" : "#818CF8"})`, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", boxShadow: `0 2px 12px ${t.accentGlow}`, opacity: title.trim() ? 1 : 0.5 }}>{card ? "Save Changes" : "Create Task"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
