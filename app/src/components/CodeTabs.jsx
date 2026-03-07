import { useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Copy, Check, Package } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

const LANG_CONFIG = {
  javascript: {
    icon: '🟨',
    label: 'JavaScript',
    color: '#fbbf24',
    bgColor: 'rgba(251,191,36,0.08)',
    borderColor: 'rgba(251,191,36,0.25)',
    activeBg: 'rgba(251,191,36,0.12)',
  },
  python: {
    icon: '🐍',
    label: 'Python',
    color: '#4ade80',
    bgColor: 'rgba(74,222,128,0.08)',
    borderColor: 'rgba(74,222,128,0.25)',
    activeBg: 'rgba(74,222,128,0.12)',
  },
}

function CopyBtn({ text, label = 'Copiar' }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }
  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg transition-all flex-shrink-0"
      style={{
        background: copied ? 'rgba(16,185,129,0.15)' : 'var(--copy-btn-bg)',
        color: copied ? '#10b981' : 'var(--copy-btn-color)',
        border: copied ? '1px solid rgba(16,185,129,0.3)' : '1px solid var(--copy-btn-border)',
      }}
    >
      {copied ? <><Check size={11} className="inline" /> Copiado!</> : <><Copy size={11} className="inline" /> {label}</>}
    </button>
  )
}

export default function CodeTabs({ codeExamples }) {
  const [activeTab, setActiveTab] = useState(0)
  const { isDark } = useTheme()

  if (!codeExamples?.tabs?.length) return null

  const tab = codeExamples.tabs[activeTab]
  const config = LANG_CONFIG[tab.lang] ?? LANG_CONFIG.javascript

  return (
    <div
      className="rounded-2xl overflow-hidden mb-6"
      style={{
        border: `1px solid ${config.borderColor}`,
        background: isDark ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.7)',
        boxShadow: `0 4px 30px ${config.color}10`,
      }}
    >
      {/* ── Encabezado de pestañas ── */}
      <div
        className="flex items-center"
        style={{ borderBottom: '1px solid var(--border-subtle)' }}
      >
        {codeExamples.tabs.map((t, i) => {
          const cfg = LANG_CONFIG[t.lang] ?? LANG_CONFIG.javascript
          const active = i === activeTab
          return (
            <button
              key={t.lang}
              onClick={() => setActiveTab(i)}
              className="flex items-center gap-2 px-5 py-3 text-sm font-semibold transition-all"
              style={{
                color: active ? cfg.color : 'var(--text-dim)',
                background: active ? cfg.activeBg : 'transparent',
                borderBottom: `2px solid ${active ? cfg.color : 'transparent'}`,
              }}
            >
              <span className="text-base leading-none">{cfg.icon}</span>
              <span>{cfg.label}</span>
              {t.badge && (
                <span
                  className="text-xs px-1.5 py-0.5 rounded-full font-bold"
                  style={{
                    background: active ? `${cfg.color}22` : 'var(--glass-bg)',
                    color: active ? cfg.color : 'var(--text-dim)',
                    border: active ? `1px solid ${cfg.color}30` : '1px solid transparent',
                  }}
                >
                  {t.badge}
                </span>
              )}
            </button>
          )
        })}
        {codeExamples.tabs.length > 1 && (
          <div className="ml-auto px-4 text-xs hidden sm:flex items-center gap-1" style={{ color: 'var(--text-dim)' }}>
            <span>↔️</span> cambia lenguaje
          </div>
        )}
      </div>

      {/* ── Comando de instalación ── */}
      {tab.install && (
        <div
          className="flex items-center gap-3 px-4 py-2.5"
          style={{
            background: isDark ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.04)',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          <Package size={13} style={{ color: config.color, flexShrink: 0 }} />
          <span className="text-xs flex-shrink-0" style={{ color: 'var(--text-muted)' }}>instalar:</span>
          <code className="flex-1 font-mono text-sm truncate" style={{ color: config.color }}>
            {tab.install}
          </code>
          <CopyBtn text={tab.install} />
        </div>
      )}

      {/* ── Barra de nombre de archivo ── */}
      {tab.filename && (
        <div
          className="flex items-center justify-between px-4 py-2"
          style={{
            background: isDark ? 'rgba(0,0,0,0.25)' : 'rgba(0,0,0,0.03)',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          <span
            className="text-xs font-mono px-2 py-0.5 rounded"
            style={{
              background: config.bgColor,
              color: config.color,
              border: `1px solid ${config.borderColor}`,
            }}
          >
            📄 {tab.filename}
          </span>
          <CopyBtn text={tab.code} label="Copiar código" />
        </div>
      )}

      {/* ── Bloque de código ── */}
      <div style={{ position: 'relative', maxHeight: '520px', overflowY: 'auto' }}>
        {!tab.filename && (
          <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', zIndex: 10 }}>
            <CopyBtn text={tab.code} label="Copiar código" />
          </div>
        )}
        <SyntaxHighlighter
          language={tab.lang}
          style={isDark ? oneDark : oneLight}
          showLineNumbers
          lineNumberStyle={{ color: isDark ? '#374151' : '#9ca3af', fontSize: '0.65rem', minWidth: '2.2rem' }}
          customStyle={{
            margin: 0,
            background: isDark ? '#0a0e1a' : '#f8f7ff',
            fontSize: '0.8rem',
            lineHeight: '1.65',
            padding: '1.25rem 1rem 1.5rem 0.5rem',
            borderRadius: 0,
          }}
          wrapLongLines
        >
          {tab.code}
        </SyntaxHighlighter>
      </div>

      {/* ── Pie con hint ── */}
      {codeExamples.hint && (
        <div
          className="px-4 py-2.5 text-xs flex items-start gap-2"
          style={{
            color: 'var(--text-muted)',
            background: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.03)',
            borderTop: '1px solid var(--border-subtle)',
          }}
        >
          <span className="flex-shrink-0">💡</span>
          <span>{codeExamples.hint}</span>
        </div>
      )}
    </div>
  )
}
