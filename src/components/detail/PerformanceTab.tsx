import { useState, useMemo } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, Dot,
} from 'recharts'
import { Run } from '../../data/runs'

type DateRange = '7d' | '30d' | '90d' | 'all'

const RANGES: { label: string; value: DateRange }[] = [
  { label: 'Last 7 days', value: '7d' },
  { label: 'Last 30 days', value: '30d' },
  { label: 'Last 90 days', value: '90d' },
  { label: 'All time', value: 'all' },
]

function getRangeStart(range: DateRange): Date | null {
  const now = new Date('2026-03-19T23:59:59Z')
  if (range === 'all') return null
  const days = range === '7d' ? 7 : range === '30d' ? 30 : 90
  const d = new Date(now)
  d.setDate(d.getDate() - days)
  return d
}

function filterByRange(runs: Run[], range: DateRange): Run[] {
  const start = getRangeStart(range)
  if (!start) return runs
  return runs.filter(r => new Date(r.enrolledAt) >= start)
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

interface Props { runs: Run[] }

export default function PerformanceTab({ runs }: Props) {
  const [range, setRange] = useState<DateRange>('30d')

  const filtered = useMemo(() => filterByRange(runs, range), [runs, range])
  const chartData = useMemo(() => buildChartData(filtered), [filtered])

  const total = filtered.length
  const inProgress = filtered.filter(r => r.status === 'in_progress').length
  const completed = filtered.filter(r => r.status === 'completed').length
  const exited = filtered.filter(r => r.status === 'exited').length

  const metrics = [
    { label: 'Total enrolled', value: total },
    { label: 'Currently in-flow', value: inProgress },
    { label: 'Completed', value: completed },
    { label: 'Exited', value: exited },
  ]

  return (
    <div>
      {/* Date range selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 28 }}>
        {RANGES.map(r => (
          <button
            key={r.value}
            onClick={() => setRange(r.value)}
            style={{
              height: 32, padding: '0 14px', borderRadius: 4,
              fontSize: 13,
              background: range === r.value ? '#e1f7f5' : '#fff',
              color: range === r.value ? '#029c91' : '#4f4f4f',
              border: range === r.value ? '1px solid #029c91' : '1px solid #e0e0e0',
              fontWeight: range === r.value ? 500 : 400,
              cursor: 'pointer',
            }}
          >{r.label}</button>
        ))}
      </div>

      {total === 0 ? (
        <div style={{
          padding: '48px 0', textAlign: 'center',
          color: '#828282', fontSize: 14,
          border: '1px dashed #e0e0e0', borderRadius: 6,
        }}>
          No runs in this period
        </div>
      ) : (
        <>
          {/* Top metrics — inline style, no card borders, like HubSpot */}
          <div style={{
            display: 'flex', gap: 0,
            background: '#fff', border: '1px solid #e0e0e0', borderRadius: 6,
            marginBottom: 32, overflow: 'hidden',
          }}>
            {metrics.map((m, i) => (
              <div key={m.label} style={{
                flex: 1, padding: '24px 28px', textAlign: 'center',
                borderRight: i < metrics.length - 1 ? '1px solid #f2f2f2' : 'none',
              }}>
                <div style={{
                  fontSize: 11, fontWeight: 600, color: '#828282',
                  textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 12,
                }}>{m.label}</div>
                <div style={{
                  fontSize: 32, fontWeight: 700,
                  color: m.value === 0 ? '#bdbdbd' : '#333',
                }}>
                  {m.value === 0 ? '—' : m.value}
                </div>
              </div>
            ))}
          </div>

          {/* Chart */}
          <div style={{
            background: '#fff', border: '1px solid #e0e0e0', borderRadius: 6,
            padding: '24px 24px 16px',
          }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#333', marginBottom: 4 }}>
              Enrollment over time
            </div>
            <div style={{ height: 280, marginTop: 16 }}>
              {chartData.length < 2 ? (
                <div style={{ paddingTop: 80, textAlign: 'center', color: '#828282', fontSize: 13 }}>
                  Not enough data points to draw a chart
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 4, right: 24, left: 0, bottom: 4 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f2f2f2" />
                    <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#828282' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: '#828282' }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{ fontSize: 13, border: '1px solid #e0e0e0', borderRadius: 4 }}
                      labelStyle={{ fontWeight: 600, color: '#333' }}
                    />
                    <Legend
                      iconType="circle"
                      wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
                    />
                    <Line
                      type="monotone" dataKey="enrolled" name="Users enrolled"
                      stroke="#3949AB" strokeWidth={2}
                      dot={<Dot r={4} fill="#3949AB" />}
                      activeDot={{ r: 5 }}
                    />
                    <Line
                      type="monotone" dataKey="completed" name="Users completed"
                      stroke="#029c91" strokeWidth={2} strokeDasharray="5 3"
                      dot={<Dot r={4} fill="#029c91" />}
                      activeDot={{ r: 5 }}
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
