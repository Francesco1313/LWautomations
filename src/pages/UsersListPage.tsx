import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/layout/Sidebar'
import { users, User } from '../data/users'

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function Avatar({ name }: { name: string }) {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
  return (
    <div style={{
      width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
      background: 'var(--grey5)', color: 'var(--grey2)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 13, fontWeight: 600,
    }}>
      {initials}
    </div>
  )
}

function TagChip({ label }: { label: string }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '2px 8px', borderRadius: 3,
      fontSize: 12, background: 'var(--grey6)', color: 'var(--grey2)',
      whiteSpace: 'nowrap',
    }}>
      {label}
    </span>
  )
}

function UserRow({ user }: { user: User }) {
  const navigate = useNavigate()
  const [hovered, setHovered] = useState(false)
  return (
    <tr
      onClick={() => navigate(`/user/${user.id}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ borderBottom: '1px solid var(--grey6)', background: hovered ? 'var(--grey7)' : '#fff', cursor: 'pointer' }}
    >
      <td style={{ padding: '10px 12px', width: 40 }} onClick={e => e.stopPropagation()}>
        <input type="checkbox" style={{ cursor: 'pointer' }} />
      </td>
      <td style={{ padding: '10px 16px', verticalAlign: 'middle' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Avatar name={user.name} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--teal)' }}>{user.name}</div>
            <div style={{ fontSize: 12, color: 'var(--grey3)' }}>{user.email}</div>
          </div>
        </div>
      </td>
      <td style={{ padding: '10px 16px', fontSize: 13, color: 'var(--grey3)', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
        {user.lastActivityAt ? formatDateTime(user.lastActivityAt) : '–'}
      </td>
      <td style={{ padding: '10px 16px', fontSize: 13, color: 'var(--grey3)', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
        {formatDateTime(user.registeredAt)}
      </td>
      <td style={{ padding: '10px 16px', verticalAlign: 'middle' }}>
        <span style={{ fontSize: 13, color: 'var(--grey3)' }}>{user.courses > 0 ? user.courses : '–'}</span>
      </td>
      <td style={{ padding: '10px 16px', verticalAlign: 'middle' }}>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {user.tags.length === 0
            ? <span style={{ fontSize: 13, color: 'var(--grey4)' }}>–</span>
            : user.tags.map(t => <TagChip key={t} label={t} />)
          }
        </div>
      </td>
    </tr>
  )
}

export default function UsersListPage() {
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')

  const filtered = useMemo(() =>
    users
      .filter(u => {
        const matchSearch = !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
        const matchRole = roleFilter === 'all' || u.role.toLowerCase() === roleFilter
        return matchSearch && matchRole
      })
      .sort((a, b) => new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime()),
    [search, roleFilter]
  )

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
      <Sidebar />
      <main style={{ flex: 1, overflowY: 'auto', background: 'var(--grey7)', display: 'flex', flexDirection: 'column' }}>

        <div style={{ background: '#fff', borderBottom: '1px solid var(--grey5)', padding: '20px 32px', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 4 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <h1 style={{ fontSize: 22, fontWeight: 500, color: 'var(--grey1)', margin: 0 }}>All users</h1>
                <span style={{ fontSize: 13, color: 'var(--teal)', cursor: 'pointer', fontWeight: 500 }}>Learn more</span>
              </div>
              <p style={{ fontSize: 14, color: 'var(--grey3)', margin: 0 }}>
                Search, filter, and manage your school users, handling course and login details, and data export.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button style={{ height: 32, padding: '0 14px', background: 'var(--teal)', color: '#fff', border: 'none', borderRadius: 4, fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>Add user</button>
              <button style={{ height: 32, padding: '0 12px', background: '#fff', color: 'var(--grey2)', border: '1px solid var(--grey5)', borderRadius: 4, fontSize: 14, cursor: 'pointer' }}>Bulk actions ▾</button>
              <button style={{ height: 32, padding: '0 12px', background: '#fff', color: 'var(--grey2)', border: '1px solid var(--grey5)', borderRadius: 4, fontSize: 14, cursor: 'pointer' }}>Export users report ▾</button>
            </div>
          </div>
        </div>

        <div style={{ padding: '20px 32px', flex: 1 }}>
          <div style={{ background: '#fff', border: '1px solid var(--grey5)', borderRadius: 6, padding: '12px 16px', marginBottom: 16 }}>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ position: 'relative' }}>
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search"
                  style={{ height: 32, padding: '0 32px 0 10px', width: 220, border: '1px solid var(--grey5)', borderRadius: 4, fontSize: 13, outline: 'none', background: '#fff' }}
                />
              </div>
              {['Products', 'Date'].map(label => (
                <select key={label} style={{ height: 32, padding: '0 10px', border: '1px solid var(--grey5)', borderRadius: 4, fontSize: 13, color: 'var(--grey3)', background: '#fff', cursor: 'pointer' }}>
                  <option>{label}</option>
                </select>
              ))}
              <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} style={{ height: 32, padding: '0 10px', border: '1px solid var(--grey5)', borderRadius: 4, fontSize: 13, color: 'var(--grey3)', background: '#fff', cursor: 'pointer' }}>
                <option value="all">Role</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="instructor">Instructor</option>
              </select>
              <select style={{ height: 32, padding: '0 10px', border: '1px solid var(--grey5)', borderRadius: 4, fontSize: 13, color: 'var(--grey3)', background: '#fff', cursor: 'pointer' }}>
                <option>Status</option>
              </select>
              <button style={{ height: 32, padding: '0 10px', border: '1px solid var(--grey5)', borderRadius: 4, fontSize: 13, color: 'var(--teal)', background: '#fff', cursor: 'pointer' }}>+ tag filter</button>
            </div>
          </div>

          <div style={{ fontSize: 13, color: 'var(--grey3)', marginBottom: 10 }}>
            Showing <strong style={{ color: 'var(--grey1)' }}>1 – {filtered.length}</strong> users out of {users.length}
          </div>

          <div style={{ background: '#fff', border: '1px solid var(--grey5)', borderRadius: 6, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--cool-grey)', borderBottom: '1px solid var(--grey5)' }}>
                  <th style={{ width: 40, padding: '10px 12px' }}><input type="checkbox" /></th>
                  {['User', 'Last activity', 'Registered ▼', 'Products', 'Tags'].map(col => (
                    <th key={col} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--grey3)', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(u => <UserRow key={u.id} user={u} />)}
                {filtered.length === 0 && (
                  <tr><td colSpan={6} style={{ padding: 48, textAlign: 'center', color: 'var(--grey3)', fontSize: 13 }}>No users match your filters</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
