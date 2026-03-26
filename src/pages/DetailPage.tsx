import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Sidebar from '../components/layout/Sidebar'
import PerformanceTab from '../components/detail/PerformanceTab'
import EnrollmentHistoryTab from '../components/detail/EnrollmentHistoryTab'
import ActionLogsTab from '../components/detail/ActionLogsTab'
import { automations } from '../data/automations'
import { runs } from '../data/runs'

type Tab = 'performance' | 'action-logs' | 'enrollment-history'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function DetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const automation = automations.find(a => a.id === id)
  const [activeTab, setActiveTab] = useState<Tab>('performance')

  if (!automation) {
    return (
      <div style={{ display: 'flex', height: '100vh', fontFamily: "'Helvetica Neue', sans-serif" }}>
        <Sidebar />
        <main style={{ flex: 1, padding: 32, background: '#f9f9f9' }}>
          <p style={{ color: '#828282' }}>Automation not found.</p>
        </main>
      </div>
    )
  }

  const totalEnrolled = runs.length

  const tabs: { key: Tab; label: string }[] = [
    { key: 'performance', label: 'Performance' },
    { key: 'action-logs', label: 'Action logs' },
    { key: 'enrollment-history', label: 'Enrollment history' },
  ]

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', fontFamily: "'Helvetica Neue', sans-serif" }}>
      <Sidebar />

      <main style={{ flex: 1, overflowY: 'auto', background: '#f9f9f9', display: 'flex', flexDirection: 'column' }}>

        {/* ── Page header ── */}
        <div style={{ background: '#fff', borderBottom: '1px solid #e0e0e0', padding: '20px 32px 0', flexShrink: 0 }}>

          {/* Breadcrumb */}
          <div style={{ fontSize: 13, color: '#828282', marginBottom: 10 }}>
            <button
              onClick={() => navigate('/')}
              style={{ color: '#029c91', fontSize: 13, cursor: 'pointer', fontWeight: 500 }}
            >Automations</button>
            <span style={{ margin: '0 6px' }}>›</span>
            <span>{automation.name}</span>
          </div>

          {/* Title row */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: '#333', margin: 0 }}>
                {automation.name}
              </h1>
              {/* Status indicators */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginTop: 8 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: automation.status === 'published' ? '#029c91' : '#828282' }}>
                  <span style={{ fontSize: 9 }}>●</span>
                  Workflow is {automation.status === 'published' ? 'ON' : 'OFF'}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: automation.hasErrors ? '#ec0e0e' : '#029c91' }}>
                  <span style={{ fontSize: 9 }}>●</span>
                  {automation.hasErrors ? `${automation.errorCount} issues found` : 'Workflow without issues'}
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
              <button
                onClick={() => navigate(`/canvas/${id}`)}
                style={{
                  height: 36, padding: '0 16px',
                  background: '#029c91', color: '#fff',
                  fontSize: 13, fontWeight: 500, borderRadius: 4, cursor: 'pointer',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = '#027d74')}
                onMouseLeave={e => (e.currentTarget.style.background = '#029c91')}
              >Edit automation</button>
              <button style={{
                height: 36, padding: '0 16px',
                border: '1px solid #e0e0e0', borderRadius: 4,
                fontSize: 13, color: '#333', background: '#fff', cursor: 'pointer',
              }}
                onMouseEnter={e => (e.currentTarget.style.background = '#f9f9f9')}
                onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
              >Review workflow issues</button>
            </div>
          </div>

          {/* Metadata table */}
          <div style={{
            border: '1px solid #e0e0e0', borderRadius: 4,
            overflow: 'hidden', marginBottom: 16,
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f9f9f9', borderBottom: '1px solid #f2f2f2' }}>
                  {['Trigger', 'Enrolled total', 'Enrolled last 7 days', 'Updated on', 'Updated by', 'Created on', 'Created by'].map(col => (
                    <th key={col} style={{
                      padding: '8px 14px', textAlign: 'left',
                      fontSize: 11, fontWeight: 600, color: '#828282',
                      textTransform: 'uppercase', letterSpacing: '0.05em',
                      whiteSpace: 'nowrap',
                    }}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: '10px 14px', fontSize: 13, color: '#333' }}>{automation.trigger}</td>
                  <td style={{ padding: '10px 14px', fontSize: 13, color: '#333' }}>{totalEnrolled}</td>
                  <td style={{ padding: '10px 14px', fontSize: 13, color: '#828282' }}>—</td>
                  <td style={{ padding: '10px 14px', fontSize: 13, color: '#333', whiteSpace: 'nowrap' }}>{formatDate(automation.editedOn)}</td>
                  <td style={{ padding: '10px 14px', fontSize: 13, color: '#333' }}>Francesco Papetti</td>
                  <td style={{ padding: '10px 14px', fontSize: 13, color: '#333', whiteSpace: 'nowrap' }}>Jan 15, 2025</td>
                  <td style={{ padding: '10px 14px', fontSize: 13, color: '#333' }}>Dimitris Tzortzis</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Tab bar */}
          <div style={{ display: 'flex', gap: 0, marginBottom: -1 }}>
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  height: 40, padding: '0 20px',
                  fontSize: 14,
                  fontWeight: activeTab === tab.key ? 600 : 400,
                  color: activeTab === tab.key ? '#333' : '#828282',
                  borderBottom: activeTab === tab.key ? '2px solid #333' : '2px solid transparent',
                  background: 'transparent', cursor: 'pointer',
                }}
              >{tab.label}</button>
            ))}
          </div>
        </div>

        {/* ── Tab content ── */}
        <div style={{ padding: '28px 32px', flex: 1 }}>
          {activeTab === 'performance' && <PerformanceTab runs={runs} />}
          {activeTab === 'enrollment-history' && <EnrollmentHistoryTab runs={runs} />}
          {activeTab === 'action-logs' && <ActionLogsTab runs={runs} />}
        </div>
      </main>
    </div>
  )
}
