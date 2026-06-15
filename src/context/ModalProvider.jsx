import { useState, useCallback, useMemo } from 'react'
import { ModalContext } from './ModalContext.js'

export function ModalProvider({ children }) {
  // activeMovie seeds the modal while it lazy-fetches full details.
  const [activeMovie, setActiveMovie] = useState(null)

  const openMovie = useCallback((movie) => setActiveMovie(movie), [])
  const closeModal = useCallback(() => setActiveMovie(null), [])

  const value = useMemo(
    () => ({ activeMovie, openMovie, closeModal }),
    [activeMovie, openMovie, closeModal]
  )

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
}
