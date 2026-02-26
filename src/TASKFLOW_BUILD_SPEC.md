# TaskFlow — Full Build Specification

> This document is a complete technical spec for building TaskFlow, a goal-driven task manager with collaborative sprints, hackathon war rooms, and an ambient AI assistant. Hand this to Claude Code and say "build this."

---

## 1. Product Overview

**TaskFlow** is a personal-first, team-ready task manager built for agency operators and small teams. It combines a visual Kanban board, goal tracking with progress visualization, collaborative sprints with bottleneck detection, hackathon war rooms for focused team sessions, and an ambient AI assistant.

**Target User:** Agency owner / small team lead who manages projects across clients and internal work. Needs something more visual and intelligent than Trello, less bloated than Jira.

**Core Differentiators:**
- Goals as first-class citizens with visual progress tracking
- Collaborative sprints with swim lanes and friction detection
- Hackathon mode — a virtual war room for focused team collaboration with its own task board, idea board, chat, and playlists
- AI assistant that's ambient by default, chat when needed
- Premium design — not generic SaaS, think Linear meets Dribbble

---

## 2. Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + Vite |
| Styling | Tailwind CSS (utility classes) |
| Charts/Viz | Recharts or D3 for goal/sprint visualizations |
| State | Zustand (lightweight, no Redux boilerplate) |
| Database | Supabase (Postgres + Realtime + Row Level Security) |
| Auth | Supabase Auth (email + OAuth) |
| Hosting | Vercel (free tier to start) |
| AI | Anthropic Claude API (sonnet for ambient, opus for deep analysis) |
| Notifications | Supabase Realtime + browser notifications |
| Drag & Drop | @dnd-kit/core (accessible, performant) |
| Fonts | DM Sans (body) + Space Mono (monospace accents) |

---

## 3. Design System

### 3.1 Theme

The app supports **light and dark mode** toggled by the user. Use CSS variables for all theme tokens.

**Light Mode:**
```
--bg: #F5F5F7
--sidebar: #FFFFFF
--sidebar-border: #E8E8ED
--card: #FFFFFF
--card-border: #E8E8ED
--column-bg: #EDEDF0
--text: #1A1A2E
--text-secondary: #6B6B80
--text-muted: #9CA3AF
--accent: #5B4AE4
--accent-light: #E8E5FF
--accent-glow: rgba(91, 74, 228, 0.15)
--input-bg: #F5F5F7
--input-border: #E0E0E5
```

**Dark Mode:**
```
--bg: #0F0F14
--sidebar: #16161E
--sidebar-border: #2A2A35
--card: #1A1A24
--card-border: #2A2A35
--column-bg: #141419
--text: #E8E8F0
--text-secondary: #8888A0
--text-muted: #555566
--accent: #9B8AFB
--accent-light: #1E1D30
--accent-glow: rgba(155, 138, 251, 0.15)
--input-bg: #141419
--input-border: #2A2A35
```

### 3.2 Typography

- **Body:** DM Sans, 13–14px, weight 400–600
- **Monospace accents** (counts, stats, badges): Space Mono, weight 700
- **Headings:** DM Sans, 18–22px, weight 700, letter-spacing: -0.03em

### 3.3 Component Patterns

- **Cards:** border-radius 12px, 4px left border for priority color, float effect on hover (translateY(-4px) scale(1.02)) with elevated shadow
- **Buttons:** border-radius 10px, gradient accent for primary actions, dashed border for add buttons
- **Modals:** 740px wide two-column layout, border-radius 18px, backdrop blur
- **Avatars:** Circular with initials, colored by user, online indicator dot
- **Priority Badges:** Colored flag icon + label, urgent gets pulse animation and red background tint on the card itself
- **No emojis anywhere** — all icons are consistent SVG line icons (Lucide icon style)

### 3.4 Animations

- **Card hover:** `transform: translateY(-4px) scale(1.02)` with `cubic-bezier(0.175, 0.885, 0.32, 1.275)`
- **Card drop into new column:** bounce-in keyframe (`cardLand`)
- **Card drop into Done:** celebratory bounce (`doneBounce`) + confetti particle system
- **Urgent cards:** subtle pulse animation on the URGENT banner
- **Modal open:** scale(0.96) → scale(1) with fade
- **General:** fadeIn for new elements entering the DOM

---

## 4. Data Models (Supabase)

### 4.1 Users
```sql
create table users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  name text not null,
  initials text not null,
  avatar_url text,
  color text not null default '#5B4AE4',
  role text,
  is_online boolean default false,
  created_at timestamptz default now()
);
```

### 4.2 Workspaces
```sql
create table workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_id uuid references users(id),
  created_at timestamptz default now()
);

create table workspace_members (
  workspace_id uuid references workspaces(id),
  user_id uuid references users(id),
  role text default 'member', -- owner, admin, member
  primary key (workspace_id, user_id)
);
```

### 4.3 Boards & Columns
```sql
create table boards (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references workspaces(id),
  name text not null,
  created_at timestamptz default now()
);

create table columns (
  id uuid primary key default gen_random_uuid(),
  board_id uuid references boards(id),
  title text not null,
  icon text not null, -- icon identifier string
  position integer not null,
  created_at timestamptz default now()
);
```

### 4.4 Cards (Tasks)
```sql
create table cards (
  id uuid primary key default gen_random_uuid(),
  board_id uuid references boards(id),
  column_id uuid references columns(id),
  title text not null,
  description text,
  priority text not null default 'medium', -- urgent, high, medium, low
  color_label text, -- hex color value
  due_date date,
  position integer not null,
  created_by uuid references users(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table card_assignees (
  card_id uuid references cards(id) on delete cascade,
  user_id uuid references users(id),
  assigned_at timestamptz default now(),
  primary key (card_id, user_id)
);
```

### 4.5 Subtasks
```sql
create table subtasks (
  id uuid primary key default gen_random_uuid(),
  card_id uuid references cards(id) on delete cascade,
  text text not null,
  is_done boolean default false,
  position integer not null,
  created_at timestamptz default now()
);
```

### 4.6 Activity / Messages
```sql
create table card_messages (
  id uuid primary key default gen_random_uuid(),
  card_id uuid references cards(id) on delete cascade,
  user_id uuid references users(id),
  text text not null,
  created_at timestamptz default now()
);
```

### 4.7 Goals
```sql
create table goals (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references workspaces(id),
  title text not null,
  description text,
  target_date date,
  created_by uuid references users(id),
  created_at timestamptz default now()
);

create table goal_cards (
  goal_id uuid references goals(id) on delete cascade,
  card_id uuid references cards(id) on delete cascade,
  primary key (goal_id, card_id)
);
```

### 4.8 Sprints
```sql
create table sprints (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references workspaces(id),
  name text not null,
  goal text,
  start_date date not null,
  end_date date not null,
  status text default 'active', -- planning, active, completed
  created_at timestamptz default now()
);

create table sprint_members (
  sprint_id uuid references sprints(id) on delete cascade,
  user_id uuid references users(id),
  primary key (sprint_id, user_id)
);

create table sprint_tasks (
  id uuid primary key default gen_random_uuid(),
  sprint_id uuid references sprints(id) on delete cascade,
  title text not null,
  assignee_id uuid references users(id),
  status text not null default 'todo', -- todo, progress, blocked, review, done
  priority text not null default 'medium',
  blocked_by uuid references sprint_tasks(id),
  days_in_status integer default 0,
  is_stalled boolean default false,
  position integer not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

### 4.9 Notifications
```sql
create table notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  type text not null, -- assigned, mentioned, sprint_update, blocked, message, hackathon_invite, hackathon_start
  title text not null,
  body text,
  card_id uuid references cards(id),
  sprint_task_id uuid references sprint_tasks(id),
  hackathon_id uuid,
  is_read boolean default false,
  created_at timestamptz default now()
);
```

### 4.10 Hackathons
```sql
create table hackathons (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references workspaces(id),
  name text not null,
  description text,
  theme text,                        -- optional theme/focus area
  scheduled_start timestamptz not null,
  scheduled_end timestamptz not null,
  actual_start timestamptz,          -- null until leader kicks it off
  actual_end timestamptz,            -- null until leader ends it
  status text default 'scheduled',   -- scheduled, live, completed, cancelled
  created_by uuid references users(id),
  cover_color text default '#5B4AE4', -- accent color for the hackathon room
  created_at timestamptz default now()
);

create table hackathon_participants (
  hackathon_id uuid references hackathons(id) on delete cascade,
  user_id uuid references users(id),
  rsvp_status text default 'pending', -- pending, accepted, declined
  role text default 'participant',    -- organizer, participant
  joined_at timestamptz,              -- when they actually entered the room
  primary key (hackathon_id, user_id)
);

-- Idea board: sticky-note style cards for brainstorming
create table hackathon_ideas (
  id uuid primary key default gen_random_uuid(),
  hackathon_id uuid references hackathons(id) on delete cascade,
  user_id uuid references users(id),
  content text not null,
  color text default '#EAB308',       -- sticky note color
  votes integer default 0,
  position_x float default 0,         -- free-form board positioning
  position_y float default 0,
  created_at timestamptz default now()
);

create table hackathon_idea_votes (
  idea_id uuid references hackathon_ideas(id) on delete cascade,
  user_id uuid references users(id),
  primary key (idea_id, user_id)
);

-- Task board within the hackathon (separate from main board)
create table hackathon_tasks (
  id uuid primary key default gen_random_uuid(),
  hackathon_id uuid references hackathons(id) on delete cascade,
  title text not null,
  description text,
  assignee_id uuid references users(id),
  status text default 'todo',         -- todo, progress, done
  priority text default 'medium',
  position integer not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Hackathon goals (mini-goals within the session)
create table hackathon_goals (
  id uuid primary key default gen_random_uuid(),
  hackathon_id uuid references hackathons(id) on delete cascade,
  title text not null,
  is_completed boolean default false,
  position integer not null,
  created_at timestamptz default now()
);

-- Linked playlists and resources
create table hackathon_resources (
  id uuid primary key default gen_random_uuid(),
  hackathon_id uuid references hackathons(id) on delete cascade,
  type text not null,                 -- playlist, link, document, figma, github
  title text not null,
  url text not null,
  added_by uuid references users(id),
  created_at timestamptz default now()
);

-- Real-time chat within the hackathon room
create table hackathon_messages (
  id uuid primary key default gen_random_uuid(),
  hackathon_id uuid references hackathons(id) on delete cascade,
  user_id uuid references users(id),
  text text not null,
  is_pinned boolean default false,
  created_at timestamptz default now()
);

-- Sprints created within a hackathon
create table hackathon_sprints (
  id uuid primary key default gen_random_uuid(),
  hackathon_id uuid references hackathons(id) on delete cascade,
  sprint_id uuid references sprints(id) on delete cascade,
  primary key (hackathon_id, sprint_id)
);
```

---

## 5. App Architecture & Views

### 5.1 Layout

```
┌──────────────┬──────────────────────────────────────┐
│              │  Header (title, stats, filters, +new) │
│   Sidebar    ├──────────────────────────────────────┤
│   (260px)    │                                      │
│              │         Main Content Area             │
│  - Logo      │  (Board / Goals / Sprints /           │
│  - Search    │   Hackathons / AI)                    │
│  - Nav       │                                      │
│  - Depts     │                                      │
│  - Team      │                                      │
│  - Stats     │                                      │
│  - Theme     │                                      │
└──────────────┴──────────────────────────────────────┘
```

### 5.2 Sidebar

Contains:
1. **Logo + app name** ("TaskFlow")
2. **Search bar** — filters cards across the board by title/description
3. **Workspace nav:**
   - Board (with urgent task count badge)
   - Goals (with active goal count)
   - Sprints (with blocked task count badge)
   - Hackathons (with "LIVE" badge when one is active, or upcoming count)
   - AI Assistant
4. **Departments** — All Teams, Design, Engineering, Marketing (filterable)
5. **Team Members** — Collapsible list with avatars, online status, roles, active task counts. Click a member to filter the board to their tasks only. "Clear filter" link when active.
6. **Quick Stats** — Total tasks, in progress, completed, with progress bar and percentage
7. **Theme Toggle** — Light/Dark mode button

### 5.3 Board View (Primary View)

**Header:** Page title, task stats summary, priority filter dropdown, team avatar stack, "+ New Task" button.

**Priority Filter:** Dropdown with Urgent/High/Medium/Low options, each showing a count of active tasks. Active filter shows colored state. Clearable.

**Columns:** 5 default columns rendered horizontally:
- Backlog (inbox icon)
- To Do (circle icon)
- In Progress (loader icon, orange)
- Review (eye icon)
- Done (check-circle icon, green)

Each column has:
- Icon + title + card count badge
- Urgent count badge (if any non-done urgent tasks)
- Dashed "+" button (fills solid accent on hover)
- Scrollable card list

**Cards on the board show:**
- 4px left border colored by priority (urgent=red, high=orange) or color label
- **Urgent banner** across the top with pulse animation when priority is urgent
- Priority badge (flag icon + label text)
- Color label strip
- Title (struck through if Done)
- Description preview (2-line clamp)
- **Inline subtask checklist** — up to 3 subtasks visible with mini checkboxes, "+N more" for extras, progress bar underneath
- Footer row: due date (red if overdue), activity count as highlighted pill badge, assignee avatar stack
- **Hover effect:** Card floats up (-4px) and scales (1.02) with elevated shadow
- **Drop animation:** Bounce-in when moved to new column
- **Done animation:** Celebratory bounce + confetti particles when moved to Done

**Drag & Drop:** Cards can be dragged between columns. Drop zone appears as dashed accent border with "Drop here" text. Card becomes semi-transparent while dragging.

### 5.4 Card Detail Modal

Opens when clicking any card. **No tabs** — everything is inline in a two-column layout.

**Left column (flexible width):**
1. **Title** — large inline-editable input (20px, bold)
2. **Description** — inline-editable textarea below title
3. **Properties row:**
   - Status (column selector buttons with icons)
   - Priority (flag buttons: Urgent/High/Medium/Low with colors)
   - Due date picker
   - Color label swatches
4. **Subtasks section** — section header with count, progress bar, full checklist with checkboxes (click to toggle), remove button per item, "Add a subtask" input + Add button
5. **Activity section** — section header with update count badge (accent pill), scrollable message list with avatars + timestamps + chat bubbles, message composer at bottom with avatar + input + send button

**Right column (240px):**
- **Collaborators panel** — full team member list, click to toggle assignment
- When adding a new collaborator, a message box slides open below their name: "Send [Name] a note:" with textarea, Skip/Send buttons. The message posts to the activity feed automatically.

**Footer:** Delete button (left, red), Cancel + Save Changes buttons (right, accent gradient)

### 5.5 Goals View

**Layout:** Goal cards arranged in a grid or list.

**Each Goal shows:**
- Title + description
- Target date
- Attached task count
- **Circular progress ring** or **horizontal progress bar** that fills as attached tasks move to Done
- Percentage complete (large, monospace)
- List of attached tasks with status indicators
- Ability to attach/detach tasks from the board

**Goal Detail:**
- Edit title/description/target date
- Browse and attach board tasks
- Visual breakdown: tasks by status (mini horizontal stacked bar)
- Milestone markers if using nested goals

**Key Behavior:** When a card that's attached to a goal moves to "Done" on the board, the goal progress updates in real-time. This should feel satisfying — maybe the ring/bar animates smoothly.

### 5.6 Sprint View

This is the most visual and distinctive view. It shows a **swim lane matrix** of team members × status columns.

**Sprint Header:**
- Sprint icon + name + goal description
- Team member avatars
- **4 metric cards:**
  - Progress: % done (done/total), green
  - Time Elapsed: % of sprint duration passed, turns red if ahead of progress by 15%+
  - Blocked: count of blocked tasks, red if > 0
  - Stalled: count of tasks with no progress, orange if > 0
- **Dual-layer timeline bar:**
  - Bottom layer: time elapsed (subtle)
  - Top layer: task completion progress (accent → green gradient)
  - Vertical marker for "today"
  - Start/end date labels

**Swim Lane Board:**

```
              │ To Do  │ In Progress │ Blocked │ In Review │ Done   │
──────────────┼────────┼─────────────┼─────────┼───────────┼────────┤
 You (Lead)   │ task   │ task        │         │           │ task   │
 30px avatar  │        │ task        │         │           │ task   │
 progress bar │        │             │         │           │        │
──────────────┼────────┼─────────────┼─────────┼───────────┼────────┤
 Sarah (Des)  │        │ task        │         │ task      │ task   │
──────────────┼────────┼─────────────┼─────────┼───────────┼────────┤
 Marcus (Dev) │        │ task        │ task    │           │ task   │
──────────────┼────────┼─────────────┼─────────┼───────────┼────────┤
```

**Column headers** have status icon, label, task count. Columns with unusually high concentration of tasks get a red **"Friction"** badge and highlighted background — this instantly shows where the bottleneck is.

**Member lane (left column):**
- Avatar with online indicator
- Name + role
- Personal progress bar (red if they have blocked tasks)
- "X/Y done" + blocked count

**Task cards in the grid:**
- 4px left border colored by status: blocked=red, stalled=orange, done=green, else priority color
- Blocked tasks show pulsing "BLOCKED" banner + dependency chip: link icon + "Waiting on" + blocker's avatar + blocker task title
- Stalled tasks show "STALLED Xd" banner in orange
- Priority badge (compact)
- Hover: card lifts + scale + shadow, highlights related dependency cards with accent border
- Click to expand: shows dependency chain (visual breadcrumb trail of blocker → blocker → blocker with avatars and status icons), days in status, assignee info

**Friction Report** (bottom of sprint view):
- Red alert banner listing every blocked and stalled task
- Each row shows: status icon, assignee avatar, task title, arrow, blocker info, days stuck
- Blocked tasks: "→ blocked by [avatar] [task title] [Xd]"
- Stalled tasks: "stalled Xd — no progress"

### 5.7 AI Assistant View

**Ambient mode (always active across all views):**
- Smart nudges that appear as subtle toast-style notifications or inline hints:
  - "This task has been deferred 4 times — break it into smaller pieces?"
  - "Based on current velocity, Sprint 1 will miss its deadline by 2 days"
  - "3 tasks are blocked — consider reassigning CI/CD pipeline to unblock the chain"
  - "You have 5 tasks due this week but 2 are still in Backlog"

**Chat mode (dedicated view):**
- Chat interface in the main content area
- User can ask:
  - "Prioritize my tasks for this week"
  - "Break down [goal name] into subtasks"
  - "Summarize sprint progress for standup"
  - "What's blocking the most tasks right now?"
  - "Create a task for [description]" → AI creates it with suggested priority, column, assignees
- AI has full context of all boards, goals, sprints, and team data
- Responses can include actionable buttons ("Create this task", "Move to In Progress", etc.)

**Implementation:** Use Anthropic Claude API. Send structured context (current board state, sprint data, goal progress) as system prompt. Use function calling for task creation/modification.

### 5.8 Hackathon View

Hackathons are **focused collaboration rooms** — a separate zone within TaskFlow where a team can lock in together. Think of it as a virtual war room with its own task board, idea board, chat, playlists, and sprints.

#### 5.8.1 Hackathon List (Default view when clicking "Hackathons" in nav)

Shows all hackathons in three sections:

**LIVE NOW** (top, prominent):
- Any hackathon with `status: 'live'` shows as a large card with a pulsing green "LIVE" indicator and glowing border
- Shows: name, description, elapsed time (live clock), participant avatars with online dots, "Enter Room" button (primary accent, large)
- The entire card should feel energetic — maybe a subtle animated gradient border or glow

**UPCOMING** (middle):
- Cards for scheduled hackathons, sorted by start date
- Shows: name, theme, scheduled date/time, duration, organizer avatar, participant count, RSVP status
- Participants see "Accepted" / "Pending" badge on their invite
- Each card has RSVP buttons: "Accept" (green) / "Decline" (muted)
- Organizer sees an edit button

**PAST** (bottom, collapsed by default):
- Completed hackathons with summary stats
- Shows: name, date, duration, participant count, tasks completed, ideas generated
- Click to view a read-only archive of the hackathon room

**"+ New Hackathon" button** in the header (organizer/admin only):
- Modal to create: name, description, theme/focus, start datetime, end datetime, invite participants (from team list)
- Sends notification to all invited participants

#### 5.8.2 Hackathon Room (The War Room)

When you click "Enter Room" on a live hackathon, the **entire app transforms**. The normal sidebar and board disappear. You enter an immersive, focused environment:

**Room Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│  [← Exit]  🟢 LIVE  Hackathon Name       ⏱ 02:34:15  👥 6 │
├────────┬──────────────────────────────────┬─────────────────┤
│        │                                  │                 │
│  Room  │       Active Tab Content         │    Chat         │
│  Nav   │   (Tasks / Ideas / Sprints /     │    Panel        │
│        │    Goals / Resources)            │   (always       │
│ [Tasks]│                                  │    visible)     │
│ [Ideas]│                                  │                 │
│ [Sprint│                                  │                 │
│ [Goals]│                                  │                 │
│ [Links]│                                  │                 │
│        │                                  │                 │
│ ────── │                                  │                 │
│ Particip                                  │                 │
│ ants   │                                  │                 │
│ (avatars                                  │                 │
│  w/     │                                  │                 │
│ online) │                                  │                 │
└────────┴──────────────────────────────────┴─────────────────┘
```

**Room Header (always visible):**
- "← Exit" button to return to main TaskFlow (with confirmation if hackathon is live)
- Pulsing green "LIVE" badge
- Hackathon name
- Live timer showing elapsed time since start (HH:MM:SS, ticking in real-time)
- Participant count with avatar stack
- "End Hackathon" button (organizer only, requires confirmation)

**Room Left Nav (icon tabs):**
- Tasks (kanban icon)
- Ideas (lightbulb icon)
- Sprints (bolt icon)
- Goals (target icon)
- Resources (link icon)
- Below: participant list with avatars, online status, and current active tab indicator ("Sarah is on Ideas")

**Room Chat Panel (right side, always visible, ~300px wide):**
- Real-time chat specific to this hackathon
- Messages show avatar, name, timestamp, text
- Support for pinning important messages (pin icon, pinned messages stick to top)
- @mention participants with autocomplete
- Typing indicators ("Marcus is typing...")
- Chat messages persist so you can scroll back
- Subtle notification sound toggle

#### 5.8.3 Hackathon Task Board

A simplified Kanban board scoped to the hackathon. Three columns: **To Do → In Progress → Done**

- Cards are simpler than the main board: title, assignee avatar, priority badge
- Drag & drop between columns
- Quick-add input at the top of each column
- Done cards trigger a mini celebration (smaller than main board confetti — maybe just a checkmark animation)
- Tasks created here are separate from the main board (they live only in the hackathon context)

#### 5.8.4 Idea Board

A **freeform canvas** for brainstorming. Think virtual sticky notes:

- Click anywhere on the canvas to add a sticky note
- Notes are colored cards (yellow, pink, blue, green, purple — user picks)
- Each note shows: content text, author avatar, vote count
- **Voting:** Click a thumbs-up on any note to upvote. Each person gets one vote per idea. Ideas sort/glow by vote count.
- Notes are **draggable** on the canvas — free-form positioning, not a grid
- Can cluster related ideas together spatially
- Optional: group notes by drawing a lasso/boundary around a cluster and naming it
- Real-time: other participants see notes appear and move in real-time

#### 5.8.5 Hackathon Sprints

Participants can create **mini-sprints** within the hackathon to align on focused bursts:

- Uses the same sprint data model and swim lane view from the main Sprints feature (Section 5.6)
- Scoped to hackathon participants only
- Shorter timeframes (hours instead of weeks)
- Same friction detection and dependency tracking
- Sprint can reference tasks from the hackathon task board

#### 5.8.6 Hackathon Goals

Quick goals for the session — simpler than main Goals:

- List of goals with checkboxes
- Drag to reorder priority
- Each goal has a title and a done/not-done state
- Progress count: "3/7 goals completed"
- Visual progress bar at the top of the goals section
- When all goals are checked off, show a celebration animation
- Goals are visible in the room header as a compact progress indicator

#### 5.8.7 Resources Panel

A shared link library for the hackathon:

- **Playlists:** Paste Spotify/Apple Music/YouTube Music playlist URLs. Show as embedded players or styled link cards with a play icon. Multiple playlists can be linked.
- **Links:** Any URL — Figma files, GitHub repos, Google Docs, reference articles. Shown as rich link previews (title, favicon, domain).
- **Type badges:** Each resource has a type badge (playlist, figma, github, doc, link)
- Anyone in the hackathon can add resources
- Resources persist after the hackathon ends (part of the archive)

#### 5.8.8 Hackathon Lifecycle

1. **Scheduled:** Organizer creates hackathon with date/time. Invites sent as notifications. Participants RSVP.
2. **Live:** Organizer clicks "Start Hackathon" when it's time. Status flips to `live`. All accepted participants see "LIVE" badge in sidebar nav. Timer starts. Room becomes accessible.
3. **In Progress:** Participants enter the room, collaborate on tasks/ideas/sprints. Chat is active. Real-time updates everywhere.
4. **Completed:** Organizer clicks "End Hackathon" (with confirmation). Room becomes read-only archive. Summary stats are generated:
   - Duration
   - Tasks completed
   - Ideas generated (+ most voted idea)
   - Goals achieved
   - Messages sent
   - Participant engagement (who contributed most)

#### 5.8.9 Hackathon Notifications

- **Invite received:** "Lisa invited you to 'Q1 Product Hackathon' on Mar 15"
- **Hackathon starting soon:** "Hackathon 'Q1 Product Hackathon' starts in 15 minutes" (push notification)
- **Hackathon is LIVE:** "🟢 Q1 Product Hackathon is now live — Enter Room" (with direct link)
- **Mentioned in chat:** "@You: Can you look at the auth flow idea?"
- **All goals completed:** "All 7 goals completed in Q1 Product Hackathon!"

#### 5.8.10 Design Notes for Hackathon Mode

- The room should feel **distinctly different** from the normal TaskFlow interface. Consider:
  - The hackathon's `cover_color` as an accent throughout the room
  - A slightly darker or more saturated background to create a "focused" atmosphere
  - Subtle animated gradient or particle effects in the room header to convey energy
  - The LIVE badge should pulse with a green glow
  - The elapsed timer uses Space Mono and ticks in real-time
- When entering the room, use a **full-screen transition** animation (zoom/fade) to reinforce that you're entering a different mode
- The "← Exit" should feel deliberate — maybe a slide-out confirmation panel ("Leave the hackathon room?")
- Chat should feel fast and lightweight — optimistic UI, messages appear instantly before server confirms
- Idea board should have a slightly textured/cork-board background to differentiate from the clean card UI elsewhere

---

## 6. Real-Time & Notifications

### 6.1 Supabase Realtime

Subscribe to changes on:
- `cards` table (card moved, created, edited)
- `card_messages` table (new activity)
- `sprint_tasks` table (status changes, blocked status)
- `subtasks` table (completion toggle)
- `hackathon_messages` table (live chat in hackathon rooms)
- `hackathon_ideas` table (new ideas, votes, position changes)
- `hackathon_tasks` table (task movement in hackathon boards)
- `hackathon_goals` table (goal completion)
- `hackathon_participants` table (join/leave, RSVP changes)
- `hackathons` table (status changes: scheduled → live → completed)

When another user moves a card or posts a message, it should update live without page refresh.

### 6.2 Notifications

Trigger notifications for:
- **Assigned to a task** — "Lisa added you to 'Build board view'"
- **Mentioned in activity** — "@You: Can you review this?"
- **Task blocked** — "CI/CD Pipeline is now blocked by Drag & Drop Engine"
- **Sprint update** — "Sprint 1 is 60% complete with 3 days remaining"
- **Task moved to Done** — "[Assignee] completed 'Design System'"
- **Hackathon invite** — "Lisa invited you to 'Q1 Product Hackathon' on Mar 15"
- **Hackathon starting soon** — "Hackathon starts in 15 minutes" (15 min before scheduled start)
- **Hackathon is LIVE** — "🟢 Q1 Product Hackathon is now live — Enter Room"
- **Hackathon chat mention** — "@You in hackathon chat: Can you look at the auth flow?"
- **Hackathon goals complete** — "All goals completed in Q1 Product Hackathon!"

Show as:
- In-app notification bell with unread count
- Browser push notifications (with permission)
- Notification dropdown panel

### 6.3 Assignee Ping

When adding a collaborator to a task, the user can optionally write a message. This:
1. Posts to the task's activity feed as "@[Name]: [message]"
2. Triggers a notification to the assignee
3. The notification links directly to the task

---

## 7. Phased Build Plan

### Phase 1: Foundation (Week 1–2)
- [ ] Project setup: Vite + React + Tailwind + Supabase
- [ ] Design system: theme tokens, CSS variables, light/dark mode toggle
- [ ] Icon library: all SVG icons as React components
- [ ] Avatar component with online status
- [ ] Supabase schema: users, workspaces, boards, columns, cards
- [ ] Auth: signup/login with Supabase Auth
- [ ] Sidebar layout with navigation

### Phase 2: Board View (Week 2–3)
- [ ] Column rendering with card counts
- [ ] Card component with all visual states (priority, urgent, overdue, done)
- [ ] Drag & drop with @dnd-kit
- [ ] Card hover float animation
- [ ] Card land/done bounce animations + confetti
- [ ] Priority filter dropdown
- [ ] Search across tasks
- [ ] Team member filter in sidebar
- [ ] "+ New Task" button per column (dashed style)

### Phase 3: Card Detail Modal (Week 3–4)
- [ ] Two-column modal layout (740px)
- [ ] Inline title + description editing
- [ ] Status/priority/date/color selectors
- [ ] Subtasks: add, toggle, remove, progress bar
- [ ] Activity feed: message list + composer
- [ ] Collaborator panel with assignment toggle
- [ ] Assignee message popup on add
- [ ] Subtask inline preview on board card

### Phase 4: Goals (Week 4–5)
- [ ] Goals CRUD
- [ ] Attach/detach cards to goals
- [ ] Progress ring/bar visualization
- [ ] Goal list/grid view
- [ ] Real-time progress updates when cards complete

### Phase 5: Sprints (Week 5–7)
- [ ] Sprint CRUD with date range
- [ ] Sprint task management (add, assign, set dependencies)
- [ ] Swim lane matrix view (members × statuses)
- [ ] Blocked/stalled status detection
- [ ] Dependency chain visualization
- [ ] Friction detection (column load analysis)
- [ ] Friction Report panel
- [ ] Sprint metrics cards (progress, time, blocked, stalled)
- [ ] Dual-layer timeline bar

### Phase 6: Real-Time & Notifications (Week 7–8)
- [ ] Supabase Realtime subscriptions
- [ ] Notification system (in-app + browser push)
- [ ] Live card movement across users
- [ ] Live activity feed updates
- [ ] Notification bell with unread count

### Phase 7: AI Assistant (Week 8–10)
- [ ] Anthropic API integration
- [ ] Ambient nudge system (context-aware suggestions)
- [ ] Chat interface in AI view
- [ ] Function calling for task creation/modification
- [ ] Sprint summary generation
- [ ] Priority recommendations

### Phase 8: Hackathons (Week 10–13)
- [ ] Hackathon CRUD — create, schedule, invite participants
- [ ] Hackathon list view (Live Now / Upcoming / Past sections)
- [ ] RSVP system with notifications
- [ ] Hackathon room — immersive full-screen layout with room transition animation
- [ ] Room header with live timer (ticking clock), participant avatars, LIVE badge
- [ ] Room chat panel — real-time messaging, @mentions, pinned messages, typing indicators
- [ ] Hackathon task board — simplified 3-column Kanban (To Do / In Progress / Done)
- [ ] Idea board — freeform canvas with draggable sticky notes, voting, color coding
- [ ] Hackathon goals — checkbox list with progress bar and completion celebration
- [ ] Resources panel — linked playlists (Spotify/YouTube embeds), Figma, GitHub, docs
- [ ] Hackathon sprints — create mini-sprints using existing sprint infrastructure
- [ ] Participant presence — show who's in the room, what tab they're viewing
- [ ] Hackathon lifecycle — scheduled → live → completed flow with organizer controls
- [ ] Post-hackathon archive — read-only room with summary stats
- [ ] Hackathon notifications — invite, starting soon (15min), live, mentions, goals complete
- [ ] Realtime subscriptions for all hackathon tables

---

## 8. File Structure

```
taskflow/
├── public/
├── src/
│   ├── components/
│   │   ├── ui/                    # Design system primitives
│   │   │   ├── Avatar.jsx
│   │   │   ├── Button.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── PriorityBadge.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Confetti.jsx
│   │   │   └── Icons.jsx          # All SVG icons
│   │   ├── layout/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Header.jsx
│   │   │   └── AppLayout.jsx
│   │   ├── board/
│   │   │   ├── BoardView.jsx
│   │   │   ├── Column.jsx
│   │   │   ├── TaskCard.jsx
│   │   │   ├── CardModal.jsx
│   │   │   ├── SubtaskList.jsx
│   │   │   ├── ActivityFeed.jsx
│   │   │   ├── CollaboratorPanel.jsx
│   │   │   └── PriorityFilter.jsx
│   │   ├── goals/
│   │   │   ├── GoalsView.jsx
│   │   │   ├── GoalCard.jsx
│   │   │   ├── GoalDetail.jsx
│   │   │   └── ProgressRing.jsx
│   │   ├── sprints/
│   │   │   ├── SprintView.jsx
│   │   │   ├── SprintHeader.jsx
│   │   │   ├── SprintMetrics.jsx
│   │   │   ├── SwimLane.jsx
│   │   │   ├── SprintTaskCard.jsx
│   │   │   ├── DependencyChain.jsx
│   │   │   ├── FrictionReport.jsx
│   │   │   └── TimelineBar.jsx
│   │   ├── ai/
│   │   │   ├── AssistantView.jsx
│   │   │   ├── ChatInterface.jsx
│   │   │   └── AmbientNudge.jsx
│   │   ├── hackathons/
│   │   │   ├── HackathonListView.jsx    # List of all hackathons (live/upcoming/past)
│   │   │   ├── HackathonCard.jsx        # Card for list view (RSVP, status, etc.)
│   │   │   ├── CreateHackathonModal.jsx # Create/schedule a new hackathon
│   │   │   ├── HackathonRoom.jsx        # The immersive war room layout
│   │   │   ├── RoomHeader.jsx           # Live timer, participant count, exit
│   │   │   ├── RoomNav.jsx              # Left tab navigation within room
│   │   │   ├── RoomChat.jsx             # Real-time chat panel (right side)
│   │   │   ├── HackTaskBoard.jsx        # Simplified 3-column kanban
│   │   │   ├── IdeaBoard.jsx            # Freeform sticky note canvas
│   │   │   ├── IdeaNote.jsx             # Individual sticky note component
│   │   │   ├── HackGoals.jsx            # Checkbox goal list with progress
│   │   │   ├── ResourcePanel.jsx        # Playlists, links, docs
│   │   │   ├── HackSprintView.jsx       # Mini-sprint within hackathon
│   │   │   ├── ParticipantList.jsx      # Online participants with tab indicators
│   │   │   └── HackathonArchive.jsx     # Read-only post-hackathon summary
│   │   └── notifications/
│   │       ├── NotificationBell.jsx
│   │       └── NotificationPanel.jsx
│   ├── stores/                     # Zustand stores
│   │   ├── boardStore.js
│   │   ├── goalStore.js
│   │   ├── sprintStore.js
│   │   ├── hackathonStore.js
│   │   ├── authStore.js
│   │   ├── themeStore.js
│   │   └── notificationStore.js
│   ├── lib/
│   │   ├── supabase.js            # Supabase client
│   │   ├── anthropic.js           # AI client
│   │   └── utils.js
│   ├── hooks/
│   │   ├── useRealtime.js
│   │   ├── useCards.js
│   │   ├── useSprints.js
│   │   ├── useHackathon.js
│   │   └── useNotifications.js
│   ├── styles/
│   │   ├── globals.css
│   │   └── animations.css
│   ├── App.jsx
│   └── main.jsx
├── supabase/
│   └── migrations/                 # SQL migration files
├── .env.example
├── tailwind.config.js
├── vite.config.js
└── package.json
```

---

## 9. Key UX Details (Don't Miss These)

1. **Card float on hover** — Every card lifts and scales on hover. This is a signature interaction. Use `cubic-bezier(0.175, 0.885, 0.32, 1.275)` for the spring feel.

2. **Confetti on Done** — When a card moves to the Done column (via drag or modal status change), fire a confetti particle system. 40 particles, mixed shapes (circles + rectangles), 8 colors, gravity-based fall animation.

3. **Urgent is unmissable** — Urgent cards get: red left border, tinted red background, full-width "URGENT" banner with flag icon and pulse animation. The column header shows an urgent count. The board header shows total urgent count.

4. **Subtasks on the card** — Show up to 3 subtask items as a mini checklist directly on the board card with tiny checkboxes. Show "+N more" if extras exist. Show progress bar below.

5. **Activity badge** — On the board card, the message count should be a highlighted pill (accent background) not plain text, so users notice when there's activity.

6. **The + button** — Column add buttons should be dashed-border squares that transition to solid accent-filled on hover. They should clearly read as "add something here."

7. **Assignee messaging** — When you add someone as a collaborator, a small message box animates open so you can ping them. This is a small detail that makes collaboration feel intentional.

8. **Sprint friction detection** — Automatically detect which status columns have unusual task pile-ups and label them "Friction" with a red badge. This is computed, not manual.

9. **Dependency visualization** — In sprints, hovering a task highlights tasks it blocks or is blocked by. Clicking expands to show the full dependency chain as a visual breadcrumb.

10. **No tabs in the card modal** — Everything is visible at once. Subtasks and activity are always showing when you open a card. No hidden content.

11. **Hackathon room is a separate world** — When entering a live hackathon, the entire UI transforms. The normal sidebar/board disappear. Use a full-screen zoom/fade transition to reinforce that you're entering a focused zone. The room should feel energetic and distinct from the rest of the app.

12. **Live hackathon energy** — The LIVE badge pulses with a green glow. The elapsed timer ticks in real-time with Space Mono font. Consider a subtle animated gradient or particle effect in the room header. The hackathon's cover_color should accent the entire room.

13. **Idea board texture** — The freeform idea board should have a slightly textured background (cork-board, canvas, or subtle dot grid) to differentiate it from the clean card UI. Sticky notes should feel tangible with slight rotation, drop shadows, and color variety.

14. **Chat is always visible in hackathon** — The right-side chat panel stays open the entire time you're in the room. It's the team's lifeline. Make it fast with optimistic UI (messages appear before server confirms). Show typing indicators. Allow pinning important messages.

15. **Hackathon exit is deliberate** — The "← Exit" button should trigger a confirmation panel ("Leave the hackathon room?") to prevent accidental exits. This reinforces the focused nature of the space.

---

## 10. Environment Variables

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_ANTHROPIC_API_KEY=your_anthropic_api_key
```

---

## 11. Reference Prototype

A working React prototype of the board, card modal, and sprint view exists as a single-file artifact. It contains:
- All theme tokens (light/dark)
- All SVG icons
- Complete board view with drag & drop
- Card modal with inline subtasks, activity, collaborator panel
- Full sprint swim lane view with friction detection
- Confetti system
- Sample data demonstrating all states

Use this prototype as the visual reference for what the production app should look and feel like. The component structure, color values, spacing, and interaction patterns in the prototype are the source of truth for design.

---

## 12. Deployment

1. Push to GitHub
2. Connect repo to Vercel
3. Set environment variables in Vercel dashboard
4. Supabase project should be created with all migrations run
5. Enable Supabase Realtime on relevant tables
6. Configure Supabase Auth providers (email + Google OAuth)
7. Set up Row Level Security policies so users only see their workspace data

---

*This spec represents the full vision. Build it phase by phase, starting with the foundation and board view. Each phase should be deployable and usable on its own. The prototype file (task-manager-v4.jsx) is the design reference.*
