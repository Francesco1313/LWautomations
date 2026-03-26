import { useState } from 'react'
import { useParams } from 'react-router-dom'
import TopBar from '../components/layout/TopBar'
import AutomationsSidebar from '../components/canvas/AutomationsSidebar'
import BuildingBlocksSidebar from '../components/canvas/BuildingBlocksSidebar'
import Canvas, { DateRange } from '../components/canvas/Canvas'
import { automations } from '../data/automations'
import { runs } from '../data/runs'

type SidebarTab = 'automations' | 'building-blocks'

const DATE_RANGE_OPTIONS: { label: string; value: DateRange }[] = [
  { label: 'Last 7 days', value: '7d' },
  { label: 'Last 30 days', value: '30d' },
  { label: 'Last 90 days', value: '90d' },
  { label: 'All time', value: 'all' },
]

export default function CanvasPage() {
  const { id } = useParams<{ id: string }>()
  const automation = automations.find(a => a.id === id)
  const automationName = automation?.name ?? 'Automation'

  const [activeTab, setActiveTab] = useState<SidebarTab>('automations')
  const [dateRange, setDateRange] = useState<DateRange>('30d')

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden',
      fontFamily: "'Helvetica Neue', sans-serif",
    }}>
      {/* Top bar */}
      <TopBar automationName={automationName} />

      {/* Editor options bar */}
      <div style={{
        height: 42, background: '#fff', borderBottom: '1px solid #e0e0e0',
        display: 'flex', alignItems: 'stretch', padding: '0 0 0 0',
        flexShrink: 0, position: 'relative',
      }}>
        {/* Left: tabs */}
        <div style={{ display: 'flex', alignItems: 'stretch', gap: 0 }}>
          <button
            onClick={() => setActiveTab('automations')}
            style={{
              height: '100%', padding: '0 16px',
              display: 'flex', alignItems: 'center', gap: 6,
              fontSize: 14, fontWeight: 500,
              color: activeTab === 'automations' ? '#333' : '#828282',
              borderBottom: activeTab === 'automations' ? '2px solid #029c91' : '2px solid transparent',
              background: 'transparent', cursor: 'pointer',
            }}
          >
            <span style={{ fontSize: 16 }}>⚡</span>
            Your Automations
          </button>
          <button
            onClick={() => setActiveTab('building-blocks')}
            style={{
              height: '100%', padding: '0 16px',
              display: 'flex', alignItems: 'center', gap: 6,
              fontSize: 14, fontWeight: 500,
              color: activeTab === 'building-blocks' ? '#333' : '#828282',
              borderBottom: activeTab === 'building-blocks' ? '2px solid #029c91' : '2px solid transparent',
              background: 'transparent', cursor: 'pointer',
            }}
          >
            <span style={{ fontSize: 16 }}>🧩</span>
            Building blocks
          </button>
        </div>

        {/* Center: breadcrumb + status */}
        <div style={{
          position: 'absolute', left: '50%', transform: 'translateX(-50%)',
          display: 'flex', alignItems: 'center', gap: 8, height: '100%',
        }}>
          <span style={{ fontSize: 15, color: '#333' }}>Automations</span>
          <span style={{ color: '#bdbdbd' }}>/</span>
          <span style={{ fontSize: 15, color: '#333' }}>{automationName}</span>
          <span style={{ fontSize: 12, color: '#828282' }}>▾</span>
          <div style={{
            background: '#e1f7f5', borderRadius: 4,
            padding: '2px 8px',
          }}>
            <span style={{ fontSize: 12, color: '#029c91' }}>
              {automation?.status === 'published' ? 'Published' : 'Unpublished'}
            </span>
          </div>
        </div>

        {/* Right: date range selector */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, paddingRight: 12 }}>
          <span style={{ fontSize: 12, color: '#828282' }}>Stats:</span>
          <select
            value={dateRange}
            onChange={e => setDateRange(e.target.value as DateRange)}
            style={{
              height: 28, padding: '0 8px',
              border: '1px solid #e0e0e0', borderRadius: 4,
              fontSize: 12, color: '#4f4f4f', background: '#fff', cursor: 'pointer',
            }}
          >
            {DATE_RANGE_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main content: sidebar + canvas */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left sidebar */}
        {activeTab === 'automations' ? (
          <AutomationsSidebar currentId={id ?? ''} />
        ) : (
          <BuildingBlocksSidebar onClose={() => setActiveTab('automations')} />
        )}

        {/* Canvas */}
        <Canvas dateRange={dateRange} runs={runs} />
      </div>
    </div>
  )
}
