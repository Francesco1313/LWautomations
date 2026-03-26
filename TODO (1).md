# Automation Activity Logging — Prototype TODO

---

## STEP 0 — Replicate existing environment

**Task 0.0 — Create all static mock data files**

Create before any component work. All other tasks depend on these files.

- [x] Create `/src/data/automations.ts` — 8 automations with realistic names, triggers, execution counts, dates, status (mix of published/unpublished), at least 2 with `hasErrors: true`
- [x] Create `/src/data/runs.ts` — execution history for one automation: 10+ runs with a mix of completed, failed, in-progress, exited statuses. At least 3 failed runs with plain-language error messages. Each run has 3+ step entries
- [x] Create `/src/data/users.ts` — 3 users, each with 4+ automation history entries of mixed event types
- [x] Ask user for Figma components before proceeding to Task 0.1

---

**Task 0.1 — Project setup and routing**

- [x] Initialize Vite + React + TypeScript project
- [x] Install React Router
- [x] Create `/src/router/index.tsx` with routes: `/` (list), `/canvas/:id`, `/detail/:id`, `/user/:id`
- [x] Create empty page components as placeholders: `AutomationsListPage`, `CanvasPage`, `DetailPage`, `UserProfilePage`
- [x] Confirm `npm run dev` starts without errors

---

**Task 0.2 — Automations list page**

Ask user for Figma components before starting.

- [x] Static LW admin left sidebar (`Sidebar.tsx`): all nav items listed, Automations highlighted as active
- [x] Main content header: "Automations" title + subtitle
- [x] "Create automation" teal button (visual only)
- [x] "Templates" and "My Automations" tabs — My Automations active
- [x] Search bar + Groups dropdown (visual only)
- [x] "Showing 1-20 automations out of 23" label
- [x] Table with columns: Group name, Automation title, Triggers, Times executed, Edited on, Status dot
- [x] Populate table from `automations.ts`
- [x] Click on a row → navigate to `/canvas/:id`

---

**Task 0.3 — Canvas page: top bar and tabs**

Ask user for Figma components before starting.

- [x] Top bar: back arrow (←) → navigates to list, "Edit" and "Help" menus (visual), Undo/Redo (visual), breadcrumb "Automations / [name]" with dot and dropdown (visual), Enable toggle, teal Save button
- [x] Two tabs: "Your Automations" and "Building blocks" — clicking switches left sidebar content
- [x] Load automation name from `automations.ts` using route param `:id`

---

**Task 0.4 — "Your Automations" sidebar**

Ask user for Figma components before starting.

- [x] Header "Automations" with "+" and "✕" buttons (visual)
- [x] Search input (visual)
- [x] "Ungrouped (23)" group with collapse/expand
- [x] List of automations from `automations.ts`: name + coloured dot
- [x] Currently open automation highlighted
- [x] Three-dot menu (⋮) on hover on active row — visual only for now (expanded in Task 0.7)

---

**Task 0.5 — "Building blocks" sidebar**

Ask user for Figma components before starting.

- [x] Header "Building blocks" with "✕"
- [x] Search input (visual)
- [x] Collapsible section "Automation controls (3)": Delay, Branch, Exit condition with icons and drag handles
- [x] Collapsible section "Triggers (45)" with "USER MANAGEMENT" subsection: Tag is added, Tag is removed, User signs up, User signs in, User signup request approved/rejected, User is updated, User added to group, User removed from group — with person icons and drag handles

---

**Task 0.6 — Canvas with static nodes and sideform**

Ask user for Figma components before starting.

- [x] Canvas area: light grey background, scrollable, zoom controls bottom-left (visual)
- [x] Pre-built static automation using data from `runs.ts`: trigger node → delay → action (add tags) → branch (YES/NO) → end nodes
- [x] Each node: correct icon, label, parameter summary
- [x] Teal border on selected node
- [x] Connector lines between nodes
- [x] "End of the automation" label at bottom of each path
- [x] "+" buttons between nodes (visual only)
- [x] Exit condition node at bottom, separate
- [x] Click any node → opens `NodeSideform.tsx` on the right
- [x] Sideform shows node-specific content per type (trigger, action, delay, branch, exit)
- [x] Sideform close button works
- [x] Clicking a different node updates the sideform content

---

**Task 0.7 — Error badge and "View activity" on the list**

Ask user for Figma components before starting.

- [x] For rows where `hasErrors: true`: add a warning badge next to the status dot, visually distinct from the red unpublished dot
- [x] Tooltip on badge: "[errorCount] failed actions in the last 30 days"
- [x] Three-dot menu (⋮) on every list row: options "Edit" (→ canvas) and "View activity" (→ detail page)
- [x] "View activity" navigates to `/detail/:id`

---

## STEP 1 — Automation Detail Page *(Goals 2, 3, 4)*

**Task 1.1 — Detail page shell and navigation**

Ask user for Figma components before starting.

- [x] Breadcrumb "Automations / [name]" — "Automations" navigates back to list
- [x] Header: automation name, ON/OFF status badge, "Edit automation" button (→ canvas), "Review issues" button (visual)
- [x] Metadata row: trigger type, total enrolled, enrolled last 7 days, updated on, updated by, created on, created by — sourced from `automations.ts` and `runs.ts`
- [x] Tab bar: Performance · Enrollment History · Action Logs — Performance active by default
- [x] Each tab click switches content area

---

**Task 1.2 — Performance tab: metric cards**

Ask user for Figma components before starting.

- [x] Four cards: Total enrolled / Currently in-flow / Completed / Exited — values from `runs.ts`
- [x] Date range filter: Last 7 days / Last 30 days / Last 90 days / All time (default: Last 30 days)
- [x] Changing range updates card values (compute from mock data timestamps)
- [x] Empty state if no data in selected period: "No runs in this period"

---

**Task 1.3 — Performance tab: enrollment trend chart**

Ask user for Figma components before starting.

- [x] Line chart with two series: "Users enrolled" (solid) and "Users completed" (dashed)
- [x] X axis: dates in selected range · Y axis: count
- [x] Chart data computed from `runs.ts` based on selected date range
- [x] Empty state: "No run data for this period"

---

**Task 1.4 — Enrollment History tab: table**

Ask user for Figma components before starting.

- [x] Columns: User (name + link to `/user/:id`) / Trigger that fired / Enrolled at / Status
- [x] Status values with distinct colours: In progress / Completed / Failed / Exited
- [x] Data from `runs.ts`, most recent first
- [x] "Why did this enroll?" button in Diagnose column on every row
- [x] Empty state: "No enrollments in this period"

---

**Task 1.5 — Enrollment History tab: filters and export**

- [x] Search input: live filter by user name or email
- [ ] Date range filter
- [x] "Showing X of Y enrollments" label updates with filter
- [x] Export CSV button — visual only

---

**Task 1.6 — "Why did this enroll?" side panel**

Ask user for Figma components before starting.

- [x] Click "Why did this enroll?" → opens side panel, table remains visible
- [x] Panel content from `runs.ts`: user name + "Enrolled" badge, enrolled timestamp, trigger event in plain language, re-entry rule
- [x] "View in user profile" link → navigates to `/user/:id`
- [x] Close button dismisses the panel

---

**Task 1.7 — Action Logs tab: grouped run log**

Ask user for Figma components before starting.

- [x] Each run from `runs.ts` rendered as a group: (1) trigger row, (2) one row per step, (3) completion row
- [x] Columns: User / Diagnose / Action / Event / Time
- [x] Trigger row: event label + "Why did this enroll?" button in Diagnose column
- [x] Action row: step label + outcome badge (Success green / Failed red)
- [x] Completion row: "Completed workflow" or "Exited at step X"
- [x] Rows within same run grouped visually (subtle background or left border)

---

**Task 1.8 — Action Logs tab: failure visibility and filters**

- [x] Failed rows: red left border — identifiable when scanning without reading
- [x] Failed row click/expand: shows `errorMessage` from `runs.ts` in plain language
- [x] Filter bar: date range / All outcomes or Failed only / All action types / search by user
- [x] Export CSV button — visual only

---

## STEP 2 — Canvas: inline node stats *(Goal 5)*

**Task 2.1 — Date range control on canvas**

Ask user for Figma components before starting.

- [x] Add compact date range dropdown to canvas top bar (default: Last 30 days)
- [x] Options: Last 7 days / Last 30 days / Last 90 days / All time
- [x] Selecting a range updates all inline stats on nodes
- [x] Does not overlap or break existing top bar layout

---

**Task 2.2 — Stats chip on trigger node**

- [x] Compute "Fired X times" from `runs.ts` based on selected date range
- [x] Display as left-side chip next to the card (not inline within the card)
- [x] "Tag conditions applied" row centered within the card
- [x] If count is zero: display nothing

---

**Task 2.3 — Stats chip on action nodes**

- [x] Compute succeeded/failed counts per action step from `runs.ts`
- [x] Display "✓ X ⊘ Y" as left-side chip next to the card (subtle styling)
- [x] Red ⊘ N serves as the error/failure indicator (replaces separate error badge)
- [x] Applies to all action node types
- [x] If zero: display nothing

---

**Task 2.4 — Stats chip on delay and branch nodes**

- [x] Delay: left-side chip with users icon + count; click opens popover with "Move users to next step" button
- [x] Branch node added to canvas (trigger → action → delay → action → branch → YES/NO ends)
- [x] Branch: left-side chip showing Y:N / N:N from step outcome data in `runs.ts`
- [x] If zero: display nothing

---

**Task 2.5 — Error visibility on action nodes**

- [x] Failed step count shown via ⊘ N in the action left-side chip (red when > 0)
- [x] No separate badge — error info is part of the stats chip pattern
- [x] If zero failures: ⊘ shown in muted grey

---

## STEP 3 — User Profile: Automation Timeline *(Goal 6)*

**Task 3.1 — User profile page and Automations section**

Ask user for Figma components before starting.

- [x] Basic user profile page: name, email, basic info from `users.ts`
- [x] "Automations" tab with count badge (count from `automationHistory` in `users.ts`) — moved to dedicated tab per user decision
- [x] Tab opens by default, always visible
- [x] Empty state: "No automations have run for this user yet."

---

**Task 3.2 — Automation timeline entries**

- [x] One row per entry in `automationHistory`: automation name (link to `/detail/:id`) / event type icon + colour / timestamp
- [x] Event types: Enrolled (blue) / Action executed (grey) / Completed (teal) / Exited (amber)
- [x] Most recent first
- [x] Click automation name → `/detail/:id`

---

**Task 3.3 — Edge cases**

- [x] More than 10 entries: show 10 most recent + "View all" expands the full list
- [x] Long automation names: truncated with ellipsis, full name on hover tooltip
