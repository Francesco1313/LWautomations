import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Sidebar from '../components/layout/Sidebar'
import { automations } from '../data/automations'
import { runs } from '../data/runs'
import ActionLogsTab from '../components/detail/ActionLogsTab'
import EnrollmentHistoryTab from '../components/detail/EnrollmentHistoryTab'
import PerformanceTab from '../components/detail/PerformanceTab'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  })
}

const TABS = [
  { key: 'performance',  label: 'Performance' },
  { key: 'action-logs',  label: 'Action logs' },
  { key: 'enrollment',   label: 'Enrollment history' },
] as const

type TabKey = typeof TABS[number]['key']

export default function DetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const automation = automations.find(a => a.id === id)
  const [activeTab, setActiveTab] = useState<TabKey>('action-logs')
  const automationRuns = runs.filter(r => r.automationId === id)

  if (!automation) {
    return (
      <div style={{ display: 'flex', height: '100vh', fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
        <Sidebar />
        <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ color: 'var(--grey3)', fontSize: 15 }}>Automation not found.</p>
        </main>
      </div>
    )
  }

  return (
    <div style={{
      display: 'flex', height: '100vh', overflow: 'hidden',
      fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    }}>
      <Sidebar />

      <main style={{
        flex: 1, overflowY: 'auto',
        background: '#fff',
        display: 'flex', flexDirection: 'column',
      }}>

        {/* ── Page header ─────────────────────────────────────────────────────── */}
        {/* DEV: use <PageTopHeader> component */}
        <div style={{
          background: '#fff',
          borderBottom: '1px solid var(--grey5)',
          padding: '18px 32px 0',
          flexShrink: 0,
        }}>
          {/* Breadcrumb */}
          <div style={{ fontSize: 13, color: 'var(--grey3)', marginBottom: 12 }}>
            <button
              onClick={() => navigate('/')}
              style={{
                color: 'var(--teal)', fontSize: 13, cursor: 'pointer',
                fontWeight: 500, background: 'none', border: 'none', padding: 0,
              }}
            >
              Automations
            </button>
            <span style={{ margin: '0 6px', color: 'var(--grey4)' }}>›</span>
            <span>{automation.name}</span>
          </div>

          {/* Title row + Edit button */}
          <div style={{
            display: 'flex', alignItems: 'flex-start',
            justifyContent: 'space-between', gap: 16, marginBottom: 12,
          }}>
            <div>
              {/* DEV: use <PageTitle> */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{
                  width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                  background: automation.status === 'active' ? 'var(--teal)' : 'var(--grey4)',
                  boxShadow: automation.status === 'active' ? '0 0 0 2px var(--light-teal)' : 'none',
                }} />
                <h1 style={{ fontSize: 22, fontWeight: 500, color: 'var(--grey1)', margin: 0, lineHeight: 1.2 }}>
                  {automation.name}
                </h1>
              </div>

              {/* Edited / Created metadata */}
              {/* DEV: use <TextMeta> / <InlineMetadata> or equivalent admin UI component */}
              <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 12, color: 'var(--grey3)' }}>
                  Edited on {formatDate(automation.editedOn)} by {automation.editedBy}
                </span>
                <span style={{ fontSize: 12, color: 'var(--grey3)' }}>
                  Created on {formatDate(automation.createdOn)} by {automation.createdBy}
                </span>
              </div>
            </div>

            {/* DEV: use <Button variant="primary"> */}
            <button
              onClick={() => navigate(`/canvas/${automation.id}`)}
              style={{
                height: 32, padding: '0 14px', flexShrink: 0,
                background: 'var(--teal)', color: '#fff',
                border: 'none', borderRadius: 4,
                fontSize: 14, fontWeight: 500, cursor: 'pointer',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--teal-80)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--teal)')}
            >
              Edit automation
            </button>
          </div>

          {/* Tab navigation */}
          {/* DEV: use <TabNav> from admin UI library */}
          <div style={{
            display: 'flex', borderTop: '1px solid var(--grey5)', marginTop: 4,
          }}>
            {TABS.map(tab => {
              const active = activeTab === tab.key
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    height: 40, padding: '0 18px',
                    background: 'transparent', border: 'none',
                    borderBottom: active ? '2px solid var(--teal)' : '2px solid transparent',
                    marginBottom: -1,
                    fontSize: 14, fontWeight: active ? 700 : 400,
                    color: active ? 'var(--teal)' : 'var(--grey3)',
                    cursor: 'pointer',
                  }}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* ── Tab content ──────────────────────────────────────────────────────── */}
        <div style={{ flex: 1, padding: '24px 32px' }}>

          {activeTab === 'performance' && (
            <PerformanceTab runs={automationRuns} />
          )}

          {activeTab === 'action-logs' && (
            <ActionLogsTab runs={automationRuns} />
          )}

          {activeTab === 'enrollment' && (
            <EnrollmentHistoryTab runs={automationRuns} />
          )}

        </div>

      </main>
    </div>
  )
}
