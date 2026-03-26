export type NodeType = 'trigger' | 'action' | 'delay' | 'branch' | 'end'

export interface CanvasNodeData {
  id: string
  type: NodeType
  title: string
  subtitle?: string
  chips?: string[]
}

interface NodeSideformProps {
  node: CanvasNodeData
  onClose: () => void
}

const sideformContent: Record<NodeType, { description: string; fields: { label: string; value: string }[] }> = {
  trigger: {
    description: 'This trigger starts the automation when the condition is met.',
    fields: [
      { label: 'Trigger type', value: 'User tagged as' },
      { label: 'Tags', value: 'Newsletter, Product Updates, Weekly Digest' },
      { label: 'Tag conditions', value: 'Applied' },
      { label: 'Re-entry rule', value: 'Once per user' },
    ],
  },
  action: {
    description: 'This action is executed for each user who reaches this step.',
    fields: [
      { label: 'Action type', value: 'Send email' },
      { label: 'Email template', value: 'Welcome email v2' },
      { label: 'From name', value: 'LearnWorlds Team' },
      { label: 'From email', value: 'noreply@learnworlds.com' },
    ],
  },
  delay: {
    description: 'Users wait at this step until the specified time has passed.',
    fields: [
      { label: 'Wait type', value: 'Until specific date/time' },
      { label: 'Wait until', value: '01:15 pm of 2025-10-21' },
      { label: 'Timezone', value: 'UTC' },
    ],
  },
  branch: {
    description: 'Users are routed down the YES or NO path depending on whether they meet the conditions.',
    fields: [
      { label: 'Condition 1', value: 'Has specific tags' },
      { label: 'Operator', value: 'AND' },
      { label: 'Condition 2', value: 'Own courses' },
    ],
  },
  end: {
    description: 'Users who reach this step have completed the automation.',
    fields: [],
  },
}

function typeLabel(type: NodeType) {
  return { trigger: 'Trigger', action: 'Action', delay: 'Delay', branch: 'Branch', end: 'End' }[type]
}

function typeColor(type: NodeType) {
  return {
    trigger: '#283593',
    action: '#8e24aa',
    delay: '#333',
    branch: '#333',
    end: '#029c91',
  }[type]
}

export default function NodeSideform({ node, onClose }: NodeSideformProps) {
  const content = sideformContent[node.type]

  return (
    <div style={{
      width: 380, minWidth: 380,
      height: '100%',
      background: '#fff',
      borderLeft: '1px solid #e0e0e0',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: "'Helvetica Neue', sans-serif",
      flexShrink: 0,
    }}>
      {/* Header */}
      <div style={{
        height: 56, display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', padding: '0 16px',
        borderBottom: '1px solid #e0e0e0', flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: typeColor(node.type),
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ color: '#fff', fontSize: 12 }}>
              {node.type === 'trigger' ? '⚡' : node.type === 'action' ? '✉' : node.type === 'delay' ? '⏱' : node.type === 'branch' ? '⑂' : '✓'}
            </span>
          </div>
          <div>
            <div style={{ fontSize: 11, color: '#828282', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 500 }}>
              {typeLabel(node.type)}
            </div>
            <div style={{ fontSize: 14, fontWeight: 500, color: '#333' }}>{node.title}</div>
          </div>
        </div>
        <button
          onClick={onClose}
          style={{ width: 28, height: 28, borderRadius: 4, fontSize: 18, color: '#828282', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#f2f2f2')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >✕</button>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
        <p style={{ fontSize: 13, color: '#828282', lineHeight: 1.5, marginBottom: 20 }}>
          {content.description}
        </p>

        {content.fields.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {content.fields.map((field) => (
              <div key={field.label}>
                <div style={{ fontSize: 11, fontWeight: 500, color: '#828282', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {field.label}
                </div>
                <div style={{
                  padding: '8px 12px',
                  background: '#f9f9f9',
                  border: '1px solid #f2f2f2',
                  borderRadius: 4,
                  fontSize: 13,
                  color: '#333',
                }}>
                  {field.value}
                </div>
              </div>
            ))}
          </div>
        )}

        {node.chips && node.chips.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 500, color: '#828282', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Tags
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {node.chips.map((chip) => (
                <span key={chip} style={{
                  padding: '4px 10px',
                  background: '#f9f9f9',
                  border: '1px solid #f2f2f2',
                  borderRadius: 4,
                  fontSize: 12,
                  color: '#4f4f4f',
                }}>{chip}</span>
              ))}
            </div>
          </div>
        )}

        {node.type === 'end' && (
          <div style={{
            marginTop: 24, padding: 16,
            background: '#e8eaf6', borderRadius: 8,
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>🏁</div>
            <div style={{ fontSize: 13, color: '#333', fontWeight: 500 }}>End of the automation</div>
            <div style={{ fontSize: 12, color: '#828282', marginTop: 4 }}>
              Users who reach this point have completed all steps.
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
