import { useState, useMemo } from 'react'
import { Run } from '../../data/runs'

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

// DEV: use <Tooltip> / <InlineHelpIcon>
function HelpIcon({ message }: { message: string }) {
  const [open, setOpen] = useState(false)
  return (
    <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}
      onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <span style={{ width: 14, height: 14, borderRadius: '50%', border: '1px solid var(--red)', color: 'var(--red)', fontSize: 10, fontWeight: 700, cursor: 'default', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1, flexShrink: 0 }}>?</span>
      {open && (
        <div style={{ position: 'absolute', bottom: 'calc(100% + 6px)', left: '50%', transform: 'translateX(-50%)', background: 'var(--grey1)', color: '#fff', fontSize: 12, lineHeight: 1.5, padding: '6px 10px', borderRadius: 4, whiteSpace: 'normal', width: 240, zIndex: 100, pointerEvents: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.18)' }}>
          {message}
        </div>
      )}
    </span>
  )
}

export type RunStatus = Run['status']
export type StatusFilter = 'all' | 'in_flow' | RunStatus

export function statusLabel(status: RunStatus): string {
  const map: Record<RunStatus, string> = {
    in_progress:   'Pending',
    executing:     'Executing',
    completed:     'Fulfilled',
    exited:        'Completed via exit condition',
    failed:        'Failed',
    failed_silent: 'Failed silently',
  }
  return map[status]
}

// ── Config chip system ────────────────────────────────────────────────────────

// Signup configs vary per user — picked deterministically by seed
const SIGNUP_CONFIGS: string[][] = [
  ['LearnWorlds', 'Google', 'Apple'],
  ['LearnWorlds'],
  ['Google', 'Apple'],
  ['Any'],
  ['LearnWorlds', 'Apple', 'Google'],
  ['Google'],
]

const STEP_CONFIG: Record<string, string[]> = {
  // Triggers — 'User signs up' handled separately with seed
  'User signs up':              [],  // overridden by seed
  'Course completed':           ['Web Dev Bootcamp', 'UX Fundamentals', 'Python Basics'],
  'User inactive for 30 days':  [],
  'User finishes free course':  ['Free JavaScript 101'],
  'Admin manually enrolls user': [],
  'Instructor account created': [],
  'User birthday':              [],
  'Scheduled monthly':          [],
  // Actions
  'Send welcome email':         ['Welcome v2 template'],
  'Add to newsletter tag':      ['newsletter', 'onboarding', 'welcome'],
  'Wait 3 days':                ['3 days'],
  'Branch':                     ['Has tag: active', 'Enrolled in course'],
  'Award completion badge':     ['Course Completion'],
  'Send congratulations email': ['Congrats v1 template'],
  'Add premium tag':            ['premium'],
  'Send re-engagement email':   ['Re-engage v1', 'Subject: We miss you', 'Delay: 7 days'],
  'Add re-engagement tag':      ['re-engagement'],
  'Send upsell offer email':    ['Upsell v2 template'],
  'Add upsell-pending tag':     ['upsell-pending'],
  'Enroll in onboarding course': ['Onboarding path 2026'],
  'Create instructor profile':   [],
  'Send welcome kit':            ['Instructor Kit v3'],
  'Send upsell email':           ['Premium offer template'],
  'Add to premium leads':        ['premium-leads'],
  'Send birthday email':         ['Birthday template'],
  'Issue 20% coupon':            ['BIRTHDAY20'],
  'Send newsletter':             ['May Newsletter'],
  'Track opens':                 [],
}

function truncate(text: string, max: number): string {
  return text.length > max ? text.slice(0, max - 1) + '…' : text
}

function seedIndex(seed: string, len: number): number {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) & 0xffffffff
  return Math.abs(h) % len
}

// DEV: use <Chips.SingleChip>
function ConfigChips({ label, seed = '' }: { label: string; seed?: string }) {
  const base = label === 'User signs up'
    ? SIGNUP_CONFIGS[seedIndex(seed, SIGNUP_CONFIGS.length)]
    : STEP_CONFIG[label]

  if (!base || base.length === 0) {
    return <span style={{ fontSize: 12, color: 'var(--grey4)', fontStyle: 'italic' }}>no configuration needed</span>
  }

  const visible = base.slice(0, 2)
  const overflow = base.length - 2
  const maxChars = visible.length === 1 ? 28 : 20

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'nowrap', marginTop: 3 }}>
      {visible.map((cfg, i) => (
        <span key={i} style={{
          display: 'inline-block',
          padding: '2px 7px', borderRadius: 4,
          fontSize: 12, background: '#E0E0E0', color: 'var(--grey2)',
          whiteSpace: 'nowrap', maxWidth: `${maxChars}ch`,
          overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {truncate(cfg, maxChars)}
        </span>
      ))}
      {overflow > 0 && (
        <span style={{ display: 'inline-block', padding: '2px 7px', borderRadius: 4, fontSize: 12, background: '#E0E0E0', color: 'var(--grey2)', whiteSpace: 'nowrap', flexShrink: 0 }}>+{overflow}</span>
      )}
    </div>
  )
}

function matchesStatusFilter(run: Run, filter: StatusFilter): boolean {
  if (filter === 'all') return true
  if (filter === 'in_flow') return run.status === 'in_progress' || run.status === 'executing'
  return run.status === filter
}

const STATUS_FILTER_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: 'all',           label: 'All statuses' },
  { value: 'in_progress',   label: 'Pending' },
  { value: 'executing',     label: 'Executing' },
  { value: 'completed',     label: 'Fulfilled' },
  { value: 'exited',        label: 'Completed via exit condition' },
  { value: 'failed',        label: 'Failed' },
  { value: 'failed_silent', label: 'Failed silently' },
]

function stepTypeLabel(type: 'action' | 'branch'): string {
  return type === 'branch' ? 'Automation control' : 'Action'
}

interface Props {
  runs: Run[]
  statusFilter: StatusFilter
  onStatusFilterChange: (f: StatusFilter) => void
}

export default function AutomationLogsTab({ runs, statusFilter, onStatusFilterChange }: Props) {
  const [expandedRunIds, setExpandedRunIds] = useState<Set<string>>(new Set())
  const [search, setSearch] = useState('')
  const [errorsOnly, setErrorsOnly] = useState(false)
  const [eventFilter, setEventFilter] = useState<string>('all')

  const sortedRuns = useMemo(() =>
    [...runs].sort((a, b) => {
      const at = a.steps.find(s => s.type === 'trigger')?.timestamp ?? a.enrolledAt
      const bt = b.steps.find(s => s.type === 'trigger')?.timestamp ?? b.enrolledAt
      return new Date(bt).getTime() - new Date(at).getTime()
    }), [runs]
  )

  const triggerOptions = useMemo(() => {
    const labels = new Set<string>()
    runs.forEach(r => { const t = r.steps.find(s => s.type === 'trigger'); if (t) labels.add(t.label) })
    return [...labels]
  }, [runs])

  const filtered = useMemo(() =>
    sortedRuns.filter(run => {
      if (!matchesStatusFilter(run, statusFilter)) return false
      if (errorsOnly && run.status !== 'failed' && run.status !== 'failed_silent') return false
      if (eventFilter !== 'all') {
        const t = run.steps.find(s => s.type === 'trigger')
        if (!t || t.label !== eventFilter) return false
      }
      if (search) {
        const q = search.toLowerCase()
        if (!run.userName.toLowerCase().includes(q) && !run.userEmail.toLowerCase().includes(q)) return false
      }
      return true
    }), [sortedRuns, statusFilter, errorsOnly, eventFilter, search]
  )

  const [allExpanded, setAllExpanded] = useState(false)

  const toggleExpand = (runId: string) => {
    setExpandedRunIds(prev => {
      const next = new Set(prev)
      if (next.has(runId)) next.delete(runId)
      else next.add(runId)
      return next
    })
  }

  const toggleExpandAll = () => {
    if (allExpanded) {
      setExpandedRunIds(new Set())
      setAllExpanded(false)
    } else {
      setExpandedRunIds(new Set(filtered.map(r => r.id)))
      setAllExpanded(true)
    }
  }

  return (
    <>
      {/* Filter bar */}
      {/* DEV: use <SearchInput>, <FilterDropdown>, <FilterToggle> */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by user..."
          style={{ height: 34, padding: '0 12px', width: 200, background: 'white', border: '1px solid var(--grey5)', borderRadius: 4, fontSize: 13, outline: 'none' }}
        />
        {/* Errors only checkbox */}
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, height: 34, padding: '0 10px', border: `1px solid ${errorsOnly ? 'var(--red)' : 'var(--grey5)'}`, borderRadius: 4, background: errorsOnly ? 'var(--light-red)' : 'white', fontSize: 13, color: errorsOnly ? 'var(--red)' : 'var(--grey2)', cursor: 'pointer', userSelect: 'none' }}>
          <input type="checkbox" checked={errorsOnly} onChange={e => setErrorsOnly(e.target.checked)} style={{ accentColor: 'var(--red)', width: 13, height: 13 }} />
          Errors only
        </label>
        {/* Expand / Collapse all — DEV: use <IconButton label="Expand all rows"> */}
        <button
          onClick={toggleExpandAll}
          style={{ display: 'flex', alignItems: 'center', gap: 6, height: 34, padding: '0 10px', border: '1px solid var(--grey5)', borderRadius: 4, background: 'white', fontSize: 13, color: 'var(--grey2)', cursor: 'pointer', userSelect: 'none' }}
        >
          {allExpanded ? (
            <>
              {/* fa-angles-up-down inverted: chevrons pointing inward = collapse */}
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="2,4 7,7 12,4" />
                <polyline points="2,10 7,7 12,10" />
              </svg>
              Collapse all rows
            </>
          ) : (
            <>
              {/* fa-angles-up-down: chevrons pointing outward = expand */}
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="2,5 7,2 12,5" />
                <polyline points="2,9 7,12 12,9" />
              </svg>
              Expand all rows
            </>
          )}
        </button>
        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={e => onStatusFilterChange(e.target.value as StatusFilter)}
          style={{ height: 34, padding: '0 12px', border: '1px solid var(--grey5)', borderRadius: 4, fontSize: 13, color: 'var(--grey2)', background: 'white', cursor: 'pointer' }}
        >
          {STATUS_FILTER_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        {/* Trigger filter */}
        <select
          value={eventFilter}
          onChange={e => setEventFilter(e.target.value)}
          style={{ height: 34, padding: '0 12px', border: '1px solid var(--grey5)', borderRadius: 4, fontSize: 13, color: 'var(--grey2)', background: 'white', cursor: 'pointer' }}
        >
          <option value="all">All triggers</option>
          {triggerOptions.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <span style={{ fontSize: 12, color: 'var(--grey3)', marginLeft: 'auto' }}>{filtered.length} log entries</span>
        <button type="button" onClick={() => {}} style={{ height: 34, padding: '0 14px', border: '1px solid var(--grey5)', borderRadius: 4, fontSize: 13, color: 'var(--grey2)', background: 'white', cursor: 'pointer' }}>Export CSV</button>
      </div>

      {/* Table */}
      {/* DEV: use <DataTable> with expandable rows */}
      <div style={{ background: 'white', border: '1px solid var(--grey5)', borderRadius: 6, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
          <colgroup>
            <col style={{ width: 280 }} />
            <col />
            <col style={{ width: 200 }} />
            <col style={{ width: 170 }} />
          </colgroup>
          <thead>
            <tr style={{ background: 'var(--cool-grey)', borderBottom: '1px solid var(--grey5)' }}>
              {['Contact', 'Event', 'Status', 'Time'].map(col => (
                <th key={col} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--grey3)', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={4} style={{ padding: 48, textAlign: 'center', color: 'var(--grey3)', fontSize: 13 }}>No log entries match your filters</td></tr>
            ) : (
              filtered.map(run => {
                const triggerStep = run.steps.find(s => s.type === 'trigger')
                const actionSteps = run.steps.filter(s => s.type === 'action' || s.type === 'branch')
                const isExpanded = expandedRunIds.has(run.id)

                return (
                  <>
                    {/* Trigger row */}
                    <tr key={run.id} style={{ borderBottom: isExpanded ? '1px solid var(--grey6)' : '2px solid var(--grey5)', background: 'white' }}>
                      <td style={{ padding: '10px 16px', verticalAlign: 'middle' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <button
                            onClick={() => toggleExpand(run.id)}
                            style={{ width: 18, height: 18, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--grey3)', fontSize: 10, padding: 0, transition: 'transform 0.15s', transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}
                          >▶</button>
                          <div>
                            {/* DEV: link → user profile Activity tab, new tab */}
                            <button
                              onClick={() => window.open(`/user/${run.userId}?tab=activity`, '_blank')}
                              style={{ fontSize: 13, color: 'var(--teal)', fontWeight: 500, cursor: 'pointer', display: 'block', background: 'none', border: 'none', padding: 0, textAlign: 'left' }}
                            >{run.userName}</button>
                            <div style={{ fontSize: 12, color: 'var(--grey3)' }}>{run.userEmail}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '10px 16px', verticalAlign: 'middle' }}>
                        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--grey1)' }}>{triggerStep?.label ?? run.triggerEvent}</div>
                        <ConfigChips label={triggerStep?.label ?? run.triggerEvent} seed={run.userId} />
                      </td>
                      <td style={{ padding: '10px 16px', verticalAlign: 'middle' }}>
                        <span style={{ fontSize: 13, color: 'var(--grey2)' }}>{statusLabel(run.status)}</span>
                      </td>
                      <td style={{ padding: '10px 16px', fontSize: 12, color: 'var(--grey2)', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>
                        {triggerStep ? formatDateTime(triggerStep.timestamp) : formatDateTime(run.enrolledAt)}
                      </td>
                    </tr>

                    {/* Expanded rows */}
                    {isExpanded && actionSteps.map((step, idx) => {
                      const isFailed = step.outcome === 'failed'
                      const isLast = idx === actionSteps.length - 1
                      return (
                        <tr key={`${run.id}-step-${idx}`} style={{ borderBottom: isLast ? '2px solid var(--grey5)' : '1px solid var(--grey6)', background: 'var(--grey7)' }}>
                          <td style={{ padding: '8px 16px' }} />
                          <td style={{ padding: '8px 16px', verticalAlign: 'middle' }}>
                            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--grey1)' }}>{step.label}</div>
                            {isFailed ? (
                              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                                <span style={{ fontSize: 12, color: 'var(--red)', fontWeight: 500 }}>{stepTypeLabel(step.type as 'action' | 'branch')} Failed</span>
                                {step.errorMessage && <HelpIcon message={step.errorMessage} />}
                              </div>
                            ) : (
                              <ConfigChips label={step.label} />
                            )}
                          </td>
                          <td style={{ padding: '8px 16px' }} />
                          <td style={{ padding: '8px 16px', fontSize: 12, color: 'var(--grey4)', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>{formatDateTime(step.timestamp)}</td>
                        </tr>
                      )
                    })}
                  </>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}
