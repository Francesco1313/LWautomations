import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Sidebar from '../components/layout/Sidebar'
import { users } from '../data/users'

// ── Types ──────────────────────────────────────────────────────────────────
type ProfileTab =
  | 'overview' | 'products' | 'plans' | 'payments'
  | 'transactions' | 'activity' | 'attribution' | 'feedback' | 'automations'

// ── Helpers ────────────────────────────────────────────────────────────────
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

// ── Event config ───────────────────────────────────────────────────────────
const eventConfig: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  enrolled:        { label: 'Enrolled',         color: '#3949AB', bg: '#e8eaf6', icon: '↗' },
  action_executed: { label: 'Action executed',  color: '#828282', bg: '#f2f2f2', icon: '⚡' },
  completed:       { label: 'Completed',        color: '#029c91', bg: '#e1f7f5', icon: '✓' },
  exited:          { label: 'Exited',           color: '#f59e0b', bg: '#fef3c7', icon: '✕' },
}

// ── Tab bar ────────────────────────────────────────────────────────────────
const TABS: { id: ProfileTab; label: string }[] = [
  { id: 'overview',     label: 'Overview' },
  { id: 'products',     label: 'Products' },
  { id: 'plans',        label: 'Plans' },
  { id: 'payments',     label: 'Payments' },
  { id: 'transactions', label: 'Transactions' },
  { id: 'activity',     label: 'Activity' },
  { id: 'attribution',  label: 'Attribution' },
  { id: 'feedback',     label: 'Feedback' },
  { id: 'automations',  label: 'Automations' },
]

// ── Action button (top bar) ────────────────────────────────────────────────
function ActionButton({ label, primary, hasChevron }: { label: string; primary?: boolean; hasChevron?: boolean }) {
  return (
    <button style={{
      height: 34, padding: '0 14px',
      background: primary ? '#029c91' : '#fff',
      color: primary ? '#fff' : '#333',
      border: primary ? 'none' : '1px solid #e0e0e0',
      borderRadius: 4, fontSize: 13, fontWeight: 500,
      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
    }}
      onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
      onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
    >
      {label}
      {hasChevron && <span style={{ fontSize: 10, color: primary ? '#fff' : '#828282' }}>▾</span>}
    </button>
  )
}

// ── Stat card ──────────────────────────────────────────────────────────────
function StatItem({ icon, value, label }: { icon: string; value: string | number; label: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, flex: 1 }}>
      <span style={{ fontSize: 18, color: '#828282' }}>{icon}</span>
      <span style={{ fontSize: 18, fontWeight: 600, color: '#333' }}>{value}</span>
      <span style={{ fontSize: 12, color: '#828282' }}>{label}</span>
    </div>
  )
}

// ── Field row (Preference section) ────────────────────────────────────────
function FieldRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, padding: '6px 0', borderBottom: '1px solid #f2f2f2' }}>
      <span style={{ fontSize: 13, color: '#828282', minWidth: 160 }}>{label}</span>
      <span style={{ fontSize: 13, color: '#333', fontWeight: 500 }}>{value}</span>
    </div>
  )
}

// ── Section heading ────────────────────────────────────────────────────────
function SectionHeading({ label }: { label: string }) {
  return (
    <div style={{ fontSize: 15, fontWeight: 600, color: '#333', marginBottom: 12 }}>{label}</div>
  )
}

// ── Overview tab ───────────────────────────────────────────────────────────
function OverviewTab({ user }: { user: { name: string; email: string } }) {
  return (
    <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
      {/* Left column */}
      <div style={{
        flex: 1, background: '#fff', borderRadius: 6, border: '1px solid #e0e0e0',
        boxShadow: '0px 0px 1px rgba(12,26,75,0.24), 0px 3px 8px rgba(50,50,71,0.05)',
        overflow: 'hidden',
      }}>
        {/* Avatar + identity */}
        <div style={{ padding: '28px 24px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, borderBottom: '1px solid #f2f2f2' }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 26, color: '#828282',
          }}>
            {user.name.charAt(0)}
          </div>
          <div style={{
            marginTop: 4, padding: '1px 10px', borderRadius: 100,
            border: '1px solid #029c91', fontSize: 11, color: '#029c91', fontWeight: 500,
          }}>
            User
          </div>
          <div style={{ fontSize: 15, fontWeight: 600, color: '#333' }}>{user.name}</div>
          <div style={{ fontSize: 13, color: '#828282' }}>{user.email}</div>
          <div style={{ fontSize: 12, color: '#bdbdbd' }}>Registered: 26 Feb 2026</div>
        </div>

        {/* Stats */}
        <div style={{ padding: '20px 16px', borderBottom: '1px solid #f2f2f2' }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <StatItem icon="≡" value={1} label="Courses" />
            <StatItem icon="⟳" value={0} label="Programs" />
            <StatItem icon="🏅" value={0} label="Certificates" />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <StatItem icon="◎" value={0} label="Score" />
            <StatItem icon="⏱" value={0} label="Study time" />
            <StatItem icon="⏱" value="1 min" label="Avg. session" />
          </div>
        </div>

        {/* Badges */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f2f2f2' }}>
          <SectionHeading label="Badges" />
          <div style={{ fontSize: 24 }}>🏅</div>
        </div>

        {/* Preference & Registration */}
        <div style={{ padding: '16px 20px' }}>
          <SectionHeading label="Preference & Registration details" />
          <FieldRow label="Department" value="Technology" />
          <FieldRow label="Middle name" value="—" />
          <FieldRow label="Registered as lead" value="No" />
        </div>
      </div>

      {/* Right column */}
      <div style={{
        width: 340, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 16,
      }}>
        {/* User fields */}
        <div style={{
          background: '#fff', borderRadius: 6, border: '1px solid #e0e0e0',
          boxShadow: '0px 0px 1px rgba(12,26,75,0.24), 0px 3px 8px rgba(50,50,71,0.05)',
          padding: '16px 20px',
        }}>
          <SectionHeading label="User fields" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px' }}>
            {[['DEPARTMENT', 'Technology'], ['MIDDLE NAME', '—']].map(([k, v]) => (
              <div key={k}>
                <div style={{ fontSize: 11, fontWeight: 500, color: '#828282', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>{k}</div>
                <div style={{ fontSize: 13, color: '#333' }}>{v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Registered as a lead */}
        <div style={{
          background: '#fff', borderRadius: 6, border: '1px solid #e0e0e0',
          boxShadow: '0px 0px 1px rgba(12,26,75,0.24), 0px 3px 8px rgba(50,50,71,0.05)',
          padding: '16px 20px',
        }}>
          <SectionHeading label="Registered as a lead" />
          <div style={{ fontSize: 13, color: '#333' }}>No</div>
        </div>

        {/* Tags */}
        <div style={{
          background: '#fff', borderRadius: 6, border: '1px solid #e0e0e0',
          boxShadow: '0px 0px 1px rgba(12,26,75,0.24), 0px 3px 8px rgba(50,50,71,0.05)',
          padding: '16px 20px',
        }}>
          <SectionHeading label="Tags" />
          <div style={{
            height: 34, border: '1px solid #e0e0e0', borderRadius: 4,
            display: 'flex', alignItems: 'center', padding: '0 10px',
            fontSize: 13, color: '#bdbdbd',
          }}>
            Select a tag or type to add new ▾
          </div>
        </div>

        {/* Notes */}
        <div style={{
          background: '#fff', borderRadius: 6, border: '1px solid #e0e0e0',
          boxShadow: '0px 0px 1px rgba(12,26,75,0.24), 0px 3px 8px rgba(50,50,71,0.05)',
          padding: '16px 20px',
        }}>
          <SectionHeading label="Notes" />
          <div style={{ fontSize: 13, color: '#bdbdbd', fontStyle: 'italic', marginBottom: 10 }}>No comments added</div>
          <div style={{
            height: 60, border: '1px dashed #e0e0e0', borderRadius: 4,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{
              width: 24, height: 24, borderRadius: '50%', background: '#029c91',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: 18, cursor: 'pointer',
            }}>+</div>
          </div>
        </div>

        {/* Badges */}
        <div style={{
          background: '#fff', borderRadius: 6, border: '1px solid #e0e0e0',
          boxShadow: '0px 0px 1px rgba(12,26,75,0.24), 0px 3px 8px rgba(50,50,71,0.05)',
          padding: '16px 20px',
        }}>
          <SectionHeading label="Badges" />
          <div style={{ fontSize: 24 }}>🏅</div>
        </div>
      </div>
    </div>
  )
}

// ── Automations tab ────────────────────────────────────────────────────────
function AutomationsTab({ history, navigate }: {
  history: ReturnType<typeof users>[number]['automationHistory']
  navigate: (path: string) => void
}) {
  const [showAll, setShowAll] = useState(false)
  const sorted = [...history].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  const visible = showAll ? sorted : sorted.slice(0, 10)
  const hasMore = sorted.length > 10

  return (
    <div style={{
      background: '#fff', borderRadius: 6, border: '1px solid #e0e0e0',
      boxShadow: '0px 0px 1px rgba(12,26,75,0.24), 0px 3px 8px rgba(50,50,71,0.05)',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px', borderBottom: '1px solid #f2f2f2',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: '#333' }}>Automations</span>
        <div style={{
          background: '#e1f7f5', borderRadius: 100,
          padding: '2px 10px', fontSize: 12, color: '#029c91', fontWeight: 500,
        }}>
          {sorted.length}
        </div>
      </div>

      {/* Empty state */}
      {sorted.length === 0 ? (
        <div style={{ padding: 48, textAlign: 'center', color: '#828282', fontSize: 13 }}>
          No automations have run for this user yet.
        </div>
      ) : (
        <>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9f9f9', borderBottom: '1px solid #f2f2f2' }}>
                {['Automation', 'Event', 'Timestamp'].map(col => (
                  <th key={col} style={{
                    padding: '10px 20px', textAlign: 'left',
                    fontSize: 12, fontWeight: 500, color: '#828282',
                  }}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map((entry, i) => {
                const ev = eventConfig[entry.eventType]
                return (
                  <tr
                    key={i}
                    style={{ borderBottom: '1px solid #f2f2f2' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#f9f9f9')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    {/* Automation name */}
                    <td style={{ padding: '12px 20px', maxWidth: 320 }}>
                      <button
                        onClick={() => navigate(`/detail/${entry.automationId}`)}
                        title={entry.automationName}
                        style={{
                          fontSize: 14, color: '#029c91', fontWeight: 500,
                          cursor: 'pointer', display: 'block',
                          maxWidth: 300, overflow: 'hidden',
                          textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                          background: 'none', border: 'none', padding: 0, textAlign: 'left',
                        }}
                      >
                        {entry.automationName}
                      </button>
                    </td>

                    {/* Event type */}
                    <td style={{ padding: '12px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                        <div style={{
                          width: 22, height: 22, borderRadius: '50%',
                          background: ev.bg,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 11, color: ev.color, fontWeight: 700, flexShrink: 0,
                        }}>
                          {ev.icon}
                        </div>
                        <span style={{ fontSize: 13, color: ev.color, fontWeight: 500 }}>{ev.label}</span>
                      </div>
                    </td>

                    {/* Timestamp */}
                    <td style={{ padding: '12px 20px', fontSize: 13, color: '#828282', whiteSpace: 'nowrap' }}>
                      {formatDateTime(entry.timestamp)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          {/* View all / collapse */}
          {hasMore && (
            <div style={{ padding: '12px 20px', borderTop: '1px solid #f2f2f2' }}>
              <button
                onClick={() => setShowAll(v => !v)}
                style={{
                  fontSize: 13, color: '#029c91', fontWeight: 500,
                  cursor: 'pointer', background: 'none', border: 'none', padding: 0,
                }}
              >
                {showAll ? 'Show less' : `View all ${sorted.length} entries`}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

// ── Placeholder tab ────────────────────────────────────────────────────────
function PlaceholderTab({ label }: { label: string }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 6, border: '1px solid #e0e0e0',
      padding: 48, textAlign: 'center', color: '#bdbdbd', fontSize: 13,
    }}>
      {label} — coming soon
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────
export default function UserProfilePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<ProfileTab>('automations')
  const user = users.find(u => u.id === id)

  if (!user) {
    return (
      <div style={{ display: 'flex', height: '100vh', fontFamily: "'Helvetica Neue', sans-serif" }}>
        <Sidebar />
        <main style={{ flex: 1, padding: 32 }}>
          <p style={{ color: '#828282' }}>User not found.</p>
        </main>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', fontFamily: "'Helvetica Neue', sans-serif" }}>
      <Sidebar />

      <main style={{ flex: 1, overflowY: 'auto', background: '#f9f9f9', display: 'flex', flexDirection: 'column' }}>
        {/* ── Top header ── */}
        <div style={{ background: '#fff', borderBottom: '1px solid #e0e0e0', padding: '16px 28px', flexShrink: 0 }}>
          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <button
              onClick={() => navigate(-1 as never)}
              style={{ fontSize: 16, color: '#828282', cursor: 'pointer', background: 'none', border: 'none', padding: 0, lineHeight: 1 }}
            >←</button>
            <button
              onClick={() => navigate(-1 as never)}
              style={{ fontSize: 13, color: '#029c91', cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}
            >All users</button>
            <span style={{ fontSize: 13, color: '#bdbdbd' }}>/</span>
            <span style={{ fontSize: 13, color: '#333' }}>{user.name}</span>
          </div>

          <div style={{ fontSize: 12, color: '#828282', marginBottom: 14 }}>
            View and manage your user's details at a glance.
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <ActionButton label="Edit user" primary />
            <ActionButton label="Manage user" hasChevron />
            <ActionButton label="Enroll in product" hasChevron />
            <ActionButton label="Send message" hasChevron />
            <ActionButton label="Open legacy" />
          </div>
        </div>

        {/* ── Tab bar ── */}
        <div style={{
          background: '#fff', borderBottom: '1px solid #e0e0e0',
          display: 'flex', alignItems: 'stretch', padding: '0 28px',
          flexShrink: 0, overflowX: 'auto',
        }}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                height: 44, padding: '0 14px',
                display: 'flex', alignItems: 'center',
                fontSize: 14, fontWeight: activeTab === tab.id ? 500 : 400,
                color: activeTab === tab.id ? '#333' : '#828282',
                borderBottom: activeTab === tab.id ? '2px solid #029c91' : '2px solid transparent',
                background: 'transparent', cursor: 'pointer', whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              {tab.label}
              {tab.id === 'automations' && (
                <span style={{
                  marginLeft: 6, background: '#e1f7f5', borderRadius: 100,
                  padding: '1px 7px', fontSize: 11, color: '#029c91', fontWeight: 500,
                }}>
                  {user.automationHistory.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── Tab content ── */}
        <div style={{ flex: 1, padding: '24px 28px', overflowY: 'auto' }}>
          {activeTab === 'overview' && <OverviewTab user={user} />}
          {activeTab === 'automations' && (
            <AutomationsTab history={user.automationHistory} navigate={navigate} />
          )}
          {activeTab !== 'overview' && activeTab !== 'automations' && (
            <PlaceholderTab label={TABS.find(t => t.id === activeTab)?.label ?? ''} />
          )}
        </div>
      </main>
    </div>
  )
}
