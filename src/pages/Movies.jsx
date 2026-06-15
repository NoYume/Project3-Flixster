import { useState, useMemo, useCallback } from 'react'
import { getPopular, discoverMovies } from '../services/tmdb.js'
import { usePaginatedMovies } from '../hooks/usePaginatedMovies.js'
import { applyFilters } from '../utils/sortMovies.js'
import MovieCarousel from '../components/MovieCarousel.jsx'
import FocusDetailPanel from '../components/FocusDetailPanel.jsx'
import FilterMenu from '../components/FilterMenu.jsx'
import Loader from '../components/Loader.jsx'
import ErrorState from '../components/ErrorState.jsx'

// Movies page (CLAUDE.md §6.4): coverflow carousel + Load More + top-right
// Filter + focus detail panel below the centered card.
export default function Movies() {
  const [filter, setFilter] = useState({ sort: 'popularity', genreId: null })
  const [focused, setFocused] = useState(null)
  const { genreId } = filter

  // Genre filtering is server-side (Discover) so it spans all pages, not just
  // the buffered ones; without a genre we use the Popular feed. Pagination
  // re-initializes when the genre changes.
  const fetchPage = useCallback(
    (page) =>
      genreId ? discoverMovies({ genreId, sortBy: 'popularity.desc', page }) : getPopular(page),
    [genreId]
  )
  const { movies, loading, error, hasMore, loadMore } = usePaginatedMovies(
    fetchPage,
    [genreId],
    true
  )

  // Sort is applied client-side over the accumulated list (genre already
  // handled server-side, so applyFilters' genre branch is a harmless no-op).
  const displayed = useMemo(() => applyFilters(movies, filter), [movies, filter])

  return (
    <div className="mx-auto max-w-7xl px-4 pb-4 pt-20 md:px-6">
      <div className="mb-3 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-ink">Movies</h1>
          <p className="text-sm text-muted">Popular right now — browse the cover flow.</p>
        </div>
        <FilterMenu value={filter} onChange={setFilter} />
      </div>

      {loading && movies.length === 0 ? (
        <Loader label="Loading movies…" className="min-h-[40vh]" />
      ) : error && movies.length === 0 ? (
        <ErrorState message="Couldn’t load movies." onRetry={loadMore} />
      ) : displayed.length === 0 && !hasMore ? (
        <p className="py-16 text-center text-muted">No movies match this filter.</p>
      ) : (
        <>
          {displayed.length === 0 && (
            <p className="py-4 text-center text-muted">No matches yet — load more to keep looking.</p>
          )}
          <MovieCarousel
            movies={displayed}
            onFocusChange={setFocused}
            onLoadMore={loadMore}
            showLoadMore={hasMore}
            loadingMore={loading}
          />
          {displayed.length > 0 && <FocusDetailPanel movie={focused || displayed[0]} />}
        </>
      )}
    </div>
  )
}
