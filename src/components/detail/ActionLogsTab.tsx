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
  rowType: 'trigger' | 'action' | 'completion'
  stepIndex: number
  label: string
  outcome: 'success' | 'failed'
  errorMessage: string | null
  timestamp: string
  run: Run
}

function buildRows(runs: Run[]): LogRow[] {
  const rows: LogRow[] = []
  const sorted = [...runs].sort(
    (a, b) => new Date(b.enrolledAt).getTime() - new Date(a.enrolledAt).getTime()
  )
  sorted.forEach(run => {
    run.steps.forEach((step, i) => {
      rows.push({
        runId: run.id,
        userId: run.userId,
        userName: run.userName,
        userEmail: run.userEmail,
        rowType: step.type,
        stepIndex: i,
        label: step.label,
        outcome: step.outcome,
        errorMessage: step.errorMessage,
        timestamp: step.timestamp,
        run,
      })
    })
  })
  return rows
}

interface Props { runs: Run[] }

export default function ActionLogsTab({ runs }: Props) {
  const navigate = useNavigate()
  const [outcomeFilter, setOutcomeFilter] = useState<OutcomeFilter>('all')
  const [search, setSearch] = useState('')
  const [expandedErrors, setExpandedErrors] = useState<Set<string>>(new Set())
  const [panelRun, setPanelRun] = useState<Run | null>(null)

  const allRows = useMemo(() => buildRows(runs), [runs])

  const filtered = useMemo(() => {
    let rows = allRows
    if (outcomeFilter === 'failed') rows = rows.filter(r => r.outcome === 'failed')
    if (search) rows = rows.filter(r =>
      r.userName.toLowerCase().includes(search.toLowerCase()) ||
      r.userEmail.toLowerCase().includes(search.toLowerCase())
    )
    return rows
  }, [allRows, outcomeFilter, search])

  const toggleError = (key: string) => {
    setExpandedErrors(prev => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }

  // Group rows by runId for visual grouping
  const runGroups = useMemo(() => {
    const groups: Record<string, LogRow[]> = {}
    const order: string[] = []
    filtered.forEach(row => {
      if (!groups[row.runId]) { groups[row.runId] = []; order.push(row.runId) }
      groups[row.runId].push(row)
    })
    return order.map(id => groups[id])
  }, [filtered])

  const outcomeColor = (o: string) => o === 'success' ? '#029c91' : '#ec0e0e'
  const outcomeLabel = (o: string) => o === 'success' ? 'Success' : 'Failed'

  return (
    <>
      {/* Filter bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by user..."
          style={{
            height: 34, padding: '0 12px', width: 220,
            background: '#fff', border: '1px solid #e0e0e0',
            borderRadius: 4, fontSize: 13, outline: 'none',
          }}
        />
        <select
          value={outcomeFilter}
          onChange={e => setOutcomeFilter(e.target.value as OutcomeFilter)}
          style={{
            height: 34, padding: '0 12px',
            border: '1px solid #e0e0e0', borderRadius: 4,
            fontSize: 13, color: '#4f4f4f', background: '#fff', cursor: 'pointer',
          }}
        >
          <option value="all">All outcomes</option>
          <option value="failed">Failed only</option>
        </select>
        <span style={{ fontSize: 12, color: '#828282', marginLeft: 'auto' }}>
          {filtered.length} log entries
        </span>
        <button style={{
          height: 34, padding: '0 14px',
          border: '1px solid #e0e0e0', borderRadius: 4,
          fontSize: 13, color: '#4f4f4f', background: '#fff', cursor: 'pointer',
        }}>Export CSV</button>
      </div>

      {/* Table */}
      <div style={{
        background: '#fff', border: '1px solid #e0e0e0', borderRadius: 6,
        overflow: 'hidden',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9f9f9', borderBottom: '1px solid #f2f2f2' }}>
              {['Contact', 'Diagnose', 'Action', 'Event', 'Time'].map(col => (
                <th key={col} style={{
                  padding: '10px 16px', textAlign: 'left',
                  fontSize: 11, fontWeight: 600, color: '#828282',
                  textTransform: 'uppercase', letterSpacing: '0.05em',
                  whiteSpace: 'nowrap',
                }}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {runGroups.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: 48, textAlign: 'center', color: '#828282', fontSize: 13 }}>
                  No log entries match your filters
                </td>
              </tr>
            ) : (
              runGroups.map((group, gi) => (
                group.map((row, ri) => {
                  const rowKey = `${row.runId}-${row.stepIndex}`
                  const isFailed = row.outcome === 'failed'
                  const errorExpanded = expandedErrors.has(rowKey)
                  const isGroupStart = ri === 0
                  const isGroupEnd = ri === group.length - 1
                  const isEvenGroup = gi % 2 === 0

                  return (
                    <>
                      <tr
                        key={rowKey}
                        style={{
                          borderBottom: isGroupEnd ? '2px solid #e0e0e0' : '1px solid #f2f2f2',
                          borderLeft: isFailed ? '3px solid #ec0e0e' : '3px solid transparent',
                          background: isEvenGroup ? '#fff' : '#fafafa',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = '#f5f5f5')}
                        onMouseLeave={e => (e.currentTarget.style.background = isEvenGroup ? '#fff' : '#fafafa')}
                      >
                        {/* Contact — only show on first row of group */}
                        <td style={{ padding: '10px 16px', verticalAlign: 'top' }}>
                          {isGroupStart && (
                            <>
                              <button
                                onClick={() => navigate(`/user/${row.userId}`)}
                                style={{ fontSize: 13, color: '#029c91', fontWeight: 500, cursor: 'pointer', display: 'block' }}
                              >{row.userName} ↗</button>
                              <div style={{ fontSize: 12, color: '#828282' }}>{row.userEmail}</div>
                            </>
                          )}
                        </td>

                        {/* Diagnose — "Why did this enroll?" on trigger rows only */}
                        <td style={{ padding: '10px 16px', verticalAlign: 'middle' }}>
                          {row.rowType === 'trigger' && (
                            <button
                              onClick={() => setPanelRun(row.run)}
                              style={{
                                height: 28, padding: '0 10px',
                                background: '#333', color: '#fff',
                                fontSize: 11, fontWeight: 500, borderRadius: 4,
                                cursor: 'pointer', whiteSpace: 'nowrap',
                              }}
                              onMouseEnter={e => (e.currentTarget.style.background = '#4f4f4f')}
                              onMouseLeave={e => (e.currentTarget.style.background = '#333')}
                            >Why did this enroll?</button>
                          )}
                          {row.rowType !== 'trigger' && (
                            <span style={{ color: '#bdbdbd', fontSize: 13 }}>—</span>
                          )}
                        </td>

                        {/* Action */}
                        <td style={{ padding: '10px 16px', verticalAlign: 'middle' }}>
                          {row.rowType === 'action' && (
                            <div>
                              <div style={{ fontSize: 13, fontWeight: 500, color: '#333' }}>
                                {ri}. {row.label}
                              </div>
                              <div style={{ fontSize: 12, color: '#828282' }}>{row.label}</div>
                            </div>
                          )}
                          {row.rowType !== 'action' && (
                            <span style={{ color: '#bdbdbd', fontSize: 13 }}>—</span>
                          )}
                        </td>

                        {/* Event */}
                        <td style={{ padding: '10px 16px', verticalAlign: 'middle' }}>
                          <div>
                            <div style={{ fontSize: 13, color: '#333' }}>
                              {row.rowType === 'trigger'
                                ? `Triggered from: ${row.label}`
                                : row.rowType === 'completion'
                                  ? 'Completed workflow'
                                  : row.outcome === 'failed' ? 'Action failed' : 'Action succeeded'
                              }
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                              <span style={{ fontSize: 8, color: outcomeColor(row.outcome) }}>●</span>
                              <span style={{ fontSize: 12, color: outcomeColor(row.outcome), fontWeight: 500 }}>
                                {outcomeLabel(row.outcome)}
                              </span>
                              {isFailed && row.errorMessage && (
                                <button
                                  onClick={() => toggleError(rowKey)}
                                  style={{ fontSize: 11, color: '#ec0e0e', marginLeft: 4, cursor: 'pointer', textDecoration: 'underline' }}
                                >
                                  {errorExpanded ? 'Hide details' : 'Show details'}
                                </button>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Time */}
                        <td style={{ padding: '10px 16px', fontSize: 12, color: '#828282', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>
                          {formatDateTime(row.timestamp)}
                        </td>
                      </tr>

                      {/* Expanded error row */}
                      {isFailed && errorExpanded && row.errorMessage && (
                        <tr
                          key={`${rowKey}-error`}
                          style={{
                            borderBottom: '1px solid #f2f2f2',
                            borderLeft: '3px solid #ec0e0e',
                            background: '#fff5f5',
                          }}
                        >
                          <td />
                          <td colSpan={4} style={{ padding: '10px 16px 14px' }}>
                            <div style={{
                              display: 'flex', alignItems: 'flex-start', gap: 8,
                              padding: '10px 14px', background: '#fff',
                              border: '1px solid #fecaca', borderRadius: 4,
                            }}>
                              <span style={{ color: '#ec0e0e', fontSize: 14, flexShrink: 0 }}>⚠</span>
                              <span style={{ fontSize: 13, color: '#333', lineHeight: 1.5 }}>
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
