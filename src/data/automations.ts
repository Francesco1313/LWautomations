export interface Automation {
  id: string
  name: string
  group: string | null
  trigger: string
  timesExecuted: number
  editedOn: string
  status: 'published' | 'unpublished'
  hasErrors: boolean
  errorCount: number
}

export const automations: Automation[] = [
  {
    id: 'auto-001',
    name: 'Welcome email on signup',
    group: 'Onboarding',
    trigger: 'User signs up',
    timesExecuted: 1240,
    editedOn: '2025-11-14T10:30:00Z',
    status: 'published',
    hasErrors: false,
    errorCount: 0,
  },
  {
    id: 'auto-002',
    name: 'Course completion reward',
    group: 'Engagement',
    trigger: 'Course completed',
    timesExecuted: 845,
    editedOn: '2025-12-02T14:15:00Z',
    status: 'published',
    hasErrors: true,
    errorCount: 3,
  },
  {
    id: 'auto-003',
    name: 'Abandoned cart follow-up',
    group: 'Sales',
    trigger: 'User abandons cart',
    timesExecuted: 312,
    editedOn: '2025-10-28T09:00:00Z',
    status: 'unpublished',
    hasErrors: false,
    errorCount: 0,
  },
  {
    id: 'auto-004',
    name: 'Monthly newsletter digest',
    group: null,
    trigger: 'Scheduled monthly',
    timesExecuted: 24,
    editedOn: '2025-12-15T16:45:00Z',
    status: 'published',
    hasErrors: false,
    errorCount: 0,
  },
  {
    id: 'auto-005',
    name: 'Re-engagement campaign',
    group: 'Engagement',
    trigger: 'User inactive for 30 days',
    timesExecuted: 560,
    editedOn: '2025-11-20T11:00:00Z',
    status: 'published',
    hasErrors: true,
    errorCount: 7,
  },
  {
    id: 'auto-006',
    name: 'New instructor onboarding',
    group: 'Onboarding',
    trigger: 'Instructor account created',
    timesExecuted: 78,
    editedOn: '2025-09-05T13:30:00Z',
    status: 'unpublished',
    hasErrors: false,
    errorCount: 0,
  },
  {
    id: 'auto-007',
    name: 'Upsell premium membership',
    group: 'Sales',
    trigger: 'User finishes free course',
    timesExecuted: 430,
    editedOn: '2025-12-18T08:20:00Z',
    status: 'published',
    hasErrors: false,
    errorCount: 0,
  },
  {
    id: 'auto-008',
    name: 'Birthday discount coupon',
    group: null,
    trigger: 'User birthday',
    timesExecuted: 192,
    editedOn: '2025-07-30T17:10:00Z',
    status: 'unpublished',
    hasErrors: false,
    errorCount: 0,
  },
]
