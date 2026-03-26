export interface AutomationHistoryEntry {
  automationId: string
  automationName: string
  eventType: 'enrolled' | 'action_executed' | 'completed' | 'exited'
  timestamp: string
}

export interface User {
  id: string
  name: string
  email: string
  automationHistory: AutomationHistoryEntry[]
}

export const users: User[] = [
  {
    id: 'user-001',
    name: 'Alice Rossi',
    email: 'alice.rossi@example.com',
    automationHistory: [
      { automationId: 'auto-001', automationName: 'Welcome email on signup', eventType: 'enrolled', timestamp: '2025-12-01T09:00:00Z' },
      { automationId: 'auto-001', automationName: 'Welcome email on signup', eventType: 'action_executed', timestamp: '2025-12-01T09:01:00Z' },
      { automationId: 'auto-001', automationName: 'Welcome email on signup', eventType: 'completed', timestamp: '2025-12-06T09:01:10Z' },
      { automationId: 'auto-002', automationName: 'Course completion reward', eventType: 'enrolled', timestamp: '2025-12-05T16:00:00Z' },
      { automationId: 'auto-002', automationName: 'Course completion reward', eventType: 'action_executed', timestamp: '2025-12-05T16:00:10Z' },
      { automationId: 'auto-007', automationName: 'Upsell premium membership', eventType: 'enrolled', timestamp: '2025-12-08T09:30:00Z' },
      { automationId: 'auto-007', automationName: 'Upsell premium membership', eventType: 'completed', timestamp: '2025-12-08T09:30:15Z' },
    ],
  },
  {
    id: 'user-002',
    name: 'Marco Bianchi',
    email: 'marco.bianchi@example.com',
    automationHistory: [
      { automationId: 'auto-001', automationName: 'Welcome email on signup', eventType: 'enrolled', timestamp: '2025-12-02T14:00:00Z' },
      { automationId: 'auto-001', automationName: 'Welcome email on signup', eventType: 'exited', timestamp: '2025-12-02T14:01:05Z' },
      { automationId: 'auto-002', automationName: 'Course completion reward', eventType: 'enrolled', timestamp: '2025-12-06T08:00:00Z' },
      { automationId: 'auto-002', automationName: 'Course completion reward', eventType: 'action_executed', timestamp: '2025-12-06T08:00:05Z' },
      { automationId: 'auto-002', automationName: 'Course completion reward', eventType: 'exited', timestamp: '2025-12-06T08:00:15Z' },
      { automationId: 'auto-007', automationName: 'Upsell premium membership', eventType: 'enrolled', timestamp: '2025-12-09T11:00:00Z' },
      { automationId: 'auto-007', automationName: 'Upsell premium membership', eventType: 'action_executed', timestamp: '2025-12-09T11:00:10Z' },
    ],
  },
  {
    id: 'user-003',
    name: 'Sofia Esposito',
    email: 'sofia.esposito@example.com',
    automationHistory: [
      { automationId: 'auto-001', automationName: 'Welcome email on signup', eventType: 'enrolled', timestamp: '2025-12-03T10:30:00Z' },
      { automationId: 'auto-001', automationName: 'Welcome email on signup', eventType: 'action_executed', timestamp: '2025-12-03T10:31:00Z' },
      { automationId: 'auto-001', automationName: 'Welcome email on signup', eventType: 'completed', timestamp: '2025-12-06T10:31:10Z' },
      { automationId: 'auto-005', automationName: 'Re-engagement campaign', eventType: 'enrolled', timestamp: '2025-12-07T12:00:00Z' },
      { automationId: 'auto-005', automationName: 'Re-engagement campaign', eventType: 'action_executed', timestamp: '2025-12-07T12:01:00Z' },
      { automationId: 'auto-005', automationName: 'Re-engagement campaign', eventType: 'exited', timestamp: '2025-12-07T12:02:00Z' },
      { automationId: 'auto-001', automationName: 'Welcome email on signup', eventType: 'enrolled', timestamp: '2025-12-10T15:00:00Z' },
    ],
  },
]
