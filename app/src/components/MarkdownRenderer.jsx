import { useState, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Copy, Check } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

const LANG_BADGE = {
  javascript: { label: '🟨 JavaScript', color: '#fbbf24', bg: 'rgba(251,191,36,0.12)', border: 'rgba(251,191,36,0.3)' },
  js:         { label: '🟨 JavaScript', color: '#fbbf24', bg: 'rgba(251,191,36,0.12)', border: 'rgba(251,191,36,0.3)' },
  python:     { label: '🐍 Python',     color: '#4ade80', bg: 'rgba(74,222,128,0.12)',  border: 'rgba(74,222,128,0.3)' },
  py:         { label: '🐍 Python',     color: '#4ade80', bg: 'rgba(74,222,128,0.12)',  border: 'rgba(74,222,128,0.3)' },
  json:       { label: '{ } JSON',      color: '#fb923c', bg: 'rgba(251,146,60,0.12)',  border: 'rgba(251,146,60,0.3)' },
  bash:       { label: '$ bash',        color: '#94a3b8', bg: 'rgba(148,163,184,0.08)', border: 'rgba(148,163,184,0.2)' },
  yaml:       { label: '⚙️ YAML',       color: '#c084fc', bg: 'rgba(192,132,252,0.10)', border: 'rgba(192,132,252,0.3)' },
}

function CodeBlock({ language, children }) {
  const [copied, setCopied] = useState(false)
  const { isDark } = useTheme()

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(children).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [children])

  const langKey = language?.toLowerCase()
  const badge = LANG_BADGE[langKey]

  return (
    <div className="code-block-wrapper">
      {badge ? (
        <span
          className="code-lang-badge"
          style={{
            color: badge.color,
            background: badge.bg,
            border: `1px solid ${badge.border}`,
            fontWeight: 700,
          }}
        >
          {badge.label}
        </span>
      ) : language ? (
        <span className="code-lang-badge">{language}</span>
      ) : null}
      <button onClick={handleCopy} className="copy-btn">
        {copied
          ? <><Check size={11} className="inline mr-1" />Copiado</>
          : <><Copy size={11} className="inline mr-1" />Copiar</>
        }
      </button>
      <SyntaxHighlighter
        language={language || 'text'}
        style={isDark ? oneDark : oneLight}
        customStyle={{
          margin: 0,
          borderRadius: '12px',
          fontSize: '0.8rem',
          lineHeight: '1.6',
          background: isDark ? '#0d1117' : '#f8f7ff',
          padding: '2rem 1rem 1rem 1rem',
          borderLeft: badge ? `3px solid ${badge.color}40` : undefined,
        }}
        showLineNumbers={language && language !== 'text' && language !== 'bash'}
        lineNumberStyle={{ color: '#374151', fontSize: '0.7rem', minWidth: '2rem' }}
        wrapLongLines
      >
        {children}
      </SyntaxHighlighter>
    </div>
  )
}

export default function MarkdownRenderer({ content }) {
  return (
    <div className="markdown-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '')
            const codeStr = String(children).replace(/\n$/, '')

            if (!inline && match) {
              return <CodeBlock language={match[1]}>{codeStr}</CodeBlock>
            }
            if (!inline && !match && codeStr.includes('\n')) {
              return <CodeBlock language="text">{codeStr}</CodeBlock>
            }
            return (
              <code className={className} {...props}>
                {children}
              </code>
            )
          },
          // Override headings to add icons
          h2({ children }) {
            return <h2>{children}</h2>
          },
          // Override tables for better styling
          table({ children }) {
            return (
              <div style={{ overflowX: 'auto' }}>
                <table>{children}</table>
              </div>
            )
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
