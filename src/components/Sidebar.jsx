import { HeartIcon, EyeIcon } from './icons.jsx'

// Favorites filter panel: toggle favorited and/or watched (CLAUDE.md §6.7).
// Controlled via value { favorited, watched } + onChange.
export default function Sidebar({ value, onChange, counts = {} }) {
  const Toggle = ({ keyName, label, icon, color }) => {
    const on = value[keyName]
    return (
      <button
        onClick={() => onChange({ ...value, [keyName]: !on })}
        aria-pressed={on}
        className="flex w-full items-center justify-between rounded-squircle px-4 py-3 text-sm font-semibold transition"
        style={{
          background: on ? color : 'rgba(255,255,255,0.05)',
          color: 'var(--color-ink)',
          boxShadow: on ? `0 0 16px ${color}` : 'none',
        }}
      >
        <span className="flex items-center gap-2">
          {icon}
          {label}
        </span>
        {typeof counts[keyName] === 'number' && (
          <span className="rounded-full bg-black/20 px-2 py-0.5 text-xs">{counts[keyName]}</span>
        )}
      </button>
    )
  }

  return (
    <aside className="w-full shrink-0 rounded-squircle glass p-4 md:w-56" style={{ boxShadow: 'var(--shadow-glass)' }}>
      <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-muted">Filter</h3>
      <div className="space-y-2">
        <Toggle keyName="favorited" label="Favorites" icon={<HeartIcon filled className="h-4 w-4" />} color="var(--color-accent)" />
        <Toggle keyName="watched" label="Watched" icon={<EyeIcon filled className="h-4 w-4" />} color="var(--color-steel)" />
      </div>
    </aside>
  )
}
