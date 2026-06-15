// Friendly, themed error message — never a broken UI (CLAUDE.md §6.9).
export default function ErrorState({ message = 'Something went wrong.', onRetry, className = '' }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-4 py-12 text-center ${className}`} role="alert">
      <div className="text-4xl" aria-hidden="true">🎬</div>
      <div>
        <p className="text-lg font-semibold text-ink">Oops — that didn’t load.</p>
        <p className="mt-1 max-w-md text-sm text-muted">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-ink transition hover:bg-accent-bright"
          style={{ boxShadow: 'var(--shadow-glow-amber)' }}
        >
          Try again
        </button>
      )}
    </div>
  )
}
