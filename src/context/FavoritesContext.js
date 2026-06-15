import { createContext, useContext } from 'react'

// Shape: { favorites: Movie[], watched: Movie[],
//          isFavorite(id), isWatched(id),
//          toggleFavorite(movie), toggleWatched(movie) }
export const FavoritesContext = createContext(null)

export function useFavorites() {
  const ctx = useContext(FavoritesContext)
  if (!ctx) throw new Error('useFavorites must be used within <FavoritesProvider>')
  return ctx
}
