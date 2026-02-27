/* constants.js — shared constants extracted from hackathon-v9.jsx */

export const IDEA_CATS = ["Workshopping", "Planning", "In Review"];

export const PC = { urgent: "#EF4444", high: "#F97316", medium: "#EAB308", low: "#22C55E" };

export const PL_MSGS = ["Lock in.", "Let's jam.", "Vibe check.", "Deep focus.", "In the zone.", "Flow state."];

export const IDEA_MSGS = [
  "Every great product starts with a spark.",
  "No idea is too wild — post it.",
  "Think big, ship small.",
  "The best ideas come from the team.",
];

export const CHEERS = ["Hooray!", "Nice work!", "Crushed it!", "Let's go!", "Ship it!"];

export const PL_GLOWS = ["#EC4899", "#F97316", "#22C55E", "#3B82F6", "#A855F7", "#EAB308", "#EF4444"];

/* ═══ PULSE / ENERGY TRACKING ═══ */
export const MOODS = [
  { emoji: "😤", label: "Struggling", value: 1, color: "#EF4444" },
  { emoji: "😕", label: "Low", value: 2, color: "#F97316" },
  { emoji: "😐", label: "Okay", value: 3, color: "#EAB308" },
  { emoji: "🙂", label: "Good", value: 4, color: "#3B82F6" },
  { emoji: "🔥", label: "On Fire", value: 5, color: "#22C55E" },
];

export const WLOAD_LABELS = {
  light: { emoji: "🌊", label: "Light", color: "#3B82F6" },
  balanced: { emoji: "⚖️", label: "Balanced", color: "#22C55E" },
  heavy: { emoji: "🏋️", label: "Heavy", color: "#F97316" },
  overwhelming: { emoji: "🆘", label: "Overwhelmed", color: "#EF4444" },
};

export const WORKLOAD_OPTIONS = [
  { id: "light", label: "Light", desc: "I have bandwidth", emoji: "🌊", color: "#3B82F6" },
  { id: "balanced", label: "Balanced", desc: "Right amount", emoji: "⚖️", color: "#22C55E" },
  { id: "heavy", label: "Heavy", desc: "Pushing through", emoji: "🏋️", color: "#F97316" },
  { id: "overwhelming", label: "Overwhelming", desc: "Need help", emoji: "🆘", color: "#EF4444" },
];

export const BLOCKER_OPTIONS = [
  { id: "none", label: "All clear", desc: "Nothing blocking me", emoji: "✅", color: "#22C55E" },
  { id: "waiting", label: "Waiting on someone", desc: "Dependency is holding me up", emoji: "⏳", color: "#F97316" },
  { id: "stuck", label: "Stuck on a problem", desc: "Need help or a second opinion", emoji: "🧱", color: "#EF4444" },
  { id: "tooling", label: "Tooling / access issue", desc: "Can't access what I need", emoji: "🔑", color: "#A855F7" },
];

export const SESSION_SNAPSHOTS = [
  { time: "Start", emoji: "🔥", avg: 4.2 },
  { time: "1h", emoji: "🙂", avg: 3.8 },
  { time: "2h", emoji: "🙂", avg: 3.6 },
  { time: "Now", emoji: "😐", avg: 3.2 },
];

export const VIBES = [
  { title: "Keyboard Cat", desc: "The OG internet classic", url: "https://www.youtube.com/watch?v=J---aiyznGQ", thumb: "#EAB308" },
  { title: "Dog Reviews Food", desc: "Very serious food critic", url: "https://www.youtube.com/watch?v=ig8CModJanM", thumb: "#3B82F6" },
  { title: "Lofi Girl", desc: "Chill beats to relax to", url: "https://www.youtube.com/watch?v=jfKfPfyJRdk", thumb: "#EC4899" },
  { title: "Cat vs Cucumber", desc: "Instant serotonin boost", url: "https://www.youtube.com/watch?v=cNycdfFEgBc", thumb: "#22C55E" },
  { title: "Dramatic Chipmunk", desc: "3 seconds of pure drama", url: "https://www.youtube.com/watch?v=a1Y73sPHKxw", thumb: "#F97316" },
  { title: "How Animals Eat", desc: "MisterEpicMann classic", url: "https://www.youtube.com/watch?v=qnydFmqHuVo", thumb: "#A855F7" },
];
