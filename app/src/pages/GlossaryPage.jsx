import { useState } from 'react'
import { Search } from 'lucide-react'
import { GLOSSARY } from '../data/curriculum'

const CATEGORIES = ['Todos', 'Core', 'MCP', 'Agentes', 'Framework', 'Automatización', 'IA Local', 'Técnica', 'Web']

const CATEGORY_COLORS = {
  'Core': '#6366f1',
  'MCP': '#3b82f6',
  'Agentes': '#7c3aed',
  'Framework': '#f59e0b',
  'Automatización': '#10b981',
  'IA Local': '#14b8a6',
  'Técnica': '#06b6d4',
  'Web': '#8b5cf6',
}

export default function GlossaryPage() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('Todos')

  const filtered = GLOSSARY.filter(item => {
    const matchSearch = !search ||
      item.term.toLowerCase().includes(search.toLowerCase()) ||
      item.def.toLowerCase().includes(search.toLowerCase())
    const matchCat = activeCategory === 'Todos' || item.category === activeCategory
    return matchSearch && matchCat
  })

  return (
    <div className="page-enter max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-black mb-2 gradient-text">
          📖 Glosario
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>Todos los términos del ecosistema IA explicados</p>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-dim)' }} />
        <input
          type="text"
          placeholder="Buscar un término..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-xl text-sm outline-none focus:ring-1 focus:ring-indigo-400"
          style={{
            background: 'var(--glass-bg)',
            border: '1px solid var(--glass-border)',
            color: 'var(--text-primary)',
          }}
        />
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={activeCategory === cat ? {
              background: `${CATEGORY_COLORS[cat] || '#6366f1'}20`,
              color: CATEGORY_COLORS[cat] || '#6366f1',
              border: `1px solid ${CATEGORY_COLORS[cat] || '#6366f1'}40`,
            } : {
              background: 'var(--glass-bg)',
              color: 'var(--text-dim)',
              border: '1px solid var(--glass-border)',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Count */}
      <p className="text-xs mb-4" style={{ color: 'var(--text-dim)' }}>
        {filtered.length} {filtered.length === 1 ? 'término' : 'términos'}
        {search && ` para "${search}"`}
      </p>

      {/* Terms */}
      <div className="space-y-3">
        {filtered.map((item, i) => (
          <div
            key={i}
            className="glass glass-hover rounded-xl p-4"
            style={{ borderLeft: `3px solid ${CATEGORY_COLORS[item.category] || '#6366f1'}50` }}
          >
            <div className="flex items-start justify-between gap-3 mb-1">
              <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{item.term}</h3>
              <span
                className="text-xs px-2 py-0.5 rounded-full flex-shrink-0"
                style={{
                  background: `${CATEGORY_COLORS[item.category] || '#6366f1'}15`,
                  color: CATEGORY_COLORS[item.category] || '#6366f1',
                  border: `1px solid ${CATEGORY_COLORS[item.category] || '#6366f1'}25`,
                }}
              >
                {item.category}
              </span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{item.def}</p>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-12" style={{ color: 'var(--text-dim)' }}>
            <p className="text-4xl mb-3">🔍</p>
            <p>No se encontraron términos para "{search}"</p>
          </div>
        )}
      </div>
    </div>
  )
}
