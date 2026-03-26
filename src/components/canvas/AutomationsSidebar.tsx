import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { automations } from '../../data/automations'

interface AutomationsSidebarProps {
  currentId: string
}

export default function AutomationsSidebar({ currentId }: AutomationsSidebarProps) {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [ungroupedOpen, setUngroupedOpen] = useState(true)
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const filtered = automations.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{
      width: 280,
      minWidth: 280,
      height: '100%',
      background: '#ffffff',
      borderRight: '1px solid #e0e0e0',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        height: 44,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 12px',
        borderBottom: '1px solid #e0e0e0',
        flexShrink: 0,
      }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: '#333' }}>Automations</span>
        <div style={{ display: 'flex', gap: 4 }}>
          <button style={{
            width: 24, height: 24, borderRadius: 4, fontSize: 16, color: '#4f4f4f',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#f2f2f2')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>+</button>
          <button style={{
            width: 24, height: 24, borderRadius: 4, fontSize: 14, color: '#4f4f4f',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#f2f2f2')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>✕</button>
        </div>
      </div>

      {/* Search */}
      <div style={{ padding: '8px 12px', flexShrink: 0 }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search automations..."
          style={{
            width: '100%',
            height: 32,
            padding: '0 8px',
            background: '#f9f9f9',
            border: '1px solid #f2f2f2',
            borderRadius: 4,
            fontSize: 13,
            color: '#333',
            outline: 'none',
          }}
        />
      </div>

      {/* Automations list */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {/* Ungrouped section */}
        <div>
          <button
            onClick={() => setUngroupedOpen(!ungroupedOpen)}
            style={{
              width: '100%',
              height: 32,
              display: 'flex',
              alignItems: 'center',
              padding: '0 12px',
              background: '#f2f2f2',
              color: '#828282',
              fontSize: 11,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              gap: 4,
            }}
          >
            <span style={{
              display: 'inline-block',
              transform: ungroupedOpen ? 'rotate(90deg)' : 'rotate(0deg)',
              transition: 'transform 0.15s',
              fontSize: 10,
            }}>▶</span>
            Ungrouped ({filtered.length})
          </button>

          {ungroupedOpen && filtered.map((automation) => {
            const isActive = automation.id === currentId
            const isHovered = hoveredId === automation.id

            return (
              <div
                key={automation.id}
                onClick={() => navigate(`/canvas/${automation.id}`)}
                onMouseEnter={() => setHoveredId(automation.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  height: 36,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0 12px',
                  background: isActive ? '#f9f9f9' : isHovered ? '#f9f9f9' : 'transparent',
                  cursor: 'pointer',
                  borderLeft: isActive ? '2px solid #029c91' : '2px solid transparent',
                }}
              >
                <span style={{
                  fontSize: 13,
                  color: isActive ? '#029c91' : '#333',
                  fontWeight: isActive ? 500 : 400,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  flex: 1,
                }}>{automation.name}</span>
                {(isActive || isHovered) && (
                  <button style={{
                    width: 20, height: 20, borderRadius: 3, fontSize: 14,
                    color: '#828282', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}
                    onMouseEnter={(e) => { e.stopPropagation(); (e.currentTarget.style.background = '#e0e0e0') }}
                    onMouseLeave={(e) => { e.stopPropagation(); (e.currentTarget.style.background = 'transparent') }}>⋮</button>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
