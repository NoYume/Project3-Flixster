import { motion } from 'framer-motion'

// Themed "Load More" trigger (CLAUDE.md §6.4).
export default function LoadMoreButton({ onClick, loading = false, className = '' }) {
  return (
    <motion.button
      whileHover={{ scale: loading ? 1 : 1.04 }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      disabled={loading}
      className={`rounded-full px-7 py-3 text-sm font-semibold text-ink transition disabled:opacity-60 ${className}`}
      style={{
        background: 'linear-gradient(135deg, var(--color-accent), var(--color-steel-deep))',
        boxShadow: 'var(--shadow-glow-amber)',
      }}
    >
      {loading ? 'Loading…' : 'Load More'}
    </motion.button>
  )
}
