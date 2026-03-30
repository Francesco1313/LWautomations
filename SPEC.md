# SPEC.md — Automation Logging Prototype
## LearnWorlds · Automation Activity Logging · v0.3

---

## Purpose

This file gives Claude Code full context about the prototype before making any changes.
Read this file entirely before touching any code.

---

## What this prototype is

A static React prototype for internal design validation of the **Automation Activity Logging** feature.
It is not a production build. It uses static mock data and minimal interactivity.
Its purpose is to validate the UI and hand off directly to developers — no Figma redline needed.

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Vite + React + TypeScript |
| Routing | React Router v6 |
| Styling | CSS variables from LearnWorlds design system (see STYLE.md) |
| State | React useState / useContext — no external state library |
| Data | Static TypeScript files in `/src/data/` |
| Charts | Recharts (if needed for Performance tab) |

---

## Folder structure

```
src/
  data/
    automations.ts        # List of automations with metadata
    runs.ts               # Run history for each automation
    users.ts              # User profiles with automation history
  pages/
    AutomationsList.tsx   # /  — automation list page
    Canvas.tsx            # /canvas/:id  — builder canvas (read-only)
    DetailPage.tsx        # /detail/:id  — automation detail (3 tabs)
    UserProfile.tsx       # /user/:id  — user profile page
  components/
    ...                   # Shared components
  App.tsx
  main.tsx
```

---

## Routing

| Path | Page | Notes |
|---|---|---|
| `/` | AutomationsList | List of all automations |
| `/canvas/:id` | Canvas | Builder canvas — static, read-only |
| `/detail/:id` | DetailPage | Automation detail — 3 tabs |
| `/user/:id` | UserProfile | User profile page |

---

## Navigation map

| From | Action | To |
|---|---|---|
| Automation List | Click row | Canvas |
| Automation List | Click "View activity" in ⋮ menu | Detail Page |
| Canvas | Click ← back | Automation List |
| Detail Page | Click "Edit automation" | Canvas |
| Detail Page | Click user name in Enrollment History | User Profile |
| Detail Page | Click "View in user profile" in Why panel | User Profile |
| User Profile | Click automation name in timeline | Detail Page |

---

## Mock data schemas

### automations.ts
```typescript
interface Automation {
  id: string
  name: string
  group: string | null
  trigger: string
  timesExecuted: number
  editedOn: string         // display date string
  editedBy: string
  createdOn: string
  createdBy: string
  status: 'active' | 'inactive'
  hasErrors: boolean       // drives error badge on list row
  enrolledTotal: number
  enrolledLast7Days: number | null
}
```

### runs.ts
```typescript
interface Run {
  id: string
  automationId: string
  userId: string
  userName: string
  userEmail: string
  enrolledAt: string       // ISO timestamp
  triggerEvent: string     // plain language, e.g. "User inactive for 30 days"
  status: 'completed' | 'failed' | 'in_progress' | 'exited'
  actions: RunAction[]
}

interface RunAction {
  id: string
  index: number
  name: string             // plain language action name
  outcome: 'success' | 'failed'
  timestamp: string
  errorMessage?: string    // plain language, only if failed
}
```

### users.ts
```typescript
interface User {
  id: string
  name: string
  email: string
  automationHistory: AutomationEvent[]
}

interface AutomationEvent {
  automationId: string
  automationName: string
  eventType: 'enrolled' | 'action_executed' | 'completed' | 'exited'
  timestamp: string
}
```

---

## The four surfaces

### 1. Automation List (`/`)
The main list of all automations. Entry point for everything.
- Shows: group, name, trigger, times executed, edited on, status dot, error badge
- Actions: click row → Canvas; click "View activity" in ⋮ → Detail Page

### 2. Builder Canvas (`/canvas/:id`)
Read-only view of the automation flow.
- Static nodes — no drag/drop, no adding/removing nodes
- Shows: error badge on failed nodes, user count on delay nodes
- Does NOT show: inline execution stats, metrics, charts

### 3. Automation Detail Page (`/detail/:id`)
The main logging surface. Three tabs:
- **Performance** (bonus — low priority)
- **Action Logs** (primary)
- **Enrollment History** (primary)

### 4. User Profile (`/user/:id`)
User profile with automation history.
- Shows automation events in existing activity log section
- No dedicated Automations tab in v1

---

## What this prototype does NOT do

- No drag/drop on canvas
- No adding or removing nodes on canvas
- No real API calls — all data is static
- No authentication
- No GDPR/export compliance features
- No AI-generated summaries
- No proactive admin alerts
- No cross-automation analytics dashboard
- No "Why did this user NOT enroll?" troubleshoot panel (postponed)
- No run-once/re-entry rule visibility (postponed — feature doesn't exist yet)
- Do NOT design final UI for User Activity integration — placeholder only

---

## Interactivity level

Keep interactions minimal:
- Click row → navigate
- Tab switching → show/hide tab content
- Click "Why did this enroll?" → open sidebar panel
- Filters → client-side filter of mock data array
- Everything else → static display

---

## Component annotation (for dev handoff)

After each UI task, add a comment above each major element:
```tsx
{/* DEV: use <TableComponent> from admin UI library */}
{/* DEV: use <FilterDropdown> from admin UI library */}
{/* DEV: use <StatusBadge variant="error"> */}
```
This allows developers to work directly from the prototype without Figma.
