import { useNavigate } from 'react-router-dom'
import { Run } from '../../data/runs'

interface Props {
  run: Run
  onClose: () => void
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default function WhyDidEnrollPanel({ run, onClose }: Props) {
  const navigate = useNavigate()

  return (
    <div style={{
      position: 'fixed', top: 0, right: 0, bottom: 0,
      width: 380, zIndex: 100,
      background: 'white',
      borderLeft: '1px solid var(--grey5)',
      boxShadow: '-4px 0 20px rgba(0,0,0,0.08)',
      display: 'flex', flexDirection: 'column',
      fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    }}>
      {/* Header */}
      {/* DEV: use <SidePanel> or <Drawer> from admin UI library */}
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid var(--grey5)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--grey1)' }}>Why did this enroll?</span>
        <button
          onClick={onClose}
          style={{ fontSize: 18, color: 'var(--grey3)', padding: 4, borderRadius: 4 }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--grey6)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          ×
        </button>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
        {/* User + Enrolled badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'var(--cool-grey)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, fontWeight: 700, color: 'var(--grey2)', flexShrink: 0,
          }}>
            {run.userName.charAt(0)}
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--grey1)' }}>{run.userName}</div>
            <div style={{ fontSize: 12, color: 'var(--grey3)' }}>{run.userEmail}</div>
          </div>
          <div style={{
            marginLeft: 'auto',
            background: 'var(--light-teal)', borderRadius: 100,
            padding: '3px 10px', fontSize: 12, fontWeight: 500, color: 'var(--teal)',
          }}>Enrolled</div>
        </div>

        {/* Fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--grey3)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
              Enrolled at
            </div>
            <div style={{ fontSize: 14, color: 'var(--grey1)' }}>{formatDateTime(run.enrolledAt)}</div>
          </div>

          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--grey3)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
              Trigger event
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '10px 12px', background: 'var(--grey7)',
              border: '1px solid var(--grey6)', borderRadius: 4,
            }}>
              <span style={{ color: 'var(--teal)', fontSize: 13 }}>•</span>
              <span style={{ fontSize: 14, color: 'var(--grey1)' }}>{run.triggerEvent}</span>
            </div>
          </div>

          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--grey3)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
              Re-entry rule
            </div>
            <div style={{ fontSize: 13, color: 'var(--grey3)', fontStyle: 'italic' }}>
              N/A, re-entry rules not yet implemented
            </div>
          </div>
        </div>

        {/* View in user profile */}
        <div style={{ marginTop: 32, paddingTop: 20, borderTop: '1px solid var(--grey6)' }}>
          <button
            onClick={() => navigate(`/user/${run.userId}`)}
            style={{
              fontSize: 13, color: 'var(--teal)', fontWeight: 500,
              display: 'flex', alignItems: 'center', gap: 4,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
            onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
          >
            View in user profile
          </button>
        </div>
      </div>
    </div>
  )
}
