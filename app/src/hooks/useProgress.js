import { useState, useCallback } from 'react'

const STORAGE_KEY = 'mcp-learning-progress'

function loadProgress() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : { completed: {}, checklistItems: {} }
  } catch {
    return { completed: {}, checklistItems: {} }
  }
}

function saveProgress(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {}
}

export function useProgress() {
  const [progress, setProgress] = useState(loadProgress)

  const toggleLesson = useCallback((moduleId, lessonId) => {
    setProgress(prev => {
      const key = `${moduleId}:${lessonId}`
      const next = {
        ...prev,
        completed: { ...prev.completed, [key]: !prev.completed[key] },
      }
      saveProgress(next)
      return next
    })
  }, [])

  const toggleCheckItem = useCallback((moduleId, lessonId, itemIndex) => {
    setProgress(prev => {
      const key = `${moduleId}:${lessonId}:${itemIndex}`
      const next = {
        ...prev,
        checklistItems: { ...prev.checklistItems, [key]: !prev.checklistItems[key] },
      }
      saveProgress(next)
      return next
    })
  }, [])

  const isLessonCompleted = useCallback((moduleId, lessonId) => {
    return !!progress.completed[`${moduleId}:${lessonId}`]
  }, [progress])

  const isCheckItemDone = useCallback((moduleId, lessonId, itemIndex) => {
    return !!progress.checklistItems[`${moduleId}:${lessonId}:${itemIndex}`]
  }, [progress])

  const getModuleProgress = useCallback((module) => {
    const total = module.lessons.length
    const done = module.lessons.filter(l => progress.completed[`${module.id}:${l.id}`]).length
    return { total, done, percent: total > 0 ? Math.round((done / total) * 100) : 0 }
  }, [progress])

  const getTotalProgress = useCallback((modules) => {
    const total = modules.reduce((acc, m) => acc + m.lessons.length, 0)
    const done = modules.reduce((acc, m) =>
      acc + m.lessons.filter(l => progress.completed[`${m.id}:${l.id}`]).length, 0)
    return { total, done, percent: total > 0 ? Math.round((done / total) * 100) : 0 }
  }, [progress])

  const resetProgress = useCallback(() => {
    const empty = { completed: {}, checklistItems: {} }
    setProgress(empty)
    saveProgress(empty)
  }, [])

  return {
    toggleLesson,
    toggleCheckItem,
    isLessonCompleted,
    isCheckItemDone,
    getModuleProgress,
    getTotalProgress,
    resetProgress,
  }
}
