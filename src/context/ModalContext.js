import { createContext, useContext } from 'react'

// Shape: { activeMovie: Movie|null, openMovie(movie), closeModal() }
export const ModalContext = createContext(null)

export function useModal() {
  const ctx = useContext(ModalContext)
  if (!ctx) throw new Error('useModal must be used within <ModalProvider>')
  return ctx
}
