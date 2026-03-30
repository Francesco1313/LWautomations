import { useState, useMemo } from 'react'
import NodeSideform, { CanvasNodeData } from './NodeSideform'
import { runs } from '../../data/runs'

// ── Node definitions ─────────────────────────────────────────────────────────
const NODES: CanvasNodeData[] = [
  { id: 'trigger-1', type: 'trigger', title: 'User tagged as', subtitle: 'Start an automation when', chips: ['Newsletter', 'Product Updates', 'Weekly Digest', '+2 more'], stepLabel: 'User signs up' },
  { id: 'action-1',  type: 'action',  title: 'Send welcome email', chips: ['Welcome email v2'], stepLabel: 'Send welcome email' },
  { id: 'delay-1',   type: 'delay',   title: 'Wait until 01:15 pm of 2025-10-21', stepLabel: 'Wait 3 days', waitingCount: 3 },
  { id: 'action-2',  type: 'action',  title: "Automatically tag based on user's email domain", chips: ['user custom field', '1 Hour Before', '+2 more'], stepLabel: 'Add to newsletter tag' },
  { id: 'branch-1',  type: 'branch',  title: 'Branch', chips: ['Has specific tags', 'AND', 'Own courses'], stepLabel: 'Branch' },
  { id: 'end-yes',   type: 'end',     title: 'End of the automation' },
  { id: 'end-no',    type: 'end',     title: 'End of the automation' },
]

// ── SVG Icons ─────────────────────────────────────────────────────────────────
function IconPerson({ color = '#fff', size = 18 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" />
    </svg>
  )
}

function IconClock({ color = '#fff', size = 18 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <polyline points="12 7 12 12 15 15" />
    </svg>
  )
}

function IconBranch({ color = '#fff', size = 18 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="6" y1="3" x2="6" y2="15" />
      <circle cx="18" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <path d="M6 9a9 9 0 0 1 9 9" />
    </svg>
  )
}

function IconFlag({ color = '#fff', size = 14 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" y1="22" x2="4" y2="15" />
    </svg>
  )
}

function IconUsers({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="var(--grey3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="9" cy="7" r="3" />
      <path d="M3 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5" />
      <circle cx="17" cy="7" r="2" />
      <path d="M21 20c0-2.2-1.8-3.8-4-3.8" />
    </svg>
  )
}

function IconWarning({ size = 20, color = 'var(--red)' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="3" />
    </svg>
  )
}

function IconInfo({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="var(--grey4)" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" strokeWidth="3" />
    </svg>
  )
}

// ── Left-side badges ──────────────────────────────────────────────────────────

// DEV: use inline label on <DelayNode> component
function WaitingBadge({ count }: { count: number }) {
  return (
    <div style={{
      width: 58,
      background: '#fff',
      border: '1px solid var(--grey5)',
      borderRadius: 10,
      padding: '10px 0 8px',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
      boxShadow: '0px 1px 6px rgba(0,0,0,0.07)',
    }}>
      <IconUsers size={22} />
      <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--grey1)', lineHeight: 1 }}>{count}</span>
    </div>
  )
}

// DEV: use <ErrorBadge> on node component
function ErrorBadge({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={e => { e.stopPropagation(); onClick() }}
      style={{
        width: 58,
        background: '#fff',
        border: '1px solid var(--red)',
        borderRadius: 10,
        padding: '10px 0 8px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
        boxShadow: '0px 1px 6px rgba(0,0,0,0.07)',
        cursor: 'pointer',
      }}
    >
      <IconWarning size={22} />
      <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--red)', lineHeight: 1 }}>!</span>
    </button>
  )
}

// Wrapper that renders left-side badges beside a node
// NOTE: popup is rendered as a direct child of this div (no transform parent)
// so that z-index works correctly across sibling nodes.
function NodeWithBadges({ children, waitingCount, hasError, isErrorOpen, onErrorClick, errorEntries }: {
  children: React.ReactNode
  waitingCount?: number
  hasError?: boolean
  isErrorOpen?: boolean
  onErrorClick?: () => void
  errorEntries?: ErrorEntry[]
}) {
  const showBadges = waitingCount !== undefined || hasError
  return (
    <div style={{ position: 'relative', zIndex: isErrorOpen ? 10 : 'auto' }}>

      {/* Badge row — transform container (stacking context isolated here) */}
      {showBadges && (
        <div style={{
          position: 'absolute',
          right: 'calc(100% + 10px)',
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex', flexDirection: 'row', gap: 8, alignItems: 'center',
        }}>
          {waitingCount !== undefined && <WaitingBadge count={waitingCount} />}
          {hasError && <ErrorBadge onClick={onErrorClick ?? (() => {})} />}
        </div>
      )}

      {/* Error popup — direct child of NodeWithBadges (no transform parent).
          DEV: use <Popover> or <Tooltip> from admin UI library */}
      {hasError && isErrorOpen && errorEntries && (
        <div
          onClick={e => e.stopPropagation()}
          style={{
            position: 'absolute',
            // Align popup with badge area: badge right edge is ~10px left of node left edge.
            // Popup appears covering badge + left portion of node card.
            left: -68,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 264,
            background: '#fff',
            border: '1px solid var(--grey5)',
            borderRadius: 8,
            boxShadow: '0 6px 24px rgba(0,0,0,0.14)',
            zIndex: 200,
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div style={{
            padding: '10px 14px',
            borderBottom: '1px solid var(--grey6)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <IconWarning size={13} />
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--red)' }}>
                {errorEntries.length} error{errorEntries.length !== 1 ? 's' : ''}
              </span>
            </div>
            <button
              onClick={onErrorClick}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--grey3)', fontSize: 16, lineHeight: 1, padding: 0 }}
            >×</button>
          </div>
          {/* Entries */}
          <div style={{ maxHeight: 300, overflowY: 'auto', padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {errorEntries.map((e, i) => (
              <div key={i} style={{
                background: 'var(--light-red)',
                border: '1px solid var(--notification-border)',
                borderLeft: '3px solid var(--red)',
                borderRadius: 6,
                padding: '8px 10px',
              }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--grey1)', marginBottom: 1 }}>{e.userName}</div>
                <div style={{ fontSize: 11, color: 'var(--grey3)', marginBottom: 6 }}>{e.userEmail}</div>
                <div style={{ fontSize: 12, color: 'var(--grey1)', lineHeight: 1.45 }}>{e.errorMessage}</div>
                <div style={{ fontSize: 11, color: 'var(--grey4)', marginTop: 6 }}>{fmtTime(e.timestamp)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {children}
    </div>
  )
}

// ── Error entry type + helper ─────────────────────────────────────────────────
interface ErrorEntry {
  userName: string
  userEmail: string
  errorMessage: string
  timestamp: string
}

function fmtTime(iso: string) {
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
  })
}

// ── Connector / PlusButton ────────────────────────────────────────────────────
function Connector({ height = 32 }: { height?: number }) {
  return <div style={{ width: 1, height, background: 'var(--grey5)' }} />
}

function PlusButton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ width: 1, height: 16, background: 'var(--grey5)' }} />
      {/* DEV: use <AddNodeButton> */}
      <button
        style={{
          width: 26, height: 26, borderRadius: '50%',
          background: '#fff', border: '1px solid var(--grey5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16, lineHeight: 1, color: 'var(--grey3)', cursor: 'pointer',
          boxShadow: '0px 1px 4px rgba(0,0,0,0.06)',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--teal)'; e.currentTarget.style.color = 'var(--teal)' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--grey5)'; e.currentTarget.style.color = 'var(--grey3)' }}
      >+</button>
      <div style={{ width: 1, height: 16, background: 'var(--grey5)' }} />
    </div>
  )
}

// ── Chip ──────────────────────────────────────────────────────────────────────
function Chip({ label }: { label: string }) {
  return (
    <span style={{
      padding: '3px 10px',
      background: 'var(--grey7)',
      border: '1px solid var(--grey5)',
      borderRadius: 20,
      fontSize: 12, color: 'var(--grey2)',
      whiteSpace: 'nowrap',
    }}>{label}</span>
  )
}

// ── TriggerNode ───────────────────────────────────────────────────────────────
function TriggerNode({ node, selected, onClick }: { node: CanvasNodeData; selected: boolean; onClick: () => void }) {
  return (
    // DEV: use <TriggerNode> canvas component
    <div onClick={onClick} style={{
      width: 456, background: '#fff', borderRadius: 12,
      boxShadow: '0px 1px 2px rgba(12,26,75,0.12), 0px 4px 12px rgba(50,50,71,0.07)',
      border: selected ? '2px solid var(--teal)' : '2px solid transparent',
      paddingTop: 32, paddingBottom: 18, paddingLeft: 18, paddingRight: 18,
      position: 'relative', cursor: 'pointer',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
    }}>
      <div style={{
        position: 'absolute', top: -22, left: '50%', transform: 'translateX(-50%)',
        width: 44, height: 44, borderRadius: '50%',
        background: 'var(--blue)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 0 0 4px #e8eaf6',
      }}>
        <IconPerson color="#fff" size={22} />
      </div>

      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 12, color: 'var(--grey3)', marginBottom: 5 }}>{node.subtitle}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, justifyContent: 'center' }}>
          <IconInfo size={13} />
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--grey1)' }}>{node.title}</span>
        </div>
      </div>

      {node.chips && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', width: '100%' }}>
          {node.chips.map(chip => <Chip key={chip} label={chip} />)}
        </div>
      )}
    </div>
  )
}

// ── ActionNode ────────────────────────────────────────────────────────────────
function ActionNode({ node, selected, onClick }: { node: CanvasNodeData; selected: boolean; onClick: () => void }) {
  return (
    // DEV: use <ActionNode> canvas component
    <div onClick={onClick} style={{
      width: 456, background: '#fff', borderRadius: 12,
      boxShadow: '0px 1px 2px rgba(12,26,75,0.12), 0px 4px 12px rgba(50,50,71,0.07)',
      border: selected ? '2px solid var(--teal)' : '2px solid transparent',
      display: 'flex', alignItems: 'center', gap: 14,
      cursor: 'pointer', padding: '14px 18px',
    }}>
      <div style={{
        width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
        background: '#8e24aa',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <IconPerson color="#fff" size={19} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--grey1)', marginBottom: node.chips?.length ? 8 : 0 }}>
          {node.title}
        </div>
        {node.chips && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {node.chips.map(chip => <Chip key={chip} label={chip} />)}
          </div>
        )}
      </div>
    </div>
  )
}

// ── DelayNode ─────────────────────────────────────────────────────────────────
function DelayNode({ node, selected, onClick }: { node: CanvasNodeData; selected: boolean; onClick: () => void }) {
  return (
    // DEV: use <DelayNode> canvas component
    <div onClick={onClick} style={{
      width: 456, background: '#fff', borderRadius: 12,
      boxShadow: '0px 1px 2px rgba(12,26,75,0.12), 0px 4px 12px rgba(50,50,71,0.07)',
      border: selected ? '2px solid var(--teal)' : '2px solid transparent',
      display: 'flex', alignItems: 'center', gap: 14,
      cursor: 'pointer', padding: '14px 18px',
    }}>
      <div style={{
        width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
        background: 'var(--grey1)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <IconClock color="#fff" size={19} />
      </div>
      <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--grey1)' }}>{node.title}</span>
    </div>
  )
}

// ── BranchNode ────────────────────────────────────────────────────────────────
function BranchNode({ node, selected, onClick }: { node: CanvasNodeData; selected: boolean; onClick: () => void }) {
  return (
    // DEV: use <BranchNode> canvas component
    <div onClick={onClick} style={{
      width: 456, background: '#fff', borderRadius: 12,
      boxShadow: '0px 1px 2px rgba(12,26,75,0.12), 0px 4px 12px rgba(50,50,71,0.07)',
      border: selected ? '2px solid var(--teal)' : '2px solid transparent',
      display: 'flex', alignItems: 'center', gap: 14,
      cursor: 'pointer', padding: '14px 18px',
    }}>
      <div style={{
        width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
        background: 'var(--grey1)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <IconBranch color="#fff" size={19} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--grey1)', marginBottom: node.chips?.length ? 8 : 0 }}>
          {node.title}
        </div>
        {node.chips && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {node.chips.map(chip => <Chip key={chip} label={chip} />)}
          </div>
        )}
      </div>
    </div>
  )
}

// ── EndNode ───────────────────────────────────────────────────────────────────
function EndNode({ selected, onClick }: { node: CanvasNodeData; selected: boolean; onClick: () => void }) {
  return (
    // DEV: use <EndNode> canvas component
    <div onClick={onClick} style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      background: '#e8eaf6', borderRadius: 100, padding: '8px 18px', cursor: 'pointer',
      border: selected ? '2px solid var(--teal)' : '2px solid transparent',
    }}>
      <div style={{
        width: 20, height: 20, borderRadius: '50%', background: 'var(--blue)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <IconFlag color="#fff" size={11} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--grey1)' }}>End of the automation</span>
    </div>
  )
}

// ── PathLabel / BranchSplitLayout ─────────────────────────────────────────────
function PathLabel({ label }: { label: string }) {
  return (
    <div style={{
      padding: '2px 14px', borderRadius: 4,
      background: 'var(--grey6)', border: '1px solid var(--grey5)',
      fontSize: 13, fontWeight: 500, color: 'var(--grey2)',
    }}>{label}</div>
  )
}

function BranchSplitLayout({ yesNode, noNode, selectedId, onSelect }: {
  yesNode: CanvasNodeData; noNode: CanvasNodeData
  selectedId: string | null; onSelect: (id: string) => void
}) {
  return (
    <div style={{ position: 'relative', display: 'flex', width: 560 }}>
      <div style={{ position: 'absolute', top: 0, left: '25%', right: '25%', height: 1, background: 'var(--grey5)' }} />
      <div style={{ position: 'absolute', top: 0, left: 'calc(25% - 0.5px)', width: 1, height: 32, background: 'var(--grey5)' }} />
      <div style={{ position: 'absolute', top: 0, left: 'calc(75% - 0.5px)', width: 1, height: 32, background: 'var(--grey5)' }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 32 }}>
        <PathLabel label="Yes" /><Connector height={16} /><PlusButton /><Connector height={16} />
        <EndNode node={yesNode} selected={selectedId === yesNode.id} onClick={() => onSelect(yesNode.id)} />
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 32 }}>
        <PathLabel label="No" /><Connector height={16} /><PlusButton /><Connector height={16} />
        <EndNode node={noNode} selected={selectedId === noNode.id} onClick={() => onSelect(noNode.id)} />
      </div>
    </div>
  )
}

// ── Canvas ────────────────────────────────────────────────────────────────────
export default function Canvas({ automationId }: { automationId?: string }) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [errorBadgeOpenId, setErrorBadgeOpenId] = useState<string | null>(null)

  const selectedNode = NODES.find(n => n.id === selectedId) ?? null

  const handleSelect = (id: string) => {
    setSelectedId(prev => prev === id ? null : id)
    setErrorBadgeOpenId(null)
  }

  const toggleErrorBadge = (nodeId: string) => {
    setErrorBadgeOpenId(prev => prev === nodeId ? null : nodeId)
    setSelectedId(null)
  }

  // Find the single node with the most real errors (non-null errorMessage).
  // Among ties, pick the one that appears earliest in the NODES flow order.
  const errorNodeId = useMemo<string | null>(() => {
    if (!automationId) return null
    let maxCount = 0
    let result: string | null = null
    NODES.forEach(node => {
      const label = node.stepLabel ?? node.title
      let count = 0
      runs
        .filter(r => r.automationId === automationId)
        .forEach(r => r.steps.forEach(s => {
          if (s.label === label && s.outcome === 'failed' && s.errorMessage) count++
        }))
      if (count > maxCount) {
        maxCount = count
        result = node.id
      }
    })
    return result
  }, [automationId])

  // Pre-compute error entries for the error node (used by the popup)
  const errorEntries = useMemo<ErrorEntry[]>(() => {
    if (!automationId || !errorNodeId) return []
    const node = NODES.find(n => n.id === errorNodeId)
    if (!node) return []
    const label = node.stepLabel ?? node.title
    const result: ErrorEntry[] = []
    runs.filter(r => r.automationId === automationId).forEach(r => {
      r.steps.filter(s => s.label === label && s.outcome === 'failed' && s.errorMessage).forEach(s => {
        result.push({ userName: r.userName, userEmail: r.userEmail, errorMessage: s.errorMessage!, timestamp: s.timestamp })
      })
    })
    return result
  }, [automationId, errorNodeId])

  return (
    <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

      {/* Canvas area */}
      <div style={{
        flex: 1, background: 'var(--grey7)',
        overflowY: 'auto', overflowX: 'auto',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '56px 80px 80px',
      }}>

        <NodeWithBadges hasError={errorNodeId === NODES[0].id} isErrorOpen={errorBadgeOpenId === NODES[0].id} errorEntries={errorNodeId === NODES[0].id ? errorEntries : []} onErrorClick={() => toggleErrorBadge(NODES[0].id)}>
          <TriggerNode node={NODES[0]} selected={selectedId === NODES[0].id} onClick={() => handleSelect(NODES[0].id)} />
        </NodeWithBadges>
        <PlusButton />

        <NodeWithBadges hasError={errorNodeId === NODES[1].id} isErrorOpen={errorBadgeOpenId === NODES[1].id} errorEntries={errorNodeId === NODES[1].id ? errorEntries : []} onErrorClick={() => toggleErrorBadge(NODES[1].id)}>
          <ActionNode node={NODES[1]} selected={selectedId === NODES[1].id} onClick={() => handleSelect(NODES[1].id)} />
        </NodeWithBadges>
        <PlusButton />

        <NodeWithBadges waitingCount={NODES[2].waitingCount} hasError={errorNodeId === NODES[2].id} isErrorOpen={errorBadgeOpenId === NODES[2].id} errorEntries={errorNodeId === NODES[2].id ? errorEntries : []} onErrorClick={() => toggleErrorBadge(NODES[2].id)}>
          <DelayNode node={NODES[2]} selected={selectedId === NODES[2].id} onClick={() => handleSelect(NODES[2].id)} />
        </NodeWithBadges>
        <PlusButton />

        <NodeWithBadges hasError={errorNodeId === NODES[3].id} isErrorOpen={errorBadgeOpenId === NODES[3].id} errorEntries={errorNodeId === NODES[3].id ? errorEntries : []} onErrorClick={() => toggleErrorBadge(NODES[3].id)}>
          <ActionNode node={NODES[3]} selected={selectedId === NODES[3].id} onClick={() => handleSelect(NODES[3].id)} />
        </NodeWithBadges>
        <PlusButton />

        <NodeWithBadges hasError={errorNodeId === NODES[4].id} isErrorOpen={errorBadgeOpenId === NODES[4].id} errorEntries={errorNodeId === NODES[4].id ? errorEntries : []} onErrorClick={() => toggleErrorBadge(NODES[4].id)}>
          <BranchNode node={NODES[4]} selected={selectedId === NODES[4].id} onClick={() => handleSelect(NODES[4].id)} />
        </NodeWithBadges>
        <BranchSplitLayout
          yesNode={NODES[5]} noNode={NODES[6]}
          selectedId={selectedId} onSelect={handleSelect}
        />

        {/* DEV: use <ZoomControls> */}
        <div style={{ position: 'fixed', bottom: 24, left: 320 }}>
          <div style={{
            background: '#fff', border: '1px solid var(--grey5)', borderRadius: 6,
            boxShadow: '0px 4px 10px rgba(0,0,0,0.08)',
            display: 'flex', alignItems: 'center', gap: 2, padding: '0 12px', height: 40,
          }}>
            <button style={{ fontSize: 16, color: 'var(--grey2)', padding: '0 6px', background: 'none', border: 'none', cursor: 'pointer' }}>−</button>
            <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--grey2)', minWidth: 36, textAlign: 'center' }}>50%</span>
            <button style={{ fontSize: 16, color: 'var(--grey2)', padding: '0 6px', background: 'none', border: 'none', cursor: 'pointer' }}>+</button>
            <div style={{ width: 1, height: 20, background: 'var(--grey5)', margin: '0 4px' }} />
            <button style={{ fontSize: 13, color: 'var(--grey2)', padding: '0 4px', background: 'none', border: 'none', cursor: 'pointer' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
            </button>
            <div style={{ width: 1, height: 20, background: 'var(--grey5)', margin: '0 4px' }} />
            <button style={{ fontSize: 13, color: 'var(--grey2)', padding: '0 4px', background: 'none', border: 'none', cursor: 'pointer' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            </button>
          </div>
        </div>
      </div>

      {/* Node sideform */}
      {selectedNode && (
        <NodeSideform node={selectedNode} onClose={() => setSelectedId(null)} />
      )}

    </div>
  )
}
