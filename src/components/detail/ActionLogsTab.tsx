import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Run } from '../../data/runs'

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

type OutcomeFilter = 'all' | 'failed'

interface LogRow {
  runId: string
  userId: string
  userName: string
  userEmail: string
  rowType: 'trigger' | 'action' | 'branch' | 'completion'
  stepIndex: number
  label: string
  outcome: 'success' | 'failed'
  errorMessage: string | null
  timestamp: string
  run: Run
}

// DEV: use <Tooltip> / <IconButton> / <InlineHelpIcon>
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

function buildRows(runs: Run[]): LogRow[] {
  const sorted = [...runs].sort(
    (a, b) => new Date(b.enrolledAt).getTime() - new Date(a.enrolledAt).getTime()
  )

  return sorted.flatMap(run => {
    const base = {
      runId: run.id,
      userId: run.userId,
      userName: run.userName,
      userEmail: run.userEmail,
      run,
    }

    const triggerStep = run.steps.find(s => s.type === 'trigger')
    const actionSteps = run.steps.filter(s => s.type === 'action' || s.type === 'branch')
    const completionStep = run.steps.find(s => s.type === 'completion')

    const rows: LogRow[] = []

    if (triggerStep) {
      rows.push({
        ...base,
        rowType: 'trigger',
        stepIndex: 0,
        label: triggerStep.label,
        outcome: triggerStep.outcome,
        errorMessage: triggerStep.errorMessage,
        timestamp: triggerStep.timestamp,
      })
    }

    actionSteps.forEach((step, idx) => {
      rows.push({
        ...base,
        rowType: step.type as 'action' | 'branch',
        stepIndex: idx + 1,
        label: step.label,
        outcome: step.outcome,
        errorMessage: step.errorMessage,
        timestamp: step.timestamp,
      })
    })

    if (completionStep) {
      rows.push({
        ...base,
        rowType: 'completion',
        stepIndex: actionSteps.length + 1,
        label: completionStep.label,
        outcome: completionStep.outcome,
        errorMessage: completionStep.errorMessage,
        timestamp: completionStep.timestamp,
      })
    }

    return rows
  })
}

function rowTypeLabel(rowType: LogRow['rowType']): string {
  if (rowType === 'trigger') return 'Trigger'
  if (rowType === 'action') return 'Action'
  if (rowType === 'branch') return 'Automation control'
  return ''
}

function rowVisual(row: LogRow) {
  if (row.rowType === 'completion') return { borderLeft: '4px solid transparent', background: 'white' }
  if (row.outcome === 'failed') return { borderLeft: '4px solid var(--red)', background: 'white' }
  if (row.rowType === 'trigger') return { borderLeft: '4px solid var(--grey2)', background: 'var(--grey7)' }
  return { borderLeft: '4px solid var(--grey4)', background: 'white' }
}

// DEV: use <LogRow>, <TextMeta>, <StatusInline> or equivalent admin UI components
function EventCell({ row }: { row: LogRow }) {
  if (row.rowType === 'completion') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span aria-hidden="true" style={{ display: 'inline-flex' }}>
          <svg width="18" height="18" viewBox="0 0 18 18" style={{ display: 'block' }}>
            <circle cx="9" cy="9" r="8" fill="var(--completed)" />
            <path d="M5 9.2 7.6 12 13 6" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span style={{ fontSize: 13, color: 'var(--teal)', fontWeight: 500 }}>
          Completed automation
        </span>
      </div>
    )
  }

  const isFailed = row.outcome === 'failed'
  const showFailed = isFailed && (row.rowType === 'action' || row.rowType === 'branch')

  return (
    <div>
      {/* Primary: action/trigger name */}
      <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--grey1)' }}>
        {row.label}
      </div>
      {/* Secondary: type label + failed feedback */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
        {showFailed ? (
          <>
            <span style={{ fontSize: 12, color: 'var(--red)', fontWeight: 500 }}>
              {rowTypeLabel(row.rowType)} Failed
            </span>
            {row.errorMessage && <HelpIcon message={row.errorMessage} />}
          </>
        ) : (
          <span style={{ fontSize: 12, color: 'var(--grey3)' }}>
            {rowTypeLabel(row.rowType)}
          </span>
        )}
      </div>
    </div>
  )
}

interface Props { runs: Run[] }

export default function ActionLogsTab({ runs }: Props) {
  const navigate = useNavigate()
  const [outcomeFilter, setOutcomeFilter] = useState<OutcomeFilter>('all')
  const [eventFilter, setEventFilter] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'contact' | 'timeline'>('contact')
  const [search, setSearch] = useState('')

  const allRows = useMemo(() => buildRows(runs), [runs])

  const eventOptions = useMemo(() => {
    const triggers = new Set<string>()
    const actions = new Set<string>()
    const controls = new Set<string>()
    allRows.forEach(r => {
      if (r.rowType === 'trigger') triggers.add(r.label)
      else if (r.rowType === 'action') actions.add(r.label)
      else if (r.rowType === 'branch') controls.add(r.label)
    })
    return { triggers: [...triggers], actions: [...actions], controls: [...controls] }
  }, [allRows])

  const filtered = useMemo(() => {
    let rows = allRows
    if (outcomeFilter === 'failed') rows = rows.filter(r => r.outcome === 'failed')
    if (eventFilter !== 'all') rows = rows.filter(r => r.label === eventFilter)
    if (search) rows = rows.filter(r =>
      r.userName.toLowerCase().includes(search.toLowerCase()) ||
      r.userEmail.toLowerCase().includes(search.toLowerCase())
    )
    return rows
  }, [allRows, outcomeFilter, eventFilter, search])

  const runGroups = useMemo(() => {
    const groups: Record<string, LogRow[]> = {}
    const order: string[] = []
    filtered.forEach(row => {
      if (!groups[row.runId]) { groups[row.runId] = []; order.push(row.runId) }
      groups[row.runId].push(row)
    })
    return order.map(id => groups[id])
  }, [filtered])

  const timelineRows = useMemo(() =>
    filtered
      .filter(r => r.rowType !== 'completion')
      .slice()
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
    [filtered]
  )

  return (
    <>
      {/* Filter bar */}
      {/* DEV: use <SearchInput>, <FilterDropdown>, <Button variant="secondary"> */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        {/* DEV: use <SegmentedControl> or <ViewToggle> */}
        <select
          value={viewMode}
          onChange={e => setViewMode(e.target.value as 'contact' | 'timeline')}
          style={{
            height: 34, padding: '0 12px',
            border: '1px solid var(--grey5)', borderRadius: 4,
            fontSize: 13, color: 'var(--grey2)', background: 'white', cursor: 'pointer',
          }}
        >
          <option value="contact">By contact</option>
          <option value="timeline">Timeline</option>
        </select>
        <div style={{ width: 1, height: 20, background: 'var(--grey5)', flexShrink: 0 }} />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by user..."
          style={{
            height: 34, padding: '0 12px', width: 220,
            background: 'white', border: '1px solid var(--grey5)',
            borderRadius: 4, fontSize: 13, outline: 'none',
          }}
        />
        <select
          value={outcomeFilter}
          onChange={e => setOutcomeFilter(e.target.value as OutcomeFilter)}
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
          onChange={e => setEventFilter(e.target.value)}
          style={{
            height: 34, padding: '0 12px',
            border: '1px solid var(--grey5)', borderRadius: 4,
            fontSize: 13, color: 'var(--grey2)', background: 'white', cursor: 'pointer',
          }}
        >
          <option value="all">All events</option>
          {eventOptions.triggers.length > 0 && (
            <optgroup label="Triggers">
              {eventOptions.triggers.map(t => <option key={t} value={t}>{t}</option>)}
            </optgroup>
          )}
          {eventOptions.actions.length > 0 && (
            <optgroup label="Actions">
              {eventOptions.actions.map(a => <option key={a} value={a}>{a}</option>)}
            </optgroup>
          )}
          {eventOptions.controls.length > 0 && (
            <optgroup label="Controls">
              {eventOptions.controls.map(c => <option key={c} value={c}>{c}</option>)}
            </optgroup>
          )}
        </select>
        <span style={{ fontSize: 12, color: 'var(--grey3)', marginLeft: 'auto' }}>
          {viewMode === 'timeline' ? timelineRows.length : filtered.length} log entries
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
          Export CSV
        </button>
      </div>

      {/* Table */}
      {/* DEV: use <DataTable> with grouped rows */}
      <div style={{
        background: 'white', border: '1px solid var(--grey5)', borderRadius: 6,
        overflow: 'hidden',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
          <colgroup>
            <col style={{ width: 280 }} />
            <col />
            <col style={{ width: 170 }} />
          </colgroup>
          <thead>
            <tr style={{ background: 'var(--cool-grey)', borderBottom: '1px solid var(--grey5)' }}>
              {['Contact', 'Event', 'Time'].map(col => (
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
            {(viewMode === 'contact' ? runGroups.length === 0 : timelineRows.length === 0) ? (
              <tr>
                <td colSpan={3} style={{ padding: 48, textAlign: 'center', color: 'var(--grey3)', fontSize: 13 }}>
                  No log entries match your filters
                </td>
              </tr>
            ) : viewMode === 'timeline' ? (
              timelineRows.map(row => {
                const rowKey = `${row.runId}-${row.stepIndex}`
                const visual = rowVisual(row)
                return (
                  <tr
                    key={rowKey}
                    style={{
                      borderBottom: '1px solid var(--grey6)',
                      borderLeft: visual.borderLeft,
                      background: visual.background,
                    }}
                  >
                    <td style={{ padding: '10px 16px', verticalAlign: 'top' }}>
                      <div>
                        {/* DEV: link to user profile */}
                        <button
                          onClick={() => navigate(`/user/${row.userId}`)}
                          style={{ fontSize: 13, color: 'var(--teal)', fontWeight: 500, cursor: 'pointer', display: 'block' }}
                        >
                          {row.userName}
                        </button>
                        <div style={{ fontSize: 12, color: 'var(--grey3)' }}>{row.userEmail}</div>
                      </div>
                    </td>
                    <td style={{ padding: '10px 16px', verticalAlign: 'middle', minWidth: 0 }}>
                      <EventCell row={row} />
                    </td>
                    <td style={{ padding: '10px 16px', fontSize: 12, color: 'var(--grey3)', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>
                      {formatDateTime(row.timestamp)}
                    </td>
                  </tr>
                )
              })
            ) : (
              runGroups.map((group) => (
                group.map((row, ri) => {
                  const rowKey = `${row.runId}-${row.stepIndex}`
                  const isGroupStart = ri === 0
                  const isGroupEnd = ri === group.length - 1
                  const visual = rowVisual(row)

                  return (
                    <tr
                      key={rowKey}
                      style={{
                        borderBottom: isGroupEnd ? '2px solid var(--grey5)' : '1px solid var(--grey6)',
                        borderLeft: visual.borderLeft,
                        background: visual.background,
                      }}
                    >
                      <td style={{ padding: '10px 16px', verticalAlign: 'top' }}>
                        {isGroupStart && (
                          <div style={{ padding: '6px 8px', borderRadius: 4 }}>
                            {/* DEV: link to user profile */}
                            <button
                              onClick={() => navigate(`/user/${row.userId}`)}
                              style={{ fontSize: 13, color: 'var(--teal)', fontWeight: 500, cursor: 'pointer', display: 'block' }}
                            >
                              {row.userName}
                            </button>
                            <div style={{ fontSize: 12, color: 'var(--grey3)' }}>{row.userEmail}</div>
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '10px 16px', verticalAlign: 'middle', minWidth: 0 }}>
                        <EventCell row={row} />
                      </td>
                      <td style={{ padding: '10px 16px', fontSize: 12, color: 'var(--grey3)', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>
                        {formatDateTime(row.timestamp)}
                      </td>
                    </tr>
                  )
                })
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}
