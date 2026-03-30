import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

type SubItem = { label: string; path: string }
type NavSection =
  | { kind: 'item'; label: string; path: string }
  | { kind: 'group'; label: string; subItems: SubItem[]; defaultOpen?: boolean }

const sections: NavSection[] = [
  { kind: 'item',  label: 'Home',          path: '#' },
  { kind: 'item',  label: 'Courses',       path: '#' },
  { kind: 'item',  label: 'Website',       path: '#' },
  {
    kind: 'group', label: 'Users', defaultOpen: true,
    subItems: [
      { label: 'All users',      path: '#' },
      { label: 'Collaborators',  path: '#' },
      { label: 'Leads',          path: '#' },
      { label: 'User Groups',    path: '#' },
      { label: 'Multiple Seats', path: '#' },
      { label: 'Automations',    path: '/' },
      { label: 'Tags',           path: '#' },
      { label: 'Approvals',      path: '#' },
    ],
  },
  { kind: 'item', label: 'Communication', path: '#' },
  { kind: 'item', label: 'Marketing',     path: '#' },
  { kind: 'item', label: 'Reports',       path: '#' },
  { kind: 'item', label: 'Mobile app',    path: '#' },
  { kind: 'item', label: 'Settings',      path: '#' },
]

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState<Record<string, boolean>>({ Users: true })

  const isAutomationsActive =
    location.pathname === '/' ||
    location.pathname.startsWith('/canvas') ||
    location.pathname.startsWith('/detail')

  function isSubActive(label: string) {
    if (label === 'Automations') return isAutomationsActive
    if (label === 'All users')   return location.pathname.startsWith('/user')
    return false
  }

  return (
    /* DEV: use <LeftSidebar> from admin UI library */
    <aside style={{
      width: 245, minWidth: 245, height: '100%',
      background: '#fff',
      borderRight: '1px solid var(--grey6)',
      display: 'flex', flexDirection: 'column',
      flexShrink: 0, overflow: 'hidden',
      fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    }}>

      {/* DEV: use <SchoolInfo> component — logo + school name */}
      <div style={{
        height: 64, flexShrink: 0,
        borderBottom: '1px solid var(--grey6)',
        display: 'flex', alignItems: 'center',
        padding: '0 12px', gap: 8,
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: '50%',
          background: '#FFEF5E', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 700, fontSize: 13, color: '#333', letterSpacing: '-0.5px',
        }}>
          BU
        </div>
        <span style={{
          fontSize: 14, fontWeight: 500,
          color: 'var(--teal)',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          BRND University
        </span>
      </div>

      {/* DEV: use <MainNavOptions> component */}
      <nav style={{ flex: 1, padding: '12px 0', overflowY: 'auto' }}>
        {sections.map((section) => {
          if (section.kind === 'item') {
            return (
              <button
                key={section.label}
                onClick={() => section.path !== '#' && navigate(section.path)}
                style={{
                  width: '100%', height: 32,
                  display: 'flex', alignItems: 'center',
                  padding: '0 20px',
                  background: 'transparent', border: 'none',
                  fontSize: 15, fontWeight: 500, color: 'var(--grey2)',
                  cursor: section.path !== '#' ? 'pointer' : 'default',
                  textAlign: 'left',
                }}
                onMouseEnter={(e) => { if (section.path !== '#') e.currentTarget.style.background = 'var(--grey7)' }}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                {section.label}
              </button>
            )
          }

          const isExpanded = open[section.label] ?? section.defaultOpen ?? false

          return (
            <div key={section.label}>
              {/* DEV: use <NavGroupHeader> — collapsible */}
              <button
                onClick={() => setOpen(prev => ({ ...prev, [section.label]: !isExpanded }))}
                style={{
                  width: '100%', height: 32,
                  display: 'flex', alignItems: 'center',
                  padding: '0 20px',
                  background: 'transparent', border: 'none',
                  fontSize: 15, fontWeight: 500, color: 'var(--grey2)',
                  cursor: 'pointer', textAlign: 'left',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--grey7)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                {section.label}
              </button>

              {isExpanded && section.subItems.map((sub) => {
                const active = isSubActive(sub.label)
                return (
                  /* DEV: use <NavSubItem active={active}> */
                  <button
                    key={sub.label}
                    onClick={() => sub.path !== '#' && navigate(sub.path)}
                    style={{
                      width: '100%', height: 30,
                      display: 'flex', alignItems: 'center',
                      padding: '0 0 0 41px',
                      background: 'transparent', border: 'none',
                      borderLeft: `2px solid ${active ? 'var(--teal)' : 'var(--grey6)'}`,
                      fontSize: 14, fontWeight: active ? 500 : 400,
                      color: active ? 'var(--teal)' : 'var(--grey3)',
                      cursor: sub.path !== '#' ? 'pointer' : 'default',
                      textAlign: 'left',
                    }}
                    onMouseEnter={(e) => { if (!active) e.currentTarget.style.color = 'var(--grey2)' }}
                    onMouseLeave={(e) => { if (!active) e.currentTarget.style.color = 'var(--grey3)' }}
                  >
                    {sub.label}
                  </button>
                )
              })}
            </div>
          )
        })}
      </nav>

      {/* DEV: use <BottomNavOptions> component */}
      <div style={{ borderTop: '1px solid var(--grey6)', padding: '12px 0', flexShrink: 0 }}>
        {['Search', 'My account'].map(label => (
          <button
            key={label}
            style={{
              width: '100%', height: 32,
              display: 'flex', alignItems: 'center',
              padding: '0 20px',
              background: 'transparent', border: 'none',
              fontSize: 15, fontWeight: 500, color: 'var(--grey2)',
              cursor: 'default', textAlign: 'left',
            }}
          >
            {label}
          </button>
        ))}
      </div>
    </aside>
  )
}
