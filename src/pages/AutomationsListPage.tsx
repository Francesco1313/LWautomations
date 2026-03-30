import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/layout/Sidebar'
import { automations, Automation } from '../data/automations'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  })
}

// ── Column layout ─────────────────────────────────────────────────────────────
// CSS Grid: single template shared by header and every row
// columns: menu | group | name | trigger | executed | edited | status
const GRID_COLS = '40px 150px 1fr 1fr 110px 110px 56px'
const P = '0 16px'   // uniform cell padding

// ── GroupLabel ─────────────────────────────────────────────────────────────────

function GroupLabel({ group }: { group: string | null }) {
  if (!group) {
    return (
      /* DEV: use <Label variant="gray" text="Not assigned"> */
      <span style={{
        display: 'inline-flex', alignItems: 'center',
        padding: '1px 4px', borderRadius: 2,
        fontSize: 13, fontWeight: 400,
        background: 'var(--grey5)', color: 'var(--grey2)',
        whiteSpace: 'nowrap',
      }}>
        Not assigned
      </span>
    )
  }
  return (
    /* DEV: use <Label variant="green" text={group}> */
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '1px 4px', borderRadius: 2,
      fontSize: 13, fontWeight: 400,
      background: 'var(--light-green)', color: 'var(--completed)',
      whiteSpace: 'nowrap',
    }}>
      {group}
    </span>
  )
}

// ── TriggerChip ───────────────────────────────────────────────────────────────

function TriggerChip({ label }: { label: string }) {
  return (
    /* DEV: use <Chips.SingleChip label={label}> */
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '4px 8px', borderRadius: 4,
      fontSize: 13, fontWeight: 400,
      background: 'var(--grey7)', color: 'var(--grey2)',
      whiteSpace: 'nowrap', maxWidth: 220,
      overflow: 'hidden', textOverflow: 'ellipsis',
    }}>
      {label}
    </span>
  )
}

// ── ThreeDotMenu ──────────────────────────────────────────────────────────────

function ThreeDotMenu({ automation }: { automation: Automation }) {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  return (
    <div style={{ position: 'relative' }}>
      {/* DEV: use <IconButton icon="more-vertical"> */}
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(!open) }}
        style={{
          width: 28, height: 28, borderRadius: 4,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: open ? 'var(--grey6)' : 'transparent',
          border: `1px solid ${open ? 'var(--grey5)' : 'transparent'}`,
          color: 'var(--grey3)', fontSize: 16, cursor: 'pointer',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'var(--grey6)'
          e.currentTarget.style.borderColor = 'var(--grey5)'
        }}
        onMouseLeave={(e) => {
          if (!open) {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.borderColor = 'transparent'
          }
        }}
      >
        &#8942;
      </button>

      {open && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 10 }} onClick={() => setOpen(false)} />
          {/* DEV: use <DropdownMenu> from admin UI library */}
          {/* DEV: use <DropdownMenu> from admin UI library */}
          <div style={{
            position: 'absolute', left: 0, top: 34, zIndex: 20,
            background: '#fff', border: '1px solid var(--grey5)',
            borderRadius: 6, boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
            minWidth: 168, overflow: 'hidden',
          }}>
            {/* DEV: use <DropdownMenuItem icon="edit" label="Edit"> */}
            <button
              onClick={(e) => { e.stopPropagation(); setOpen(false); navigate(`/canvas/${automation.id}`) }}
              style={{
                width: '100%', height: 36, padding: '0 14px',
                display: 'flex', alignItems: 'center', gap: 10,
                textAlign: 'left', fontSize: 13, color: 'var(--grey1)',
                background: 'transparent', border: 'none', cursor: 'pointer',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--grey7)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              Edit
            </button>
            {/* DEV: use <DropdownMenuItem icon="activity" label="View activity"> */}
            <button
              onClick={(e) => { e.stopPropagation(); setOpen(false); navigate(`/detail/${automation.id}`) }}
              style={{
                width: '100%', height: 36, padding: '0 14px',
                display: 'flex', alignItems: 'center', gap: 10,
                textAlign: 'left', fontSize: 13, color: 'var(--grey1)',
                background: 'transparent', border: 'none', cursor: 'pointer',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--grey7)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              View activity
            </button>
            <div style={{ height: 1, background: 'var(--grey6)', margin: '4px 0' }} />
            {/* DEV: use <DropdownMenuItem icon="duplicate" label="Duplicate"> */}
            <button
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%', height: 36, padding: '0 14px',
                display: 'flex', alignItems: 'center', gap: 10,
                textAlign: 'left', fontSize: 13, color: 'var(--grey1)',
                background: 'transparent', border: 'none', cursor: 'pointer',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--grey7)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              Duplicate
            </button>
            {/* DEV: use <DropdownMenuItem icon="export" label="Export"> */}
            <button
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%', height: 36, padding: '0 14px',
                display: 'flex', alignItems: 'center', gap: 10,
                textAlign: 'left', fontSize: 13, color: 'var(--grey1)',
                background: 'transparent', border: 'none', cursor: 'pointer',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--grey7)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              Export
            </button>
            <div style={{ height: 1, background: 'var(--grey6)', margin: '4px 0' }} />
            {/* DEV: use <DropdownMenuItem icon="delete" label="Delete" destructive> */}
            <button
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%', height: 36, padding: '0 14px',
                display: 'flex', alignItems: 'center', gap: 10,
                textAlign: 'left', fontSize: 13, color: 'var(--red)',
                background: 'transparent', border: 'none', cursor: 'pointer',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--light-red)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  )
}

// ── AutomationRow ──────────────────────────────────────────────────────────────

function AutomationRow({ automation }: { automation: Automation }) {
  const navigate = useNavigate()
  const [hovered, setHovered] = useState(false)

  return (
    /* DEV: use <DataTable.Row> — fixed height 68px */
    <div
      onClick={() => navigate(`/canvas/${automation.id}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        height: 68, minHeight: 68,
        display: 'grid', gridTemplateColumns: GRID_COLS, alignItems: 'center',
        background: hovered ? 'var(--teal-60-light3)' : '#fff',
        cursor: 'pointer',
        transition: 'background 0.1s',
      }}
    >
      {/* Menu — leftmost cell, visible only on hover */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ padding: '0 4px 0 8px', display: 'flex', alignItems: 'center', visibility: hovered ? 'visible' : 'hidden' }}
      >
        <ThreeDotMenu automation={automation} />
      </div>

      {/* Group */}
      <div style={{ padding: P, display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        <GroupLabel group={automation.group} />
      </div>

      {/* Name — error badge lives here */}
      <div style={{ padding: P, display: 'flex', alignItems: 'center', gap: 7, overflow: 'hidden' }}>
        {/* DEV: use <StatusBadge variant="error"> when hasErrors */}
        {automation.hasErrors && (
          <div
            title="This automation has errors"
            style={{
              width: 16, height: 16, borderRadius: '50%', flexShrink: 0,
              background: 'var(--red)', color: '#fff',
              fontSize: 10, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'help',
            }}
          >!</div>
        )}
        <span style={{
          fontSize: 14, fontWeight: 500,
          color: automation.hasErrors ? 'var(--red)' : 'var(--grey2)',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {automation.name}
        </span>
      </div>

      {/* Trigger */}
      <div style={{ padding: P, display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        <TriggerChip label={automation.trigger} />
      </div>

      {/* Times executed */}
      <div style={{ padding: P, display: 'flex', alignItems: 'center' }}>
        <span style={{ fontSize: 13, color: 'var(--grey2)' }}>
          {automation.timesExecuted.toLocaleString()}
        </span>
      </div>

      {/* Edited on */}
      <div style={{ padding: P, display: 'flex', alignItems: 'center' }}>
        <span style={{ fontSize: 13, color: 'var(--grey2)' }}>
          {formatDate(automation.editedOn)}
        </span>
      </div>

      {/* Status dot */}
      {/* DEV: use <StatusDot status={automation.status}> */}
      <div style={{ padding: P, display: 'flex', alignItems: 'center' }}>
        <span style={{
          width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
          background: automation.status === 'active' ? 'var(--teal)' : 'var(--grey4)',
          boxShadow: automation.status === 'active' ? '0 0 0 2px var(--light-teal)' : 'none',
          display: 'inline-block',
        }} />
      </div>
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function AutomationsListPage() {
  const [search, setSearch] = useState('')
  const [groupFilter, setGroupFilter] = useState('all')
  const [errorsOnly, setErrorsOnly] = useState(false)

  const groups = Array.from(
    new Set(automations.map(a => a.group).filter(Boolean))
  ) as string[]

  const filtered = automations.filter(a => {
    const matchesSearch = !search
      || a.name.toLowerCase().includes(search.toLowerCase())
      || a.trigger.toLowerCase().includes(search.toLowerCase())
    const matchesGroup = groupFilter === 'all' || a.group === groupFilter
    const matchesErrors = !errorsOnly || a.hasErrors
    return matchesSearch && matchesGroup && matchesErrors
  })

  const errorCount = automations.filter(a => a.hasErrors).length

  return (
    <div style={{
      display: 'flex', height: '100vh', overflow: 'hidden',
      fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    }}>
      <Sidebar />

      <main style={{
        flex: 1, overflowY: 'auto',
        background: 'var(--grey7)',
        display: 'flex', flexDirection: 'column',
      }}>

        {/* ── Page header ────────────────────────────────────────────────────── */}
        {/* DEV: use <PageTopHeader> component */}
        <div style={{
          background: '#fff',
          borderBottom: '1px solid var(--grey5)',
          padding: '18px 32px 20px',
          flexShrink: 0,
        }}>
          {/* Title row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            {/* DEV: use <PageTitle> */}
            <h1 style={{ fontSize: 22, fontWeight: 500, color: 'var(--grey1)', margin: 0, lineHeight: 1.2 }}>
              Automations
            </h1>
            {/* DEV: use <HelpLink> or <InfoIcon> component */}
            <span style={{ fontSize: 13, color: 'var(--teal)', cursor: 'pointer', fontWeight: 500 }}>
              Learn more
            </span>
          </div>

          {/* Subtitle */}
          <p style={{ fontSize: 14, color: 'var(--grey3)', margin: '0 0 14px', lineHeight: 1.4 }}>
            Automate user processes using specific triggers, actions, and conditions for seamless operations.
          </p>

          {/* DEV: use <Button variant="primary"> */}
          <button
            style={{
              height: 32, padding: '0 12px',
              background: 'var(--teal)', color: '#fff',
              border: 'none', borderRadius: 4,
              fontSize: 14, fontWeight: 500, cursor: 'pointer',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--teal-80)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--teal)')}
          >
            Create automation
          </button>
        </div>

        {/* ── Content ────────────────────────────────────────────────────────── */}
        <div style={{ padding: '20px 32px', flex: 1 }}>

          {/* Error alert banner */}
          {errorCount > 0 && (
            /* DEV: use <AlertBanner variant="error"> */
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 14px', marginBottom: 16,
              background: 'var(--light-red)',
              border: '1px solid var(--notification-border)',
              borderRadius: 4, fontSize: 13, color: 'var(--dark-red)',
            }}>
              <div style={{
                width: 18, height: 18, borderRadius: '50%',
                background: 'var(--red)', color: '#fff',
                fontSize: 10, fontWeight: 700, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>!</div>
              <span>
                <strong>{errorCount} automation{errorCount > 1 ? 's' : ''}</strong>{' '}
                {errorCount > 1 ? 'have' : 'has'} failed actions. Review to ensure learners are not missing steps.
              </span>
              <button
                onClick={() => setErrorsOnly(true)}
                style={{
                  marginLeft: 'auto', padding: '3px 10px',
                  border: '1px solid var(--red)', borderRadius: 4,
                  background: 'transparent', color: 'var(--red)',
                  fontSize: 12, fontWeight: 500, cursor: 'pointer',
                }}
              >
                Show only errors
              </button>
            </div>
          )}

          {/* Filter bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            {/* DEV: use <SearchInput placeholder="Search by automation, triggers, actions.."> */}
            <div style={{ position: 'relative', width: 340 }}>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by automation, triggers, actions.."
                style={{
                  width: '100%', height: 32, padding: '0 32px 0 8px',
                  background: '#fff', border: '1px solid var(--grey5)',
                  borderRadius: 4, fontSize: 14, color: 'var(--grey1)', outline: 'none',
                }}
              />
              <span style={{
                position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
                fontSize: 14, color: 'var(--grey4)', pointerEvents: 'none',
                lineHeight: 1,
              }}>
                &#9906;
              </span>
            </div>

            {/* DEV: use <FilterDropdown label="All groups"> */}
            <select
              value={groupFilter}
              onChange={(e) => setGroupFilter(e.target.value)}
              style={{
                height: 32, padding: '0 8px',
                background: '#fff', border: '1px solid var(--grey5)',
                borderRadius: 4, fontSize: 14, color: 'var(--grey2)',
                cursor: 'pointer', outline: 'none',
              }}
            >
              <option value="all">All groups</option>
              {groups.map(g => <option key={g} value={g}>{g}</option>)}
            </select>

            {/* DEV: use <FilterToggle label="Errors only"> */}
            <label style={{
              display: 'flex', alignItems: 'center', gap: 6,
              height: 32, padding: '0 10px',
              border: `1px solid ${errorsOnly ? 'var(--red)' : 'var(--grey5)'}`,
              borderRadius: 4,
              background: errorsOnly ? 'var(--light-red)' : '#fff',
              fontSize: 14, color: errorsOnly ? 'var(--red)' : 'var(--grey2)',
              cursor: 'pointer', userSelect: 'none',
            }}>
              <input
                type="checkbox" checked={errorsOnly}
                onChange={(e) => setErrorsOnly(e.target.checked)}
                style={{ accentColor: 'var(--red)', width: 13, height: 13 }}
              />
              Errors only
            </label>

            <span style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--grey3)' }}>
              Show <strong style={{ color: 'var(--grey2)' }}>{filtered.length}</strong> from {automations.length} automations
            </span>
          </div>

          {/* DEV: use <DataTable> component */}
          <div>
            {/* Column header */}
            {/* DEV: use <DataTable.Header> */}
            <div style={{
              display: 'grid', gridTemplateColumns: GRID_COLS, alignItems: 'center',
              paddingBottom: 8,
              borderBottom: '1px solid var(--grey5)',
            }}>
              <div />{/* empty — aligns with leftmost menu column */}
              <div style={{ padding: P, fontSize: 13, fontWeight: 500, color: 'var(--grey3)' }}>Group name</div>
              <div style={{ padding: P, fontSize: 13, fontWeight: 500, color: 'var(--grey3)' }}>Automation title</div>
              <div style={{ padding: P, fontSize: 13, fontWeight: 500, color: 'var(--grey3)' }}>Triggers</div>
              <div style={{ padding: P, fontSize: 13, fontWeight: 500, color: 'var(--grey3)' }}>Times executed</div>
              <div style={{ padding: P, fontSize: 13, fontWeight: 500, color: 'var(--grey3)' }}>Edited on</div>
              <div style={{ padding: P, fontSize: 13, fontWeight: 500, color: 'var(--grey3)' }}>Status</div>
            </div>

            {/* Card list — each row is an independent white card */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 10 }}>
              {filtered.map((a) => (
                <AutomationRow key={a.id} automation={a} />
              ))}
              {filtered.length === 0 && (
                <div style={{
                  padding: '48px 0', textAlign: 'center',
                  color: 'var(--grey3)', fontSize: 13,
                  background: '#fff', borderRadius: 4,
                }}>
                  {errorsOnly ? 'No automations with errors' : 'No automations found'}
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
