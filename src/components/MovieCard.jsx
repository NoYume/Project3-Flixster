import { motion } from 'framer-motion'
import { posterUrl } from '../services/tmdb.js'
import { useModal } from '../context/ModalContext.js'
import { useFavorites } from '../context/FavoritesContext.js'
import { HeartIcon, EyeIcon } from './icons.jsx'

// Movie poster card with favorite (heart) / watched (eye) badges; clicking
// the cover opens the Universal Modal (CLAUDE.md §6.4).
export default function MovieCard({ movie }) {
  const { openMovie } = useModal()
  const { isFavorite, isWatched, toggleFavorite, toggleWatched } = useFavorites()

  const favorited = isFavorite(movie.id)
  const watched = isWatched(movie.id)

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className="group relative overflow-hidden rounded-squircle"
      style={{ boxShadow: 'var(--shadow-glass)' }}
    >
      <button
        onClick={() => openMovie(movie)}
        className="block w-full"
        aria-label={`View details for ${movie.title}`}
      >
        <img
          src={posterUrl(movie.poster_path, 'w500')}
          alt={`${movie.title} poster`}
          loading="lazy"
          className="aspect-[2/3] w-full object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent p-3 pt-10 text-left">
          <p className="line-clamp-2 text-sm font-semibold text-ink">{movie.title}</p>
          {movie.release_date && (
            <p className="text-xs text-muted">{movie.release_date.slice(0, 4)}</p>
          )}
        </div>
      </button>

      <div className="absolute right-2 top-2 flex gap-1.5">
        <BadgeButton
          active={watched}
          onClick={() => toggleWatched(movie)}
          activeColor="var(--color-steel)"
          label={watched ? 'Mark as not watched' : 'Mark as watched'}
        >
          <EyeIcon filled={watched} className="h-4 w-4" />
        </BadgeButton>
        <BadgeButton
          active={favorited}
          onClick={() => toggleFavorite(movie)}
          activeColor="var(--color-accent)"
          label={favorited ? 'Remove from favorites' : 'Add to favorites'}
        >
          <HeartIcon filled={favorited} className="h-4 w-4" />
        </BadgeButton>
      </div>

      {favorited && (
        <span className="pointer-events-none absolute left-2 top-2 rounded-full bg-accent/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-ink">
          ♥ Fav
        </span>
      )}
    </motion.div>
  )
}

function BadgeButton({ active, onClick, activeColor, label, children }) {
  return (
    <motion.button
      whileTap={{ scale: 0.85 }}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      aria-label={label}
      aria-pressed={active}
      className="grid h-8 w-8 place-items-center rounded-full backdrop-blur-md transition"
      style={{
        background: active ? activeColor : 'rgba(10,10,15,0.55)',
        color: 'var(--color-ink)',
        boxShadow: active ? `0 0 14px ${activeColor}` : 'none',
      }}
    >
      {children}
    </motion.button>
  )
}
