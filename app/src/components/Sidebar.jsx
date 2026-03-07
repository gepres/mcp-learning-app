import { Link, useParams } from 'react-router-dom'
import { CheckCircle2, Circle, ChevronDown, ChevronRight, Home, FileText, BookOpen, Zap } from 'lucide-react'
import { useState } from 'react'
import { MODULES } from '../data/curriculum'

export default function Sidebar({ getModuleProgress, isLessonCompleted, onClose }) {
  const { moduleId, lessonId } = useParams()
  const [collapsed, setCollapsed] = useState({})

  const toggleModule = (id) => setCollapsed(c => ({ ...c, [id]: !c[id] }))

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Logo / Header */}
      <div className="p-4 flex items-center justify-between flex-shrink-0" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <Link
          to="/"
          className="flex items-center gap-2 group"
          onClick={onClose}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
          >
            🧠
          </div>
          <span className="text-sm font-bold gradient-text">Aprende MCP</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {/* Home */}
        <Link
          to="/"
          onClick={onClose}
          className={`sidebar-item ${!moduleId ? 'active' : ''}`}
        >
          <Home size={14} className="flex-shrink-0" />
          <span>Inicio</span>
        </Link>

        {/* Modules */}
        <div className="pt-2">
          <p className="px-3 py-1 text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-dim)' }}>
            Módulos
          </p>
          {MODULES.map(module => {
            const prog = getModuleProgress(module)
            const isOpen = !collapsed[module.id]
            const isActiveModule = moduleId === module.id

            return (
              <div key={module.id}>
                <button
                  onClick={() => toggleModule(module.id)}
                  className={`sidebar-item w-full text-left ${isActiveModule ? 'active' : ''}`}
                >
                  <span className="text-base flex-shrink-0">{module.icon}</span>
                  <span className="flex-1 text-xs">{module.number} {module.title}</span>
                  {/* Progress pill */}
                  <span
                    className="text-xs px-1.5 py-0.5 rounded-full flex-shrink-0"
                    style={{
                      background: `linear-gradient(135deg, ${module.colorFrom}20, ${module.colorTo}20)`,
                      color: module.colorFrom,
                      border: `1px solid ${module.colorFrom}30`,
                    }}
                  >
                    {prog.done}/{prog.total}
                  </span>
                  {isOpen
                    ? <ChevronDown size={12} className="flex-shrink-0" style={{ color: 'var(--text-dim)' }} />
                    : <ChevronRight size={12} className="flex-shrink-0" style={{ color: 'var(--text-dim)' }} />
                  }
                </button>

                {/* Lessons */}
                {isOpen && (
                  <div className="ml-4 mt-0.5 space-y-0.5">
                    {module.lessons.map(lesson => {
                      const completed = isLessonCompleted(module.id, lesson.id)
                      const isActive = moduleId === module.id && lessonId === lesson.id

                      return (
                        <Link
                          key={lesson.id}
                          to={`/lesson/${module.id}/${lesson.id}`}
                          onClick={onClose}
                          className={`sidebar-item ${isActive ? 'active' : ''}`}
                          style={{
                            borderLeft: isActive ? `2px solid ${module.colorFrom}` : '2px solid transparent',
                            paddingLeft: '10px',
                          }}
                        >
                          {completed
                            ? <CheckCircle2 size={12} className="flex-shrink-0" style={{ color: module.colorFrom }} />
                            : <Circle size={12} className="flex-shrink-0" style={{ color: 'var(--text-dim)' }} />
                          }
                          <span className="text-xs leading-tight">{lesson.title}</span>
                          {lesson.isPractice && (
                            <Zap size={10} className="flex-shrink-0 text-amber-400" />
                          )}
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </nav>

      {/* Bottom links */}
      <div className="p-3 flex-shrink-0 space-y-1" style={{ borderTop: '1px solid var(--border-subtle)' }}>
        <Link to="/cheatsheet" onClick={onClose} className="sidebar-item">
          <FileText size={13} className="flex-shrink-0" />
          <span className="text-xs">Cheatsheet</span>
        </Link>
        <Link to="/glossary" onClick={onClose} className="sidebar-item">
          <BookOpen size={13} className="flex-shrink-0" />
          <span className="text-xs">Glosario</span>
        </Link>
      </div>
    </div>
  )
}
