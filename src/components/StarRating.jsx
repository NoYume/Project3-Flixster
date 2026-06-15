import { StarIcon } from './icons.jsx'

// Renders a 0-10 TMDB vote average as a 5-star meter plus the numeric value.
export default function StarRating({ value = 0, showNumber = true, size = 16 }) {
  const outOfFive = Math.max(0, Math.min(5, (value || 0) / 2))
  const full = Math.floor(outOfFive)
  const hasHalf = outOfFive - full >= 0.25 && outOfFive - full < 0.75
  const roundedUp = outOfFive - full >= 0.75

  return (
    <div className="flex items-center gap-1.5" aria-label={`Rated ${(value || 0).toFixed(1)} out of 10`}>
      <div className="flex" style={{ color: 'var(--color-amber)' }}>
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = i < full + (roundedUp ? 1 : 0)
          const half = hasHalf && i === full
          return (
            <span key={i} className="relative inline-block" style={{ width: size, height: size }}>
              <StarIcon style={{ width: size, height: size, opacity: 0.25 }} aria-hidden="true" />
              {(filled || half) && (
                <span
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: half ? size / 2 : size }}
                >
                  <StarIcon style={{ width: size, height: size }} aria-hidden="true" />
                </span>
              )}
            </span>
          )
        })}
      </div>
      {showNumber && (
        <span className="text-sm font-semibold text-ink">{(value || 0).toFixed(1)}</span>
      )}
    </div>
  )
}
