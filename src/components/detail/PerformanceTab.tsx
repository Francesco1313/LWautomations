import { useState, useMemo } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer,
} from 'recharts'
import { Run } from '../../data/runs'

type DateRange = '7d' | '30d' | '90d' | 'all'

const RANGES: { label: string; value: DateRange }[] = [
  { label: 'Last 7 days',  value: '7d' },
  { label: 'Last 30 days', value: '30d' },
  { label: 'Last 90 days', value: '90d' },
  { label: 'All time',     value: 'all' },
]

function getRangeStart(range: DateRange): Date | null {
  if (range === 'all') return null
  const days = range === '7d' ? 7 : range === '30d' ? 30 : 90
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d
}

function buildChartData(runs: Run[]) {
  const byDate: Record<string, { enrolled: number; completed: number }> = {}
  runs.forEach(r => {
    const d = r.enrolledAt.slice(0, 10)
    if (!byDate[d]) byDate[d] = { enrolled: 0, completed: 0 }
    byDate[d].enrolled++
    if (r.status === 'completed') byDate[d].completed++
  })
  return Object.entries(byDate)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, counts]) => ({
      date: new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
      enrolled: counts.enrolled,
      completed: counts.completed,
    }))
}

const METRIC_ACCENT: Record<string, string> = {
  'Currently in-flow': '#FB8C00', // var(--in-progress)
  'Completed':         '#52A62B', // var(--completed)
  'Exited':            '#828282', // var(--grey3)
}

interface Props { runs: Run[] }

export default function PerformanceTab({ runs }: Props) {
  const [range, setRange] = useState<DateRange>('30d')

  const filtered = useMemo(() => {
    const start = getRangeStart(range)
    if (!start) return runs
    return runs.filter(r => new Date(r.enrolledAt) >= start)
  }, [runs, range])

  const chartData = useMemo(() => buildChartData(filtered), [filtered])

  const metrics = [
    { label: 'Total enrolled',     value: filtered.length },
    { label: 'Currently in-flow',  value: filtered.filter(r => r.status === 'in_progress').length },
    { label: 'Completed',          value: filtered.filter(r => r.status === 'completed').length },
    { label: 'Exited',             value: filtered.filter(r => r.status === 'exited').length },
  ]

  return (
    <div>
      {/* Date range selector */}
      {/* DEV: use <DateRangePicker> */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 28 }}>
        {RANGES.map(r => {
          const active = range === r.value
          return (
            <button
              key={r.value}
              onClick={() => setRange(r.value)}
              style={{
                height: 32, padding: '0 14px', borderRadius: 4,
                fontSize: 13, cursor: 'pointer',
                background: active ? 'var(--light-teal)' : 'white',
                color: active ? 'var(--teal)' : 'var(--grey2)',
                border: active ? '1px solid var(--teal)' : '1px solid var(--grey5)',
                fontWeight: active ? 500 : 400,
              }}
            >{r.label}</button>
          )
        })}
      </div>

      {filtered.length === 0 ? (
        <div style={{
          padding: '48px 0', textAlign: 'center',
          color: 'var(--grey3)', fontSize: 14,
          border: '1px dashed var(--grey5)', borderRadius: 6,
        }}>
          No runs in this period
        </div>
      ) : (
        <>
          {/* Metric cards */}
          {/* DEV: use <MetricCard> for each card */}
          <div style={{
            display: 'flex', gap: 0,
            background: 'white', border: '1px solid var(--grey5)', borderRadius: 6,
            marginBottom: 24, overflow: 'hidden',
          }}>
            {metrics.map((m, i) => (
              <div key={m.label} style={{
                flex: 1, padding: '24px 28px', textAlign: 'center',
                borderRight: i < metrics.length - 1 ? '1px solid var(--grey6)' : 'none',
              }}>
                <div style={{
                  fontSize: 11, fontWeight: 600, color: 'var(--grey3)',
                  textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 12,
                }}>{m.label}</div>
                <div style={{
                  fontSize: 32, fontWeight: 700,
                  color: m.value === 0
                    ? 'var(--grey4)'
                    : (METRIC_ACCENT[m.label] ?? 'var(--grey1)'),
                }}>
                  {m.value === 0 ? '—' : m.value}
                </div>
              </div>
            ))}
          </div>

          {/* Line chart */}
          {/* DEV: use <LineChart> from Recharts or equivalent admin chart component */}
          <div style={{
            background: 'white', border: '1px solid var(--grey5)', borderRadius: 6,
            padding: '24px 24px 16px',
          }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--grey1)', marginBottom: 16 }}>
              Enrollment over time
            </div>
            <div style={{ height: 280 }}>
              {chartData.length < 2 ? (
                <div style={{ paddingTop: 80, textAlign: 'center', color: 'var(--grey3)', fontSize: 13 }}>
                  Not enough data points to draw a chart
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 4, right: 24, left: 0, bottom: 4 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F2F2F2" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 12, fill: '#828282' }}
                      axisLine={false} tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: '#828282' }}
                      axisLine={false} tickLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip
                      contentStyle={{ fontSize: 13, border: '1px solid #E0E0E0', borderRadius: 4 }}
                      labelStyle={{ fontWeight: 600, color: '#333333' }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
                    <Line
                      type="monotone" dataKey="enrolled" name="Users enrolled"
                      stroke="#029C91" strokeWidth={2}
                      dot={{ r: 4, fill: '#029C91' }} activeDot={{ r: 5 }}
                    />
                    <Line
                      type="monotone" dataKey="completed" name="Users completed"
                      stroke="#52A62B" strokeWidth={2} strokeDasharray="5 3"
                      dot={{ r: 4, fill: '#52A62B' }} activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
