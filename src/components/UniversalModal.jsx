import { useState, useEffect, useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { getMovieDetails, backdropUrl } from '../services/tmdb.js'
import { useModal } from '../context/ModalContext.js'
import { useFavorites } from '../context/FavoritesContext.js'
import AIRecommendationPanel from './AIRecommendationPanel.jsx'
import StarRating from './StarRating.jsx'
import Loader from './Loader.jsx'
import ErrorState from './ErrorState.jsx'
import { HeartIcon, PlayIcon, CloseIcon } from './icons.jsx'

// Universal Movie Modal (CLAUDE.md §6.5): route-independent overlay with the
// trailer, full details, the isolated AI panel, and Play/Favorite actions.
export default function UniversalModal() {
  const { activeMovie, closeModal } = useModal()

  return (
    <AnimatePresence>
      {activeMovie && <ModalContent movie={activeMovie} onClose={closeModal} />}
    </AnimatePresence>
  )
}

function ModalContent({ movie, onClose }) {
  const [details, setDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const { isFavorite, toggleFavorite } = useFavorites()

  const load = () => {
    setLoading(true)
    setError(false)
    getMovieDetails(movie.id)
      .then(setDetails)
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(false)
    setDetails(null)
    getMovieDetails(movie.id)
      .then((d) => !cancelled && setDetails(d))
      .catch(() => !cancelled && setError(true))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [movie.id])

  // Close on Esc and lock body scroll while open.
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const favorited = isFavorite(movie.id)
  // Prefer fetched details, fall back to the seed movie fields. Memoized so
  // its identity stays stable across context-driven re-renders (e.g.
  // favoriting), which would otherwise make the AI panel re-fetch.
  const view = useMemo(
    () => ({
      id: movie.id,
      title: details?.title || movie.title,
      overview: details?.overview || movie.overview,
      backdropPath: details?.backdropPath ?? movie.backdrop_path,
      voteAverage: details?.voteAverage ?? movie.vote_average ?? 0,
      releaseDate: details?.releaseDate || movie.release_date,
      runtime: details?.runtime,
      genres: details?.genres || [],
      directors: details?.directors || [],
      cast: details?.cast || [],
      trailerKey: details?.trailerKey,
    }),
    [movie, details]
  )

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center overflow-hidden p-4"
      style={{ background: 'rgba(0,0,0,0.7)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={`${view.title} details`}
        initial={{ opacity: 0, scale: 0.94, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 24 }}
        transition={{ type: 'spring', stiffness: 240, damping: 26 }}
        onClick={(e) => e.stopPropagation()}
        className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-squircle-lg glass"
        style={{ boxShadow: 'var(--shadow-glass)' }}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 z-20 grid h-9 w-9 place-items-center rounded-full bg-black/50 text-ink backdrop-blur transition hover:bg-accent"
        >
          <CloseIcon className="h-5 w-5" />
        </button>

        {/* Top: trailer if available, otherwise the backdrop image */}
        <div className="relative aspect-video w-full shrink-0 bg-black">
          {view.trailerKey ? (
            <iframe
              className="h-full w-full"
              src={`https://www.youtube.com/embed/${view.trailerKey}`}
              title={`${view.title} trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <>
              <img
                src={backdropUrl(view.backdropPath, 'w1280')}
                alt={`${view.title} backdrop`}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-panel to-transparent" />
            </>
          )}
        </div>

        {/* Body — only this region scrolls when content overflows */}
        <div className="modal-scroll min-h-0 flex-1 space-y-5 overflow-y-auto p-6">
          {error ? (
            <ErrorState message="Couldn’t load full details for this movie." onRetry={load} />
          ) : (
            <>
              <div>
                <h2 className="text-2xl font-bold text-ink">{view.title}</h2>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
                  <StarRating value={view.voteAverage} />
                  {view.releaseDate && <span>{view.releaseDate.slice(0, 4)}</span>}
                  {view.runtime ? <span>{view.runtime} min</span> : null}
                </div>
              </div>

              {view.genres.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {view.genres.map((g) => (
                    <span key={g} className="rounded-full bg-panel-3/80 px-3 py-1 text-xs text-muted">
                      {g}
                    </span>
                  ))}
                </div>
              )}

              <p className="text-sm leading-relaxed text-ink/85">
                {view.overview || 'No overview available.'}
              </p>

              {loading ? (
                <Loader label="Loading cast & crew…" className="py-4" />
              ) : (
                <div className="space-y-1 text-sm text-muted">
                  {view.directors.length > 0 && (
                    <p>
                      <span className="font-semibold text-ink">Director: </span>
                      {view.directors.join(', ')}
                    </p>
                  )}
                  {view.cast.length > 0 && (
                    <p>
                      <span className="font-semibold text-ink">Cast: </span>
                      {view.cast.join(', ')}
                    </p>
                  )}
                </div>
              )}

              {!loading && <AIRecommendationPanel movie={view} />}
            </>
          )}
        </div>

        {/* Actions — anchored below the scrolling body, always visible */}
        <div className="flex shrink-0 gap-3 border-t border-white/10 p-4">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex flex-1 items-center justify-center gap-2 rounded-full py-3 text-sm font-bold text-ink"
            style={{ background: 'var(--color-accent)', boxShadow: 'var(--shadow-glow-amber)' }}
          >
            <PlayIcon className="h-5 w-5" /> Play Movie
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => toggleFavorite(movie)}
            aria-pressed={favorited}
            className="flex flex-1 items-center justify-center gap-2 rounded-full py-3 text-sm font-bold transition"
            style={{
              background: favorited ? 'var(--color-accent)' : 'rgba(255,255,255,0.08)',
              color: 'var(--color-ink)',
            }}
          >
            <HeartIcon filled={favorited} className="h-5 w-5" />
            {favorited ? 'Favorited' : 'Favorite Movie'}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}
