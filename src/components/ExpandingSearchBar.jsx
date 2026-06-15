import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { searchMovies } from '../services/tmdb.js'
import { useModal } from '../context/ModalContext.js'
import { SearchIcon, CloseIcon } from './icons.jsx'
import SearchPreviewDropdown from './SearchPreviewDropdown.jsx'

// Search icon that expands into a typeable bar (CLAUDE.md §6.8). Debounced
// search drives a preview dropdown; Enter navigates to /search?q=.
export default function ExpandingSearchBar() {
  const [expanded, setExpanded] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const inputRef = useRef(null)
  const containerRef = useRef(null)
  const navigate = useNavigate()
  const { openMovie } = useModal()

  useEffect(() => {
    if (expanded) inputRef.current?.focus()
  }, [expanded])

  // Debounced (~300ms) live search for the preview dropdown.
  useEffect(() => {
    const q = query.trim()
    if (!q) {
      setResults([])
      setError(false)
      setLoading(false)
      return
    }
    setLoading(true)
    setError(false)
    const t = setTimeout(() => {
      searchMovies(q, 1)
        .then((data) => setResults(data.results))
        .catch(() => setError(true))
        .finally(() => setLoading(false))
    }, 300)
    return () => clearTimeout(t)
  }, [query])

  useEffect(() => {
    if (!expanded) return
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setExpanded(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [expanded])

  const goToResults = () => {
    const q = query.trim()
    if (!q) return
    navigate(`/search?q=${encodeURIComponent(q)}`)
    setExpanded(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    goToResults()
  }

  const pickPreview = (movie) => {
    openMovie(movie)
    setExpanded(false)
  }

  const showDropdown = expanded && query.trim().length > 0

  return (
    <div ref={containerRef} className="relative">
      <div className="flex items-center">
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.form
              onSubmit={handleSubmit}
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 220, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 28 }}
              className="overflow-hidden"
            >
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search movies…"
                aria-label="Search movies"
                className="w-[220px] rounded-full bg-panel-2/80 px-4 py-2 text-sm text-ink outline-none placeholder:text-muted focus:ring-2"
                style={{ '--tw-ring-color': 'var(--color-accent-bright)' }}
              />
            </motion.form>
          )}
        </AnimatePresence>

        <button
          onClick={() => {
            if (expanded && query) {
              setQuery('')
            } else {
              setExpanded((v) => !v)
            }
          }}
          aria-label={expanded ? 'Close search' : 'Open search'}
          className="grid h-10 w-10 place-items-center rounded-full text-ink transition hover:text-accent-bright"
        >
          {expanded && query ? <CloseIcon className="h-5 w-5" /> : <SearchIcon className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {showDropdown && (
          <SearchPreviewDropdown
            results={results}
            loading={loading}
            error={error}
            query={query.trim()}
            onPick={pickPreview}
            onSeeAll={goToResults}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
