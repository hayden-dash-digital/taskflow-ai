# HACKATHON FEATURE — Claude Code Implementation Guide

## What This Is

This is a handoff package to implement the **Hackathon feature** in the TaskFlow app. We've already designed and prototyped the entire feature as an interactive React component. Your job is to decompose it into proper production components, wire it to Supabase, and integrate it into the existing TaskFlow sidebar navigation.

## Files You Need

1. **`TASKFLOW_BUILD_SPEC.md`** — The full technical spec. Read Section 4.10 (Hackathon database schema), Phase 8 (build checklist), and Section 8 (file structure). The DB tables, RLS policies, and component tree are all defined here.

2. **`hackathon-v9.jsx`** — The complete interactive prototype (~1,055 lines). This is the **source of truth** for all UI, interactions, animations, and behavior. Every pixel, every modal, every animation in this file is intentional and approved. Do NOT redesign anything — implement it exactly as shown.

## How To Use The Prototype

The prototype is a single-file React component with everything inlined. Here's how it maps to production components:

### Component Decomposition

```
hackathon-v9.jsx (monolith) → split into:

App() list view          → HackathonListView.jsx
  - Live room cards      → HackathonCard.jsx (variant: "live")
  - Upcoming cards       → HackathonCard.jsx (variant: "upcoming")
  - Schedule modal       → CreateHackathonModal.jsx

Room() component         → HackathonRoom.jsx
  Header bar             → RoomHeader.jsx
  Sidebar tabs           → RoomNav.jsx
  
  Ideas tab              → IdeaBoard.jsx + IdeaNote.jsx
    - Idea detail modal  → IdeaDetailModal.jsx
    - Graveyard section  → IdeaGraveyard.jsx
  
  Tasks tab              → HackTaskBoard.jsx
    - Task detail modal  → HackTaskDetailModal.jsx
    - Add task modal     → CreateHackTaskModal.jsx
  
  Sprint tab             → HackSprintView.jsx
    - Sprint grid        → SprintSwimLane.jsx (reuse from main sprints)
    - Friction report    → HackFrictionReport.jsx (expandable cards)
    - Sprint task modal  → SprintTaskModal.jsx
  
  Goals tab              → HackGoals.jsx
  Resources tab          → ResourcePanel.jsx
  Playlists tab          → PlaylistPanel.jsx
  Meetings tab           → MeetingRoom.jsx
    - Meeting list       → MeetingCard.jsx
    - Active meeting     → ActiveMeetingView.jsx
    - Schedule modal     → CreateMeetingModal.jsx
  Breakroom tab          → BreakroomView.jsx
    - Break timer        → BreakTimer.jsx
    - Vibes section      → VibesCorner.jsx
  
  Chat panel             → RoomChat.jsx
  
  Exit confirm modal     → ExitConfirmModal.jsx

  Celebration overlay    → Celebration.jsx (confetti + text)

  Share playlist modal   → SharePlaylistModal.jsx
```

### State → Zustand Store

The prototype uses `useState` for everything. In production, create `hackathonStore.js`:

```js
// stores/hackathonStore.js
import { create } from 'zustand';

const useHackathonStore = create((set, get) => ({
  // List view
  hackathons: [],
  activeRoom: null,
  
  // Room state
  activeTab: 'ideas',
  tasks: [],
  ideas: [],
  graveyard: [],
  messages: [],
  meetings: [],
  playlists: [],
  goals: [],
  
  // UI state
  celebration: null,
  onBreak: false,
  breakStart: null,
  updateRequests: [],
  activeMeeting: null,
  meetingNotes: [],
  
  // Actions
  setActiveRoom: (room) => set({ activeRoom: room, activeTab: 'ideas' }),
  exitRoom: () => set({ activeRoom: null }),
  setTab: (tab) => set({ activeTab: tab }),
  
  moveTask: (id, status) => { /* ... */ },
  voteIdea: (id) => { /* ... */ },
  killIdea: (id) => { /* ... */ },
  reviveIdea: (id) => { /* ... */ },
  sendMessage: (text) => { /* ... */ },
  toggleBreak: () => { /* ... */ },
  requestUpdate: (taskId) => { /* ... */ },
  
  // Supabase sync
  fetchHackathons: async () => { /* ... */ },
  subscribeToRoom: (hackathonId) => { /* ... */ },
}));
```

### Data → Supabase

The prototype has hardcoded data in the `HACKS` array. In production:

1. Run the SQL migrations from Section 4.10 of the build spec
2. Replace `HACKS` with `useHackathonStore().hackathons` fetched from Supabase
3. Wire all mutations (vote, move task, send message, etc.) to Supabase
4. Set up Realtime subscriptions for: messages, tasks, ideas, participants

### Sidebar Integration

Add "Hackathons" to the main app sidebar in `Sidebar.jsx`:

```jsx
// In your sidebar nav items array, add:
{ id: 'hackathons', label: 'Hackathons', icon: 'party', path: '/hackathons' }

// The icon is a party/rocket icon — see the I.party definition in the prototype
```

When the user clicks Hackathons in the sidebar, render `HackathonListView`. When they click into a room, render `HackathonRoom` as a full-screen overlay (it takes over the viewport, hides the main sidebar).

### Route Structure

```
/hackathons                → HackathonListView
/hackathons/:id            → HackathonRoom (full-screen, own layout)
```

## Critical Implementation Details

Read the prototype carefully. Here are things that are easy to miss:

### Animations (copy from prototype's Styles component)
- `livePulse` — green dot pulsing on LIVE badges
- `roomEnter` — scale-in when entering a hackathon room
- `fadeIn` — standard entry for cards and modals
- `modalIn` — modal slide-up with scale
- `confettiFall` + `cheerPop` + `celebFade` — task completion celebration
- `graveShake` — skull icon shakes when graveyard is opened
- `coffeeFloat` + `steamRise` — break mode coffee cup animation
- `breakPop` — bounce animation when clicking Take a Break
- `hFloat` — card hover lift effect (translateY -3px, scale 1.015)
- `ideaCard:hover` — idea card lift (translateY -4px, scale 1.03)

### Celebration System
When a task moves to "done", fire confetti + random cheer text. Uses a unique `key` prop to force React remount:
```jsx
setCelebration(null);
setTimeout(() => setCelebration({ text: CHEERS[random], key: Date.now() }), 50);
```
The celebration auto-fades after 2.5s via CSS `celebFade` animation.

### Idea Board
- 3 category lanes: Workshopping → Planning → In Review
- Ideas are drag-droppable between lanes
- Ideas are sorted by votes (descending) within each lane
- Each category lane has a colored header (yellow/blue/green)
- Vote button uses Space Mono font
- Kill idea → moves to graveyard with shake animation
- Revive → moves back to Workshopping with fresh votes

### Task Board
- Cards are BOTH draggable AND have Start/Done buttons (both methods work)
- Cards have a left border colored by priority (4px solid)
- Subtask progress bar shown inline on card
- Strike-through text on completed tasks

### Sprint View
- Grid lines are 2px solid (not 1px — readability was a deliberate choice)
- Column headers are bold + color-coded (blue for In Progress, red for Blocked, green for Done, purple for Review)
- Task cards inside grid: 14px bold text, 4px priority left border
- Hover state: scale(1.04) with accent border glow

### Friction Report (below sprint grid)
- Expandable cards, NOT a flat list
- Each card has a pulsing red dot + "Blocked" label
- Collapsed: shows title, assignee, "Details" badge
- Expanded: shows description, blocker info, and "Request Update" button
- Request Update button → turns green with checkmark after clicking
- Store requested IDs in state to persist the green state

### Meeting Room
- List view shows meeting cards with Join Now (live) / RSVP (scheduled) buttons
- RSVP toggles to green "Going" checkmark
- Clicking "Join Now" enters the active meeting view:
  - Participant video grid (avatar cards with gradient backgrounds, 16:10 aspect ratio)
  - Your tile has mic + camera control icons
  - Raise Hand toggle button
  - End Meeting / Leave buttons
  - Split panel: Agenda (left) + Meeting Notes (right)
  - Meeting notes are timestamped and persist during the meeting

### Playlists
- Each playlist card gets a UNIQUE glow color on hover (PL_GLOWS array)
- The icon scales, rotates, and changes to the glow color
- Background gets a gradient tint matching the glow color
- "Share a playlist" button opens a modal with title, curator, URL, platform picker

### Breakroom
- Take a Break card is vertically centered (flexDirection: column, justifyContent: center)
- Click triggers a bounce animation (breakPop)
- When on break: coffee icon floats, steam rises, orange accent
- Break timer shows live m:ss counter next to each person who's on break
- Vibes Corner: 6 YouTube video cards with gradient play-button thumbnails

### Chat Panel
- Always visible on right side (290px width)
- Pinned messages stick to top with pin icon
- Your messages are right-aligned with accent background
- Other messages are left-aligned with white background
- Each message shows sender color on the name
- Timestamps in 12hr format
- Send button only shows accent color when input has text

### Theme
- Light mode ONLY (dark mode was deliberately removed)
- All theme values are in the `TH.light` object in the prototype
- Key colors: bg #F5F5F7, card #FFFFFF, accent #5B4AE4, text #1A1A2E
- Fonts: DM Sans (body), Space Mono (monospace accents like timers, counts)

## Step-by-Step Build Order

1. **Database first** — Run hackathon table migrations from Section 4.10
2. **Store** — Create `hackathonStore.js` with all state + Supabase queries
3. **Sidebar** — Add Hackathons tab to main navigation
4. **List view** — `HackathonListView` + `HackathonCard` + `CreateHackathonModal`
5. **Room shell** — `HackathonRoom` + `RoomHeader` + `RoomNav` + `RoomChat`
6. **Tabs one by one:**
   - Ideas (most complex — drag, vote, graveyard, detail modal)
   - Tasks (drag + buttons, celebration, add task modal)
   - Sprint (grid, friction report with Request Update)
   - Goals (progress bars, expandable cards)
   - Meetings (list + active meeting room with notes)
   - Resources (expandable cards with links)
   - Playlists (unique glow colors, share modal)
   - Breakroom (break toggle, timer, vibes corner)
7. **Realtime** — Wire up Supabase subscriptions for messages, tasks, ideas
8. **Notifications** — Hackathon invite, starting soon, mentions

## Testing Checklist

- [ ] Can create and schedule a hackathon from list view
- [ ] Can RSVP to upcoming hackathons
- [ ] Can enter a live room and see all 8 tabs
- [ ] Ideas: drag between lanes, vote, open detail, kill/revive, comment
- [ ] Tasks: drag between columns, click Start/Done, celebration fires, add new task
- [ ] Sprint: grid renders with all members, hover effect, friction cards expand, Request Update works
- [ ] Goals: progress bars update when tasks complete, expandable detail
- [ ] Meetings: RSVP toggles, Join Now enters meeting room, notes work, Raise Hand works
- [ ] Resources: expand/collapse, links open in new tab
- [ ] Playlists: unique glow colors per card, share playlist creates new card
- [ ] Breakroom: break toggle with animation, timer counts, Vibes Corner links work
- [ ] Chat: send messages, pinned messages at top, auto-scroll
- [ ] Exit: confirmation modal, can rejoin after leaving
- [ ] Celebration: fires on every task completion with unique animation
- [ ] Timer: ticks in real-time in room header
- [ ] All animations from the Styles component are implemented
