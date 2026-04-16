## LearnWorlds · Automation Activity Logging · v0.4

---

## Before you start

1. Read `SPEC.md` fully before touching any code.
2. Read `STYLE.md` fully before writing any CSS or inline styles.
3. Work one step at a time. Stop after each step and wait for review before proceeding.
4. After every UI task, add `{/* DEV: ... */}` comments above major elements indicating which component from the admin UI library should be used in production.
5. Never invent colours or typography — always use the tokens from `STYLE.md`.
6. Never add drag/drop, node editing, or real API calls.
7. Replace the word `workflow` with `automation` everywhere in the prototype. Do not leave any `workflow` copy in the UI.
8. Do not change any functionality or UI/UX that is not explicitly mentioned below. Everything else must remain exactly as it is.

---

## Step 1 — Detail Page Header Simplification

### Task 1.0 — Remove obsolete status section
- [x]
Remove the existing inline status copy:
- `Workflow is ON`
- `Workflow without issues`
- any equivalent variant using the word `workflow`

Do not keep this section in any form.

### Task 1.1 — Update title area
- [x]
In the page title area:
- Add a green bullet next to the title
- Replace any remaining `workflow` wording with `automation`
- Keep the rest of the title area unchanged unless explicitly listed below

### Task 1.2 — Remove metadata bar
- [x]
Remove the current metadata bar completely.
This includes removing:
- `Trigger name`
- `Enrolled Total`
- `Enrolled Last 7 Days`
- `Updated On`
- `Updated By`
- `Created On`
- `Created By`

### Task 1.3 — Rebuild creation/edit info under title
- [x]
Under the page title, add only these 2 metadata items as simple inline text:
- `Edited on [date] by [name]`
- `Created on [date] by [name]`

Rules:
- `Updated on` must become `Edited on`
- Do not recreate the old metadata bar layout
- This information must sit under the title area, using a lighter secondary-information treatment
- Do not include any enrollment counts here
- `{/* DEV: use <TextMeta> / <InlineMetadata> or equivalent admin UI component */}`

---

## Step 2 — Shared Terminology Cleanup

### Task 2.0 — Replace “workflow” with “automation” everywhere
- [x]
Across the entire detail page and any related views touched by this prototype update:
- Replace `workflow` with `automation`
- Ensure no visible UI string still uses `workflow`

This applies to:
- page header
- tab content
- status copy
- helper text
- empty states
- badges / labels
- tooltips / inline messages

Do not rename internal code identifiers unless needed for visible UI output.

---

## Step 3 — Action Logs: Remove success feedback and redesign row hierarchy

### Task 3.0 — Remove success feedback from rows
- [x]
In the **Action Logs** tab:
- Remove `· Success` from all rows
- Success must no longer appear as visible feedback on either trigger rows or action rows

Rules:
- Actions can show feedback only when they failed
- Triggers must not show feedback

### Task 3.1 — Apply the same feedback rules to Enrollment History
- [x]
In the **Enrollment history** tab:
- Remove `· Success` from all rows
- Apply the exact same visibility rules used in Action Logs:
  - actions show feedback only when failed
  - triggers do not show feedback

### Task 3.2 — Redesign list item information hierarchy
- [x]
In both **Action Logs** and **Enrollment history**, update only the **Event** column item layout.

Do **not** change the structure or behavior of the other columns:
- `Contact` stays unchanged
- `Time` stays unchanged

Update the row layout inside the **Event** column so that the information hierarchy becomes:

**First row (primary information):**
- the trigger / action / automation control name
- this becomes the most visually prominent information

**Second row (secondary information):**
- the event type label: `Trigger`, `Action`, or `Automation control`
- when applicable, failed feedback appears next to this label

Rules:
- Do not keep the current structure where the type label is the first/highest-emphasis information
- The item name must become the primary line
- The type label must become secondary metadata
- Keep the timestamp placement unchanged
- Keep the contact cell unchanged
- `{/* DEV: use <LogRow>, <TextMeta>, <StatusInline> or equivalent admin UI components */}`

### Task 3.3 — Failed state treatment
- [x]
When an item has failed:
- show `Failed` next to the secondary label only where valid
- use the existing error colour treatment / tokens

Important behavior rules:
- The only visible row feedback state is `Failed`
- `Success` is never shown
- Triggers do not show feedback
- Failed feedback is therefore valid only for `Action` and `Automation control` rows

### Task 3.4 — Replace “Show details” with tooltip help icon
- [x]
For failed rows:
- remove the `Show details` text link
- place a `?` help icon next to `Failed`
- on hover of the `?` icon, show a tooltip containing the same error information currently revealed by `Show details`

Rules:
- Tooltip content should reuse the current plain-language failure explanation
- Do not open an inline expanded area for this interaction anymore
- Keep the interaction lightweight and contextual
- `{/* DEV: use <Tooltip> / <IconButton> / <InlineHelpIcon> */}`

### Task 3.5 — Remove inline failed detail expansion UI
- [x]
Remove the current expanded failed-detail row pattern used by `Show details`.

This means:
- no expandable error row under log items
- no `Show details` / `Hide details` copy
- error explanation is available only through the tooltip on the `?` icon

---

## Step 4 — Remove “Why did this enroll?”

### Task 4.0 — Remove CTA from Action Logs
- [x]
Remove the `Why did this enroll?` CTA entirely from Action Logs.

### Task 4.1 — Remove supporting UI that depends on this CTA
- [x]
Remove or disable any UI in this prototype that exists only to support `Why did this enroll?`, if present in the current implementation.

Do not replace it with another CTA.

---

## Step 5 — Trigger row feedback cleanup

### Task 5.0 — Remove failed feedback from trigger rows in Action Logs
- [x]
In **Action Logs**:
- remove the `Failed` feedback from trigger rows
- trigger rows must not display feedback states

Rationale:
- triggers do not display feedback in this prototype
- if a trigger appears in the log, it should appear as an entry without success/failed feedback

### Task 5.1 — Apply the same rule to Enrollment History
- [x]
Apply the same rule to **Enrollment history**:
- trigger rows must not display `Failed` feedback there either
- keep the trigger row itself; only remove the feedback state

### Task 5.2 — Preserve all other log behavior
- [x]
Other than removing failed feedback from trigger rows, keep the existing logging behavior unchanged.
- Do not alter unrelated filtering
- Do not alter sorting
- Do not alter timestamps
- Do not alter grouping
- Do not alter navigation
- Do not remove row entries unless explicitly requested elsewhere in this TODO

---

## Final guardrail

- [x]
Do **not** change any other functionality or UI/UX that is not explicitly mentioned in this TODO.
Everything not listed above must remain exactly as it is.

