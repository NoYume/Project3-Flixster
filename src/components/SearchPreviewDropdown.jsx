import { motion } from 'framer-motion'
import { posterUrl } from '../services/tmdb.js'
import Loader from './Loader.jsx'

// Quick-preview dropdown under the search bar: poster + title for the top
// matches, click to open the modal (CLAUDE.md §6.8).
export default function SearchPreviewDropdown({ results, loading, error, onPick, onSeeAll, query }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      className="absolute left-0 right-0 top-full z-40 mt-2 max-h-[70vh] overflow-y-auto rounded-squircle glass p-2"
      style={{ boxShadow: 'var(--shadow-glass)' }}
    >
      {loading && <Loader label="Searching…" className="py-6" />}

      {!loading && error && (
        <p className="px-3 py-4 text-center text-sm text-muted">Couldn’t search right now — try again.</p>
      )}

      {!loading && !error && results.length === 0 && query && (
        <p className="px-3 py-4 text-center text-sm text-muted">No matches for “{query}”.</p>
      )}

      {!loading && !error &&
        results.slice(0, 6).map((m) => (
          <button
            key={m.id}
            onClick={() => onPick(m)}
            className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition hover:bg-white/8"
          >
            <img
              src={posterUrl(m.poster_path, 'w92')}
              alt=""
              className="h-14 w-10 shrink-0 rounded object-cover"
            />
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold text-ink">{m.title}</span>
              {m.release_date && (
                <span className="block text-xs text-muted">{m.release_date.slice(0, 4)}</span>
              )}
            </span>
          </button>
        ))}

      {!loading && !error && results.length > 0 && (
        <button
          onClick={onSeeAll}
          className="mt-1 w-full rounded-lg py-2 text-center text-sm font-semibold text-steel transition hover:bg-white/8"
        >
          See all results for “{query}” →
        </button>
      )}
    </motion.div>
  )
}
