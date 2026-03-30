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
      background: 'white',
      borderBottom: '1px solid var(--grey5)',
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
            color: 'var(--grey2)',
            fontSize: 14,
            padding: '4px 6px',
            borderRadius: 4,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--grey6)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          <span style={{ fontSize: 16 }}>←</span>
        </button>
        <span style={{ fontSize: 14, color: 'var(--grey1)', fontWeight: 500 }}>
          {automationName}
        </span>
        <span style={{ color: 'var(--grey4)', fontSize: 14 }}>|</span>
        <span
          style={{ fontSize: 14, color: 'var(--grey2)', cursor: 'pointer' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--teal)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--grey2)')}
        >
          Edit
        </span>
        <span style={{ color: 'var(--grey4)', fontSize: 14 }}>|</span>
        <span
          style={{ fontSize: 14, color: 'var(--grey2)', cursor: 'pointer' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--teal)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--grey2)')}
        >
          Help
        </span>
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
          color: 'var(--grey3)', fontSize: 13, padding: '4px 8px', borderRadius: 4,
        }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--grey6)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
          <span style={{ fontSize: 14 }}>↩</span>
          <span>Undo</span>
        </button>
        <button style={{
          display: 'flex', alignItems: 'center', gap: 4,
          color: 'var(--grey3)', fontSize: 13, padding: '4px 8px', borderRadius: 4,
        }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--grey6)')}
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
              background: isPublished ? 'var(--teal)' : 'var(--grey4)',
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
              background: 'white',
              transition: 'left 0.2s',
              boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
            }} />
          </button>
          <span style={{ fontSize: 13, color: 'var(--grey2)' }}>Publish the automation</span>
        </div>
        <button style={{
          height: 32,
          padding: '0 16px',
          background: 'var(--teal)',
          color: 'white',
          fontSize: 13,
          fontWeight: 500,
          borderRadius: 4,
          border: 'none',
          cursor: 'pointer',
        }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--teal-80)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--teal)')}>
          Save
        </button>
      </div>
    </div>
  )
}
