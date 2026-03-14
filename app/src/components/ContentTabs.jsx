import { useState } from 'react'
import { FileText, Network } from 'lucide-react'
import MarkdownRenderer from './MarkdownRenderer'
import { useTheme } from '../context/ThemeContext'

// ── Parser: extrae secciones estructuradas del markdown ───────────────────
function parseContent(markdown) {
  const lines = markdown.split('\n')
  const sections = []
  let current = null

  for (const line of lines) {
    const t = line.trim()

    if (t.startsWith('## ')) {
      if (current) sections.push(current)
      current = {
        title: t.replace(/^##\s+/, '').replace(/[`*_]/g, ''),
        items: [],
      }
    } else if (t.startsWith('### ') && current) {
      current.items.push({
        type: 'h3',
        text: t.replace(/^###\s+/, '').replace(/[`*_]/g, ''),
      })
    } else if (/^[-*]\s/.test(t) && current) {
      const text = t
        .replace(/^[-*]\s+/, '')
        .replace(/`([^`]+)`/g, '$1')
        .replace(/\*\*([^*]+)\*\*/g, '$1')
        .replace(/[*_]/g, '')
        .substring(0, 90)
      if (text.length > 2) current.items.push({ type: 'bullet', text })
    } else if (t.startsWith('> ') && current) {
      const text = t.replace(/^>\s+/, '').replace(/[*_`]/g, '').substring(0, 100)
      if (text.length > 2) current.items.push({ type: 'note', text })
    } else if (t.startsWith('```') && current) {
      current.items.push({ type: 'code' })
    }
  }

  if (current) sections.push(current)
  return sections
}

// ── Paleta de colores para las tarjetas ───────────────────────────────────
const PALETTE = [
  { color: '#818cf8', bg: 'rgba(129,140,248,0.07)', border: 'rgba(129,140,248,0.22)' },
  { color: '#34d399', bg: 'rgba(52,211,153,0.07)',  border: 'rgba(52,211,153,0.22)'  },
  { color: '#f59e0b', bg: 'rgba(245,158,11,0.07)',  border: 'rgba(245,158,11,0.22)'  },
  { color: '#f472b6', bg: 'rgba(244,114,182,0.07)', border: 'rgba(244,114,182,0.22)' },
  { color: '#38bdf8', bg: 'rgba(56,189,248,0.07)',  border: 'rgba(56,189,248,0.22)'  },
  { color: '#a78bfa', bg: 'rgba(167,139,250,0.07)', border: 'rgba(167,139,250,0.22)' },
  { color: '#fb923c', bg: 'rgba(251,146,60,0.07)',  border: 'rgba(251,146,60,0.22)'  },
  { color: '#22d3ee', bg: 'rgba(34,211,238,0.07)',  border: 'rgba(34,211,238,0.22)'  },
]

// ── Vista gráfica ─────────────────────────────────────────────────────────
function GraphicView({ content }) {
  const { isDark } = useTheme()
  const sections = parseContent(content)

  if (sections.length === 0) {
    return (
      <div className="text-center py-16" style={{ color: 'var(--text-dim)' }}>
        No se pudo generar el gráfico para esta lección.
      </div>
    )
  }

  return (
    <div className="p-5 sm:p-7">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {sections.map((section, i) => {
          const p = PALETTE[i % PALETTE.length]
          const bullets  = section.items.filter(it => it.type === 'bullet')
          const notes    = section.items.filter(it => it.type === 'note')
          const hasCode  = section.items.some(it => it.type === 'code')
          const subheads = section.items.filter(it => it.type === 'h3')

          return (
            <div
              key={i}
              className="rounded-2xl p-4 flex flex-col gap-2.5"
              style={{
                background: p.bg,
                border: `1px solid ${p.border}`,
                borderTop: `3px solid ${p.color}`,
              }}
            >
              {/* Número + título */}
              <div className="flex items-start gap-2">
                <span
                  className="text-xs font-black px-2 py-0.5 rounded-full flex-shrink-0 mt-0.5"
                  style={{ background: p.color + '28', color: p.color }}
                >
                  {i + 1}
                </span>
                <h3 className="text-sm font-bold leading-snug" style={{ color: 'var(--text-primary)' }}>
                  {section.title}
                </h3>
              </div>

              {/* Sub-títulos H3 */}
              {subheads.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {subheads.map((sh, j) => (
                    <span
                      key={j}
                      className="text-xs px-2 py-0.5 rounded-full font-semibold"
                      style={{ background: p.color + '18', color: p.color }}
                    >
                      {sh.text}
                    </span>
                  ))}
                </div>
              )}

              {/* Bullets */}
              {bullets.length > 0 && (
                <div className="flex flex-col gap-1.5 mt-0.5">
                  {bullets.slice(0, 6).map((item, j) => (
                    <div key={j} className="flex items-start gap-2 text-xs" style={{ color: 'var(--text-dim)' }}>
                      <span
                        className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full"
                        style={{ background: p.color }}
                      />
                      <span className="leading-snug">{item.text}</span>
                    </div>
                  ))}
                  {bullets.length > 6 && (
                    <span className="text-xs pl-3.5" style={{ color: 'var(--text-muted)' }}>
                      +{bullets.length - 6} más
                    </span>
                  )}
                </div>
              )}

              {/* Nota destacada */}
              {notes.length > 0 && (
                <div
                  className="text-xs px-3 py-2 rounded-xl italic leading-snug mt-auto"
                  style={{ background: p.color + '14', color: p.color, borderLeft: `2px solid ${p.color}60` }}
                >
                  💡 {notes[0].text.length > 90 ? notes[0].text.substring(0, 90) + '…' : notes[0].text}
                </div>
              )}

              {/* Badge de código */}
              {hasCode && (
                <div className="mt-auto pt-1">
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-semibold"
                    style={{ background: p.color + '20', color: p.color }}
                  >
                    {'</>'} código
                  </span>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Componente principal ───────────────────────────────────────────────────
export default function ContentTabs({ content, moduleColor }) {
  const [active, setActive] = useState('text')

  const accentColor = moduleColor || '#818cf8'

  const tabs = [
    { id: 'text',    label: 'Texto',   icon: <FileText size={13} /> },
    { id: 'graphic', label: 'Gráfico', icon: <Network  size={13} /> },
  ]

  return (
    <div className="glass rounded-2xl overflow-hidden mb-6">
      {/* Pestañas */}
      <div className="flex items-center" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        {tabs.map(tab => {
          const isActive = active === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className="flex items-center gap-2 px-5 py-3 text-sm font-semibold transition-all"
              style={{
                color: isActive ? accentColor : 'var(--text-dim)',
                background: isActive ? accentColor + '10' : 'transparent',
                borderBottom: `2px solid ${isActive ? accentColor : 'transparent'}`,
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
        <div className="p-6 sm:p-8">
          <MarkdownRenderer content={content} />
        </div>
      ) : (
        <GraphicView content={content} />
      )}
    </div>
  )
}
