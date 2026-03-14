import { useState } from 'react'
import { FileText, Share2 } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import {
  DiagReactLoop, DiagMcpProblem, DiagMcpElements, DiagMcpSampling,
  DiagAgentSimple, DiagAgentMemory, DiagAgentPlanner, DiagAgentMulti,
  DiagPatternSequential, DiagPatternParallel, DiagPipeline2Agents,
  DiagN8nEmail, DiagEcosystemLayers, DiagQaArch, DiagRagPipeline,
  DiagMcpLifecycle, DiagFlowComplete,
  DiagSamplingFlow, DiagRestaurant, DiagFilesystemExample,
  DiagGithubExample, DiagMultiServer, DiagHostElement, DiagJuntosTechnical,
  DiagStdio, DiagHttpStreamable,
  DiagLangChainProgression, DiagLangGraphFlow, DiagCrewStructure, DiagFrameworksComparison,
} from './DiagramComponents'

const REGISTRY = {
  'react-loop':        DiagReactLoop,
  'mcp-problem':       DiagMcpProblem,
  'mcp-elements':      DiagMcpElements,
  'mcp-sampling':      DiagMcpSampling,
  'sampling-flow':     DiagSamplingFlow,
  'restaurant':        DiagRestaurant,
  'filesystem-ex':     DiagFilesystemExample,
  'github-ex':         DiagGithubExample,
  'multi-server':      DiagMultiServer,
  'host-element':      DiagHostElement,
  'juntos-technical':  DiagJuntosTechnical,
  'stdio':             DiagStdio,
  'http-streamable':   DiagHttpStreamable,
  'langchain':         DiagLangChainProgression,
  'langgraph':         DiagLangGraphFlow,
  'crewai':            DiagCrewStructure,
  'frameworks-cmp':    DiagFrameworksComparison,
  'agent-simple':      DiagAgentSimple,
  'agent-memory':      DiagAgentMemory,
  'agent-planner':     DiagAgentPlanner,
  'agent-multi':       DiagAgentMulti,
  'pattern-seq':       DiagPatternSequential,
  'pattern-par':       DiagPatternParallel,
  'pipeline-2':        DiagPipeline2Agents,
  'n8n-email':         DiagN8nEmail,
  'ecosystem':         DiagEcosystemLayers,
  'qa-arch':           DiagQaArch,
  'rag-pipeline':      DiagRagPipeline,
  'mcp-lifecycle':     DiagMcpLifecycle,
  'flow-complete':     DiagFlowComplete,
}

export default function DiagramTabs({ children, vizId }) {
  const [active, setActive] = useState('text')
  const { isDark } = useTheme()
  const text = String(children)
  const Diagram = REGISTRY[vizId]

  const tabs = [
    { id: 'text',    label: 'Texto',   icon: <FileText size={12} /> },
    { id: 'graphic', label: 'Gráfico', icon: <Share2 size={12} /> },
  ]

  return (
    <div
      className="my-4 rounded-xl overflow-hidden"
      style={{ border: '1px solid var(--border-subtle)' }}
    >
      {/* Pestañas */}
      <div
        className="flex items-center"
        style={{
          borderBottom: '1px solid var(--border-subtle)',
          background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
        }}
      >
        {tabs.map(tab => {
          const isActive = active === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold transition-all"
              style={{
                color: isActive ? '#818cf8' : 'var(--text-dim)',
                borderBottom: `2px solid ${isActive ? '#818cf8' : 'transparent'}`,
                background: isActive ? 'rgba(129,140,248,0.07)' : 'transparent',
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Contenido */}
      {active === 'text' ? (
        <pre
          style={{
            margin: 0,
            padding: '1.25rem 1rem',
            background: isDark ? '#0a0e1a' : '#f8f7ff',
            fontSize: '0.78rem',
            lineHeight: 1.7,
            overflowX: 'auto',
            color: isDark ? '#94a3b8' : '#475569',
            fontFamily: '"JetBrains Mono", monospace',
          }}
        >
          {text}
        </pre>
      ) : Diagram ? (
        <Diagram />
      ) : (
        <div className="p-6 text-center text-xs" style={{ color: 'var(--text-muted)' }}>
          Diagrama no disponible.
        </div>
      )}
    </div>
  )
}
