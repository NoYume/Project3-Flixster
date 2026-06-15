import { useState, useEffect, useCallback, useRef } from 'react'

const PAGE_SIZE = 10 // movies revealed per "Load More" (CLAUDE.md §6.4)

/**
 * Buffers a TMDB paginated fetcher and reveals movies PAGE_SIZE (10) at a time.
 * TMDB returns ~20 results per page, so we fetch on demand and reveal in
 * 10-movie chunks. De-dupes by id (TMDB can repeat across pages).
 *
 * @param fetchPage async (page:number) => { results, totalPages }
 * @param deps      re-initialize when these change (e.g. the search query)
 * @param enabled   skip fetching when false (e.g. empty query)
 */
export function usePaginatedMovies(fetchPage, deps = [], enabled = true) {
  const [buffer, setBuffer] = useState([]) // all fetched (de-duped) movies
  const [visible, setVisible] = useState(0) // how many we currently show
  const [tmdbPage, setTmdbPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false) // initial / page fetch
  const [error, setError] = useState(false)

  const fetchRef = useRef(fetchPage)
  fetchRef.current = fetchPage
  const seenIds = useRef(new Set())

  // Each run owns its own `seen` Set and a cancellation token, so a stale
  // fetch (e.g. StrictMode's discarded first mount) can't pollute the live
  // buffer or steal ids from the surviving run.
  const fetchInto = useCallback(async (page, seen, isCancelled = () => false) => {
    const { results, totalPages: tp } = await fetchRef.current(page)
    if (isCancelled()) return 0
    setTotalPages(tp || 1)
    const fresh = results.filter((m) => {
      if (seen.has(m.id)) return false
      seen.add(m.id)
      return true
    })
    setBuffer((prev) => [...prev, ...fresh])
    return fresh.length
  }, [])

  useEffect(() => {
    if (!enabled) {
      setBuffer([])
      setVisible(0)
      setError(false)
      return
    }
    let cancelled = false
    const seen = new Set() // this run's dedup set (see fetchInto)
    seenIds.current = seen // keep ref in sync for loadMore
    setBuffer([])
    setVisible(0)
    setTmdbPage(1)
    setLoading(true)
    setError(false)

    fetchInto(1, seen, () => cancelled)
      .then((count) => {
        if (!cancelled) setVisible(Math.min(PAGE_SIZE, count))
      })
      .catch(() => !cancelled && setError(true))
      .finally(() => !cancelled && setLoading(false))

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  const loadMore = useCallback(async () => {
    setError(false)
    // If the buffer already has more than what's visible, just reveal more.
    if (visible < buffer.length) {
      setVisible((v) => Math.min(v + PAGE_SIZE, buffer.length))
      // Top up the buffer in the background if it's getting thin.
      if (buffer.length - visible <= PAGE_SIZE && tmdbPage < totalPages) {
        const next = tmdbPage + 1
        setTmdbPage(next)
        fetchInto(next, seenIds.current).catch(() => {})
      }
      return
    }
    // Otherwise fetch the next TMDB page, then reveal.
    if (tmdbPage >= totalPages) return
    const next = tmdbPage + 1
    setLoading(true)
    try {
      const added = await fetchInto(next, seenIds.current)
      setTmdbPage(next)
      setVisible((v) => v + Math.min(PAGE_SIZE, added))
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [visible, buffer.length, tmdbPage, totalPages, fetchInto])

  const movies = buffer.slice(0, visible)
  const hasMore = visible < buffer.length || tmdbPage < totalPages

  return { movies, loading, error, hasMore, loadMore }
}
