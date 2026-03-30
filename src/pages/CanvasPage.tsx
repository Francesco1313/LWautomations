import { useState } from 'react'
import { useParams } from 'react-router-dom'
import TopBar from '../components/layout/TopBar'
import AutomationsSidebar from '../components/canvas/AutomationsSidebar'
import BuildingBlocksSidebar from '../components/canvas/BuildingBlocksSidebar'
import Canvas from '../components/canvas/Canvas'
import { automations } from '../data/automations'

type SidebarTab = 'automations' | 'building-blocks'

export default function CanvasPage() {
  const { id } = useParams<{ id: string }>()
  const automation = automations.find(a => a.id === id)
  const automationName = automation?.name ?? 'Automation'

  const [activeTab, setActiveTab] = useState<SidebarTab>('automations')

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden',
      fontFamily: "'Helvetica Neue', sans-serif",
    }}>
      <TopBar automationName={automationName} />

      {/* Options bar */}
      <div style={{
        height: 42, background: 'white', borderBottom: '1px solid var(--grey5)',
        display: 'flex', alignItems: 'stretch',
        flexShrink: 0, position: 'relative',
      }}>
        {/* Left: tabs */}
        <div style={{ display: 'flex', alignItems: 'stretch' }}>
          {/* DEV: use <TabNav> */}
          <button
            onClick={() => setActiveTab('automations')}
            style={{
              height: '100%', padding: '0 16px',
              display: 'flex', alignItems: 'center', gap: 6,
              fontSize: 14, fontWeight: 500,
              color: activeTab === 'automations' ? 'var(--grey1)' : 'var(--grey3)',
              borderBottom: activeTab === 'automations' ? '2px solid var(--teal)' : '2px solid transparent',
              background: 'transparent', cursor: 'pointer',
            }}
          >
            Your Automations
          </button>
          <button
            onClick={() => setActiveTab('building-blocks')}
            style={{
              height: '100%', padding: '0 16px',
              display: 'flex', alignItems: 'center', gap: 6,
              fontSize: 14, fontWeight: 500,
              color: activeTab === 'building-blocks' ? 'var(--grey1)' : 'var(--grey3)',
              borderBottom: activeTab === 'building-blocks' ? '2px solid var(--teal)' : '2px solid transparent',
              background: 'transparent', cursor: 'pointer',
            }}
          >
            Building blocks
          </button>
        </div>

        {/* Center: breadcrumb */}
        <div style={{
          position: 'absolute', left: '50%', transform: 'translateX(-50%)',
          display: 'flex', alignItems: 'center', gap: 8, height: '100%',
        }}>
          <span style={{ fontSize: 15, color: 'var(--grey1)' }}>Automations</span>
          <span style={{ color: 'var(--grey4)' }}>/</span>
          <span style={{ fontSize: 15, color: 'var(--grey1)' }}>{automationName}</span>
          <div style={{ background: 'var(--light-teal)', borderRadius: 4, padding: '2px 8px' }}>
            <span style={{ fontSize: 12, color: 'var(--teal)' }}>
              {automation?.status === 'active' ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      </div>

      {/* Main: sidebar + canvas */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {activeTab === 'automations' ? (
          <AutomationsSidebar currentId={id ?? ''} />
        ) : (
          <BuildingBlocksSidebar onClose={() => setActiveTab('automations')} />
        )}
        <Canvas automationId={id} />
      </div>
    </div>
  )
}
