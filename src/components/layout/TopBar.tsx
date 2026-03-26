import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

interface TopBarProps {
  automationName: string
}

export default function TopBar({ automationName }: TopBarProps) {
  const navigate = useNavigate()
  const [isPublished, setIsPublished] = useState(false)

  return (
    <div style={{
      height: 44,
      background: '#ffffff',
      borderBottom: '1px solid #e0e0e0',
      display: 'flex',
      alignItems: 'center',
      padding: '0 16px',
      flexShrink: 0,
      position: 'relative',
    }}>
      {/* Left section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1 }}>
        <button
          onClick={() => navigate('/')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            color: '#4f4f4f',
            fontSize: 14,
            padding: '4px 6px',
            borderRadius: 4,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#f2f2f2')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          <span style={{ fontSize: 16 }}>←</span>
        </button>
        <span style={{ fontSize: 14, color: '#333', fontWeight: 500 }}>Automation</span>
        <span style={{ color: '#bdbdbd', fontSize: 14 }}>|</span>
        <span style={{ fontSize: 14, color: '#4f4f4f', cursor: 'pointer' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#029c91')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#4f4f4f')}>Edit</span>
        <span style={{ color: '#bdbdbd', fontSize: 14 }}>|</span>
        <span style={{ fontSize: 14, color: '#4f4f4f', cursor: 'pointer' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#029c91')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#4f4f4f')}>Help</span>
        <span style={{ color: '#bdbdbd', fontSize: 14 }}>|</span>
        <span style={{ fontSize: 14, color: '#d9006f', cursor: 'pointer', fontWeight: 500 }}>Upgrade</span>
      </div>

      {/* Center: Undo / Redo */}
      <div style={{
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'center',
        gap: 4,
      }}>
        <button style={{
          display: 'flex', alignItems: 'center', gap: 4,
          color: '#828282', fontSize: 13, padding: '4px 8px', borderRadius: 4,
        }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#f2f2f2')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
          <span style={{ fontSize: 14 }}>↩</span>
          <span>Undo</span>
        </button>
        <button style={{
          display: 'flex', alignItems: 'center', gap: 4,
          color: '#828282', fontSize: 13, padding: '4px 8px', borderRadius: 4,
        }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#f2f2f2')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
          <span style={{ fontSize: 14 }}>↪</span>
          <span>Redo</span>
        </button>
      </div>

      {/* Right section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginLeft: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Toggle */}
          <button
            onClick={() => setIsPublished(!isPublished)}
            style={{
              width: 36,
              height: 20,
              borderRadius: 10,
              background: isPublished ? '#029c91' : '#bdbdbd',
              position: 'relative',
              transition: 'background 0.2s',
              flexShrink: 0,
            }}
          >
            <span style={{
              position: 'absolute',
              top: 2,
              left: isPublished ? 18 : 2,
              width: 16,
              height: 16,
              borderRadius: '50%',
              background: '#fff',
              transition: 'left 0.2s',
              boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
            }} />
          </button>
          <span style={{ fontSize: 13, color: '#4f4f4f' }}>Publish the automation</span>
        </div>
        <button style={{
          height: 32,
          padding: '0 16px',
          background: '#029c91',
          color: '#fff',
          fontSize: 13,
          fontWeight: 500,
          borderRadius: 4,
          border: 'none',
          cursor: 'pointer',
        }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#027d74')}
          onMouseLeave={(e) => (e.currentTarget.style.background = '#029c91')}>
          Save
        </button>
      </div>
    </div>
  )
}
