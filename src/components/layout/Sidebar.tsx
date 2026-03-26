import { useNavigate, useLocation } from 'react-router-dom'

const navItems = [
  { label: 'Dashboard', icon: '⊞', path: '#' },
  { label: 'Users', icon: '👤', path: '#' },
  { label: 'Courses', icon: '📚', path: '#' },
  { label: 'Communities', icon: '💬', path: '#' },
  { label: 'Memberships', icon: '⭐', path: '#' },
  { label: 'Automations', icon: '⚡', path: '/' },
  { label: 'Sales', icon: '💳', path: '#' },
  { label: 'Settings', icon: '⚙️', path: '#' },
]

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <aside style={{
      width: 200,
      minWidth: 200,
      height: '100%',
      background: '#ffffff',
      borderRight: '1px solid #e0e0e0',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
    }}>
      {/* Logo area */}
      <div style={{
        height: 56,
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        borderBottom: '1px solid #e0e0e0',
      }}>
        <div style={{
          width: 32,
          height: 32,
          background: '#029c91',
          borderRadius: 6,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontWeight: 700,
          fontSize: 16,
          marginRight: 8,
        }}>LW</div>
        <span style={{ fontWeight: 600, fontSize: 14, color: '#333' }}>LearnWorlds</span>
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: '8px 0' }}>
        {navItems.map((item) => {
          const isActive =
            (item.path === '/' && (location.pathname === '/' || location.pathname.startsWith('/canvas') || location.pathname.startsWith('/detail'))) ||
            (item.label === 'Users' && location.pathname.startsWith('/user'))
          return (
            <button
              key={item.label}
              onClick={() => item.path !== '#' && navigate(item.path)}
              style={{
                width: '100%',
                height: 40,
                display: 'flex',
                alignItems: 'center',
                padding: '0 16px',
                gap: 10,
                background: isActive ? '#e1f7f5' : 'transparent',
                color: isActive ? '#029c91' : '#4f4f4f',
                fontSize: 14,
                fontWeight: isActive ? 500 : 400,
                cursor: item.path !== '#' ? 'pointer' : 'default',
                border: 'none',
                textAlign: 'left',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => {
                if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = '#f9f9f9'
              }}
              onMouseLeave={(e) => {
                if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'
              }}
            >
              <span style={{
                width: 20,
                height: 20,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 14,
                flexShrink: 0,
              }}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
