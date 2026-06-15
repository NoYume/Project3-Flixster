import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getGenres } from '../services/tmdb.js'
import { SORT_OPTIONS } from '../utils/sortMovies.js'
import { FilterIcon } from './icons.jsx'

// Top-right filter control (CLAUDE.md §6.1 / §6.4): sort + genre selection,
// controlled via value { sort, genreId } + onChange.
export default function FilterMenu({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const [genres, setGenres] = useState([])
  const ref = useRef(null)

  useEffect(() => {
    getGenres()
      .then(({ list }) => setGenres(list))
      .catch(() => setGenres([]))
  }, [])

  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const active = value.genreId || value.sort !== 'popularity'

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-ink transition glass"
        style={active ? { boxShadow: 'var(--shadow-glow-steel)' } : undefined}
        aria-haspopup="true"
        aria-expanded={open}
      >
        <FilterIcon className="h-4 w-4" />
        Filter
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
            className="absolute right-0 z-30 mt-2 w-[min(16rem,calc(100vw-2rem))] rounded-squircle glass p-4"
            style={{ boxShadow: 'var(--shadow-glass)' }}
          >
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted">Sort by</p>
            <div className="grid grid-cols-2 gap-2">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => onChange({ ...value, sort: opt.value })}
                  className="rounded-lg px-3 py-2 text-left text-sm transition"
                  style={{
                    background: value.sort === opt.value ? 'var(--color-accent)' : 'rgba(255,255,255,0.06)',
                    color: value.sort === opt.value ? '#111315' : 'var(--color-ink)',
                    fontWeight: value.sort === opt.value ? 700 : 500,
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <p className="mb-2 mt-4 text-xs font-bold uppercase tracking-wide text-muted">Genre</p>
            <select
              value={value.genreId || ''}
              onChange={(e) => onChange({ ...value, genreId: e.target.value || null })}
              className="w-full rounded-lg bg-panel-2 px-3 py-2 text-sm text-ink outline-none focus:ring-2"
              style={{ '--tw-ring-color': 'var(--color-steel)' }}
            >
              <option value="">All genres</option>
              {genres.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>

            {active && (
              <button
                onClick={() => onChange({ sort: 'popularity', genreId: null })}
                className="mt-3 w-full rounded-lg py-2 text-xs font-semibold text-muted transition hover:text-ink"
              >
                Reset filters
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
