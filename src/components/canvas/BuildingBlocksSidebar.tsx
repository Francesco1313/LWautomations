import { useState } from 'react'

const userMgmtTriggers = [
  'Tag is added',
  'Tag is removed',
  'User signs up',
  'User signs in',
  'User signup request approved',
  'User signup request rejected',
  'User is updated',
  'User added to group',
  'User removed from group',
]

const automationControls = [
  { label: 'Delay', color: '#333' },
  { label: 'Branch', color: '#3949AB' },
  { label: 'Exit condition', color: '#8e24aa' },
]

interface SectionProps {
  title: string
  count: number
  children: React.ReactNode
  defaultOpen?: boolean
}

function Section({ title, count, children, defaultOpen = true }: SectionProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '8px 8px', background: '#f2f2f2', fontSize: 13, color: '#4f4f4f',
          cursor: 'pointer', border: 'none', textAlign: 'left',
        }}
      >
        <span>{title} ({count})</span>
        <span style={{
          display: 'inline-block',
          transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.15s', fontSize: 10,
        }}>▼</span>
      </button>
      {open && children}
    </div>
  )
}

function DragItem({ label, iconColor = '#4f4f4f' }: { label: string; iconColor?: string }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      height: 36, padding: '0 4px',
      background: '#fff', borderRadius: 4,
      boxShadow: '0px 0px 1px rgba(12,26,75,0.24), 0px 3px 8px rgba(50,50,71,0.05)',
      cursor: 'grab',
    }}
      onMouseEnter={(e) => (e.currentTarget.style.background = '#f9f9f9')}
      onMouseLeave={(e) => (e.currentTarget.style.background = '#fff')}
    >
      {/* Icon circle */}
      <div style={{
        width: 32, height: 32, borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <div style={{
          width: 24, height: 24, borderRadius: '50%',
          background: '#f9f9f9', border: '1px solid #f2f2f2',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: iconColor }} />
        </div>
      </div>
      <span style={{ flex: 1, fontSize: 12, fontWeight: 500, color: '#4f4f4f', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {label}
      </span>
      {/* Drag handle */}
      <div style={{ fontSize: 14, color: '#bdbdbd', flexShrink: 0, paddingRight: 4 }}>⣿</div>
    </div>
  )
}

interface BuildingBlocksSidebarProps {
  onClose: () => void
}

export default function BuildingBlocksSidebar({ onClose }: BuildingBlocksSidebarProps) {
  const [search, setSearch] = useState('')
  const [controlsOpen, setControlsOpen] = useState(true)

  const filterItems = (items: string[]) =>
    items.filter(i => i.toLowerCase().includes(search.toLowerCase()))

  return (
    <div style={{
      width: 280, minWidth: 280, height: '100%',
      background: '#fff', borderRight: '1px solid #e0e0e0',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
      position: 'relative',
    }}>
      {/* Header */}
      <div style={{
        padding: '12px 8px 8px',
        flexShrink: 0, borderBottom: '1px solid #f2f2f2',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 500, color: '#4f4f4f' }}>Building blocks</span>
          <button onClick={onClose} style={{ fontSize: 16, color: '#828282', padding: 2 }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#333')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#828282')}>✕</button>
        </div>
        {/* Search */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          height: 32, padding: '0 8px',
          background: '#f9f9f9', border: '1px solid #f2f2f2', borderRadius: 4,
        }}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Triggers, actions, automation controls.."
            style={{
              flex: 1, fontSize: 13, color: '#333', background: 'transparent',
              border: 'none', outline: 'none',
            }}
          />
          <span style={{ color: '#bdbdbd', fontSize: 14 }}>🔍</span>
        </div>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 60 }}>
        {/* Triggers section */}
        <Section title="Triggers" count={44}>
          <div style={{ padding: '8px 0' }}>
            {/* Subsection header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 16px', marginBottom: 4 }}>
              <span style={{ fontSize: 10, fontWeight: 600, color: '#bdbdbd', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                ▾ User Management
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '0 16px' }}>
              {filterItems(userMgmtTriggers).map((t) => (
                <DragItem key={t} label={t} iconColor="#283593" />
              ))}
            </div>
          </div>
        </Section>

        {/* Actions section */}
        <Section title="Actions" count={31}>
          <div style={{ padding: '8px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 16px', marginBottom: 4 }}>
              <span style={{ fontSize: 10, fontWeight: 600, color: '#bdbdbd', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                ▾ Messaging
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '0 16px' }}>
              {filterItems(['Send email', 'Send email to multiple users', 'Send message']).map((t) => (
                <DragItem key={t} label={t} iconColor="#8e24aa" />
              ))}
            </div>
          </div>
        </Section>
      </div>

      {/* Sticky bottom: Automation controls */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        boxShadow: '0px -4px 20px rgba(0,0,0,0.1)',
        background: '#fff',
      }}>
        <button
          onClick={() => setControlsOpen(!controlsOpen)}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '8px', background: '#f2f2f2', fontSize: 13, color: '#4f4f4f',
            cursor: 'pointer', border: 'none', textAlign: 'left',
          }}
        >
          <span>Automation controls (3)</span>
          <span style={{
            display: 'inline-block',
            transform: controlsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.15s', fontSize: 10,
          }}>▼</span>
        </button>
        {controlsOpen && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '8px 16px 12px' }}>
            {automationControls.map((c) => (
              <DragItem key={c.label} label={c.label} iconColor={c.color} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
