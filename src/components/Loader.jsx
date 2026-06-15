// Themed loading animation — three bouncing dots. Used by every fetch
// (TMDB + OpenRouter) per CLAUDE.md §6.9.
export default function Loader({ label = 'Loading…', className = '' }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 py-10 ${className}`} role="status" aria-live="polite">
      <div className="flex gap-2">
        <span className="loader-dot h-3 w-3 rounded-full bg-accent-bright" style={{ animationDelay: '0s' }} />
        <span className="loader-dot h-3 w-3 rounded-full bg-steel" style={{ animationDelay: '0.15s' }} />
        <span className="loader-dot h-3 w-3 rounded-full bg-amber" style={{ animationDelay: '0.3s' }} />
      </div>
      {label && <p className="text-sm text-muted">{label}</p>}
    </div>
  )
}
