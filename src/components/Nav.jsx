import { NavLink } from 'react-router-dom'
import ExpandingSearchBar from './ExpandingSearchBar.jsx'
import { ProfileIcon, FilmIcon } from './icons.jsx'

// Fixed glassmorphic top navigation (CLAUDE.md §6.1).
// Left→right: brand, Home / Movies / My Favorites links, Search, Profile.
const LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/movies', label: 'Movies' },
  { to: '/favorites', label: 'My Favorites' },
]

export default function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 glass">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:px-6">
        {/* Brand (flex-1 balances the right group so the center links stay centered) */}
        <div className="flex flex-1 justify-start">
          <NavLink to="/" className="flex items-center gap-2">
            <FilmIcon className="h-6 w-6 text-accent-bright" />
            <span className="text-lg font-extrabold tracking-tight text-ink">
              Little<span className="text-accent-bright">Film</span>
            </span>
          </NavLink>
        </div>

        {/* Primary links */}
        <ul className="hidden shrink-0 items-center gap-1 md:flex">
          {LINKS.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.end}
                className="relative rounded-full px-4 py-2 text-sm font-semibold transition"
              >
                {({ isActive }) => (
                  <>
                    <span className={isActive ? 'text-ink' : 'text-muted hover:text-ink'}>
                      {link.label}
                    </span>
                    {isActive && (
                      <span
                        className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-accent-bright"
                        style={{ boxShadow: '0 0 10px var(--color-accent-bright)' }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Search + profile (flex-1 balances the brand; right-aligned so the
            search bar expands into its own space without shoving the links) */}
        <div className="flex flex-1 items-center justify-end gap-1">
          <ExpandingSearchBar />
          <button
            aria-label="Profile"
            className="grid h-10 w-10 place-items-center rounded-full text-ink transition hover:text-steel"
          >
            <ProfileIcon className="h-6 w-6" />
          </button>
        </div>
      </nav>

      {/* Mobile links row */}
      <ul className="flex items-center justify-center gap-1 border-t border-white/8 pb-2 md:hidden">
        {LINKS.map((link) => (
          <li key={link.to}>
            <NavLink
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `block px-3 py-1.5 text-xs font-semibold ${isActive ? 'text-accent-bright' : 'text-muted'}`
              }
            >
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </header>
  )
}
