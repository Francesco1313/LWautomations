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

function statusLabel(status: Run['status']): string {
  if (status === 'completed') return 'Executed'
  if (status === 'failed') return 'Not fulfilled'
  if (status === 'in_progress') return 'In progress'
  return 'Exited'
}

function statusStyle(status: Run['status']): React.CSSProperties {
  if (status === 'completed') return { background: 'var(--light-green)', color: 'var(--completed)' }
  if (status === 'failed') return { background: 'var(--light-red)', color: 'var(--red)' }
  if (status === 'in_progress') return { background: '#FFF3E0', color: '#E65100' }
  return { background: 'var(--grey6)', color: 'var(--grey3)' }
}

// DEV: use <StatusBadge>
function StatusBadge({ status }: { status: Run['status'] }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '2px 8px', borderRadius: 3,
      fontSize: 12, fontWeight: 500,
      whiteSpace: 'nowrap',
      ...statusStyle(status),
    }}>
      {statusLabel(status)}
    </span>
  )
}

function stepTypeLabel(type: 'action' | 'branch'): string {
  return type === 'branch' ? 'Automation control' : 'Action'
}

interface Props { runs: Run[] }

export default function AutomationLogsTab({ runs }: Props) {
  const navigate = useNavigate()
  const [expandedRunIds, setExpandedRunIds] = useState<Set<string>>(new Set())
  const [search, setSearch] = useState('')
  const [outcomeFilter, setOutcomeFilter] = useState<OutcomeFilter>('all')
  const [eventFilter, setEventFilter] = useState<string>('all')

  const sortedRuns = useMemo(() =>
    [...runs].sort((a, b) => {
      const at = a.steps.find(s => s.type === 'trigger')?.timestamp ?? a.enrolledAt
      const bt = b.steps.find(s => s.type === 'trigger')?.timestamp ?? b.enrolledAt
      return new Date(bt).getTime() - new Date(at).getTime()
    }),
    [runs]
  )

  const triggerOptions = useMemo(() => {
    const labels = new Set<string>()
    runs.forEach(r => {
      const t = r.steps.find(s => s.type === 'trigger')
      if (t) labels.add(t.label)
    })
    return [...labels]
  }, [runs])

  const filtered = useMemo(() => {
    return sortedRuns.filter(run => {
      if (outcomeFilter === 'failed' && run.status !== 'failed') return false
      if (eventFilter !== 'all') {
        const t = run.steps.find(s => s.type === 'trigger')
        if (!t || t.label !== eventFilter) return false
      }
      if (search) {
        const q = search.toLowerCase()
        if (!run.userName.toLowerCase().includes(q) && !run.userEmail.toLowerCase().includes(q)) return false
      }
      return true
    })
  }, [sortedRuns, outcomeFilter, eventFilter, search])

  const toggleExpand = (runId: string) => {
    setExpandedRunIds(prev => {
      const next = new Set(prev)
      if (next.has(runId)) next.delete(runId)
      else next.add(runId)
      return next
    })
  }

  return (
    <>
      {/* Filter bar */}
      {/* DEV: use <SearchInput>, <FilterDropdown>, <Button variant="secondary"> */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
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
          {triggerOptions.map(t => <option key={t} value={t}>{t}</option>)}
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
          Export CSV
        </button>
      </div>

      {/* Table */}
      {/* DEV: use <DataTable> with expandable rows */}
      <div style={{
        background: 'white', border: '1px solid var(--grey5)', borderRadius: 6,
        overflow: 'hidden',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
          <colgroup>
            <col style={{ width: 280 }} />
            <col />
            <col style={{ width: 130 }} />
            <col style={{ width: 170 }} />
          </colgroup>
          <thead>
            <tr style={{ background: 'var(--cool-grey)', borderBottom: '1px solid var(--grey5)' }}>
              {['Contact', 'Event', 'Status', 'Time'].map(col => (
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
                <td colSpan={4} style={{ padding: 48, textAlign: 'center', color: 'var(--grey3)', fontSize: 13 }}>
                  No log entries match your filters
                </td>
              </tr>
            ) : (
              filtered.map(run => {
                const triggerStep = run.steps.find(s => s.type === 'trigger')
                const actionSteps = run.steps.filter(s => s.type === 'action' || s.type === 'branch')
                const isExpanded = expandedRunIds.has(run.id)
                return (
                  <>
                    {/* Trigger row */}
                    <tr
                      key={run.id}
                      style={{
                        borderBottom: isExpanded ? '1px solid var(--grey6)' : '2px solid var(--grey5)',
                        background: 'white',
                      }}
                    >
                      {/* Contact */}
                      <td style={{ padding: '10px 16px', verticalAlign: 'middle' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          {/* DEV: use <ExpandButton> / <IconButton icon="chevron-right"> */}
                          <button
                            onClick={() => toggleExpand(run.id)}
                            style={{
                              width: 18, height: 18, flexShrink: 0,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              background: 'none', border: 'none', cursor: 'pointer',
                              color: 'var(--grey3)', fontSize: 10, padding: 0,
                              transition: 'transform 0.15s',
                              transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                            }}
                            aria-label={isExpanded ? 'Collapse' : 'Expand'}
                          >
                            ▶
                          </button>
                          <div>
                            {/* DEV: link to user profile */}
                            <button
                              onClick={() => navigate(`/user/${run.userId}`)}
                              style={{
                                fontSize: 13, color: 'var(--teal)', fontWeight: 500,
                                cursor: 'pointer', display: 'block',
                                background: 'none', border: 'none', padding: 0, textAlign: 'left',
                              }}
                            >
                              {run.userName}
                            </button>
                            <div style={{ fontSize: 12, color: 'var(--grey3)' }}>{run.userEmail}</div>
                          </div>
                        </div>
                      </td>
                      {/* Event */}
                      <td style={{ padding: '10px 16px', verticalAlign: 'middle' }}>
                        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--grey1)' }}>
                          {triggerStep?.label ?? run.triggerEvent}
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--grey3)', marginTop: 2 }}>Trigger</div>
                      </td>
                      {/* Status */}
                      <td style={{ padding: '10px 16px', verticalAlign: 'middle' }}>
                        <StatusBadge status={run.status} />
                      </td>
                      {/* Time */}
                      <td style={{ padding: '10px 16px', fontSize: 12, color: 'var(--grey2)', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>
                        {triggerStep ? formatDateTime(triggerStep.timestamp) : formatDateTime(run.enrolledAt)}
                      </td>
                    </tr>

                    {/* Expanded action/branch rows */}
                    {isExpanded && actionSteps.map((step, idx) => {
                      const isFailed = step.outcome === 'failed'
                      const isLast = idx === actionSteps.length - 1
                      return (
                        <tr
                          key={`${run.id}-step-${idx}`}
                          style={{
                            borderBottom: isLast ? '2px solid var(--grey5)' : '1px solid var(--grey6)',
                            background: 'var(--grey7)',
                          }}
                        >
                          {/* Contact — empty */}
                          <td style={{ padding: '8px 16px' }} />
                          {/* Event */}
                          <td style={{ padding: '8px 16px', verticalAlign: 'middle' }}>
                            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--grey1)' }}>
                              {step.label}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                              {isFailed ? (
                                <>
                                  <span style={{ fontSize: 12, color: 'var(--red)', fontWeight: 500 }}>
                                    {stepTypeLabel(step.type as 'action' | 'branch')} Failed
                                  </span>
                                  {step.errorMessage && <HelpIcon message={step.errorMessage} />}
                                </>
                              ) : (
                                <span style={{ fontSize: 12, color: 'var(--grey3)' }}>
                                  {stepTypeLabel(step.type as 'action' | 'branch')}
                                </span>
                              )}
                            </div>
                          </td>
                          {/* Status — empty */}
                          <td style={{ padding: '8px 16px' }} />
                          {/* Time — lighter */}
                          <td style={{ padding: '8px 16px', fontSize: 12, color: 'var(--grey4)', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>
                            {formatDateTime(step.timestamp)}
                          </td>
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
