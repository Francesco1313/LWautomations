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
      background: '#fff',
      borderLeft: '1px solid #e0e0e0',
      boxShadow: '-4px 0 20px rgba(0,0,0,0.08)',
      display: 'flex', flexDirection: 'column',
      fontFamily: "'Helvetica Neue', sans-serif",
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid #e0e0e0',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: '#333' }}>Why did this enroll?</span>
        <button
          onClick={onClose}
          style={{ fontSize: 18, color: '#828282', padding: 4, borderRadius: 4 }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#f2f2f2')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >✕</button>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
        {/* User + Enrolled badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: '#e8eaf6', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, fontWeight: 700, color: '#283593', flexShrink: 0,
          }}>
            {run.userName.charAt(0)}
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#333' }}>{run.userName}</div>
            <div style={{ fontSize: 12, color: '#828282' }}>{run.userEmail}</div>
          </div>
          <div style={{
            marginLeft: 'auto',
            background: '#e8eaf6', borderRadius: 100,
            padding: '3px 10px', fontSize: 12, fontWeight: 500, color: '#283593',
          }}>Enrolled</div>
        </div>

        {/* Fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#828282', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
              Enrolled at
            </div>
            <div style={{ fontSize: 14, color: '#333' }}>{formatDateTime(run.enrolledAt)}</div>
          </div>

          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#828282', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
              Trigger event
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '10px 12px', background: '#f9f9f9',
              border: '1px solid #f2f2f2', borderRadius: 4,
            }}>
              <span style={{ color: '#029c91', fontSize: 13 }}>●</span>
              <span style={{ fontSize: 14, color: '#333' }}>{run.triggerEvent}</span>
            </div>
          </div>

          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#828282', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
              Re-entry rule
            </div>
            <div style={{ fontSize: 14, color: '#333' }}>{run.reentryRule}</div>
          </div>
        </div>

        {/* View in user profile */}
        <div style={{ marginTop: 32, paddingTop: 20, borderTop: '1px solid #f2f2f2' }}>
          <button
            onClick={() => navigate(`/user/${run.userId}`)}
            style={{
              fontSize: 13, color: '#029c91', fontWeight: 500,
              display: 'flex', alignItems: 'center', gap: 4,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
            onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
          >
            View in user profile ↗
          </button>
        </div>
      </div>
    </div>
  )
}
