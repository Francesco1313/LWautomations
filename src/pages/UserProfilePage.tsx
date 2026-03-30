import { useParams, useNavigate } from 'react-router-dom'
import Sidebar from '../components/layout/Sidebar'

export default function UserProfilePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', fontFamily: "'Helvetica Neue', sans-serif" }}>
      <Sidebar />
      <main style={{ flex: 1, overflowY: 'auto', background: 'var(--grey7)', display: 'flex', flexDirection: 'column' }}>

        {/* DEV: use <PageHeader> */}
        <div style={{ background: '#fff', borderBottom: '1px solid var(--grey5)', padding: '20px 32px', flexShrink: 0 }}>
          <div style={{ fontSize: 13, color: 'var(--grey3)', marginBottom: 8 }}>
            <button
              onClick={() => navigate(-1 as never)}
              style={{ color: 'var(--teal)', fontSize: 13, cursor: 'pointer', fontWeight: 500, background: 'none', border: 'none', padding: 0 }}
            >← All users</button>
            <span style={{ margin: '0 6px' }}>›</span>
            <span>User {id}</span>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--grey1)', margin: 0 }}>User profile</h1>
        </div>

        {/* Placeholder — will be built in Step 7 */}
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column', gap: 8,
        }}>
          <span style={{ fontSize: 32, color: 'var(--grey4)' }}>👤</span>
          <p style={{ fontSize: 15, fontWeight: 500, color: 'var(--grey3)', margin: 0 }}>User profile — coming in Step 7</p>
          <p style={{ fontSize: 13, color: 'var(--grey4)', margin: 0 }}>Automation activity timeline</p>
        </div>

      </main>
    </div>
  )
}
