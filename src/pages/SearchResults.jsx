import { useState, useMemo, useCallback } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { searchMovies, getNowPlaying, discoverMovies } from '../services/tmdb.js'
import { usePaginatedMovies } from '../hooks/usePaginatedMovies.js'
import { applyFilters } from '../utils/sortMovies.js'
import MovieCarousel from '../components/MovieCarousel.jsx'
import FocusDetailPanel from '../components/FocusDetailPanel.jsx'
import FilterMenu from '../components/FilterMenu.jsx'
import Loader from '../components/Loader.jsx'
import ErrorState from '../components/ErrorState.jsx'

// Search Results (CLAUDE.md §6.8): results for ?q= with the top-right Filter;
// clearing the query falls back to the Now Playing list.
export default function SearchResults() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const query = (params.get('q') || '').trim()
  const hasQuery = query.length > 0

  const [filter, setFilter] = useState({ sort: 'popularity', genreId: null })
  const [focused, setFocused] = useState(null)
  const { genreId } = filter

  // Fetcher: search when there's a query; otherwise the default list — which
  // becomes a genre-aware Discover feed when a genre is picked (server-side).
  // (TMDB /search/movie has no genre param, so genre stays client-side for
  // active queries.)
  const fetchPage = useCallback(
    (page) => {
      if (hasQuery) return searchMovies(query, page)
      return genreId ? discoverMovies({ genreId, sortBy: 'popularity.desc', page }) : getNowPlaying(page)
    },
    [hasQuery, query, genreId]
  )
  const { movies, loading, error, hasMore, loadMore } = usePaginatedMovies(
    fetchPage,
    [hasQuery, query, genreId],
    true
  )

  const displayed = useMemo(() => applyFilters(movies, filter), [movies, filter])

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-12 pt-28 md:px-6 md:pt-24">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-ink">
            {hasQuery ? 'Search Results' : 'Now Playing'}
          </h1>
          <p className="text-sm text-muted">
            {hasQuery ? (
              <>
                Showing matches for “{query}”.{' '}
                <button onClick={() => navigate('/search')} className="text-steel hover:underline">
                  Clear search
                </button>
              </>
            ) : (
              'In theaters now — search to find a specific title.'
            )}
          </p>
        </div>
        <FilterMenu value={filter} onChange={setFilter} />
      </div>

      {loading && movies.length === 0 ? (
        <Loader label={hasQuery ? 'Searching…' : 'Loading…'} className="min-h-[40vh]" />
      ) : error && movies.length === 0 ? (
        <ErrorState message="Couldn’t load results." onRetry={loadMore} />
      ) : displayed.length === 0 && !hasMore ? (
        <p className="py-16 text-center text-muted">
          {hasQuery ? `No movies found for “${query}”.` : 'No movies available right now.'}
        </p>
      ) : (
        <>
          {displayed.length === 0 && (
            <p className="py-4 text-center text-muted">
              No matches yet — load more to keep looking.
            </p>
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
