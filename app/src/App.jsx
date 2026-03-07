import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { useState, useCallback } from 'react'
import { Menu, X, RotateCcw, Sun, Moon } from 'lucide-react'
import { MODULES } from './data/curriculum'
import { useProgress } from './hooks/useProgress'
import { ThemeProvider, useTheme } from './context/ThemeContext'
import Sidebar from './components/Sidebar'
import HomePage from './pages/HomePage'
import LessonPage from './pages/LessonPage'
import CheatsheetPage from './pages/CheatsheetPage'
import GlossaryPage from './pages/GlossaryPage'

function ThemeToggle() {
  const { isDark, toggle } = useTheme()
  return (
    <button
      onClick={toggle}
      className="theme-toggle"
      title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
    >
      {isDark
        ? <Sun size={15} />
        : <Moon size={15} />
      }
    </button>
  )
}

function Layout({ children, progressHooks }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { isDark } = useTheme()
  const location = useLocation()
  const isHome = location.pathname === '/'

  const {
    getModuleProgress,
    getTotalProgress,
    isLessonCompleted,
    resetProgress,
  } = progressHooks

  const totalProgress = getTotalProgress(MODULES)

  return (
    <div className="flex h-screen overflow-hidden bg-grid">
      {/* Ambient orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      {/* ── SIDEBAR (Desktop) ── */}
      <aside
        className="hidden lg:flex flex-col w-64 flex-shrink-0 relative z-10"
        style={{
          background: 'var(--bg-sidebar)',
          backdropFilter: 'blur(20px)',
          borderRight: '1px solid var(--border-subtle)',
        }}
      >
        <Sidebar
          getModuleProgress={getModuleProgress}
          isLessonCompleted={isLessonCompleted}
        />
      </aside>

      {/* ── SIDEBAR (Mobile overlay) ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="absolute inset-0 backdrop-blur-sm" style={{ background: 'rgba(0,0,0,0.5)' }} />
          <aside
            className="absolute left-0 top-0 bottom-0 w-72 z-10"
            style={{
              background: 'var(--bg-sidebar)',
              borderRight: '1px solid var(--border-subtle)',
            }}
            onClick={e => e.stopPropagation()}
          >
            <Sidebar
              getModuleProgress={getModuleProgress}
              isLessonCompleted={isLessonCompleted}
              onClose={() => setSidebarOpen(false)}
            />
          </aside>
        </div>
      )}

      {/* ── MAIN ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        {/* Top bar */}
        <header
          className="flex-shrink-0 flex items-center justify-between px-4 sm:px-6 h-14"
          style={{
            background: 'var(--bg-header)',
            backdropFilter: 'blur(16px)',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          {/* Mobile menu button */}
          <button
            className="lg:hidden flex items-center justify-center w-8 h-8 rounded-lg transition-all"
            style={{ color: 'var(--text-muted)' }}
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={18} />
          </button>

          {/* Mobile logo */}
          <span className="lg:hidden text-sm font-bold gradient-text">🧠 Aprende MCP</span>

          {/* Progress indicator (desktop) */}
          <div className="hidden lg:flex items-center gap-3 text-xs" style={{ color: 'var(--text-dim)' }}>
            <span>Progreso total:</span>
            <div className="w-32 progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${totalProgress.percent}%`,
                  background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                }}
              />
            </div>
            <span className="font-semibold" style={{ color: 'var(--text-muted)' }}>
              {totalProgress.done}/{totalProgress.total}
            </span>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            {/* Reset button */}
            {totalProgress.done > 0 && (
              <button
                onClick={() => {
                  if (window.confirm('¿Resetear todo el progreso? Esta acción no se puede deshacer.')) {
                    resetProgress()
                  }
                }}
                className="flex items-center gap-1.5 text-xs px-2 py-1 rounded-lg transition-colors"
                style={{ color: 'var(--text-dim)' }}
                title="Resetear progreso"
              >
                <RotateCcw size={12} />
                <span className="hidden sm:inline">Reset</span>
              </button>
            )}
            <ThemeToggle />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

function AppRoutes({ progressHooks }) {
  const {
    getModuleProgress,
    getTotalProgress,
    isLessonCompleted,
    toggleLesson,
    isCheckItemDone,
    toggleCheckItem,
  } = progressHooks

  return (
    <Routes>
      <Route
        path="/"
        element={
          <HomePage
            getModuleProgress={getModuleProgress}
            getTotalProgress={getTotalProgress}
          />
        }
      />
      <Route
        path="/lesson/:moduleId/:lessonId"
        element={
          <LessonPage
            isLessonCompleted={isLessonCompleted}
            toggleLesson={toggleLesson}
            isCheckItemDone={isCheckItemDone}
            toggleCheckItem={toggleCheckItem}
          />
        }
      />
      <Route path="/cheatsheet" element={<CheatsheetPage />} />
      <Route path="/glossary" element={<GlossaryPage />} />
    </Routes>
  )
}

function AppContent() {
  const progressHooks = useProgress()

  return (
    <Router>
      <Layout progressHooks={progressHooks}>
        <AppRoutes progressHooks={progressHooks} />
      </Layout>
    </Router>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}
