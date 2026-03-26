import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/layout/Sidebar'
import { automations, Automation } from '../data/automations'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

function ThreeDotMenu({ automation }: { automation: Automation }) {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(!open) }}
        style={{
          width: 28, height: 28, borderRadius: 4, fontSize: 16, color: '#828282',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: open ? '#f2f2f2' : 'transparent',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = '#f2f2f2')}
        onMouseLeave={(e) => { if (!open) e.currentTarget.style.background = 'transparent' }}
      >⋮</button>
      {open && (
        <>
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 10 }}
            onClick={() => setOpen(false)}
          />
          <div style={{
            position: 'absolute', right: 0, top: 32, zIndex: 20,
            background: '#fff', border: '1px solid #e0e0e0', borderRadius: 4,
            boxShadow: '0px 4px 10px rgba(0,0,0,0.1)', minWidth: 140,
          }}>
            <button
              onClick={(e) => { e.stopPropagation(); setOpen(false); navigate(`/canvas/${automation.id}`) }}
              style={{
                width: '100%', height: 36, padding: '0 12px', textAlign: 'left',
                fontSize: 13, color: '#333', display: 'block',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#f9f9f9')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >Edit</button>
            <button
              onClick={(e) => { e.stopPropagation(); setOpen(false); navigate(`/detail/${automation.id}`) }}
              style={{
                width: '100%', height: 36, padding: '0 12px', textAlign: 'left',
                fontSize: 13, color: '#333', display: 'block',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#f9f9f9')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >View activity</button>
          </div>
        </>
      )}
    </div>
  )
}

function AutomationRow({ automation }: { automation: Automation }) {
  const navigate = useNavigate()
  const [hovered, setHovered] = useState(false)

  return (
    <tr
      onClick={() => navigate(`/canvas/${automation.id}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        cursor: 'pointer',
        background: hovered ? '#f9f9f9' : '#fff',
        borderBottom: '1px solid #f2f2f2',
      }}
    >
      <td style={{ padding: '12px 16px', fontSize: 13, color: '#828282' }}>
        {automation.group ?? '—'}
      </td>
      <td style={{ padding: '12px 16px', fontSize: 14, color: '#333', fontWeight: 500 }}>
        {automation.name}
      </td>
      <td style={{ padding: '12px 16px', fontSize: 13, color: '#4f4f4f' }}>
        {automation.trigger}
      </td>
      <td style={{ padding: '12px 16px', fontSize: 13, color: '#4f4f4f', textAlign: 'right' }}>
        {automation.timesExecuted.toLocaleString()}
      </td>
      <td style={{ padding: '12px 16px', fontSize: 13, color: '#828282' }}>
        {formatDate(automation.editedOn)}
      </td>
      <td style={{ padding: '12px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Status dot */}
          <div title={automation.status} style={{
            width: 10, height: 10, borderRadius: '50%',
            background: automation.status === 'published' ? '#029c91' : '#828282',
            flexShrink: 0,
          }} />
          {/* Error badge */}
          {automation.hasErrors && (
            <div
              title={`${automation.errorCount} failed actions in the last 30 days`}
              style={{
                width: 16, height: 16, borderRadius: '50%',
                background: '#ec0e0e', color: '#fff',
                fontSize: 10, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, cursor: 'help',
              }}
            >!</div>
          )}
          {/* Three-dot menu */}
          {hovered && (
            <div onClick={(e) => e.stopPropagation()} style={{ marginLeft: 'auto' }}>
              <ThreeDotMenu automation={automation} />
            </div>
          )}
        </div>
      </td>
    </tr>
  )
}

export default function AutomationsListPage() {
  const [activeTab, setActiveTab] = useState<'templates' | 'my'>('my')
  const [search, setSearch] = useState('')

  const filtered = automations.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.trigger.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', fontFamily: "'Helvetica Neue', sans-serif" }}>
      <Sidebar />

      <main style={{ flex: 1, overflowY: 'auto', background: '#f9f9f9', display: 'flex', flexDirection: 'column' }}>
        {/* Page header */}
        <div style={{
          background: '#fff', borderBottom: '1px solid #e0e0e0',
          padding: '24px 32px 0',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: '#333', margin: 0 }}>Automations</h1>
              <p style={{ fontSize: 13, color: '#828282', marginTop: 4 }}>
                Automate repetitive tasks and engage your learners at the right time
              </p>
            </div>
            <button style={{
              height: 36, padding: '0 16px',
              background: '#029c91', color: '#fff',
              fontSize: 13, fontWeight: 500,
              borderRadius: 4, border: 'none', cursor: 'pointer',
            }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#027d74')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#029c91')}>
              + Create automation
            </button>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 0 }}>
            {(['templates', 'my'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  height: 40, padding: '0 16px',
                  fontSize: 14, fontWeight: 500,
                  color: activeTab === tab ? '#333' : '#828282',
                  borderBottom: activeTab === tab ? '2px solid #029c91' : '2px solid transparent',
                  background: 'transparent', cursor: 'pointer',
                  marginBottom: -1,
                }}
              >
                {tab === 'templates' ? 'Templates' : 'My Automations'}
              </button>
            ))}
          </div>
        </div>

        {/* Filters + table */}
        <div style={{ padding: '24px 32px' }}>
          {/* Search + filter row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search automations..."
              style={{
                height: 36, padding: '0 12px', width: 280,
                background: '#fff', border: '1px solid #e0e0e0',
                borderRadius: 4, fontSize: 13, color: '#333', outline: 'none',
              }}
            />
            <select style={{
              height: 36, padding: '0 12px',
              background: '#fff', border: '1px solid #e0e0e0',
              borderRadius: 4, fontSize: 13, color: '#4f4f4f', cursor: 'pointer',
            }}>
              <option>All groups</option>
              <option>Onboarding</option>
              <option>Engagement</option>
              <option>Sales</option>
            </select>
            <span style={{ fontSize: 12, color: '#828282', marginLeft: 'auto' }}>
              Showing 1–{filtered.length} automations out of {automations.length}
            </span>
          </div>

          {/* Table */}
          <div style={{
            background: '#fff', borderRadius: 6,
            border: '1px solid #e0e0e0',
            boxShadow: '0px 0px 1px rgba(12,26,75,0.24), 0px 3px 8px rgba(50,50,71,0.05)',
            overflow: 'hidden',
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #f2f2f2' }}>
                  {['Group', 'Automation name', 'Trigger', 'Times executed', 'Edited on', 'Status'].map((col) => (
                    <th key={col} style={{
                      padding: '10px 16px', textAlign: col === 'Times executed' ? 'right' : 'left',
                      fontSize: 12, fontWeight: 500, color: '#828282',
                      background: '#f9f9f9', whiteSpace: 'nowrap',
                    }}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((a) => <AutomationRow key={a.id} automation={a} />)}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ padding: 48, textAlign: 'center', color: '#828282', fontSize: 13 }}>
                      No automations found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
