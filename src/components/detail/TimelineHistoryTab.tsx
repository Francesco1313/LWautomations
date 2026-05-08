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
  rowType: 'trigger' | 'action' | 'branch'
  stepIndex: number
  label: string
  outcome: 'success' | 'failed'
  errorMessage: string | null
  timestamp: string
}

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
  const rows: LogRow[] = []
  runs.forEach(run => {
    const base = { runId: run.id, userId: run.userId, userName: run.userName, userEmail: run.userEmail }
    run.steps.forEach((step, idx) => {
      if (step.type === 'completion') return
      rows.push({
        ...base,
        rowType: step.type as 'trigger' | 'action' | 'branch',
        stepIndex: idx,
        label: step.label,
        outcome: step.outcome,
        errorMessage: step.errorMessage,
        timestamp: step.timestamp,
      })
    })
  })
  return rows.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

function rowTypeLabel(rowType: LogRow['rowType']): string {
  if (rowType === 'trigger') return 'Trigger'
  if (rowType === 'action') return 'Action'
  return 'Automation control'
}

function rowVisual(row: LogRow) {
  if (row.outcome === 'failed' && row.rowType !== 'trigger') return { borderLeft: '4px solid var(--red)', background: 'white' }
  if (row.rowType === 'trigger') return { borderLeft: '4px solid var(--grey2)', background: 'var(--grey7)' }
  return { borderLeft: '4px solid var(--grey4)', background: 'white' }
}

function EventCell({ row }: { row: LogRow }) {
  const isFailed = row.outcome === 'failed'
  const showFailed = isFailed && (row.rowType === 'action' || row.rowType === 'branch')
  return (
    <div>
      <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--grey1)' }}>{row.label}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
        {showFailed ? (
          <>
            <span style={{ fontSize: 12, color: 'var(--red)', fontWeight: 500 }}>
              {rowTypeLabel(row.rowType)} Failed
            </span>
            {row.errorMessage && <HelpIcon message={row.errorMessage} />}
          </>
        ) : (
          <span style={{ fontSize: 12, color: 'var(--grey3)' }}>{rowTypeLabel(row.rowType)}</span>
        )}
      </div>
    </div>
  )
}

interface Props { runs: Run[] }

export default function TimelineHistoryTab({ runs }: Props) {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [outcomeFilter, setOutcomeFilter] = useState<OutcomeFilter>('all')
  const [eventFilter, setEventFilter] = useState<string>('all')

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
    if (eventFilter === '__all_triggers__') rows = rows.filter(r => r.rowType === 'trigger')
    else if (eventFilter === '__all_actions__') rows = rows.filter(r => r.rowType === 'action')
    else if (eventFilter !== 'all') rows = rows.filter(r => r.label === eventFilter)
    if (search) rows = rows.filter(r =>
      r.userName.toLowerCase().includes(search.toLowerCase()) ||
      r.userEmail.toLowerCase().includes(search.toLowerCase())
    )
    return rows
  }, [allRows, outcomeFilter, eventFilter, search])

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
          {eventOptions.triggers.length > 0 && (
            <optgroup label="Triggers">
              <option value="__all_triggers__">All triggers</option>
              {eventOptions.triggers.map(t => <option key={t} value={t}>{t}</option>)}
            </optgroup>
          )}
          {eventOptions.actions.length > 0 && (
            <optgroup label="Actions">
              <option value="__all_actions__">All actions</option>
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
      {/* DEV: use <DataTable> */}
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
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={3} style={{ padding: 48, textAlign: 'center', color: 'var(--grey3)', fontSize: 13 }}>
                  No log entries match your filters
                </td>
              </tr>
            ) : (
              filtered.map((row, i) => {
                const visual = rowVisual(row)
                return (
                  <tr
                    key={`${row.runId}-${row.stepIndex}-${i}`}
                    style={{
                      borderBottom: '1px solid var(--grey6)',
                      borderLeft: visual.borderLeft,
                      background: visual.background,
                    }}
                  >
                    <td style={{ padding: '10px 16px', verticalAlign: 'top' }}>
                      <button
                        onClick={() => navigate(`/user/${row.userId}`)}
                        style={{ fontSize: 13, color: 'var(--teal)', fontWeight: 500, cursor: 'pointer', display: 'block', background: 'none', border: 'none', padding: 0, textAlign: 'left' }}
                      >
                        {row.userName}
                      </button>
                      <div style={{ fontSize: 12, color: 'var(--grey3)' }}>{row.userEmail}</div>
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
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}
