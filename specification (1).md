# Automation Activity Logging — Software Specification

## Overview

A front-end-only prototype of the LearnWorlds Automations environment, built to explore and validate the Automation Activity Logging feature. The prototype replicates the existing automations UI (list page + canvas builder) and adds new observability surfaces: an Automation Detail Page, inline canvas stats, and a user profile automation timeline.

The prototype uses static mock data and is intended for internal design validation only — not for production use.

---

## Tech Stack

- **Frontend framework:** React with Vite + TypeScript
- **Data:** Static TypeScript files (no backend, no API)
- **State management:** React `useState` / `useContext`
- **Styling:** Defined via Figma components provided in chat via MCP. Before implementing any UI component, ask the user to provide the relevant Figma designs or components via MCP
- **Routing:** React Router (for navigation between list, canvas, detail page, user profile)

---

## Figma / Design Components

Before implementing any new UI component or screen, always ask the user:

> "Before I build this component, do you have a Figma design or component to share via MCP?"

Do not proceed with visual implementation until the user has either shared a design or explicitly confirmed to proceed without one.

---

## Mock Data

All data is static and defined in TypeScript files inside `/src/data/`. These files are created before any component work begins (see Task 0.0 in the TODO).

### `/src/data/automations.ts`
List of automations shown in the list page and sidebar.

```ts
{
  id: string
  name: string
  group: string | null         // e.g. "Not assigned"
  trigger: string              // e.g. "user is enrolled in a course"
  timesExecuted: number
  editedOn: string             // ISO date string
  status: "published" | "unpublished"
  hasErrors: boolean           // true if failed actions in last 30 days
  errorCount: number
}
```

### `/src/data/runs.ts`
Execution history for a single automation (used in the Detail Page).

```ts
{
  id: string
  userId: string
  userName: string
  userEmail: string
  enrolledAt: string           // ISO date string
  triggerEvent: string         // e.g. "User enrolled in course"
  reentryRule: string          // e.g. "Run once per user"
  status: "completed" | "in_progress" | "failed" | "exited"
  steps: [
    {
      type: "trigger" | "action" | "completion"
      label: string            // e.g. "Triggered from: enrollment created"
      outcome: "success" | "failed"
      errorMessage: string | null   // plain language, never JSON
      timestamp: string
    }
  ]
}
```

### `/src/data/users.ts`
User profiles used in the user profile automation timeline.

```ts
{
  id: string
  name: string
  email: string
  automationHistory: [
    {
      automationId: string
      automationName: string
      eventType: "enrolled" | "action_executed" | "completed" | "exited"
      timestamp: string
    }
  ]
}
```

---

## Application Structure

```
/src
  /data
    automations.ts
    runs.ts
    users.ts
  /components
    /layout
      Sidebar.tsx              // Static LW admin sidebar
      TopBar.tsx               // Canvas top bar
    /automations-list
      AutomationsList.tsx      // Main list table
      AutomationRow.tsx        // Single row with error badge + three-dot menu
    /canvas
      Canvas.tsx               // Canvas area
      CanvasNode.tsx           // Single node (trigger, action, delay, branch, exit)
      NodeSideform.tsx         // Right config panel
      BuildingBlocksSidebar.tsx
      AutomationsSidebar.tsx
    /detail
      DetailPage.tsx
      PerformanceTab.tsx
      EnrollmentHistoryTab.tsx
      ActionLogsTab.tsx
      WhyDidEnrollPanel.tsx
    /profile
      UserProfile.tsx
      AutomationsTimeline.tsx
  /pages
    AutomationsListPage.tsx
    CanvasPage.tsx
    DetailPage.tsx
    UserProfilePage.tsx
  /router
    index.tsx
```

---

## Pages & Navigation

| From | Action | To |
|------|--------|----|
| AutomationsListPage | Click automation row | CanvasPage |
| AutomationsListPage | Click "View activity" in three-dot menu | DetailPage |
| CanvasPage | Click "← back" | AutomationsListPage |
| DetailPage | Click "Edit automation" | CanvasPage |
| DetailPage | Click user name in Enrollment History | UserProfilePage |
| DetailPage | Click "View in user profile" in Why panel | UserProfilePage |
| UserProfilePage | Click automation name in timeline | DetailPage |

---

## Features

### Existing environment (replicated)

**Automations list page**
- Static LW admin sidebar with all nav items, Automations active
- Table: Group name, Automation title, Triggers, Times executed, Edited on, Status dot
- Search bar and Groups filter (visual only)
- Click row → navigates to canvas

**Canvas builder**
- Top bar: back arrow, Edit/Help menus, breadcrumb, Enable toggle, Save button
- Two tabs: Your Automations / Building blocks
- Your Automations sidebar: list of automations with coloured dots, active row highlighted
- Building blocks sidebar: Automation controls (Delay, Branch, Exit condition) + Triggers list
- Canvas: static pre-built automation with trigger, delay, action, branch, exit condition nodes
- Click node → opens right sideform with node-specific configuration
- Sideform varies by node type

### New features

**Automation list — health signals** *(Goal 1)*
- Error badge on rows where `hasErrors: true` — visually distinct from the status dot
- Tooltip on badge: "X failed actions in the last 30 days"
- "View activity" in three-dot menu → navigates to Detail Page

**Automation Detail Page** *(Goals 2, 3, 4)*
- Accessible from "View activity" in the list, never through the canvas
- Header: name, ON/OFF status, "Edit automation" button, "Review issues" button
- Metadata row: trigger type, total enrolled, enrolled last 7 days, updated on/by, created on/by
- Three tabs: Performance · Enrollment History · Action Logs
- *Performance tab:* four metric cards (Total enrolled, In-flow, Completed, Exited) + line chart (enrolled vs completed over time) + date range filter
- *Enrollment History tab:* table (User, Trigger fired, Enrolled at, Status) + "Why did this enroll?" button per row + search + date filter + CSV export (visual only)
- *Action Logs tab:* grouped runs (trigger row + action rows + completion row) + failure visibility (red indicator + plain-language error) + filters + CSV export (visual only)

**Why did this enroll? panel**
- Opens as a side panel over the detail page
- Shows: user name + Enrolled badge, timestamp, trigger event in plain language, re-entry rule
- "View in user profile" link
- Close button

**Canvas — inline node stats** *(Goal 5)*
- Date range dropdown in top bar (default: Last 30 days)
- Each node shows inline execution stats:
  - Trigger: "Fired X times"
  - Action: "✓ X  ⊘ Y"
  - Delay: "X users waiting here"
  - Branch: "X → YES / Y → NO"
- If all stats are zero: nothing shown (clean empty state)
- Error badge (red, top-right) on nodes with failed executions
- Hover tooltip: "Y failed executions in selected period"

**User Profile — Automation Timeline** *(Goal 6)*
- Dedicated "Automations" section on admin user profile page
- Count badge in section header
- Chronological list: automation name (linked to Detail Page) / event type (icon + colour) / timestamp
- Most recent at top
- More than 10 events: show 10 + "View all"
- Empty state: "No automations have run for this user yet."
- Click automation name → Detail Page pre-filtered to that user

---

## Out of Scope

- No backend, no API, no authentication
- No real data — all mock
- No drag-and-drop in the canvas (nodes are static)
- No ability to create, edit or delete automations in the prototype
- No email preview or test send
- No real file export (CSV export buttons are visual only)
- No mobile responsiveness
