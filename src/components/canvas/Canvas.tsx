import { useState, useMemo } from 'react'
import { Run } from '../../data/runs'
import NodeSideform, { CanvasNodeData } from './NodeSideform'

export type DateRange = '7d' | '30d' | '90d' | 'all'

interface EnrolledUser {
  name: string
  email: string
  enrolledAt: string
}

interface FailedDetail {
  userName: string
  userEmail: string
  errorMessage: string
}

interface NodeStats {
  firedCount: number
  succeeded: number
  failed: number
  waiting: number
  branchYes: number
  branchNo: number
  enrolledUsers: EnrolledUser[]
  failedDetails: FailedDetail[]
}

const NODE_STEP_LABELS: Record<string, string[]> = {
  'action-1': ['Send welcome email'],
  'action-2': ['Add to newsletter tag', 'Add re-engagement tag', 'Add upsell-pending tag', 'Add premium tag'],
}

function getRangeStart(range: DateRange): Date | null {
  const now = new Date('2026-03-19T23:59:59Z')
  if (range === 'all') return null
  const days = range === '7d' ? 7 : range === '30d' ? 30 : 90
  const d = new Date(now)
  d.setDate(d.getDate() - days)
  return d
}

function computeStats(runs: Run[], dateRange: DateRange): Record<string, NodeStats> {
  const start = getRangeStart(dateRange)
  const filtered = start ? runs.filter(r => new Date(r.enrolledAt) >= start) : runs
  const empty = (): NodeStats => ({
    firedCount: 0, succeeded: 0, failed: 0, waiting: 0, branchYes: 0, branchNo: 0,
    enrolledUsers: [], failedDetails: [],
  })

  const stats: Record<string, NodeStats> = {
    'trigger-1': empty(), 'action-1': empty(), 'delay-1': empty(),
    'action-2': empty(), 'branch-1': empty(), 'end-yes': empty(), 'end-no': empty(),
  }

  stats['trigger-1'].firedCount = filtered.length
  stats['trigger-1'].enrolledUsers = filtered.map(r => ({
    name: r.userName,
    email: r.userEmail,
    enrolledAt: r.enrolledAt,
  }))

  for (const nodeId of ['action-1', 'action-2'] as const) {
    const labels = NODE_STEP_LABELS[nodeId]
    filtered.forEach(run => {
      run.steps.forEach(step => {
        if (step.type === 'action' && labels.includes(step.label)) {
          if (step.outcome === 'success') {
            stats[nodeId].succeeded++
          } else {
            stats[nodeId].failed++
            stats[nodeId].failedDetails.push({
              userName: run.userName,
              userEmail: run.userEmail,
              errorMessage: step.errorMessage ?? 'Unknown error',
            })
          }
        }
      })
    })
  }

  stats['delay-1'].waiting = filtered.filter(r => r.status === 'in_progress').length

  filtered.forEach(run => {
    run.steps.forEach(step => {
      if (step.type === 'branch') {
        if (step.branchPath === 'yes') stats['branch-1'].branchYes++
        else if (step.branchPath === 'no') stats['branch-1'].branchNo++
      }
    })
  })

  return stats
}

// ── Chip helpers ───────────────────────────────────────────────────────────
function ChipArrow() {
  return (
    <div style={{
      width: 0, height: 0, flexShrink: 0,
      borderTop: '5px solid transparent',
      borderBottom: '5px solid transparent',
      borderLeft: '6px solid #d8d8d8',
    }} />
  )
}

// Wrapper: positions chip absolutely to the left of the parent card (which must be position:relative)
function LeftChip({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      position: 'absolute',
      right: '100%',
      top: '50%',
      transform: 'translateY(-50%)',
      display: 'flex',
      alignItems: 'center',
      zIndex: 20,
    }}>
      {children}
      <ChipArrow />
    </div>
  )
}

// Shared popover container with caret
function ChipPopover({ children, width = 300 }: { children: React.ReactNode; width?: number }) {
  return (
    <div style={{
      position: 'absolute',
      bottom: 'calc(100% + 10px)',
      left: '50%',
      transform: 'translateX(-50%)',
      width,
      background: '#fff',
      border: '1px solid #e0e0e0',
      borderRadius: 8,
      boxShadow: '0px 8px 24px rgba(0,0,0,0.14)',
      padding: 16,
      zIndex: 200,
    }}>
      {children}
      {/* Caret border */}
      <div style={{
        position: 'absolute', bottom: -8, left: '50%', transform: 'translateX(-50%)',
        width: 0, height: 0,
        borderLeft: '8px solid transparent', borderRight: '8px solid transparent',
        borderTop: '8px solid #e0e0e0',
      }} />
      {/* Caret white fill */}
      <div style={{
        position: 'absolute', bottom: -7, left: '50%', transform: 'translateX(-50%)',
        width: 0, height: 0,
        borderLeft: '7px solid transparent', borderRight: '7px solid transparent',
        borderTop: '7px solid #fff',
      }} />
    </div>
  )
}

// ── Trigger chip (interactive — lists enrolled users) ──────────────────────
function TriggerChip({ fired, enrolledUsers }: { fired: number; enrolledUsers: EnrolledUser[] }) {
  const [open, setOpen] = useState(false)
  if (fired === 0) return null

  return (
    <LeftChip>
      <div style={{ position: 'relative' }}>
        {open && (
          <ChipPopover width={320}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: 14 }}>👤</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>
                {fired} user{fired !== 1 ? 's' : ''} enrolled
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {enrolledUsers.map((u, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 500, color: '#333' }}>{u.name}</div>
                    <div style={{ fontSize: 11, color: '#828282' }}>{u.email}</div>
                  </div>
                  <div style={{ fontSize: 11, color: '#bdbdbd', flexShrink: 0, marginLeft: 12 }}>
                    {new Date(u.enrolledAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                  </div>
                </div>
              ))}
            </div>
          </ChipPopover>
        )}
        <div
          onClick={e => { e.stopPropagation(); setOpen(o => !o) }}
          style={{
            padding: '5px 8px',
            background: open ? '#ebebeb' : '#f9f9f9',
            border: '1px solid #e8e8e8',
            borderRadius: 5,
            display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 5,
            cursor: 'pointer',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = '#ebebeb')}
          onMouseLeave={e => (e.currentTarget.style.background = open ? '#ebebeb' : '#f9f9f9')}
        >
          <span style={{ fontSize: 11, color: '#9e9e9e' }}>⚡</span>
          <span style={{ fontSize: 11, color: '#9e9e9e', fontWeight: 500, whiteSpace: 'nowrap' }}>{fired} fired</span>
        </div>
      </div>
    </LeftChip>
  )
}

// ── Action chip (interactive — shows passed/failed breakdown) ──────────────
function ActionChip({ succeeded, failed, failedDetails }: {
  succeeded: number
  failed: number
  failedDetails: FailedDetail[]
}) {
  const [open, setOpen] = useState(false)
  if (succeeded === 0 && failed === 0) return null

  return (
    <LeftChip>
      <div style={{ position: 'relative' }}>
        {open && (
          <ChipPopover width={340}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
              <span style={{ fontSize: 13, color: '#029c91', fontWeight: 600 }}>✓ {succeeded} passed</span>
              <span style={{ fontSize: 13, color: failed > 0 ? '#ec0e0e' : '#bdbdbd', fontWeight: 600 }}>⊘ {failed} failed</span>
            </div>
            {failed > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ fontSize: 11, fontWeight: 500, color: '#828282', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>
                  Failed
                </div>
                {failedDetails.map((d, i) => (
                  <div key={i} style={{ padding: '8px 10px', background: '#fff5f5', border: '1px solid #fecdd3', borderRadius: 6 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#333', marginBottom: 2 }}>{d.userName}</div>
                    <div style={{ fontSize: 11, color: '#828282', marginBottom: 6 }}>{d.userEmail}</div>
                    <div style={{ fontSize: 11, color: '#ec0e0e', lineHeight: 1.5 }}>{d.errorMessage}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: 12, color: '#828282', margin: 0 }}>All actions completed successfully.</p>
            )}
          </ChipPopover>
        )}
        <div
          onClick={e => { e.stopPropagation(); setOpen(o => !o) }}
          style={{
            padding: '5px 8px',
            background: open ? '#ebebeb' : '#f9f9f9',
            border: '1px solid #e8e8e8',
            borderRadius: 5,
            display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 3,
            cursor: 'pointer',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = '#ebebeb')}
          onMouseLeave={e => (e.currentTarget.style.background = open ? '#ebebeb' : '#f9f9f9')}
        >
          <span style={{ fontSize: 10, color: '#029c91', fontWeight: 500, whiteSpace: 'nowrap' }}>✓ {succeeded} passed</span>
          <span style={{ fontSize: 10, color: failed > 0 ? '#ec0e0e' : '#bdbdbd', fontWeight: 500, whiteSpace: 'nowrap' }}>⊘ {failed} failed</span>
        </div>
      </div>
    </LeftChip>
  )
}

// ── Delay chip (interactive — move users popover) ──────────────────────────
function DelayChip({ waiting }: { waiting: number }) {
  const [open, setOpen] = useState(false)
  const [moved, setMoved] = useState(false)
  const count = moved ? 0 : waiting
  if (count === 0) return null

  return (
    <LeftChip>
      <div style={{ position: 'relative' }}>
        {open && (
          <ChipPopover width={300}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 16 }}>👥</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>
                {count} user{count !== 1 ? 's' : ''} waiting in this delay
              </span>
            </div>
            <p style={{ fontSize: 12, color: '#828282', lineHeight: 1.6, margin: '0 0 14px' }}>
              These users are currently waiting in this delay step. If necessary, you can end the delay and move them to the next step immediately.
            </p>
            <button
              onClick={() => { setMoved(true); setOpen(false) }}
              style={{
                height: 30, padding: '0 14px',
                border: '1px solid #029c91', borderRadius: 4,
                fontSize: 12, color: '#029c91', background: '#fff',
                cursor: 'pointer', fontWeight: 500,
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#e1f7f5')}
              onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
            >
              Move users to next step
            </button>
          </ChipPopover>
        )}
        <div
          onClick={e => { e.stopPropagation(); setOpen(o => !o) }}
          style={{
            padding: '5px 8px',
            background: open ? '#ebebeb' : '#f5f5f5',
            border: '1px solid #e0e0e0',
            borderRadius: 6,
            display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 5,
            cursor: 'pointer',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = '#ebebeb')}
          onMouseLeave={e => (e.currentTarget.style.background = open ? '#ebebeb' : '#f5f5f5')}
        >
          <span style={{ fontSize: 12, color: '#828282' }}>👥</span>
          <span style={{ fontSize: 11, fontWeight: 600, color: '#4f4f4f', whiteSpace: 'nowrap' }}>{count} waiting</span>
        </div>
      </div>
    </LeftChip>
  )
}

// ── Branch chip (informational) ────────────────────────────────────────────
function BranchChip({ yes, no }: { yes: number; no: number }) {
  if (yes === 0 && no === 0) return null
  return (
    <LeftChip>
      <div style={{
        padding: '5px 8px',
        background: '#f9f9f9',
        border: '1px solid #e8e8e8',
        borderRadius: 5,
        display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 3,
      }}>
        <span style={{ fontSize: 10, color: '#029c91', fontWeight: 500, whiteSpace: 'nowrap' }}>Yes {yes}</span>
        <span style={{ fontSize: 10, color: '#828282', fontWeight: 500, whiteSpace: 'nowrap' }}>No {no}</span>
      </div>
    </LeftChip>
  )
}

// ── Node definitions ───────────────────────────────────────────────────────
const NODES: CanvasNodeData[] = [
  { id: 'trigger-1', type: 'trigger', title: 'User tagged as', subtitle: 'Start an automation when', chips: ['Newsletter', 'Product Updates', 'Weekly Digest', '+2 more'] },
  { id: 'action-1', type: 'action', title: 'Send welcome email', chips: ['Welcome email v2'] },
  { id: 'delay-1', type: 'delay', title: 'Wait until 01:15 pm of 2025-10-21' },
  { id: 'action-2', type: 'action', title: 'Automatically tag based on user\'s email domain', chips: ['user custom field', '1 Hour Before', '+2 more'] },
  { id: 'branch-1', type: 'branch', title: 'Branch', chips: ['Has specific tags', 'AND', 'Own courses'] },
  { id: 'end-yes', type: 'end', title: 'End of the automation' },
  { id: 'end-no', type: 'end', title: 'End of the automation' },
]

// ── TriggerNode ────────────────────────────────────────────────────────────
function TriggerNode({ node, selected, onClick, stats }: { node: CanvasNodeData; selected: boolean; onClick: () => void; stats: NodeStats }) {
  return (
    <div onClick={onClick} style={{
      width: 456, background: '#fff', borderRadius: 4,
      boxShadow: '0px 0px 1px rgba(12,26,75,0.24), 0px 3px 8px rgba(50,50,71,0.05)',
      border: selected ? '2px solid #029c91' : '2px solid transparent',
      paddingTop: 24, paddingBottom: 16, paddingLeft: 12, paddingRight: 12,
      position: 'relative', cursor: 'pointer',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
    }}>
      <TriggerChip fired={stats.firedCount} enrolledUsers={stats.enrolledUsers} />

      {/* Icon */}
      <div style={{
        position: 'absolute', top: -22, left: '50%', transform: 'translateX(-50%)',
        width: 44, height: 44, borderRadius: '50%',
        background: '#e8eaf6', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#283593', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: '#fff', fontSize: 16 }}>👤</span>
        </div>
      </div>

      {/* Heading */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 14, color: '#828282' }}>{node.subtitle}</div>
        <div style={{ fontSize: 14, fontWeight: 500, color: '#333', marginTop: 2 }}>⊙ {node.title}</div>
      </div>

      {/* Chips */}
      {node.chips && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', width: '100%' }}>
          {node.chips.map(chip => (
            <span key={chip} style={{ padding: '4px 8px', background: '#f9f9f9', borderRadius: 4, fontSize: 13, color: '#4f4f4f' }}>{chip}</span>
          ))}
        </div>
      )}

      {/* Tag conditions — centered */}
      <div style={{ width: '100%', borderTop: '1px solid #f2f2f2', paddingTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#e8eaf6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#283593' }}>🏷</div>
        <span style={{ fontSize: 13, color: '#4f4f4f' }}>Tag conditions applied</span>
      </div>
    </div>
  )
}

// ── ActionNode ─────────────────────────────────────────────────────────────
function ActionNode({ node, selected, onClick, stats }: { node: CanvasNodeData; selected: boolean; onClick: () => void; stats: NodeStats }) {
  return (
    <div onClick={onClick} style={{
      width: 456, background: '#fff', borderRadius: 4,
      boxShadow: '0px 0px 1px rgba(12,26,75,0.24), 0px 3px 8px rgba(50,50,71,0.05)',
      border: selected ? '2px solid #029c91' : '2px solid transparent',
      display: 'flex', alignItems: 'stretch', cursor: 'pointer',
      overflow: 'visible', position: 'relative',
    }}>
      <ActionChip succeeded={stats.succeeded} failed={stats.failed} failedDetails={stats.failedDetails} />

      {/* Left icon strip */}
      <div style={{
        width: 72, flexShrink: 0, background: 'rgba(243,229,245,0.5)',
        borderRight: '1px solid #f9f9f9',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px 10px',
        borderRadius: '2px 0 0 2px',
      }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#f3e5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#8e24aa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#fff', fontSize: 12 }}>✉</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: '10px', display: 'flex', flexDirection: 'column', gap: 6, overflow: 'hidden' }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#333' }}>{node.title}</div>
        {node.chips && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {node.chips.map(chip => (
              <span key={chip} style={{ padding: '4px 8px', background: '#f9f9f9', borderRadius: 4, fontSize: 12, color: '#4f4f4f' }}>{chip}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ── DelayNode ──────────────────────────────────────────────────────────────
function DelayNode({ node, selected, onClick, stats }: { node: CanvasNodeData; selected: boolean; onClick: () => void; stats: NodeStats }) {
  return (
    <div onClick={onClick} style={{
      width: 456, background: '#fff', borderRadius: 4,
      boxShadow: '0px 0px 1px rgba(12,26,75,0.24), 0px 3px 8px rgba(50,50,71,0.05)',
      border: selected ? '2px solid #029c91' : '2px solid transparent',
      display: 'flex', alignItems: 'stretch', cursor: 'pointer',
      overflow: 'visible', position: 'relative',
    }}>
      <DelayChip waiting={stats.waiting} />

      {/* Left icon strip */}
      <div style={{
        width: 72, flexShrink: 0, background: '#f9f9f9',
        borderRight: '1px solid #f2f2f2', borderRadius: '4px 0 0 4px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#fff', fontSize: 14 }}>⏱</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: '8px 10px', display: 'flex', alignItems: 'center' }}>
        <span style={{ fontSize: 14, fontWeight: 500, color: '#333' }}>{node.title}</span>
      </div>
    </div>
  )
}

// ── BranchNode ─────────────────────────────────────────────────────────────
function BranchNode({ node, selected, onClick, stats }: { node: CanvasNodeData; selected: boolean; onClick: () => void; stats: NodeStats }) {
  return (
    <div onClick={onClick} style={{
      width: 456, background: '#fff', borderRadius: 4,
      boxShadow: '0px 0px 1px rgba(12,26,75,0.24), 0px 3px 8px rgba(50,50,71,0.05)',
      border: selected ? '2px solid #029c91' : '2px solid transparent',
      display: 'flex', alignItems: 'stretch', cursor: 'pointer',
      overflow: 'visible', position: 'relative',
    }}>
      <BranchChip yes={stats.branchYes} no={stats.branchNo} />

      {/* Left icon strip */}
      <div style={{
        width: 72, flexShrink: 0, background: '#f5f5f5',
        borderRight: '1px solid #f2f2f2', borderRadius: '4px 0 0 4px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#fff', fontSize: 14 }}>⑂</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: '10px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#333' }}>{node.title}</div>
        {node.chips && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {node.chips.map(chip => (
              <span key={chip} style={{ padding: '4px 8px', background: '#f9f9f9', borderRadius: 4, fontSize: 12, color: '#4f4f4f' }}>{chip}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ── EndNode ────────────────────────────────────────────────────────────────
function EndNode({ node, selected, onClick }: { node: CanvasNodeData; selected: boolean; onClick: () => void }) {
  return (
    <div onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 8,
      background: '#e8eaf6', borderRadius: 100,
      padding: '8px 16px', cursor: 'pointer',
      border: selected ? '2px solid #029c91' : '2px solid transparent',
    }}>
      <span style={{ fontSize: 14, color: '#333' }}>🏠</span>
      <span style={{ fontSize: 12, fontWeight: 700, color: '#333' }}>End of the automation</span>
    </div>
  )
}

// ── PlusButton / Connector ─────────────────────────────────────────────────
function PlusButton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ width: 1, height: 20, background: '#e0e0e0' }} />
      <button
        style={{ width: 28, height: 28, borderRadius: '50%', background: '#fff', border: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: '#828282', cursor: 'pointer', boxShadow: '0px 1px 4px rgba(0,0,0,0.06)' }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = '#029c91')}
        onMouseLeave={e => (e.currentTarget.style.borderColor = '#e0e0e0')}
      >+</button>
      <div style={{ width: 1, height: 20, background: '#e0e0e0' }} />
    </div>
  )
}

function Connector({ height = 32 }: { height?: number }) {
  return <div style={{ width: 1, height, background: '#e0e0e0' }} />
}

// ── Label pill (Yes / No) ──────────────────────────────────────────────────
function PathLabel({ label }: { label: string }) {
  return (
    <div style={{
      padding: '2px 14px', borderRadius: 4,
      background: '#f2f2f2', border: '1px solid #e0e0e0',
      fontSize: 13, fontWeight: 500, color: '#4f4f4f',
    }}>{label}</div>
  )
}

// ── Branch split layout ────────────────────────────────────────────────────
function BranchSplitLayout({
  yesNode, noNode, selectedId, onSelect,
}: {
  yesNode: CanvasNodeData
  noNode: CanvasNodeData
  selectedId: string | null
  onSelect: (id: string) => void
}) {
  return (
    <div style={{ position: 'relative', display: 'flex', width: 560 }}>
      {/* Horizontal split line at y=0, from 25% to 75% */}
      <div style={{ position: 'absolute', top: 0, left: '25%', right: '25%', height: 1, background: '#e0e0e0' }} />
      {/* Left vertical: 25% down 32px */}
      <div style={{ position: 'absolute', top: 0, left: 'calc(25% - 0.5px)', width: 1, height: 32, background: '#e0e0e0' }} />
      {/* Right vertical: 75% down 32px */}
      <div style={{ position: 'absolute', top: 0, left: 'calc(75% - 0.5px)', width: 1, height: 32, background: '#e0e0e0' }} />

      {/* YES path */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 32 }}>
        <PathLabel label="Yes" />
        <Connector height={16} />
        <PlusButton />
        <Connector height={16} />
        <EndNode node={yesNode} selected={selectedId === yesNode.id} onClick={() => onSelect(yesNode.id)} />
      </div>

      {/* NO path */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 32 }}>
        <PathLabel label="No" />
        <Connector height={16} />
        <PlusButton />
        <Connector height={16} />
        <EndNode node={noNode} selected={selectedId === noNode.id} onClick={() => onSelect(noNode.id)} />
      </div>
    </div>
  )
}

// ── Canvas ─────────────────────────────────────────────────────────────────
interface CanvasProps {
  runs: Run[]
  dateRange: DateRange
}

export default function Canvas({ runs, dateRange }: CanvasProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selectedNode = NODES.find(n => n.id === selectedId) ?? null
  const nodeStats = useMemo(() => computeStats(runs, dateRange), [runs, dateRange])

  const handleSelect = (id: string) => setSelectedId(prev => prev === id ? null : id)

  return (
    <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
      {/* Canvas area */}
      <div style={{
        flex: 1, background: '#f9f9f9', overflowY: 'auto', overflowX: 'auto',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '48px 80px 80px',
      }}>
        <TriggerNode node={NODES[0]} selected={selectedId === NODES[0].id} onClick={() => handleSelect(NODES[0].id)} stats={nodeStats['trigger-1']} />
        <PlusButton />
        <ActionNode node={NODES[1]} selected={selectedId === NODES[1].id} onClick={() => handleSelect(NODES[1].id)} stats={nodeStats['action-1']} />
        <PlusButton />
        <DelayNode node={NODES[2]} selected={selectedId === NODES[2].id} onClick={() => handleSelect(NODES[2].id)} stats={nodeStats['delay-1']} />
        <PlusButton />
        <ActionNode node={NODES[3]} selected={selectedId === NODES[3].id} onClick={() => handleSelect(NODES[3].id)} stats={nodeStats['action-2']} />
        <PlusButton />
        <BranchNode node={NODES[4]} selected={selectedId === NODES[4].id} onClick={() => handleSelect(NODES[4].id)} stats={nodeStats['branch-1']} />
        <Connector height={0} />
        <BranchSplitLayout
          yesNode={NODES[5]}
          noNode={NODES[6]}
          selectedId={selectedId}
          onSelect={handleSelect}
        />

        {/* Zoom controls */}
        <div style={{ position: 'fixed', bottom: 24, left: 320, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{
            background: '#fff', border: '1px solid #e0e0e0', borderRadius: 4,
            boxShadow: '0px 4px 10px rgba(0,0,0,0.1)',
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 12px', height: 44, minWidth: 160,
          }}>
            <button style={{ fontSize: 16, color: '#4f4f4f' }}>−</button>
            <span style={{ fontSize: 14, fontWeight: 500, color: '#4f4f4f', minWidth: 32, textAlign: 'center' }}>50%</span>
            <button style={{ fontSize: 16, color: '#4f4f4f' }}>+</button>
            <div style={{ width: 1, height: 24, background: '#e0e0e0' }} />
            <button style={{ fontSize: 14, color: '#4f4f4f' }}>⛶</button>
            <div style={{ width: 1, height: 24, background: '#e0e0e0' }} />
            <button style={{ fontSize: 14, color: '#4f4f4f' }}>⬇</button>
          </div>
        </div>
      </div>

      {/* Node sideform */}
      {selectedNode && <NodeSideform node={selectedNode} onClose={() => setSelectedId(null)} />}
    </div>
  )
}
