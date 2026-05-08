import { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Sidebar from '../components/layout/Sidebar'
import { users } from '../data/users'
import { runs, Run } from '../data/runs'
import { automations } from '../data/automations'

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'Today'
  if (days === 1) return '1 day ago'
  return `${days} days ago`
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

const TABS = [
  'Overview', 'Products', 'Plans', 'Payments',
  'Transactions', 'Activity', 'Attribution', 'Feedback',
] as const
type Tab = typeof TABS[number]

// ── Overview tab ──────────────────────────────────────────────────────────────
function StatBox({ value, label }: { value: number; label: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <span style={{ fontSize: 22, fontWeight: 500, color: 'var(--grey1)' }}>{value}</span>
      <span style={{ fontSize: 12, color: 'var(--grey3)' }}>{label}</span>
    </div>
  )
}

function TagChip({ label }: { label: string }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '3px 8px', borderRadius: 3,
      fontSize: 12, background: 'var(--grey6)', color: 'var(--grey2)',
    }}>
      {label} <span style={{ color: 'var(--grey4)', cursor: 'pointer' }}>×</span>
    </span>
  )
}

// ── Activity tab ──────────────────────────────────────────────────────────────
interface AutomationEvent {
  timestamp: string
  label: string
  automationName: string
  automationId: string
  outcome: 'success' | 'failed' | 'info'
}

function buildAutomationEvents(userRuns: Run[]): AutomationEvent[] {
  const autoMap = new Map(automations.map(a => [a.id, a.name]))
  const events: AutomationEvent[] = []

  userRuns.forEach(run => {
    const autoName = autoMap.get(run.automationId) ?? run.automationId

    // Enrolled (trigger)
    const trigger = run.steps.find(s => s.type === 'trigger')
    if (trigger) {
      events.push({
        timestamp: trigger.timestamp,
        label: `Enrolled: ${trigger.label}`,
        automationName: autoName,
        automationId: run.automationId,
        outcome: 'info',
      })
    }

    // Actions
    run.steps.filter(s => s.type === 'action' || s.type === 'branch').forEach(step => {
      events.push({
        timestamp: step.timestamp,
        label: step.label,
        automationName: autoName,
        automationId: run.automationId,
        outcome: step.outcome === 'failed' ? 'failed' : 'success',
      })
    })

    // Completion
    const completion = run.steps.find(s => s.type === 'completion')
    if (completion) {
      events.push({
        timestamp: completion.timestamp,
        label: 'Completed automation',
        automationName: autoName,
        automationId: run.automationId,
        outcome: 'success',
      })
    }
  })

  return events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

export default function UserProfilePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<Tab>('Overview')

  const user = users.find(u => u.id === id)
  const userRuns = useMemo(() => runs.filter(r => r.userId === id), [id])
  const automationEvents = useMemo(() => buildAutomationEvents(userRuns), [userRuns])

  if (!user) {
    return (
      <div style={{ display: 'flex', height: '100vh', fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
        <Sidebar />
        <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ color: 'var(--grey3)', fontSize: 15 }}>User not found.</p>
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
      <main style={{ flex: 1, overflowY: 'auto', background: 'var(--grey7)', display: 'flex', flexDirection: 'column' }}>

        {/* ── Page header ───────────────────────────────────────────────────── */}
        <div style={{ background: '#fff', borderBottom: '1px solid var(--grey5)', padding: '18px 32px 0', flexShrink: 0 }}>
          {/* Breadcrumb */}
          <div style={{ fontSize: 13, color: 'var(--grey3)', marginBottom: 10 }}>
            <button
              onClick={() => navigate('/users')}
              style={{ color: 'var(--teal)', fontSize: 13, cursor: 'pointer', fontWeight: 500, background: 'none', border: 'none', padding: 0 }}
            >
              ← All users
            </button>
            <span style={{ margin: '0 6px', color: 'var(--grey4)' }}>›</span>
            <span>{user.name}</span>
          </div>

          {/* Subtitle */}
          <p style={{ fontSize: 14, color: 'var(--grey3)', margin: '0 0 12px' }}>
            View and manage your user's details at a glance.
          </p>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <button style={{ height: 32, padding: '0 14px', background: 'var(--teal)', color: '#fff', border: 'none', borderRadius: 4, fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>
              Edit user
            </button>
            <button style={{ height: 32, padding: '0 12px', background: '#fff', color: 'var(--grey2)', border: '1px solid var(--grey5)', borderRadius: 4, fontSize: 14, cursor: 'pointer' }}>
              Manage user ▾
            </button>
            <button style={{ height: 32, padding: '0 12px', background: '#fff', color: 'var(--grey2)', border: '1px solid var(--grey5)', borderRadius: 4, fontSize: 14, cursor: 'pointer' }}>
              Enroll in product
            </button>
            <button style={{ height: 32, padding: '0 12px', background: '#fff', color: 'var(--grey2)', border: '1px solid var(--grey5)', borderRadius: 4, fontSize: 14, cursor: 'pointer' }}>
              Send message
            </button>
          </div>

          {/* Tab nav */}
          <div style={{ display: 'flex', borderTop: '1px solid var(--grey5)', marginTop: 4 }}>
            {TABS.map(tab => {
              const active = activeTab === tab
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    height: 40, padding: '0 16px',
                    background: 'transparent', border: 'none',
                    borderBottom: active ? '2px solid var(--teal)' : '2px solid transparent',
                    marginBottom: -1,
                    fontSize: 14, fontWeight: active ? 700 : 400,
                    color: active ? 'var(--teal)' : 'var(--grey3)',
                    cursor: 'pointer',
                  }}
                >
                  {tab}
                </button>
              )
            })}
          </div>
        </div>

        {/* ── Tab content ───────────────────────────────────────────────────── */}
        <div style={{ flex: 1, padding: '24px 32px' }}>

          {/* ── Overview ── */}
          {activeTab === 'Overview' && (
            <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 20 }}>

              {/* Left card: avatar + stats */}
              <div style={{ background: '#fff', border: '1px solid var(--grey5)', borderRadius: 6, padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
                {/* Avatar + identity */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    width: 72, height: 72, borderRadius: '50%',
                    background: 'var(--grey5)', color: 'var(--grey2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 24, fontWeight: 600,
                  }}>
                    {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <span style={{
                    fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 3,
                    background: 'var(--light-green)', color: 'var(--completed)',
                    textTransform: 'uppercase', letterSpacing: '0.05em',
                  }}>
                    {user.role}
                  </span>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--grey1)' }}>{user.name}</div>
                    <div style={{ fontSize: 13, color: 'var(--grey3)' }}>{user.email}</div>
                    <div style={{ fontSize: 12, color: 'var(--grey4)', marginTop: 4 }}>
                      Registered: {formatDate(user.registeredAt)}
                    </div>
                  </div>
                </div>

                {/* Stats grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                  <StatBox value={user.courses} label="Courses" />
                  <StatBox value={user.programs} label="Programs" />
                  <StatBox value={user.certificates} label="Certificates" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                  <StatBox value={0} label="Score" />
                  <StatBox value={0} label="Study time" />
                  <StatBox value={0} label="Avg. session" />
                </div>

                {/* Tags */}
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--grey2)', marginBottom: 8 }}>Tags</div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {user.tags.map(t => <TagChip key={t} label={t} />)}
                    {user.tags.length === 0 && <span style={{ fontSize: 13, color: 'var(--grey4)' }}>No tags</span>}
                  </div>
                </div>
              </div>

              {/* Right card: user fields + notes */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ background: '#fff', border: '1px solid var(--grey5)', borderRadius: 6, padding: 24 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--grey1)', marginBottom: 16 }}>User fields</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    {['TEXT', 'DROPDOWN', 'CHECKBOX', 'RADIO', 'DATE'].map(field => (
                      <div key={field}>
                        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--grey3)', letterSpacing: '0.05em', marginBottom: 4 }}>{field}</div>
                        <div style={{ fontSize: 13, color: 'var(--grey3)' }}>–</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ background: '#fff', border: '1px solid var(--grey5)', borderRadius: 6, padding: 24 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--grey1)', marginBottom: 8 }}>Notes</div>
                  <div style={{ fontSize: 13, color: 'var(--grey3)' }}>No comments added</div>
                </div>
              </div>
            </div>
          )}

          {/* ── Activity ── */}
          {activeTab === 'Activity' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* Login activity */}
              <div style={{ background: '#fff', border: '1px solid var(--grey5)', borderRadius: 6, overflow: 'hidden' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '14px 20px', borderBottom: '1px solid var(--grey5)',
                  background: 'var(--cool-grey)',
                }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--grey1)' }}>Login activity</span>
                  <button style={{
                    height: 30, padding: '0 12px',
                    border: '1px solid var(--grey5)', borderRadius: 4,
                    fontSize: 13, color: 'var(--grey2)', background: '#fff', cursor: 'pointer',
                  }}>
                    Export login/logout report
                  </button>
                </div>
                <div style={{ padding: '8px 0' }}>
                  {user.loginActivity.map((entry, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '10px 20px',
                        borderBottom: i < user.loginActivity.length - 1 ? '1px solid var(--grey6)' : 'none',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{
                          width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                          background: 'var(--grey4)',
                        }} />
                        <span style={{ fontSize: 13, color: 'var(--grey1)' }}>{entry.label}</span>
                      </div>
                      <span style={{ fontSize: 12, color: 'var(--grey3)', whiteSpace: 'nowrap' }}>
                        {timeAgo(entry.date)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Automation activity */}
              <div style={{ background: '#fff', border: '1px solid var(--grey5)', borderRadius: 6, overflow: 'hidden' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '14px 20px', borderBottom: '1px solid var(--grey5)',
                  background: 'var(--cool-grey)',
                }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--grey1)' }}>Automation activity</span>
                  <span style={{ fontSize: 12, color: 'var(--grey3)' }}>{automationEvents.length} events</span>
                </div>

                {automationEvents.length === 0 ? (
                  <div style={{ padding: 32, textAlign: 'center', fontSize: 13, color: 'var(--grey3)' }}>
                    No automation activity for this user
                  </div>
                ) : (
                  <div style={{ padding: '8px 0' }}>
                    {automationEvents.map((event, i) => (
                      <div
                        key={i}
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          padding: '10px 20px',
                          borderBottom: i < automationEvents.length - 1 ? '1px solid var(--grey6)' : 'none',
                          borderLeft: event.outcome === 'failed' ? '3px solid var(--red)' : '3px solid transparent',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                          <span style={{
                            width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                            background: event.outcome === 'failed' ? 'var(--red)' : event.outcome === 'success' ? 'var(--completed)' : 'var(--grey4)',
                          }} />
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: 13, color: event.outcome === 'failed' ? 'var(--red)' : 'var(--grey1)', fontWeight: 500 }}>
                              {event.label}
                            </div>
                            <button
                              onClick={() => navigate(`/detail/${event.automationId}`)}
                              style={{ fontSize: 12, color: 'var(--teal)', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                            >
                              {event.automationName}
                            </button>
                          </div>
                        </div>
                        <span style={{ fontSize: 12, color: 'var(--grey3)', whiteSpace: 'nowrap', marginLeft: 16 }}>
                          {formatDateTime(event.timestamp)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Other tabs placeholder ── */}
          {activeTab !== 'Overview' && activeTab !== 'Activity' && (
            <div style={{
              background: '#fff', border: '1px solid var(--grey5)', borderRadius: 6,
              padding: 48, textAlign: 'center',
            }}>
              <p style={{ fontSize: 14, color: 'var(--grey3)', margin: 0 }}>{activeTab} — not in scope for this prototype</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
