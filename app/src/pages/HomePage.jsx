import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2, BookOpen, Zap, Trophy, Clock } from 'lucide-react'
import { MODULES } from '../data/curriculum'

function ModuleCard({ module, progress, index }) {
  const firstLesson = module.lessons[0]
  const allDone = progress.done === progress.total && progress.total > 0

  return (
    <Link
      to={`/lesson/${module.id}/${firstLesson.id}`}
      className="glass glass-hover rounded-2xl overflow-hidden block group"
      style={{
        animationDelay: `${index * 0.08}s`,
        animationFillMode: 'both',
        animation: 'fade-up 0.5s ease-out both',
      }}
    >
      {/* Card header gradient */}
      <div
        className="h-2 w-full"
        style={{ background: `linear-gradient(90deg, ${module.colorFrom}, ${module.colorTo})` }}
      />

      <div className="p-5">
        {/* Number + Icon */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center text-xl"
              style={{
                background: `linear-gradient(135deg, ${module.colorFrom}20, ${module.colorTo}20)`,
                border: `1px solid ${module.colorFrom}30`,
              }}
            >
              {module.icon}
            </div>
            <div>
              <span
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: module.colorFrom }}
              >
                Módulo {module.number}
              </span>
              <h3 className="text-base font-bold leading-tight" style={{ color: 'var(--text-primary)' }}>{module.title}</h3>
            </div>
          </div>
          {allDone && (
            <Trophy size={18} className="text-amber-400 flex-shrink-0 mt-1" />
          )}
        </div>

        {/* Description */}
        <p className="text-xs leading-relaxed mb-4" style={{ color: 'var(--text-muted)' }}>{module.description}</p>

        {/* Lessons preview */}
        <div className="space-y-1.5 mb-4">
          {module.lessons.slice(0, 3).map(lesson => (
            <div key={lesson.id} className="flex items-center gap-2">
              <div
                className="w-1 h-1 rounded-full flex-shrink-0"
                style={{ background: module.colorFrom }}
              />
              <span className="text-xs truncate" style={{ color: 'var(--text-dim)' }}>{lesson.title}</span>
              {lesson.isPractice && <Zap size={9} className="flex-shrink-0 text-amber-500" />}
            </div>
          ))}
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs" style={{ color: 'var(--text-dim)' }}>
              {progress.done} / {progress.total} lecciones
            </span>
            <span className="text-xs font-semibold" style={{ color: module.colorFrom }}>
              {progress.percent}%
            </span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${progress.percent}%`,
                background: `linear-gradient(90deg, ${module.colorFrom}, ${module.colorTo})`,
              }}
            />
          </div>
        </div>

        {/* CTA */}
        <div
          className="flex items-center gap-1 mt-4 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ color: module.colorFrom }}
        >
          {progress.done === 0 ? 'Comenzar' : 'Continuar'}
          <ArrowRight size={12} />
        </div>
      </div>
    </Link>
  )
}

function TicBadge({ acronym, emoji }) {
  return (
    <div
      className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm"
      style={{
        background: 'rgba(251,191,36,0.08)',
        border: '1px solid rgba(251,191,36,0.2)',
      }}
    >
      <span>{emoji}</span>
      <span className="font-bold text-amber-300">{acronym}</span>
    </div>
  )
}

export default function HomePage({ getModuleProgress, getTotalProgress }) {
  const totalProgress = getTotalProgress(MODULES)
  const allTics = MODULES.flatMap(m => m.lessons.filter(l => l.tic).map(l => ({ acronym: l.tic.acronym, emoji: l.tic.emoji })))

  return (
    <div className="page-enter min-h-screen">
      {/* ── HERO ── */}
      <section className="relative pt-16 pb-12 px-6 text-center overflow-hidden">
        {/* Floating emoji decorations */}
        <div className="absolute inset-0 pointer-events-none select-none">
          {['🔌', '🤖', '🔄', '🏠', '🌐', '🧱'].map((emoji, i) => (
            <span
              key={i}
              className="absolute text-3xl opacity-10"
              style={{
                top: `${15 + (i * 15) % 70}%`,
                left: `${5 + (i * 17) % 90}%`,
                animation: `float ${5 + i}s ease-in-out infinite`,
                animationDelay: `${i * 0.8}s`,
              }}
            >
              {emoji}
            </span>
          ))}
        </div>

        <div className="relative z-10 max-w-3xl mx-auto">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
            style={{
              background: 'rgba(99,102,241,0.12)',
              border: '1px solid rgba(99,102,241,0.3)',
              color: '#a5b4fc',
            }}
          >
            <span className="text-base">🧠</span>
            Guía completa del ecosistema IA moderno
          </div>

          <h1
            className="text-5xl sm:text-6xl font-black mb-4 leading-tight"
            style={{
              background: 'linear-gradient(135deg, #e2e8f0 0%, #6366f1 50%, #8b5cf6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Aprende MCP<br />y Agentes de IA
          </h1>

          <p className="text-lg mb-8 leading-relaxed max-w-2xl mx-auto" style={{ color: 'var(--text-muted)' }}>
            De cero a héroe en el ecosistema de IA moderno: MCP, Agentes, n8n, IA Local y más.
            Con <span className="text-amber-400 font-semibold">TICs mnemotécnicos</span> para recordar mejor.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center gap-6 mb-8">
            {[
              { icon: BookOpen, label: `${totalProgress.total} lecciones`, value: null },
              { icon: CheckCircle2, label: 'módulos', value: MODULES.length },
              { icon: Zap, label: 'prácticas', value: MODULES.flatMap(m => m.lessons).filter(l => l.isPractice).length },
              { icon: Trophy, label: 'TICs', value: allTics.length },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                <Icon size={16} className="text-indigo-400" />
                <span className="text-sm font-medium">
                  {value !== null ? <><span className="font-bold" style={{ color: 'var(--text-primary)' }}>{value}</span> </> : ''}{label}
                </span>
              </div>
            ))}
          </div>

          {/* Overall progress */}
          {totalProgress.done > 0 && (
            <div className="glass rounded-2xl p-4 mb-8 max-w-sm mx-auto">
              <div className="flex justify-between text-sm mb-2">
                <span style={{ color: 'var(--text-muted)' }}>Tu progreso total</span>
                <span className="font-bold gradient-text">{totalProgress.done}/{totalProgress.total}</span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${totalProgress.percent}%`,
                    background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #06b6d4)',
                  }}
                />
              </div>
            </div>
          )}

          {/* TIC badges */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {allTics.map((t, i) => <TicBadge key={i} {...t} />)}
          </div>
        </div>
      </section>

      {/* ── MODULE GRID ── */}
      <section className="px-4 sm:px-6 pb-16 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Módulos de Aprendizaje</h2>
          <Link
            to="/cheatsheet"
            className="flex items-center gap-1 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Ver Cheatsheet <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MODULES.map((module, i) => (
            <ModuleCard
              key={module.id}
              module={module}
              progress={getModuleProgress(module)}
              index={i}
            />
          ))}
        </div>

        {/* Quick access */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              to: '/cheatsheet',
              icon: '⚡',
              title: 'Cheatsheet',
              desc: 'Comandos y patrones rápidos',
              color: '#6366f1',
            },
            {
              to: '/glossary',
              icon: '📖',
              title: 'Glosario',
              desc: 'Todos los términos explicados',
              color: '#8b5cf6',
            },
            {
              to: '/lesson/fundamentos/agente',
              icon: '🚀',
              title: 'Empezar ahora',
              desc: 'Primera lección: ¿Qué es un Agente?',
              color: '#06b6d4',
            },
          ].map(card => (
            <Link
              key={card.to}
              to={card.to}
              className="glass glass-hover rounded-xl p-4 flex items-center gap-4"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                style={{ background: `${card.color}20`, border: `1px solid ${card.color}30` }}
              >
                {card.icon}
              </div>
              <div>
                <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{card.title}</div>
                <div className="text-xs" style={{ color: 'var(--text-dim)' }}>{card.desc}</div>
              </div>
              <ArrowRight size={14} className="ml-auto flex-shrink-0" style={{ color: 'var(--text-dim)' }} />
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
