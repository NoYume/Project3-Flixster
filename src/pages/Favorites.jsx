import { useState, useMemo } from 'react'
import { useFavorites } from '../context/FavoritesContext.js'
import MovieCarousel from '../components/MovieCarousel.jsx'
import FocusDetailPanel from '../components/FocusDetailPanel.jsx'
import Sidebar from '../components/Sidebar.jsx'
import { HeartIcon } from '../components/icons.jsx'

// My Favorites (CLAUDE.md §6.6 / §6.7): reuses the carousel + focus panel,
// with a sidebar to filter by favorited / watched.
export default function Favorites() {
  const { favorites, watched, isFavorite, isWatched } = useFavorites()
  const [filter, setFilter] = useState({ favorited: true, watched: false })
  const [focused, setFocused] = useState(null)

  // The page draws from the union of favorited + watched movies (deduped by
  // id), so a movie that's only watched (never favorited) still appears.
  const allMovies = useMemo(() => {
    const byId = new Map()
    for (const m of favorites) byId.set(m.id, m)
    for (const m of watched) if (!byId.has(m.id)) byId.set(m.id, m)
    return [...byId.values()]
  }, [favorites, watched])

  const displayed = useMemo(() => {
    // Sidebar toggles form an OR-union of selected sets (CLAUDE.md §6.7
    // "favorited and/or watched"). With neither selected, show everything.
    const { favorited, watched: watchedSel } = filter
    if (!favorited && !watchedSel) return allMovies
    return allMovies.filter(
      (m) => (favorited && isFavorite(m.id)) || (watchedSel && isWatched(m.id))
    )
  }, [allMovies, filter, isFavorite, isWatched])

  const counts = {
    favorited: favorites.length,
    watched: watched.length,
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-12 pt-28 md:px-6 md:pt-24">
      <div className="mb-6">
        <h1 className="flex items-center gap-2 text-3xl font-extrabold text-ink">
          <HeartIcon filled className="h-7 w-7 text-accent-bright" /> My Favorites
        </h1>
        <p className="text-sm text-muted">Movies you’ve hearted.</p>
      </div>

      <div className="flex flex-col gap-6 md:flex-row">
        <Sidebar value={filter} onChange={setFilter} counts={counts} />

        <div className="min-w-0 flex-1">
          {allMovies.length === 0 ? (
            <EmptyState message="No favorites yet — tap the ♥ on any movie to add it here." />
          ) : displayed.length === 0 ? (
            <EmptyState message="No favorites match this filter." />
          ) : (
            <>
              <MovieCarousel movies={displayed} onFocusChange={setFocused} />
              <FocusDetailPanel movie={focused || displayed[0]} />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function EmptyState({ message }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 rounded-squircle glass p-10 text-center">
      <HeartIcon className="h-10 w-10 text-muted" />
      <p className="max-w-sm text-muted">{message}</p>
    </div>
  )
}
