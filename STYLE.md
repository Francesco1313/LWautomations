# STYLE.md — LearnWorlds Design System Tokens
## For use in the Automation Logging Prototype

---

## Purpose

This file defines the CSS variables and typographic classes from the LearnWorlds design system.
Apply these variables directly in the prototype CSS/inline styles.
Do NOT invent new colours or typography — always use these tokens.

---

## Colours

Apply as CSS variables. Reference them as `var(--token-name)` in all styles.

### Core brand
```css
--teal: #029C91;
--teal-80: #01837A;
--teal-60-light1: #00aeab;
--teal-60-light2: #D6EAEA;
--teal-60-light3: #F2FAF9;
--teal-90: #022B30;
--light-teal: #E1F7F5;
```

### Greys (most used for UI chrome)
```css
--grey1: #333333;   /* primary text */
--grey2: #4F4F4F;   /* secondary text */
--grey3: #828282;   /* muted text, placeholders */
--grey4: #BDBDBD;   /* disabled states */
--grey5: #E0E0E0;   /* borders, dividers */
--grey6: #F2F2F2;   /* subtle backgrounds */
--grey7: #F9F9F9;   /* page background, zebra rows */
--cool-grey: #F2F4F8;
```

### Semantic colours
```css
/* Error / failure */
--red: #F04438;
--dark-red: #B42318;
--light-red: #FEF3F2;

/* Success */
--green: #235826;
--light-green: #ECFDF3;
--dark-green: #6fcf97;

/* Warning */
--orange: #B54708;
--light-orange: #FFFAEB;

/* Info / links */
--blue: #283593;
--light-blue: #F0F9FF;
```

### Status tags
Use these for status badges (In progress / Completed / Failed / Exited):
```css
--not-started: #C0C5DF;
--in-progress: #FB8C00;       /* background: --light-orange */
--completed: #52A62B;         /* background: --light-green */
/* failed: use --red / --light-red */
```

### Notification / callout backgrounds
```css
--notification-bg: color-mix(in srgb, white 93%, var(--red));
--notification-border: color-mix(in srgb, white 70%, var(--red));
--tip-bg: color-mix(in srgb, white 93%, #FFC240);
--tip-border: color-mix(in srgb, white 70%, #FFC240);
--info-bg: white;
--info-border: var(--grey5);
--info-bg-dark: var(--grey7);
```

---

## Typography

Font families:
```css
font-family: "Averta Extra Bold", sans-serif;   /* headings */
font-family: "Averta Semi Bold", sans-serif;
font-family: "Averta Bold", sans-serif;
font-family: "Averta Regular", sans-serif;       /* body */
```

Apply these class names for font sizes:
```css
.lbl-extra-large  { font-size: 33px; line-height: 1.4; letter-spacing: -1px; }
.lbl-very-large   { font-size: 20px; line-height: 1.4; }
.lbl-semi-large   { font-size: 18px; line-height: 1.4; }
.lbl-large        { font-size: 17px; line-height: 1.5; }
.lbl-normal       { font-size: 15px; line-height: 1.5; }  /* default body */
.lbl-small        { font-size: 14px; line-height: 1.4; }
.lbl-very-small   { font-size: 13px; line-height: 1.3; }
.lbl-extra-small  { font-size: 12px; line-height: 1.4; }
.lbl-tiny         { font-size: 11px; line-height: 1.3; }
```

Font weights:
```css
.weight-normal  { font-weight: normal; }
.weight-500     { font-weight: 500; }
.weight-700     { font-weight: 700; }
.weight-bold    { font-weight: bold; }
```

---

## Borders
```css
.b-1px-lightGray     { border: 1px solid var(--grey5); }
.bb-1px-lightGray    { border-bottom: 1px solid var(--grey5); }
.bt-1px-lightGray    { border-top: 1px solid var(--grey5); }
.bl-1px-lightGray    { border-left: 1px solid var(--grey5); }
.br-1px-lightGray    { border-right: 1px solid var(--grey5); }
.bl-5px-lightGray    { border-left: 5px solid var(--grey5); }
```

---

## Shadows
```css
.with-light-shadow   { box-shadow: 0 5px 12px rgba(0,0,0,0.05); }
.with-shadow         { box-shadow: 0 0 10px rgba(0,0,0,0.1); }
.with-bottom-shadow  { box-shadow: 0 5px 15px rgba(0,0,0,0.15); }
```

---

## Usage guidelines for the prototype

### Page background
```css
background-color: var(--grey7);
```

### Table rows
- Default row: `background: white`
- Alternate row (zebra): `background: var(--grey7)`
- Header row: `background: var(--teal-60-light3)` or `var(--cool-grey)`

### Status badge mapping
| Status | Text colour | Background |
|---|---|---|
| In progress | `--in-progress` | `--light-orange` |
| Completed | `--completed` | `--light-green` |
| Failed | `--red` | `--light-red` |
| Exited | `--grey3` | `--grey6` |

### Error badge (on list rows and canvas nodes)
```css
background: var(--red);
color: white;
border-radius: 50%;
font-size: 11px;
font-weight: bold;
```

### Trigger vs action colour coding (Action Logs)
Consistent with the automation builder:
- Trigger row: left border `4px solid var(--teal)`
- Action row: left border `4px solid var(--grey4)`
- Failed row: left border `4px solid var(--red)`, background `var(--light-red)`

### Sidebar panel ("Why did this enroll?")
```css
background: white;
border-left: 1px solid var(--grey5);
box-shadow: -5px 0 15px rgba(0,0,0,0.08);
```

### Primary button
```css
background: var(--teal);
color: white;
border-radius: 6px;
font-family: "Averta Semi Bold";
font-size: 14px;
```

### Secondary button / outline
```css
background: white;
border: 1px solid var(--grey5);
color: var(--grey1);
border-radius: 6px;
```

### Filter dropdown
```css
background: white;
border: 1px solid var(--grey5);
border-radius: 6px;
font-size: 14px;
color: var(--grey1);
```

### Tab navigation
- Active tab: `border-bottom: 2px solid var(--teal)`, `color: var(--teal)`, `font-weight: bold`
- Inactive tab: `color: var(--grey3)`, no border
