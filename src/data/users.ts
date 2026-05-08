export interface User {
  id: string
  name: string
  email: string
  role: 'User' | 'Admin' | 'Instructor'
  registeredAt: string
  lastActivityAt: string | null
  tags: string[]
  courses: number
  programs: number
  certificates: number
  loginActivity: { label: string; date: string }[]
}

export const users: User[] = [
  {
    id: 'user-001',
    name: 'Simone Moretti',
    email: 'simone.moretti@example.com',
    role: 'User',
    registeredAt: '2026-04-08T12:30:00Z',
    lastActivityAt: '2026-04-08T12:31:00Z',
    tags: ['onboarding', 'active'],
    courses: 1, programs: 0, certificates: 0,
    loginActivity: [
      { label: 'Logged in', date: '2026-04-08T12:30:00Z' },
      { label: 'Is an imported new user', date: '2026-04-08T12:29:00Z' },
    ],
  },
  {
    id: 'user-002',
    name: 'Valentina Greco',
    email: 'valentina.greco@example.com',
    role: 'User',
    registeredAt: '2026-04-05T16:10:00Z',
    lastActivityAt: '2026-04-05T16:15:00Z',
    tags: ['onboarding'],
    courses: 2, programs: 0, certificates: 0,
    loginActivity: [
      { label: 'Logged in', date: '2026-04-05T16:10:00Z' },
      { label: 'Enrolled in course', date: '2026-04-05T16:12:00Z' },
    ],
  },
  {
    id: 'user-003',
    name: 'Davide Serra',
    email: 'davide.serra@example.com',
    role: 'User',
    registeredAt: '2026-04-01T10:45:00Z',
    lastActivityAt: '2026-04-02T09:00:00Z',
    tags: ['engaged'],
    courses: 3, programs: 1, certificates: 0,
    loginActivity: [
      { label: 'Drip feed section unlocked', date: '2026-04-02T09:00:00Z' },
      { label: 'Logged in', date: '2026-04-01T10:45:00Z' },
      { label: 'Is an imported new user', date: '2026-04-01T10:44:00Z' },
    ],
  },
  {
    id: 'user-004',
    name: 'Chiara Fontana',
    email: 'chiara.fontana@example.com',
    role: 'User',
    registeredAt: '2026-03-28T12:00:00Z',
    lastActivityAt: '2026-03-29T14:00:00Z',
    tags: ['onboarding', 'premium'],
    courses: 2, programs: 0, certificates: 1,
    loginActivity: [
      { label: 'Logged in', date: '2026-03-29T14:00:00Z' },
      { label: 'Completed course', date: '2026-03-29T13:45:00Z' },
      { label: 'Logged in', date: '2026-03-28T12:00:00Z' },
    ],
  },
  {
    id: 'user-005',
    name: 'Paolo Conti',
    email: 'paolo.conti@example.com',
    role: 'User',
    registeredAt: '2026-03-24T11:00:00Z',
    lastActivityAt: '2026-03-25T10:00:00Z',
    tags: [],
    courses: 1, programs: 0, certificates: 0,
    loginActivity: [
      { label: 'Logged in', date: '2026-03-25T10:00:00Z' },
      { label: 'Logged in', date: '2026-03-24T11:00:00Z' },
    ],
  },
  {
    id: 'user-006',
    name: 'Roberto Mancini',
    email: 'roberto.mancini@example.com',
    role: 'User',
    registeredAt: '2026-03-21T10:10:00Z',
    lastActivityAt: '2026-03-22T08:30:00Z',
    tags: ['engaged'],
    courses: 4, programs: 1, certificates: 0,
    loginActivity: [
      { label: 'Logged in', date: '2026-03-22T08:30:00Z' },
      { label: 'Drip feed section unlocked', date: '2026-03-21T11:00:00Z' },
      { label: 'Logged in', date: '2026-03-21T10:10:00Z' },
    ],
  },
  {
    id: 'user-007',
    name: 'Martina Ricci',
    email: 'martina.ricci@example.com',
    role: 'User',
    registeredAt: '2026-03-19T15:20:00Z',
    lastActivityAt: null,
    tags: ['inactive'],
    courses: 0, programs: 0, certificates: 0,
    loginActivity: [
      { label: 'Logged in', date: '2026-03-19T15:20:00Z' },
    ],
  },
  {
    id: 'user-008',
    name: 'Andrea Colombo',
    email: 'andrea.colombo@example.com',
    role: 'User',
    registeredAt: '2026-03-14T10:45:00Z',
    lastActivityAt: '2026-03-15T09:00:00Z',
    tags: ['premium'],
    courses: 5, programs: 2, certificates: 1,
    loginActivity: [
      { label: 'Completed course', date: '2026-03-15T09:00:00Z' },
      { label: 'Logged in', date: '2026-03-14T10:45:00Z' },
    ],
  },
  {
    id: 'user-009',
    name: 'Elena Galli',
    email: 'elena.galli@example.com',
    role: 'User',
    registeredAt: '2026-03-11T17:30:00Z',
    lastActivityAt: '2026-03-12T10:00:00Z',
    tags: [],
    courses: 2, programs: 0, certificates: 0,
    loginActivity: [
      { label: 'Logged in', date: '2026-03-12T10:00:00Z' },
      { label: 'Enrolled in course', date: '2026-03-11T17:35:00Z' },
      { label: 'Logged in', date: '2026-03-11T17:30:00Z' },
    ],
  },
  {
    id: 'user-010',
    name: 'Giulia Romano',
    email: 'giulia.romano@example.com',
    role: 'Instructor',
    registeredAt: '2026-03-08T12:30:00Z',
    lastActivityAt: '2026-03-10T14:00:00Z',
    tags: ['instructor'],
    courses: 0, programs: 0, certificates: 0,
    loginActivity: [
      { label: 'Logged in', date: '2026-03-10T14:00:00Z' },
      { label: 'Manually add & enroll (instructor)', date: '2026-03-08T12:31:00Z' },
      { label: 'Logged in', date: '2026-03-08T12:30:00Z' },
    ],
  },
  {
    id: 'user-011',
    name: 'Luca Ferrari',
    email: 'luca.ferrari@example.com',
    role: 'User',
    registeredAt: '2026-03-02T09:15:00Z',
    lastActivityAt: '2026-03-05T11:00:00Z',
    tags: ['onboarding'],
    courses: 1, programs: 0, certificates: 0,
    loginActivity: [
      { label: 'Logged in', date: '2026-03-05T11:00:00Z' },
      { label: 'Logged in', date: '2026-03-02T09:15:00Z' },
    ],
  },
  {
    id: 'user-012',
    name: 'Marco Bianchi',
    email: 'marco.bianchi@example.com',
    role: 'User',
    registeredAt: '2026-02-20T10:00:00Z',
    lastActivityAt: '2026-02-22T15:00:00Z',
    tags: ['engaged', 'premium'],
    courses: 6, programs: 2, certificates: 2,
    loginActivity: [
      { label: 'Completed course', date: '2026-02-22T15:00:00Z' },
      { label: 'Drip feed section unlocked', date: '2026-02-21T09:00:00Z' },
      { label: 'Logged in', date: '2026-02-20T10:00:00Z' },
    ],
  },
  {
    id: 'user-013',
    name: 'Alice Rossi',
    email: 'alice.rossi@example.com',
    role: 'Admin',
    registeredAt: '2025-01-15T09:00:00Z',
    lastActivityAt: '2026-04-07T10:00:00Z',
    tags: ['admin'],
    courses: 0, programs: 0, certificates: 0,
    loginActivity: [
      { label: 'Logged in', date: '2026-04-07T10:00:00Z' },
      { label: 'Logged in', date: '2026-04-01T09:00:00Z' },
    ],
  },
  {
    id: 'user-014',
    name: 'Sofia Esposito',
    email: 'sofia.esposito@example.com',
    role: 'User',
    registeredAt: '2026-02-10T14:00:00Z',
    lastActivityAt: '2026-02-15T16:00:00Z',
    tags: ['onboarding', 'inactive'],
    courses: 1, programs: 0, certificates: 0,
    loginActivity: [
      { label: 'Logged in', date: '2026-02-15T16:00:00Z' },
      { label: 'Is an imported new user', date: '2026-02-10T14:01:00Z' },
      { label: 'Logged in', date: '2026-02-10T14:00:00Z' },
    ],
  },
]
