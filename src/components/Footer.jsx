import { FilmIcon } from './icons.jsx'

// Site-wide themed footer (CLAUDE.md §6.2).
export default function Footer() {
  return (
    <footer className="mt-6 border-t border-white/10 px-6 py-5">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-muted md:flex-row">
        <div className="flex items-center gap-2">
          <FilmIcon className="h-5 w-5 text-accent-bright" />
          <span className="font-bold text-ink">LittleFilm</span>
          <span className="text-muted">· Shanghai Night</span>
        </div>
        <p>
          Movie data &amp; imagery by{' '}
          <a href="https://www.themoviedb.org/" target="_blank" rel="noreferrer" className="text-steel hover:underline">
            TMDB
          </a>
          {' · '}AI recs by{' '}
          <a href="https://openrouter.ai/" target="_blank" rel="noreferrer" className="text-steel hover:underline">
            OpenRouter
          </a>
        </p>
        <p className="text-muted">© {new Date().getFullYear()} LittleFilm</p>
      </div>
    </footer>
  )
}
