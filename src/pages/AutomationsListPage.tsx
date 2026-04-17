import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/layout/Sidebar'
import { automations, Automation } from '../data/automations'
import { runs } from '../data/runs'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  })
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

// ── Column layout ─────────────────────────────────────────────────────────────
const GRID_COLS = '28px 1fr 150px 190px 100px 100px 120px 44px'
const P = '0 12px'

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

// ── ActionChip ────────────────────────────────────────────────────────────────
function ActionChip({ label }: { label: string }) {
  return (
    /* DEV: use <Chips.SingleChip label={label}> */
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '4px 8px', borderRadius: 4,
      fontSize: 13, fontWeight: 400,
      background: 'var(--grey7)', color: 'var(--grey2)',
      whiteSpace: 'nowrap', maxWidth: 180,
      overflow: 'hidden', textOverflow: 'ellipsis',
    }}>
      {label}
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
    /* DEV: use <DataTable.Row> — min height 68px, wraps on long titles */
    <div
      onClick={() => navigate(`/canvas/${automation.id}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        minHeight: 68,
        display: 'grid', gridTemplateColumns: GRID_COLS, alignItems: 'center',
        background: hovered ? 'var(--teal-60-light3)' : '#fff',
        cursor: 'pointer',
        transition: 'background 0.1s',
      }}
    >
      {/* dot-menu */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ padding: '0 4px 0 8px', display: 'flex', alignItems: 'center', visibility: hovered ? 'visible' : 'hidden' }}
      >
        <ThreeDotMenu automation={automation} />
      </div>
      {/* Automation title — up to 3 lines */}
      <div style={{ padding: P, display: 'flex', alignItems: 'center', gap: 7, minWidth: 0 }}>
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
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {automation.name}
        </span>
      </div>
      {/* When (trigger) */}
      <div style={{ padding: P, display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        <TriggerChip label={automation.trigger} />
      </div>
      {/* Then (actions) */}
      <div style={{ padding: P, display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-start', paddingTop: 10, paddingBottom: 10 }}>
        {automation.actions.map(a => <ActionChip key={a} label={a} />)}
      </div>
      {/* Times executed — teal, clickable → view activity */}
      <div
        onClick={(e) => { e.stopPropagation(); navigate(`/detail/${automation.id}`) }}
        style={{ padding: P, display: 'flex', alignItems: 'center' }}
      >
        <span style={{ fontSize: 13, color: 'var(--teal)', fontWeight: 500, cursor: 'pointer' }}>
          {automation.timesExecuted.toLocaleString()}
        </span>
      </div>
      {/* Edited on */}
      <div style={{ padding: P, display: 'flex', alignItems: 'center' }}>
        <span style={{ fontSize: 13, color: 'var(--grey2)' }}>
          {formatDate(automation.editedOn)}
        </span>
      </div>
      {/* Group name */}
      <div style={{ padding: P, display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        <GroupLabel group={automation.group} />
      </div>
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

// ── HelpIcon (tooltip on ?) ────────────────────────────────────────────────────
// DEV: use <Tooltip> / <InlineHelpIcon>
function HelpIcon({ message }: { message: string }) {
  const [open, setOpen] = useState(false)
  return (
    <span
      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <span style={{
        width: 14, height: 14, borderRadius: '50%',
        border: '1px solid var(--red)', color: 'var(--red)',
        fontSize: 10, fontWeight: 700, cursor: 'default',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        lineHeight: 1, flexShrink: 0,
      }}>?</span>
      {open && (
        <div style={{
          position: 'absolute', bottom: 'calc(100% + 6px)', left: '50%',
          transform: 'translateX(-50%)',
          background: 'var(--grey1)', color: '#fff',
          fontSize: 12, lineHeight: 1.5, padding: '6px 10px',
          borderRadius: 4, whiteSpace: 'normal', width: 240,
          zIndex: 100, pointerEvents: 'none',
          boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
        }}>
          {message}
        </div>
      )}
    </span>
  )
}

// ── Automation Logs data types ─────────────────────────────────────────────────
interface LogRow {
  automationId: string
  automationName: string
  stepType: 'trigger' | 'action' | 'branch'
  stepLabel: string
  outcome: 'success' | 'failed'
  errorMessage: string | null
  timestamp: string
}

function buildLogRows(): LogRow[] {
  const autoMap = new Map(automations.map(a => [a.id, a.name]))
  const rows: LogRow[] = []

  runs.forEach(run => {
    const automationName = autoMap.get(run.automationId) ?? run.automationId
    run.steps.forEach(step => {
      if (step.type === 'completion') return
      rows.push({
        automationId: run.automationId,
        automationName,
        stepType: step.type as 'trigger' | 'action' | 'branch',
        stepLabel: step.label,
        outcome: step.outcome,
        errorMessage: step.errorMessage,
        timestamp: step.timestamp,
      })
    })
  })

  return rows.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

function stepTypeLabel(t: LogRow['stepType']): string {
  if (t === 'trigger') return 'Trigger'
  if (t === 'action') return 'Action'
  return 'Automation control'
}

// ── Automation Logs Tab ────────────────────────────────────────────────────────
function AutomationLogsTab() {
  const [search, setSearch] = useState('')
  const [outcomeFilter, setOutcomeFilter] = useState<'all' | 'failed'>('all')
  const [eventFilter, setEventFilter] = useState<'all' | 'trigger' | 'action' | 'branch'>('all')

  const allRows = useMemo(() => buildLogRows(), [])

  const filtered = useMemo(() => {
    let rows = allRows
    if (outcomeFilter === 'failed') rows = rows.filter(r => r.outcome === 'failed' && r.stepType !== 'trigger')
    if (eventFilter !== 'all') rows = rows.filter(r => r.stepType === eventFilter)
    if (search) rows = rows.filter(r =>
      r.automationName.toLowerCase().includes(search.toLowerCase())
    )
    return rows
  }, [allRows, search, outcomeFilter, eventFilter])

  return (
    <div style={{ padding: '20px 32px', flex: 1 }}>
      {/* Filter bar */}
      {/* DEV: use <SearchInput>, <FilterDropdown> */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by automation..."
          style={{
            height: 34, padding: '0 12px', width: 260,
            background: 'white', border: '1px solid var(--grey5)',
            borderRadius: 4, fontSize: 13, outline: 'none',
          }}
        />
        {/* DEV: use <FilterDropdown> */}
        <select
          value={outcomeFilter}
          onChange={e => setOutcomeFilter(e.target.value as 'all' | 'failed')}
          style={{
            height: 34, padding: '0 12px',
            border: '1px solid var(--grey5)', borderRadius: 4,
            fontSize: 13, color: 'var(--grey2)', background: 'white', cursor: 'pointer',
          }}
        >
          <option value="all">All outcomes</option>
          <option value="failed">Failed only</option>
        </select>
        {/* DEV: use <FilterDropdown> */}
        <select
          value={eventFilter}
          onChange={e => setEventFilter(e.target.value as 'all' | 'trigger' | 'action' | 'branch')}
          style={{
            height: 34, padding: '0 12px',
            border: '1px solid var(--grey5)', borderRadius: 4,
            fontSize: 13, color: 'var(--grey2)', background: 'white', cursor: 'pointer',
          }}
        >
          <option value="all">All events</option>
          <option value="trigger">Trigger</option>
          <option value="action">Action</option>
          <option value="branch">Automation control</option>
        </select>
        <span style={{ fontSize: 12, color: 'var(--grey3)', marginLeft: 'auto' }}>
          {filtered.length} log entries
        </span>
        {/* DEV: use <Button variant="secondary"> */}
        <button
          type="button"
          onClick={() => {}}
          style={{
            height: 34, padding: '0 14px',
            border: '1px solid var(--grey5)', borderRadius: 4,
            fontSize: 13, color: 'var(--grey2)', background: 'white', cursor: 'pointer',
          }}
        >
          Export full CSV
        </button>
      </div>

      {/* Table */}
      {/* DEV: use <DataTable> */}
      <div style={{
        background: 'white', border: '1px solid var(--grey5)', borderRadius: 6,
        overflow: 'hidden',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
          <colgroup>
            <col style={{ width: 260 }} />
            <col />
            <col style={{ width: 170 }} />
          </colgroup>
          <thead>
            <tr style={{ background: 'var(--cool-grey)', borderBottom: '1px solid var(--grey5)' }}>
              {['Automation', 'Event', 'Time'].map(col => (
                <th key={col} style={{
                  padding: '10px 16px', textAlign: 'left',
                  fontSize: 11, fontWeight: 600, color: 'var(--grey3)',
                  textTransform: 'uppercase', letterSpacing: '0.05em',
                  whiteSpace: 'nowrap',
                }}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={3} style={{ padding: 48, textAlign: 'center', color: 'var(--grey3)', fontSize: 13 }}>
                  No log entries match your filters
                </td>
              </tr>
            ) : (
              filtered.map((row, i) => {
                const isFailed = row.outcome === 'failed'
                const showFailed = isFailed && (row.stepType === 'action' || row.stepType === 'branch')
                const borderLeft = showFailed
                  ? '4px solid var(--red)'
                  : '4px solid var(--grey2)'
                return (
                  <tr
                    key={i}
                    style={{
                      borderBottom: '1px solid var(--grey6)',
                      borderLeft,
                      background: 'white',
                    }}
                  >
                    {/* Automation */}
                    <td style={{ padding: '10px 16px', verticalAlign: 'middle' }}>
                      <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--grey1)' }}>
                        {row.automationName}
                      </span>
                    </td>
                    {/* Event */}
                    {/* DEV: use <LogRow>, <TextMeta>, <StatusInline> */}
                    <td style={{ padding: '10px 16px', verticalAlign: 'middle', minWidth: 0 }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--grey1)' }}>
                          {row.stepLabel}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                          {showFailed ? (
                            <>
                              <span style={{ fontSize: 12, color: 'var(--red)', fontWeight: 500 }}>
                                {stepTypeLabel(row.stepType)} Failed
                              </span>
                              {row.errorMessage && <HelpIcon message={row.errorMessage} />}
                            </>
                          ) : (
                            <span style={{ fontSize: 12, color: 'var(--grey3)' }}>
                              {stepTypeLabel(row.stepType)}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    {/* Time */}
                    <td style={{ padding: '10px 16px', fontSize: 12, color: 'var(--grey3)', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>
                      {formatDateTime(row.timestamp)}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── My Automations Tab ─────────────────────────────────────────────────────────
function MyAutomationsTab() {
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
            fontSize: 14, color: 'var(--grey4)', pointerEvents: 'none', lineHeight: 1,
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
        {/* DEV: use <DataTable.Header> */}
        <div style={{
          display: 'grid', gridTemplateColumns: GRID_COLS, alignItems: 'center',
          paddingBottom: 8,
          borderBottom: '1px solid var(--grey5)',
        }}>
          <div />
          <div style={{ padding: P, fontSize: 13, fontWeight: 500, color: 'var(--grey3)' }}>Automation title</div>
          <div style={{ padding: P, fontSize: 13, fontWeight: 500, color: 'var(--grey3)' }}>When</div>
          <div style={{ padding: P, fontSize: 13, fontWeight: 500, color: 'var(--grey3)' }}>Then</div>
          <div style={{ padding: P, fontSize: 13, fontWeight: 500, color: 'var(--grey3)' }}>Times executed</div>
          <div style={{ padding: P, fontSize: 13, fontWeight: 500, color: 'var(--grey3)' }}>Edited on</div>
          <div style={{ padding: P, fontSize: 13, fontWeight: 500, color: 'var(--grey3)' }}>Group name</div>
          <div style={{ padding: P, fontSize: 13, fontWeight: 500, color: 'var(--grey3)' }}>Status</div>
        </div>
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
  )
}

// ── Page ───────────────────────────────────────────────────────────────────────
type PageTab = 'my-automations' | 'automation-logs'

const TABS: { key: PageTab; label: string }[] = [
  { key: 'my-automations', label: 'My automations' },
  { key: 'automation-logs', label: 'Automation logs' },
]

export default function AutomationsListPage() {
  const [activeTab, setActiveTab] = useState<PageTab>('my-automations')

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
          padding: '18px 32px 0',
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
              marginBottom: 16,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--teal-80)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--teal)')}
          >
            Create automation
          </button>

          {/* Tab nav */}
          {/* DEV: use <TabNav> from admin UI library */}
          <div style={{ display: 'flex', borderTop: '1px solid var(--grey5)' }}>
            {TABS.map(tab => {
              const active = activeTab === tab.key
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    height: 40, padding: '0 18px',
                    background: 'transparent', border: 'none',
                    borderBottom: active ? '2px solid var(--teal)' : '2px solid transparent',
                    marginBottom: -1,
                    fontSize: 14, fontWeight: active ? 700 : 400,
                    color: active ? 'var(--teal)' : 'var(--grey3)',
                    cursor: 'pointer',
                  }}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* ── Tab content ────────────────────────────────────────────────────── */}
        {activeTab === 'my-automations' && <MyAutomationsTab />}
        {activeTab === 'automation-logs' && <AutomationLogsTab />}

      </main>
    </div>
  )
}
