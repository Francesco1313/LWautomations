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

const statusColors: Record<string, string> = {
  completed: '#029c91',
  in_progress: '#3949AB',
  failed: '#ec0e0e',
  exited: '#f59e0b',
}
const statusLabels: Record<string, string> = {
  completed: 'Completed',
  in_progress: 'In progress',
  failed: 'Failed',
  exited: 'Exited',
}

interface Props { runs: Run[] }

export default function EnrollmentHistoryTab({ runs }: Props) {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [panelRun, setPanelRun] = useState<Run | null>(null)

  const sorted = useMemo(() =>
    [...runs].sort((a, b) => new Date(b.enrolledAt).getTime() - new Date(a.enrolledAt).getTime()),
    [runs]
  )

  const filtered = useMemo(() =>
    sorted.filter(r =>
      r.userName.toLowerCase().includes(search.toLowerCase()) ||
      r.userEmail.toLowerCase().includes(search.toLowerCase())
    ),
    [sorted, search]
  )

  return (
    <>
      {/* Filter bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          style={{
            height: 34, padding: '0 12px', width: 260,
            background: '#fff', border: '1px solid #e0e0e0',
            borderRadius: 4, fontSize: 13, color: '#333', outline: 'none',
          }}
        />
        <span style={{ fontSize: 12, color: '#828282', marginLeft: 'auto' }}>
          Showing {filtered.length} of {runs.length} enrollments
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
              {['Contact', 'Diagnose', 'Trigger', 'Enrolled at', 'Status'].map(col => (
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
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: 48, textAlign: 'center', color: '#828282', fontSize: 13 }}>
                  No enrollments in this period
                </td>
              </tr>
            ) : (
              filtered.map(run => (
                <tr key={run.id}
                  style={{ borderBottom: '1px solid #f2f2f2' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#f9f9f9')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  {/* Contact */}
                  <td style={{ padding: '12px 16px' }}>
                    <button
                      onClick={() => navigate(`/user/${run.userId}`)}
                      style={{ fontSize: 13, color: '#029c91', fontWeight: 500, display: 'block', cursor: 'pointer' }}
                    >{run.userName} ↗</button>
                    <div style={{ fontSize: 12, color: '#828282' }}>{run.userEmail}</div>
                  </td>
                  {/* Diagnose */}
                  <td style={{ padding: '12px 16px' }}>
                    <button
                      onClick={() => setPanelRun(run)}
                      style={{
                        height: 30, padding: '0 12px',
                        background: '#333', color: '#fff',
                        fontSize: 12, fontWeight: 500, borderRadius: 4,
                        cursor: 'pointer', whiteSpace: 'nowrap',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#4f4f4f')}
                      onMouseLeave={e => (e.currentTarget.style.background = '#333')}
                    >Why did this enroll?</button>
                  </td>
                  {/* Trigger */}
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ color: '#029c91', fontSize: 12 }}>●</span>
                      <span style={{ fontSize: 13, color: '#4f4f4f' }}>
                        Triggered from: {run.triggerEvent}
                      </span>
                    </div>
                  </td>
                  {/* Enrolled at */}
                  <td style={{ padding: '12px 16px', fontSize: 13, color: '#828282', whiteSpace: 'nowrap' }}>
                    {formatDateTime(run.enrolledAt)}
                  </td>
                  {/* Status */}
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 5,
                      padding: '3px 10px', borderRadius: 100,
                      fontSize: 12, fontWeight: 500,
                      background: statusColors[run.status] + '18',
                      color: statusColors[run.status],
                    }}>
                      <span style={{ fontSize: 8 }}>●</span>
                      {statusLabels[run.status]}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Why did this enroll panel */}
      {panelRun && (
        <WhyDidEnrollPanel run={panelRun} onClose={() => setPanelRun(null)} />
      )}
    </>
  )
}
