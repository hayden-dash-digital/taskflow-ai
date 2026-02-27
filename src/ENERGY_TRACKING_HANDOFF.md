# ENERGY TRACKING — Claude Code Implementation Guide

## What This Is

A team energy/momentum tracking system for TaskFlow. Users do a daily 30-second check-in, and the app surfaces team health, blockers, workload imbalances, and AI-generated insights. Integrates into both the main dashboard and hackathon rooms.

## Files You Need

1. **`TASKFLOW_BUILD_SPEC.md`** — Already in your project root
2. **`energy-tracking-v2.jsx`** — The complete interactive prototype. Source of truth for all UI, interactions, and behavior. Implement exactly as shown.

## Component Decomposition

```
energy-tracking-v2.jsx (monolith) → split into:

Daily Check-in Flow       → DailyCheckin.jsx
  Step 0: Energy picker   → EnergyPicker.jsx
  Step 1: Workload        → WorkloadPicker.jsx
  Step 2: Blockers        → BlockerPicker.jsx
  Step 3: Focus/Wins      → FocusInput.jsx
  Progress dots           → CheckinProgress.jsx
  Post-checkin summary    → CheckinSummary.jsx

Team Pulse card           → TeamPulse.jsx
  Expandable user row     → PulseUserRow.jsx

AI Insight card           → EnergyInsight.jsx

Energy × Velocity chart   → EnergyVelocityChart.jsx

Individual Trends         → IndividualTrends.jsx
  User pulse history      → UserPulseHistory.jsx

Hackathon Room Widgets:
  Room header pulse bar   → RoomPulseBar.jsx
  Quick pulse prompt      → QuickPulse.jsx
  Session energy timeline → SessionEnergy.jsx
  Individual check-in     → RoomCheckinPanel.jsx
  Actionable signals      → ActionableSignals.jsx
```

## Database Schema

Add these tables to Supabase:

```sql
-- Daily pulse check-ins
create table pulse_checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  team_id uuid references teams(id) on delete cascade,
  energy int not null check (energy between 1 and 5),
  workload text check (workload in ('light','balanced','heavy','overwhelming')),
  blocker text check (blocker in ('none','waiting','stuck','tooling')),
  blocker_detail text,
  focus text,
  hackathon_id uuid references hackathons(id) on delete set null,
  created_at timestamptz default now()
);

-- Index for fast daily lookups
create index idx_pulse_checkins_daily on pulse_checkins (team_id, created_at desc);
create index idx_pulse_checkins_user on pulse_checkins (user_id, created_at desc);

-- RLS
alter table pulse_checkins enable row level security;

-- Team members can see all pulses from their team
create policy "Team members can view pulses"
  on pulse_checkins for select
  using (team_id in (select team_id from team_members where user_id = auth.uid()));

-- Users can insert their own pulses
create policy "Users can insert own pulse"
  on pulse_checkins for insert
  with check (user_id = auth.uid());

-- Users can update their own pulse from today only
create policy "Users can update today's pulse"
  on pulse_checkins for update
  using (user_id = auth.uid() and created_at::date = current_date);
```

## Zustand Store

```js
// stores/pulseStore.js
import { create } from 'zustand';

const usePulseStore = create((set, get) => ({
  todayCheckin: null,       // Current user's checkin for today
  teamPulses: [],           // All team members' checkins for today
  history: [],              // 14-day history for charts
  checkStep: 0,             // 0=energy, 1=workload, 2=blockers, 3=focus, 4=done
  
  // Check-in flow
  setEnergy: (val) => set({ checkStep: 1, todayCheckin: { ...get().todayCheckin, energy: val } }),
  setWorkload: (val) => set({ checkStep: 2, todayCheckin: { ...get().todayCheckin, workload: val } }),
  setBlocker: (type, detail) => set({ todayCheckin: { ...get().todayCheckin, blocker: type, blocker_detail: detail } }),
  setFocus: (text) => set({ todayCheckin: { ...get().todayCheckin, focus: text } }),
  advanceStep: () => set(s => ({ checkStep: s.checkStep + 1 })),
  
  submitCheckin: async () => {
    const checkin = get().todayCheckin;
    // Insert into Supabase
    // Then refresh teamPulses
    set({ checkStep: 4 });
  },
  
  redoCheckin: () => set({ checkStep: 0, todayCheckin: null }),
  
  // Data fetching
  fetchTeamPulses: async (teamId) => { /* Supabase query for today's pulses */ },
  fetchHistory: async (teamId, days=14) => { /* Supabase query for history */ },
  
  // Realtime
  subscribeToTeamPulses: (teamId) => { /* Supabase realtime subscription */ },
}));
```

## Where It Lives in the App

### Main Dashboard
Add an "Energy" or "Pulse" tab in the sidebar. When clicked, show:
1. Daily Check-in prompt (top) — if not done today, show the 4-step flow
2. Team Pulse card + AI Insight card (side by side)
3. Energy × Velocity chart (14-day timeline)
4. Individual Trends (clickable team member cards with sparklines)

### Hackathon Rooms
Integrate into the existing room:
1. **Room header** — add the Team Vibe bar (inline emoji chips per person + avg)
2. **Quick pulse** — if user hasn't checked in, show slim prompt inside the room
3. **Session Energy** — track mood snapshots at intervals (start, 1h, 2h, etc.)
4. When a check-in is submitted inside a hackathon room, store the `hackathon_id`

## Critical Implementation Details

### Check-in Flow UX
- 4 steps with animated transitions (fadeUp)
- Progress dots at top showing current step, completed steps filled with accent color
- Each step animates in when the previous one completes
- Skip buttons on Steps 2 (blocker detail) and 3 (focus) — not everyone wants to type
- "~30 sec" label next to progress dots sets expectations
- After completion: summary card shows energy emoji + workload badge + blocker/focus inline

### Mood System
```
Value 1: 😤 Struggling  (#EF4444 red)
Value 2: 😕 Low         (#F97316 orange)
Value 3: 😐 Okay        (#EAB308 yellow)
Value 4: 🙂 Good        (#3B82F6 blue)
Value 5: 🔥 On Fire     (#22C55E green)
```

### Workload Options
```
light:        🌊 "I have bandwidth"     (#3B82F6)
balanced:     ⚖️ "Right amount"         (#22C55E)
heavy:        🏋️ "Pushing through"      (#F97316)
overwhelming: 🆘 "Need help"            (#EF4444)
```

### Blocker Types
```
none:    ✅ "All clear"
waiting: ⏳ "Waiting on someone" — shows text input for details
stuck:   🧱 "Stuck on a problem" — shows text input for details
tooling: 🔑 "Tooling / access issue" — shows text input for details
```

### Team Pulse Card
- Each user row is CLICKABLE — expands to show focus, blocker detail, full status
- Workload badges shown inline (colored pills: 🌊 Light, ⚖️ Balanced, etc.)
- "Blocked" red badge if user has a blocker
- Bottom bar: team average emoji + numeric score, plus warning pills ("2 overloaded", "1 blocked")
- Users who haven't checked in show "Pending" grey pill

### AI Insight Logic (priority order)
1. High output + low energy → "Burnout risk"
2. Multiple people overwhelmed → "Redistribute tasks"
3. Multiple people blocked → "Clear blockers before they cascade"
4. High energy + high output → "Ride the wave"
5. Energy trending down → "Worth a team check-in"
6. Default → "Sustainable pace"

### Energy × Velocity Chart
- 14-day timeline
- Green bars = tasks completed per day
- Purple line + dots = team energy average
- Hover any day to see tooltip with date, energy emoji, and task count
- The KEY insight: when the line and bars diverge, something is wrong
- Y-axis: 1–5 (energy scale), bars scaled to max task count

### Individual Trends
- 5 team member cards side by side
- Each shows: avatar, name, 7-day average emoji, numeric avg, mini sparkline (7 bars)
- Click to expand → 14-day detailed view with emoji + colored bars per day

### Hackathon Room Integration
- Room header: "Team Vibe" bar with emoji chips per person
- Session Energy: timeline of mood snapshots at intervals (Start → 1h → 2h → Now)
- Connected by a line to show trajectory
- If energy drops, auto-shows a yellow warning: "Energy dropping — might be a good time for a break"
- Actionable Signals: generated from check-in data, not hardcoded
  - High energy person → "good candidate for extra tasks"
  - Blocked person → "clear this before it cascades"
  - Overwhelmed person → "consider redistributing"
  - Low energy person → "suggest lighter tasks or a break"

### Animations
- `fadeUp` — card entry animation
- `emojiPop` — emoji bounces in after logging (scale 0.3 → 1.3 → 1 with rotation)
- `checkPop` — checkmark scales in on completion
- `insightSlide` — insight card slides up with slight scale
- `.mood-btn:hover` — emoji buttons scale to 1.35x
- `.hFloat` — standard card hover lift
- Progress dots transition their fill color smoothly

## One-line Summary
One-tap energy check-in → workload → blockers → focus → team sees everything → AI flags problems → leaders act faster.
