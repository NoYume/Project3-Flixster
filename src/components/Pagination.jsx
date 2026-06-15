import { motion } from 'framer-motion'

// Page jumper for the carousel (CLAUDE.md §6.4). One page per group of
// `groupSize` movies; page N jumps to that group's first movie. The strip
// grows as "Load More" reveals groups but is windowed with ellipses
// (first/last pinned + a window around the current page) so it never overflows.

const SIBLING_COUNT = 1 // pages on each side of the current page
const BOUNDARY_COUNT = 1 // pages pinned at start / end

const range = (start, end) =>
  Array.from({ length: Math.max(end - start + 1, 0) }, (_, i) => start + i)

// MUI-style windowed list of 1-indexed page numbers, with 'start-ellipsis' /
// 'end-ellipsis' markers where pages are collapsed. Below the slot threshold
// every page is shown; above it the count stays fixed.
function paginationItems(count, page) {
  const totalSlots = BOUNDARY_COUNT * 2 + SIBLING_COUNT * 2 + 3
  if (count <= totalSlots) return range(1, count)

  const startPages = range(1, BOUNDARY_COUNT)
  const endPages = range(count - BOUNDARY_COUNT + 1, count)

  const siblingsStart = Math.max(
    Math.min(page - SIBLING_COUNT, count - BOUNDARY_COUNT - SIBLING_COUNT * 2 - 1),
    BOUNDARY_COUNT + 2
  )
  const siblingsEnd = Math.min(
    Math.max(page + SIBLING_COUNT, BOUNDARY_COUNT + SIBLING_COUNT * 2 + 2),
    endPages[0] - 2
  )

  return [
    ...startPages,
    siblingsStart > BOUNDARY_COUNT + 2
      ? 'start-ellipsis'
      : BOUNDARY_COUNT + 1 < count - BOUNDARY_COUNT
        ? BOUNDARY_COUNT + 1
        : null,
    ...range(siblingsStart, siblingsEnd),
    siblingsEnd < count - BOUNDARY_COUNT - 1
      ? 'end-ellipsis'
      : count - BOUNDARY_COUNT > BOUNDARY_COUNT
        ? count - BOUNDARY_COUNT
        : null,
    ...endPages,
  ].filter((x) => x !== null)
}

export default function Pagination({ pageCount, activePage, onJump, groupSize = 10 }) {
  if (pageCount < 1) return null

  // Algorithm is 1-indexed; activePage / onJump stay 0-indexed externally.
  const items = paginationItems(pageCount, activePage + 1)

  return (
    <nav
      aria-label="Movie pages"
      className="mt-4 flex flex-wrap items-center justify-center gap-2"
    >
      {items.map((item) => {
        if (item === 'start-ellipsis' || item === 'end-ellipsis') {
          return (
            <span
              key={item}
              aria-hidden="true"
              className="grid h-9 min-w-9 place-items-center px-1 text-sm font-bold text-muted"
            >
              …
            </span>
          )
        }

        const page = item - 1 // back to 0-indexed for the jump handler
        const active = page === activePage
        return (
          <motion.button
            key={item}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => onJump(page)}
            aria-label={`Jump to movie ${page * groupSize + 1}`}
            aria-current={active ? 'true' : undefined}
            className="grid h-9 min-w-9 place-items-center rounded-full px-3 text-sm font-bold transition"
            style={{
              background: active ? 'var(--color-accent)' : 'rgba(255,255,255,0.08)',
              color: 'var(--color-ink)',
              boxShadow: active ? 'var(--shadow-glow-amber)' : 'none',
            }}
          >
            {item}
          </motion.button>
        )
      })}
    </nav>
  )
}
