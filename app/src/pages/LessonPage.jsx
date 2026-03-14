import { useParams, Link, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { CheckCircle2, Circle, ChevronLeft, ChevronRight, Home, Trophy, Clock, Zap, Check, Code2 } from 'lucide-react'
import { MODULES } from '../data/curriculum'
import MarkdownRenderer from '../components/MarkdownRenderer'
import TicCard from '../components/TicCard'
import CodeTabs from '../components/CodeTabs'

function findLesson(moduleId, lessonId) {
  const module = MODULES.find(m => m.id === moduleId)
  if (!module) return { module: null, lesson: null, prev: null, next: null }
  const lessonIndex = module.lessons.findIndex(l => l.id === lessonId)
  const lesson = module.lessons[lessonIndex]

  // Compute prev / next across all modules
  const allLessons = MODULES.flatMap(m => m.lessons.map(l => ({ ...l, moduleId: m.id })))
  const allIndex = allLessons.findIndex(l => l.moduleId === moduleId && l.id === lessonId)
  const prev = allIndex > 0 ? allLessons[allIndex - 1] : null
  const next = allIndex < allLessons.length - 1 ? allLessons[allIndex + 1] : null

  return { module, lesson, prev, next }
}

export default function LessonPage({
  isLessonCompleted,
  toggleLesson,
  isCheckItemDone,
  toggleCheckItem,
}) {
  const { moduleId, lessonId } = useParams()
  const navigate = useNavigate()
  const { module, lesson, prev, next } = findLesson(moduleId, lessonId)

  useEffect(() => {
    document.querySelector('main')?.scrollTo({ top: 0, behavior: 'smooth' })
  }, [moduleId, lessonId])

  if (!module || !lesson) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400">
        Lección no encontrada.{' '}
        <Link to="/" className="text-indigo-400 ml-2">Volver al inicio</Link>
      </div>
    )
  }

  const completed = isLessonCompleted(moduleId, lessonId)
  const checkDone = lesson.checklist.filter((_, i) => isCheckItemDone(moduleId, lessonId, i)).length
  const checkTotal = lesson.checklist.length

  return (
    <div className="page-enter max-w-screen-xl mx-auto px-4 sm:px-6 py-6">
      {/* ── BREADCRUMB ── */}
      <div className="flex items-center gap-2 text-xs mb-6 flex-wrap" style={{ color: 'var(--text-dim)' }}>
        <Link to="/" className="transition-colors flex items-center gap-1 hover:opacity-80">
          <Home size={12} /> Inicio
        </Link>
        <span>/</span>
        <Link
          to={`/lesson/${module.id}/${module.lessons[0].id}`}
          className="hover:opacity-80 transition-opacity"
          style={{ color: module.colorFrom }}
        >
          {module.icon} {module.title}
        </Link>
        <span>/</span>
        <span style={{ color: 'var(--text-muted)' }}>{lesson.title}</span>
      </div>

      <div className="flex gap-6">
        {/* ── MAIN CONTENT ── */}
        <div className="flex-1 min-w-0">
          {/* Lesson header */}
          <div
            className="rounded-2xl p-5 mb-6"
            style={{
              background: `linear-gradient(135deg, ${module.colorFrom}10, ${module.colorTo}08)`,
              border: `1px solid ${module.colorFrom}20`,
            }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                    style={{
                      background: `${module.colorFrom}20`,
                      color: module.colorFrom,
                      border: `1px solid ${module.colorFrom}30`,
                    }}
                  >
                    {module.icon} {module.title}
                  </span>
                  {lesson.isPractice && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                      <Zap size={10} /> Práctica
                    </span>
                  )}
                  {lesson.isFinal && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1">
                      <Trophy size={10} /> Proyecto Final
                    </span>
                  )}
                </div>
                <h1 className="text-2xl sm:text-3xl font-black leading-tight mb-1" style={{ color: 'var(--text-primary)' }}>
                  {lesson.title}
                </h1>
                <div className="flex items-center gap-3 text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
                  <span className="flex items-center gap-1">
                    <Clock size={12} /> {lesson.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 size={12} style={{ color: completed ? module.colorFrom : undefined }} />
                    {completed ? 'Completada' : 'Pendiente'}
                  </span>
                </div>
              </div>

              {/* Complete button */}
              <button
                onClick={() => toggleLesson(moduleId, lessonId)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all flex-shrink-0"
                style={completed ? {
                  background: `${module.colorFrom}20`,
                  color: module.colorFrom,
                  border: `1px solid ${module.colorFrom}40`,
                } : {
                  background: 'var(--glass-bg)',
                  color: 'var(--text-muted)',
                  border: '1px solid var(--glass-border)',
                }}
              >
                {completed
                  ? <><Check size={14} /> Completada</>
                  : <><Circle size={14} /> Marcar completa</>
                }
              </button>
            </div>
          </div>

          {/* Lesson content */}
          <div className="glass rounded-2xl p-6 sm:p-8 mb-6">
            <MarkdownRenderer content={lesson.content} />
          </div>

          {/* ── CODE TABS (un bloque) ── */}
          {lesson.codeExamples && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Code2 size={14} style={{ color: module.colorFrom }} />
                <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                  Código interactivo · JS & Python
                </span>
              </div>
              <CodeTabs codeExamples={lesson.codeExamples} />
            </div>
          )}

          {/* ── CODE TABS (múltiples bloques separados por lenguaje) ── */}
          {lesson.codeExamplesGroups && lesson.codeExamplesGroups.map((group, i) => (
            <div key={i} className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Code2 size={14} style={{ color: module.colorFrom }} />
                <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                  {group.label}
                </span>
              </div>
              <CodeTabs codeExamples={group} />
            </div>
          ))}

          {/* ── CHECKLIST ── */}
          <div className="glass rounded-2xl p-5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <CheckCircle2 size={16} style={{ color: module.colorFrom }} />
                Checklist de comprensión
              </h3>
              <span className="text-sm font-semibold" style={{ color: module.colorFrom }}>
                {checkDone}/{checkTotal}
              </span>
            </div>

            {/* Progress */}
            <div className="progress-bar mb-4">
              <div
                className="progress-fill"
                style={{
                  width: `${checkTotal > 0 ? (checkDone / checkTotal) * 100 : 0}%`,
                  background: `linear-gradient(90deg, ${module.colorFrom}, ${module.colorTo})`,
                }}
              />
            </div>

            <div className="space-y-1">
              {lesson.checklist.map((item, i) => {
                const done = isCheckItemDone(moduleId, lessonId, i)
                return (
                  <div
                    key={i}
                    className="checklist-item"
                    onClick={() => toggleCheckItem(moduleId, lessonId, i)}
                  >
                    <div className={`checklist-check ${done ? 'checked' : ''}`}>
                      {done && <Check size={11} className="text-white" />}
                    </div>
                    <span
                      className="text-sm transition-colors"
                      style={done ? { color: 'var(--text-dim)', textDecoration: 'line-through' } : { color: 'var(--md-text)' }}
                    >
                      {item}
                    </span>
                  </div>
                )
              })}
            </div>

            {checkDone === checkTotal && checkTotal > 0 && (
              <div
                className="mt-4 p-3 rounded-xl text-center text-sm font-semibold"
                style={{
                  background: `${module.colorFrom}15`,
                  color: module.colorFrom,
                  border: `1px solid ${module.colorFrom}25`,
                }}
              >
                🎉 ¡Checklist completado! No olvides marcar la lección como completada.
              </div>
            )}
          </div>

          {/* ── NAV PREV / NEXT ── */}
          <div className="flex items-center justify-between gap-4">
            {prev ? (
              <Link
                to={`/lesson/${prev.moduleId}/${prev.id}`}
                className="flex items-center gap-2 glass glass-hover rounded-xl px-4 py-3 text-sm transition-colors"
                style={{ color: 'var(--text-muted)' }}
              >
                <ChevronLeft size={16} />
                <div className="text-left">
                  <div className="text-xs" style={{ color: 'var(--text-dim)' }}>Anterior</div>
                  <div className="font-medium text-xs leading-tight">{prev.title}</div>
                </div>
              </Link>
            ) : <div />}

            {next ? (
              <Link
                to={`/lesson/${next.moduleId}/${next.id}`}
                className="flex items-center gap-2 glass glass-hover rounded-xl px-4 py-3 text-sm ml-auto"
                style={{
                  background: `${module.colorFrom}10`,
                  border: `1px solid ${module.colorFrom}25`,
                  color: module.colorFrom,
                }}
              >
                <div className="text-right">
                  <div className="text-xs opacity-60">Siguiente</div>
                  <div className="font-medium text-xs leading-tight">{next.title}</div>
                </div>
                <ChevronRight size={16} />
              </Link>
            ) : (
              <Link
                to="/"
                className="flex items-center gap-2 glass glass-hover rounded-xl px-4 py-3 text-sm ml-auto text-amber-400"
                style={{ border: '1px solid rgba(251,191,36,0.2)' }}
              >
                <Trophy size={16} />
                ¡Curso completado!
              </Link>
            )}
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="hidden lg:block w-64 flex-shrink-0 space-y-4">
          {/* TIC Card */}
          {lesson.tic && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest mb-3 px-1" style={{ color: 'var(--text-dim)' }}>
                💡 Truco de memoria
              </h4>
              <TicCard tic={lesson.tic} />
            </div>
          )}

          {/* Module lessons mini-list */}
          <div className="glass rounded-2xl p-4">
            <h4 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--text-dim)' }}>
              {module.icon} Este módulo
            </h4>
            <div className="space-y-1">
              {module.lessons.map(l => {
                const isActive = l.id === lessonId
                const done = isLessonCompleted(moduleId, l.id)
                return (
                  <Link
                    key={l.id}
                    to={`/lesson/${moduleId}/${l.id}`}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs transition-all"
                    style={{
                      background: isActive ? `${module.colorFrom}15` : 'transparent',
                      color: isActive ? module.colorFrom : done ? 'var(--text-dim)' : 'var(--text-muted)',
                    }}
                  >
                    {done
                      ? <CheckCircle2 size={11} style={{ color: module.colorFrom, flexShrink: 0 }} />
                      : <Circle size={11} style={{ flexShrink: 0, opacity: 0.4 }} />
                    }
                    <span className="truncate leading-tight">{l.title}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
