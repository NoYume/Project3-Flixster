import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getMovieDetails } from '../services/tmdb.js'
import { useModal } from '../context/ModalContext.js'
import { useFavorites } from '../context/FavoritesContext.js'
import StarRating from './StarRating.jsx'
import Loader from './Loader.jsx'
import { HeartIcon, PlayIcon } from './icons.jsx'

// Detail area below the centered carousel card (CLAUDE.md §6.4): rating,
// genres, cast/crew, overview, and Play/Favorite. Lazy-fetches full details.
export default function FocusDetailPanel({ movie }) {
  const [details, setDetails] = useState(null)
  const [loading, setLoading] = useState(false)
  const { openMovie } = useModal()
  const { isFavorite, toggleFavorite } = useFavorites()

  useEffect(() => {
    if (!movie) return
    let cancelled = false
    setLoading(true)
    setDetails(null)
    getMovieDetails(movie.id)
      .then((d) => !cancelled && setDetails(d))
      .catch(() => !cancelled && setDetails(null))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [movie])

  if (!movie) return null

  const favorited = isFavorite(movie.id)
  const rating = details?.voteAverage ?? movie.vote_average ?? 0

  return (
    <motion.div
      key={movie.id}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 220, damping: 26 }}
      className="mx-auto mt-3 w-full max-w-3xl rounded-squircle glass p-5 text-center"
      style={{ boxShadow: 'var(--shadow-glass)' }}
    >
      <h2 className="text-xl font-bold text-ink sm:text-2xl">{movie.title}</h2>

      <div className="mt-2 flex justify-center">
        <StarRating value={rating} />
      </div>

      {loading && !details ? (
        <Loader label="Loading details…" className="py-6" />
      ) : (
        <>
          {details?.genres?.length > 0 && (
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              {details.genres.map((g) => (
                <span key={g} className="rounded-full bg-panel-3/80 px-3 py-1 text-xs text-muted">
                  {g}
                </span>
              ))}
            </div>
          )}

          <dl className="mt-3 space-y-1 text-sm text-muted">
            {details?.directors?.length > 0 && (
              <div>
                <span className="font-semibold text-ink">Director: </span>
                {details.directors.join(', ')}
              </div>
            )}
            {details?.cast?.length > 0 && (
              <div>
                <span className="font-semibold text-ink">Starring: </span>
                {details.cast.slice(0, 4).join(', ')}
              </div>
            )}
          </dl>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-ink/80 line-clamp-3">
            {movie.overview || details?.overview || 'No description available.'}
          </p>
        </>
      )}

      <div className="mt-4 flex flex-wrap justify-center gap-3">
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => openMovie(movie)}
          className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-ink sm:px-6 sm:py-2.5"
          style={{ background: 'var(--color-accent)', boxShadow: 'var(--shadow-glow-amber)' }}
        >
          <PlayIcon className="h-4 w-4" /> Play
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => toggleFavorite(movie)}
          aria-pressed={favorited}
          className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition sm:px-6 sm:py-2.5"
          style={{
            background: favorited ? 'var(--color-accent)' : 'rgba(255,255,255,0.08)',
            color: 'var(--color-ink)',
          }}
        >
          <HeartIcon filled={favorited} className="h-4 w-4" />
          {favorited ? 'Favorited' : 'Favorite'}
        </motion.button>
      </div>
    </motion.div>
  )
}
