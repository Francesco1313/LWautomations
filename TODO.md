# TODO.md — Automation Logging Prototype
## LearnWorlds · Automation Activity Logging · v0.3

---

## Before you start

1. Read `SPEC.md` fully before touching any code.
2. Read `STYLE.md` fully before writing any CSS or inline styles.
3. Work one step at a time. Stop after each step and wait for review before proceeding.
4. After every UI task, add `{/* DEV: ... */}` comments above major elements indicating which component from the admin UI library should be used in production.
5. Never invent colours or typography — always use the tokens from `STYLE.md`.
6. Never add drag/drop, node editing, or real API calls.

---

## Step 1 — Automation List

### Task 1.0 — Review existing list
- [x]
Read the current `AutomationsList.tsx` and note what already exists.
Do not modify anything yet. Report back what columns and interactions are currently implemented.

### Task 1.1 — Add error badge to list rows
- [x]
For every automation where `hasErrors === true`, display a red error badge next to the status dot.
- Badge style: circular, `background: var(--red)`, white `!` icon or count, positioned inline with the status column.
- Badge is always visible — no hover required.
- `{/* DEV: use <StatusBadge variant="error"> */}`

### Task 1.2 — Add "Show automations with errors" filter
- [x]
Add a filter control above the table (alongside existing filters).
- Label: "Show automations with errors"
- Behaviour: when active, the table shows only rows where `hasErrors === true`
- Not active by default
- Consistent with existing filter style (see `STYLE.md` → Filter dropdown)
- `{/* DEV: use <FilterDropdown> */}`

### Task 1.3 — Add "View activity" entry point
- [x]
In the ⋮ menu for each row, add a "View activity" option.
- Clicking it navigates to `/detail/:id` for that automation
- Keep the existing "Edit" option that navigates to `/canvas/:id`
- `{/* DEV: use <DropdownMenu> from admin UI library */}`

### Task 1.4 — Verify navigation
- [x]
Confirm that:
- Clicking a row still navigates to `/canvas/:id`
- Clicking "View activity" in ⋮ navigates to `/detail/:id`
- Both routes exist in `App.tsx`

---

## Step 2 — Automation Detail Page — Shell & Header

### Task 2.0 — Review existing Detail Page
- [x]
Read the current `DetailPage.tsx` and note what already exists.
Do not modify anything yet. Report back current structure.

### Task 2.1 — Build page header
- [x]
At the top of the detail page, display a metadata bar with:
- Trigger name
- Enrolled Total (all-time count)
- Enrolled Last 7 Days (null shows as "—")
- Updated On
- Updated By
- Created On
- Created By
- Style: table-like row, `background: var(--grey7)`, `border-bottom: 1px solid var(--grey5)`
- `{/* DEV: use <MetadataBar> or equivalent admin UI component */}`

### Task 2.2 — Build status indicators
- [x]
Below the page title, show two inline status pills:
- "Workflow is ON" (teal dot + teal text) when automation is active
- "Workflow without issues" (teal dot + teal text) when `hasErrors === false`
- "Workflow has errors" (red dot + red text) when `hasErrors === true`
- `{/* DEV: use <StatusPill> */}`

### Task 2.3 — Build tab navigation
- [x]
Three tabs: **Performance** · **Action logs** · **Enrollment history**
- Default selected tab: Action logs
- Active tab style: `border-bottom: 2px solid var(--teal)`, bold, teal text
- Inactive tab style: grey text, no border
- Clicking tab switches content below — no page navigation
- `{/* DEV: use <TabNav> from admin UI library */}`

### Task 2.4 — Add "Edit automation" button
- [x]
Top-right of the page: primary button "Edit automation" → navigates to `/canvas/:id`
- Style: `background: var(--teal)`, white text
- `{/* DEV: use <Button variant="primary"> */}`

---

## Step 3 — Action Logs Tab

### Task 3.0 — Review existing Action Logs
- [x]
Note what already exists in the Action Logs tab. Report back before modifying.

### Task 3.1 — Redesign table structure
- [x]
Replace any existing Action Logs layout with the following structure:
- Rows are grouped by user run
- Each group contains:
  1. Trigger row (first row of the group)
  2. One row per action with its outcome
  3. Completion row (last row of the group)
- Columns: **Contact** | **Action** | **Event** | **Time**
- The Contact column shows user name + email only on the trigger row of each group; subsequent rows in the same group leave Contact empty
- `{/* DEV: use <DataTable> with grouped rows */}`

### Task 3.2 — Visual differentiation of triggers vs actions
- [x]
- Trigger row: `border-left: 4px solid var(--teal)`, slightly lighter background
- Action row: `border-left: 4px solid var(--grey4)`
- Failed row: `border-left: 4px solid var(--red)`, `background: var(--light-red)`
- Completion row: standard row, show "Completed workflow · Success" in Event column in teal
- Do NOT add an explicit "Trigger" or "Action" label column — the visual differentiation is sufficient

### Task 3.3 — Failed rows and error display
- [x]
For failed action rows:
- Show "Action failed · Failed" in the Event column, where "Failed" is in `var(--red)`
- Show a "Show details" link inline
- Clicking "Show details" expands an error detail row below, showing the plain-language error message
- Error message style: `background: var(--light-red)`, `border-left: 4px solid var(--red)`, `color: var(--grey1)`, small font
- `{/* DEV: use <ExpandableRow> or <InlineAlert variant="error"> */}`

### Task 3.4 — "Why did this enroll?" on trigger row
- [x]
On the trigger row for each group, show a small "Why did this enroll?" button or link.
- Clicking it opens the sidebar panel (see Task 3.6)
- Do NOT add a separate "Diagnose" column — this replaces it
- `{/* DEV: use <TextButton> or <IconButton> */}`

### Task 3.5 — Filters
- [x]
Above the table, show:
- Search input: "Search by user..."
- Outcome filter dropdown: "All outcomes" / "Failed only"
- Row count: "X log entries" (right-aligned)
- Export CSV button (right-aligned, secondary style)
- `{/* DEV: use <SearchInput>, <FilterDropdown>, <Button variant="secondary"> */}`

### Task 3.6 — "Why did this enroll?" sidebar panel
- [x]
Sliding panel from the right side. Shows:
- User name + email + "Enrolled" badge
- Enrolled At: timestamp
- Trigger Event: plain language trigger name (with bullet)
- Re-entry Rule: plain language (e.g. "Once every 30 days" — use placeholder text for now since feature doesn't exist yet; display "N/A — re-entry rules not yet implemented" in grey italic)
- "View in user profile ↗" link → navigates to `/user/:userId`
- Close button (×) top right
- Style: white background, `border-left: 1px solid var(--grey5)`, `box-shadow: -5px 0 15px rgba(0,0,0,0.08)`
- `{/* DEV: use <SidePanel> or <Drawer> from admin UI library */}`

---

## Step 4 — Enrollment History Tab

### Task 4.0 — Review existing Enrollment History
- [x]
Note what already exists. Report back before modifying.

### Task 4.1 — Redesign table structure
- [x]
One row per user enrollment. Columns:
- **Contact** — user name (linked to `/user/:id`) + email below
- **Trigger** — plain language trigger event (with bullet prefix, teal colour)
- **Enrolled at** — date + time
- **Status** — status badge
- `{/* DEV: use <DataTable> */}`

### Task 4.2 — Status badges
- [x]
| Status | Text | Text colour | Background |
|---|---|---|---|
| In progress | In progress | `--in-progress` | `--light-orange` |
| Completed | Completed | `--completed` | `--light-green` |
| Failed | Failed | `--red` | `--light-red` |
| Exited | Exited | `--grey3` | `--grey6` |

- `{/* DEV: use <StatusBadge> */}`

### Task 4.3 — "Why did this enroll?" CTA per row
- [x]
Each row has a "Why did this enroll?" button in the Contact column (or as a separate action column).
- Clicking it opens the same sidebar panel described in Task 3.6
- Panel content is populated from the run data for that enrollment
- `{/* DEV: use <TextButton> */}`

### Task 4.4 — Filters and export
- [x]
Above the table:
- Search input: "Search by name or email..."
- Date range filter (default: last 30 days)
- Row count: "Showing X of Y enrollments" (right-aligned)
- Export CSV button (right-aligned, secondary style)
- `{/* DEV: use <SearchInput>, <DateRangePicker>, <Button variant="secondary"> */}`

### Task 4.5 — User name link destination
- [x]
Clicking a user name in this table navigates to `/user/:id`.
Add a comment in the code:
```tsx
{/* 
  OPEN QUESTION: This link currently navigates to /user/:id (UserProfile page).
  With the dedicated Automations tab removed from v1 scope, the final destination 
  on the user profile is undefined — likely the Activity tab once automation events 
  are integrated there. Update once OQ-07 is resolved.
*/}
```

---

## Step 5 — Performance Tab (Bonus)

### Task 5.0 — Note on priority
- [x]
This tab is low priority ("bonus"). It can ship without it. Implement only if Step 1–4 are complete and stable.

### Task 5.1 — Metric cards
- [x]
Four metric cards in a row:
- Total Enrolled
- Currently In-Flow
- Completed
- Exited via exit condition
- Style: white card, `border: 1px solid var(--grey5)`, `border-radius: 8px`, `box-shadow: 0 5px 12px rgba(0,0,0,0.05)`
- `{/* DEV: use <MetricCard> */}`

### Task 5.2 — Enrollment over time chart
- [x]
Line chart with two series: "Enrolled" (teal) and "Completed" (green).
- Use Recharts
- Date range filter above the chart (default: last 30 days)
- `{/* DEV: use <LineChart> from Recharts or equivalent admin chart component */}`

---

## Step 6 — Canvas — Error Visibility

### Task 6.0 — Review existing Canvas
- [x]
Note what already exists on the canvas. Report back before modifying.

### Task 6.1 — Error badge on failed nodes
- [x]
For any action node where the run data shows at least one failure:
- Display a small red badge on the node (top-right corner)
- Badge: circular, `background: var(--red)`, white `!`, small size
- No tooltip required — clicking the node can show the detail page
- `{/* DEV: use <ErrorBadge> on node component */}`

### Task 6.2 — User count on delay nodes
- [x]
For delay nodes, display a small count showing how many users are currently waiting.
- Label: "X waiting" below the node label
- Style: `color: var(--grey3)`, `font-size: 12px`
- Use mock data to show a realistic number
- `{/* DEV: use inline label on <DelayNode> component */}`

### Task 6.3 — Confirm nothing else is shown on canvas
- [x]
Verify that no other execution metrics, stats, or charts are shown on the canvas.
Only the error badge (Task 6.1) and the delay user count (Task 6.2) should be present.

---

## Step 7 — User Profile — Activity Placeholder

### Task 7.0 — Review existing User Profile
- [ ]
Note what already exists on the User Profile page. Report back before modifying.

### Task 7.1 — Add automation events placeholder
- [ ]
In the User Profile activity section, add automation events as a new event type in the existing activity list.
Each event shows:
- Automation name (linked to `/detail/:automationId`)
- Event type: "Enrolled" / "Action executed" / "Completed" / "Exited"
- Timestamp
- Use a small automation icon or teal tag to distinguish automation events from other activity events

Add this comment prominently in the code:
```tsx
{/*
  PENDING ALIGNMENT — OQ-07
  Automation events are directionally confirmed to appear in the User Activity log.
  The exact UI treatment, labelling, and placement within this section have NOT been 
  finalised and require PM alignment before production implementation.
  This is a placeholder only — do not treat this as the final design.
*/}
```

- `{/* DEV: integrate with existing <ActivityLog> component — add automation as new event type */}`

---

## Step 8 — Component Annotation Pass

### Task 8.0 — Review all files
- [ ]
Go through every file modified in Steps 1–7 and verify that every major UI element has a `{/* DEV: ... */}` comment indicating which production component to use.

### Task 8.1 — Annotation checklist
- [ ]
Ensure the following are annotated:
- [ ] Table / DataTable
- [ ] Filter dropdowns
- [ ] Search inputs
- [ ] Status badges
- [ ] Error badges
- [ ] Tab navigation
- [ ] Sidebar / drawer panel
- [ ] Buttons (primary / secondary / text)
- [ ] Metric cards
- [ ] Date range picker
- [ ] Export CSV button
- [ ] Activity log event row
- [ ] Canvas node components (error badge, delay count)

### Task 8.2 — Final check
- [ ]
Verify:
- [ ] No hardcoded colours outside of STYLE.md tokens
- [ ] No interactions added beyond what is specified in SPEC.md
- [ ] All routes in App.tsx are correct
- [ ] No console errors in the dev build
- [ ] Prototype runs with `npm run dev` without errors
