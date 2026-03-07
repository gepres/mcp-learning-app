import { useState } from 'react'

export default function TicCard({ tic }) {
  const [flipped, setFlipped] = useState(false)

  if (!tic) return null

  return (
    <div className="tic-perspective" style={{ height: '280px' }}>
      <div
        className={`tic-inner cursor-pointer ${flipped ? 'flipped' : ''}`}
        onClick={() => setFlipped(f => !f)}
        style={{ height: '100%' }}
      >
        {/* FRONT */}
        <div
          className="tic-face"
          style={{
            background: 'linear-gradient(135deg, rgba(251,191,36,0.1), rgba(245,158,11,0.05))',
            border: '1px solid rgba(251,191,36,0.25)',
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">{tic.emoji}</span>
            <span className="text-xs font-semibold text-amber-400/70 uppercase tracking-widest">
              💡 Truco para recordar
            </span>
          </div>

          <div className="flex items-center justify-center gap-1 mb-4 flex-wrap">
            {tic.letters.map((item, i) => (
              <div key={i} className="text-center">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-xl font-black"
                  style={{
                    background: `hsl(${(i * 40 + 30) % 360}, 80%, 55%)`,
                    boxShadow: `0 0 12px hsl(${(i * 40 + 30) % 360}, 80%, 55%, 0.4)`,
                  }}
                >
                  {item.letter}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <span
              className="text-2xl font-black tracking-wider"
              style={{
                background: 'linear-gradient(135deg, #fbbf24, #f97316)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {tic.acronym}
            </span>
            <p className="text-xs mt-1 italic" style={{ color: 'rgba(251,191,36,0.6)' }}>"{tic.trigger}"</p>
          </div>

          <div className="mt-auto pt-3 text-center">
            <span className="text-xs flex items-center justify-center gap-1" style={{ color: 'var(--text-dim)' }}>
              <span>↩️</span> Toca para voltear
            </span>
          </div>
        </div>

        {/* BACK */}
        <div
          className="tic-face tic-back"
          style={{
            background: 'linear-gradient(135deg, rgba(251,191,36,0.08), rgba(245,158,11,0.03))',
            border: '1px solid rgba(251,191,36,0.2)',
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-semibold text-amber-400/70 uppercase tracking-widest">
              🧠 Significado
            </span>
          </div>

          <div className="space-y-2 flex-1 overflow-y-auto">
            {tic.letters.map((item, i) => (
              <div key={i} className="flex items-start gap-2">
                <span
                  className="text-sm font-black w-5 flex-shrink-0"
                  style={{
                    color: `hsl(${(i * 40 + 30) % 360}, 80%, 65%)`,
                  }}
                >
                  {item.letter}
                </span>
                <div>
                  <span className="text-xs font-semibold text-amber-300">{item.word}</span>
                  <span className="text-xs ml-1" style={{ color: 'var(--text-muted)' }}>— {item.desc}</span>
                </div>
              </div>
            ))}
          </div>

          <div
            className="mt-3 p-2 rounded-lg text-xs italic leading-relaxed"
            style={{ color: 'var(--text-muted)', background: 'rgba(251,191,36,0.05)', border: '1px solid rgba(251,191,36,0.1)' }}
          >
            {tic.analogy}
          </div>
        </div>
      </div>
    </div>
  )
}
