import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Run } from '../../data/runs'
import WhyDidEnrollPanel from './WhyDidEnrollPanel'

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
        rowType: step.type,
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

interface Props { runs: Run[] }

export default function ActionLogsTab({ runs }: Props) {
  const navigate = useNavigate()
  const [outcomeFilter, setOutcomeFilter] = useState<OutcomeFilter>('all')
  const [eventFilter, setEventFilter] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'contact' | 'timeline'>('contact')
  const [search, setSearch] = useState('')
  const [expandedErrors, setExpandedErrors] = useState<Set<string>>(new Set())
  const [panelRun, setPanelRun] = useState<Run | null>(null)

  const allRows = useMemo(() => buildRows(runs), [runs])

  // Build grouped event options from actual data
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

  const toggleError = (key: string) => {
    setExpandedErrors(prev => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }

  // Group rows by runId for "By contact" view
  const runGroups = useMemo(() => {
    const groups: Record<string, LogRow[]> = {}
    const order: string[] = []
    filtered.forEach(row => {
      if (!groups[row.runId]) { groups[row.runId] = []; order.push(row.runId) }
      groups[row.runId].push(row)
    })
    return order.map(id => groups[id])
  }, [filtered])

  // Flat rows sorted by step timestamp for Timeline view (no completion rows)
  const timelineRows = useMemo(() =>
    filtered
      .filter(r => r.rowType !== 'completion')
      .slice()
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
    [filtered]
  )

  const outcomeColor = (o: string) => o === 'success' ? 'var(--teal)' : 'var(--red)'
  const outcomeLabel = (o: string) => o === 'success' ? 'Success' : 'Failed'

  const rowVisual = (row: LogRow) => {
    if (row.rowType === 'completion') {
      return { borderLeft: '4px solid transparent', background: 'white' }
    }
    if (row.outcome === 'failed') {
      return { borderLeft: '4px solid var(--red)', background: 'white' }
    }
    if (row.rowType === 'trigger') {
      return { borderLeft: '4px solid var(--grey2)', background: 'var(--grey7)' }
    }
    return { borderLeft: '4px solid var(--grey4)', background: 'white' }
  }

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
                const isFailed = row.outcome === 'failed'
                const errorExpanded = expandedErrors.has(rowKey)
                const visual = rowVisual(row)
                return (
                  <>
                    <tr
                      key={rowKey}
                      style={{
                        borderBottom: '1px solid var(--grey6)',
                        borderLeft: visual.borderLeft,
                        background: visual.background,
                      }}
                    >
                      {/* Contact — always visible in timeline view */}
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
                      {/* Event */}
                      <td style={{ padding: '10px 16px', verticalAlign: 'middle', minWidth: 0 }}>
                        <div>
                          <div style={{ fontSize: 13, color: 'var(--grey1)' }}>
                            {row.rowType === 'trigger' && (
                              <><span style={{ fontWeight: 600, letterSpacing: '0.04em' }}>TRIGGER:</span> {row.label}</>
                            )}
                            {row.rowType === 'action' && (
                              <><span style={{ fontWeight: 600, letterSpacing: '0.04em' }}>ACTION:</span> {row.label}</>
                            )}
                            {row.rowType === 'branch' && (
                              <><span style={{ fontWeight: 600, letterSpacing: '0.04em' }}>CONTROL:</span> {row.label}</>
                            )}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                            <span style={{ fontSize: 8, color: outcomeColor(row.outcome) }}>●</span>
                            <span style={{ fontSize: 12, color: outcomeColor(row.outcome), fontWeight: 500 }}>
                              {outcomeLabel(row.outcome)}
                            </span>
                            {row.rowType === 'trigger' && (
                              <>
                                <span style={{ color: 'var(--grey4)' }}>·</span>
                                <button
                                  onClick={() => setPanelRun(row.run)}
                                  style={{ fontSize: 12, color: 'var(--grey2)', cursor: 'pointer', textDecoration: 'underline', background: 'transparent', border: 'none', padding: 0 }}
                                >
                                  Why did this enroll?
                                </button>
                              </>
                            )}
                            {isFailed && row.errorMessage && (
                              <button
                                onClick={() => toggleError(rowKey)}
                                style={{ fontSize: 11, color: 'var(--red)', marginLeft: 4, cursor: 'pointer', textDecoration: 'underline' }}
                              >
                                {errorExpanded ? 'Hide details' : 'Show details'}
                              </button>
                            )}
                          </div>
                        </div>
                      </td>
                      {/* Time */}
                      <td style={{ padding: '10px 16px', fontSize: 12, color: 'var(--grey3)', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>
                        {formatDateTime(row.timestamp)}
                      </td>
                    </tr>
                    {isFailed && errorExpanded && row.errorMessage && (
                      <tr key={`${rowKey}-error`} style={{ borderBottom: '1px solid var(--grey6)', borderLeft: '4px solid var(--red)', background: 'var(--notification-bg)' }}>
                        <td style={{ padding: '10px 16px 14px' }} />
                        <td colSpan={2} style={{ padding: '10px 16px 14px' }}>
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '10px 14px', background: 'white', border: '1px solid var(--notification-border)', borderRadius: 4, maxWidth: 520, boxSizing: 'border-box' }}>
                            <span style={{ color: 'var(--red)', fontSize: 14, flexShrink: 0, fontWeight: 700 }}>!</span>
                            <span style={{ fontSize: 13, color: 'var(--grey1)', lineHeight: 1.5, minWidth: 0, overflowWrap: 'anywhere', wordBreak: 'break-word' }}>{row.errorMessage}</span>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                )
              })
            ) : (
              runGroups.map((group) => (
                group.map((row, ri) => {
                  const rowKey = `${row.runId}-${row.stepIndex}`
                  const isFailed = row.outcome === 'failed'
                  const errorExpanded = expandedErrors.has(rowKey)
                  const isGroupStart = ri === 0
                  const isGroupEnd = ri === group.length - 1
                  const visual = rowVisual(row)

                  return (
                    <>
                      <tr
                        key={rowKey}
                        style={{
                          borderBottom: isGroupEnd ? '2px solid var(--grey5)' : '1px solid var(--grey6)',
                          borderLeft: visual.borderLeft,
                          background: visual.background,
                        }}
                      >
                        {/* Contact — only show on first row of group */}
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

                        {/* Event (includes action details) */}
                        <td style={{ padding: '10px 16px', verticalAlign: 'middle', minWidth: 0 }}>
                          <div>
                            {/* DEV: trigger/action visual mapping */}
                            {row.rowType === 'completion' ? (
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span aria-hidden="true" style={{ display: 'inline-flex' }}>
                                  <svg
                                    width="18"
                                    height="18"
                                    viewBox="0 0 18 18"
                                    style={{ display: 'block' }}
                                  >
                                    <circle cx="9" cy="9" r="8" fill="var(--completed)" />
                                    <path
                                      d="M5 9.2 7.6 12 13 6"
                                      fill="none"
                                      stroke="white"
                                      strokeWidth="1.8"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                </span>
                                <span style={{ fontSize: 13, color: 'var(--teal)', fontWeight: 500 }}>
                                  Completed workflow
                                </span>
                              </div>
                            ) : (
                              <>
                                <div style={{ fontSize: 13, color: 'var(--grey1)' }}>
                                  {row.rowType === 'trigger' && (
                                    <><span style={{ fontWeight: 600, letterSpacing: '0.04em' }}>TRIGGER:</span> {row.label}</>
                                  )}
                                  {row.rowType === 'action' && (
                                    <><span style={{ fontWeight: 600, letterSpacing: '0.04em' }}>ACTION:</span> {row.label}</>
                                  )}
                                  {row.rowType === 'branch' && (
                                    <><span style={{ fontWeight: 600, letterSpacing: '0.04em' }}>CONTROL:</span> {row.label}</>
                                  )}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                                  <span style={{ fontSize: 8, color: outcomeColor(row.outcome) }}>●</span>
                                  <span style={{ fontSize: 12, color: outcomeColor(row.outcome), fontWeight: 500 }}>
                                    {outcomeLabel(row.outcome)}
                                  </span>
                                  {row.rowType === 'trigger' && (
                                    <>
                                      <span style={{ color: 'var(--grey4)' }}>·</span>
                                      {/* DEV: use <TextButton> or <IconButton> */}
                                      <button
                                        onClick={() => setPanelRun(row.run)}
                                        style={{
                                          fontSize: 12,
                                          color: 'var(--grey2)',
                                          cursor: 'pointer',
                                          textDecoration: 'underline',
                                          background: 'transparent',
                                          border: 'none',
                                          padding: 0,
                                        }}
                                      >
                                        Why did this enroll?
                                      </button>
                                    </>
                                  )}
                                  {isFailed && row.errorMessage && (
                                    <button
                                      onClick={() => toggleError(rowKey)}
                                      style={{ fontSize: 11, color: 'var(--red)', marginLeft: 4, cursor: 'pointer', textDecoration: 'underline' }}
                                    >
                                      {errorExpanded ? 'Hide details' : 'Show details'}
                                    </button>
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                        </td>

                        {/* Time */}
                        <td style={{ padding: '10px 16px', fontSize: 12, color: 'var(--grey3)', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>
                          {formatDateTime(row.timestamp)}
                        </td>
                      </tr>

                      {/* Expanded error row */}
                      {isFailed && errorExpanded && row.errorMessage && (
                        <tr
                          key={`${rowKey}-error`}
                          style={{
                            borderBottom: '1px solid var(--grey6)',
                            borderLeft: '4px solid var(--red)',
                            background: 'white',
                          }}
                        >
                          {/* Keep table grid, align content to Event column */}
                          <td style={{ padding: '10px 16px 14px' }} />
                          <td colSpan={2} style={{ padding: '10px 16px 14px' }}>
                            <div style={{
                              display: 'flex', alignItems: 'flex-start', gap: 8,
                              padding: '10px 14px', background: 'white',
                              border: '1px solid var(--notification-border)', borderRadius: 4,
                              width: '100%',
                              maxWidth: 520,
                              boxSizing: 'border-box',
                            }}>
                              <span style={{ color: 'var(--red)', fontSize: 14, flexShrink: 0, fontWeight: 700 }}>!</span>
                              <span style={{ fontSize: 13, color: 'var(--grey1)', lineHeight: 1.5, minWidth: 0, overflowWrap: 'anywhere', wordBreak: 'break-word' }}>
                                {row.errorMessage}
                              </span>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  )
                })
              ))
            )}
          </tbody>
        </table>
      </div>

      {panelRun && (
        <WhyDidEnrollPanel run={panelRun} onClose={() => setPanelRun(null)} />
      )}
    </>
  )
}
