import { useState, useEffect, useCallback, useMemo } from 'react'
import { FavoritesContext } from './FavoritesContext.js'

const FAV_KEY = 'littlefilm:favorites'
const WATCHED_KEY = 'littlefilm:watched'

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

// Watched used to persist as an array of bare ids. Now we store full movie
// objects (so the Favorites page can render watched-only movies). Migrate any
// legacy id entries to minimal { id } objects on load.
function loadWatched() {
  const raw = load(WATCHED_KEY, [])
  if (!Array.isArray(raw)) return []
  return raw.map((item) => (item && typeof item === 'object' ? item : { id: item }))
}

export function FavoritesProvider({ children }) {
  // Store full movie objects (not just ids) so the Favorites page can render
  // poster, title, etc. for either set.
  const [favorites, setFavorites] = useState(() => load(FAV_KEY, []))
  const [watched, setWatched] = useState(loadWatched)

  useEffect(() => {
    localStorage.setItem(FAV_KEY, JSON.stringify(favorites))
  }, [favorites])
  useEffect(() => {
    localStorage.setItem(WATCHED_KEY, JSON.stringify(watched))
  }, [watched])

  const isFavorite = useCallback(
    (id) => favorites.some((m) => m.id === id),
    [favorites]
  )
  const isWatched = useCallback((id) => watched.some((m) => m.id === id), [watched])

  const toggleFavorite = useCallback((movie) => {
    setFavorites((prev) =>
      prev.some((m) => m.id === movie.id)
        ? prev.filter((m) => m.id !== movie.id)
        : [...prev, movie]
    )
  }, [])

  const toggleWatched = useCallback((movie) => {
    const entry = movie && typeof movie === 'object' ? movie : { id: movie }
    setWatched((prev) =>
      prev.some((m) => m.id === entry.id)
        ? prev.filter((m) => m.id !== entry.id)
        : [...prev, entry]
    )
  }, [])

  const value = useMemo(
    () => ({ favorites, watched, isFavorite, isWatched, toggleFavorite, toggleWatched }),
    [favorites, watched, isFavorite, isWatched, toggleFavorite, toggleWatched]
  )

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
}
