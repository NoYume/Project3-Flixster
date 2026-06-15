import { motion } from 'framer-motion'
import { backdropUrl } from '../services/tmdb.js'
import { useModal } from '../context/ModalContext.js'
import { PlayIcon } from './icons.jsx'

// Immersive hero for the Home page (CLAUDE.md §6.3) — large backdrop with
// a left-aligned text overlay (title + overview) and [Play] / [More Info].
export default function HomeHero({ movie }) {
  const { openMovie } = useModal()
  if (!movie) return null

  return (
    <section className="relative flex min-h-0 w-full flex-1 items-center overflow-hidden pt-28 md:pt-22">
      {/* Movie image: inset 5.5rem (4rem fixed nav + 1.5rem) below the top so
          the nav→image gap matches the 1.5rem (mt-6) image→footer gap, leaving
          the backdrop vertically centered. Clipped so the cover-scaled image
          never forces a page scrollbar. */}
      <div className="absolute inset-x-0 bottom-0 top-28 overflow-hidden md:top-22">
        <motion.img
          key={movie.id}
          initial={{ scale: 1.08, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          src={backdropUrl(movie.backdrop_path, 'original')}
          alt={`${movie.title} backdrop`}
          className="h-full w-full object-cover"
        />
        {/* Scrims darken left + bottom so the text overlay stays legible */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/55 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent" />
      </div>

      <div className="relative z-10 flex w-full max-w-6xl flex-col px-6 md:pl-10 md:pr-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 120, damping: 20 }}
          className="max-w-xl"
        >
          <span className="mb-3 inline-block rounded-full bg-accent/90 px-3 py-1 text-xs font-bold uppercase tracking-widest text-ink">
            Featured
          </span>
          <h1 className="text-3xl font-extrabold leading-tight text-ink drop-shadow-lg sm:text-4xl md:text-6xl">
            {movie.title}
          </h1>
          {movie.release_date && (
            <p className="mt-2 text-sm text-muted">{movie.release_date.slice(0, 4)}</p>
          )}
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-ink/85 line-clamp-4 md:text-base">
            {movie.overview || 'No overview available for this title.'}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => openMovie(movie)}
              className="flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-ink sm:px-7 sm:py-3"
              style={{ background: 'var(--color-accent)', boxShadow: 'var(--shadow-glow-amber)' }}
            >
              <PlayIcon className="h-5 w-5" /> Play
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => openMovie(movie)}
              className="rounded-full px-5 py-2.5 text-sm font-bold text-ink glass sm:px-7 sm:py-3"
            >
              More Info
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
