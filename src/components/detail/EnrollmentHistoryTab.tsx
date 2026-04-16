import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Run } from '../../data/runs'

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

type DateRange = '7d' | '30d' | '90d' | 'all'

const DATE_RANGE_OPTIONS: { value: DateRange; label: string }[] = [
  { value: '7d',  label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
  { value: 'all', label: 'All time' },
]

function cutoffDate(range: DateRange): Date | null {
  if (range === 'all') return null
  const days = range === '7d' ? 7 : range === '30d' ? 30 : 90
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d
}

interface Props { runs: Run[] }

export default function EnrollmentHistoryTab({ runs }: Props) {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [dateRange, setDateRange] = useState<DateRange>('30d')

  const sorted = useMemo(() =>
    [...runs].sort((a, b) => new Date(b.enrolledAt).getTime() - new Date(a.enrolledAt).getTime()),
    [runs]
  )

  const filtered = useMemo(() => {
    const cutoff = cutoffDate(dateRange)
    return sorted.filter(r => {
      if (cutoff && new Date(r.enrolledAt) < cutoff) return false
      if (search) {
        const q = search.toLowerCase()
        return r.userName.toLowerCase().includes(q) || r.userEmail.toLowerCase().includes(q)
      }
      return true
    })
  }, [sorted, search, dateRange])

  return (
    <>
      {/* Filter bar */}
      {/* DEV: use <SearchInput>, <DateRangePicker>, <Button variant="secondary"> */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          style={{
            height: 34, padding: '0 12px', width: 260,
            background: 'white', border: '1px solid var(--grey5)',
            borderRadius: 4, fontSize: 13, outline: 'none',
          }}
        />
        {/* DEV: use <DateRangePicker> */}
        <select
          value={dateRange}
          onChange={e => setDateRange(e.target.value as DateRange)}
          style={{
            height: 34, padding: '0 12px',
            border: '1px solid var(--grey5)', borderRadius: 4,
            fontSize: 13, color: 'var(--grey2)', background: 'white', cursor: 'pointer',
          }}
        >
          {DATE_RANGE_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <span style={{ fontSize: 12, color: 'var(--grey3)', marginLeft: 'auto' }}>
          Showing {filtered.length} of {runs.length} enrollments
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
            <col style={{ width: 260 }} />
            <col />
            <col style={{ width: 170 }} />
          </colgroup>
          <thead>
            <tr style={{ background: 'var(--cool-grey)', borderBottom: '1px solid var(--grey5)' }}>
              {['Contact', 'Trigger', 'Enrolled at'].map(col => (
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
                  No enrollments match your filters
                </td>
              </tr>
            ) : (
              filtered.map(run => {
                const triggerStep = run.steps.find(s => s.type === 'trigger')
                const borderLeft = triggerStep?.outcome === 'failed' ? '4px solid var(--red)' : '4px solid var(--grey2)'
                return (
                <tr
                  key={run.id}
                  style={{ borderBottom: '1px solid var(--grey6)', borderLeft }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--grey7)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  {/* Contact */}
                  <td style={{ padding: '10px 16px', verticalAlign: 'middle' }}>
                    {/*
                      OPEN QUESTION: This link currently navigates to /user/:id (UserProfile page).
                      With the dedicated Automations tab removed from v1 scope, the final destination
                      on the user profile is undefined — likely the Activity tab once automation events
                      are integrated there. Update once OQ-07 is resolved.
                    */}
                    {/* DEV: use <TextButton> */}
                    <button
                      onClick={() => navigate(`/user/${run.userId}`)}
                      style={{
                        fontSize: 13, color: 'var(--teal)', fontWeight: 500,
                        cursor: 'pointer', display: 'block',
                        background: 'transparent', border: 'none', padding: 0,
                        textAlign: 'left',
                      }}
                    >
                      {run.userName}
                    </button>
                    <div style={{ fontSize: 12, color: 'var(--grey3)' }}>{run.userEmail}</div>
                  </td>

                  {/* Trigger */}
                  {/* DEV: use <LogRow>, <TextMeta> or equivalent admin UI components */}
                  <td style={{ padding: '10px 16px', verticalAlign: 'middle' }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--grey1)' }}>
                      {run.triggerEvent}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--grey3)', marginTop: 2 }}>
                      Trigger
                    </div>
                  </td>

                  {/* Enrolled at */}
                  <td style={{ padding: '10px 16px', fontSize: 12, color: 'var(--grey3)', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>
                    {formatDateTime(run.enrolledAt)}
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
