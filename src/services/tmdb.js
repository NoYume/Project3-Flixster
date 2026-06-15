// TMDB service layer (CLAUDE.md §8). Auth via VITE_TMDB_API_KEY; helpers
// normalize failures into thrown Errors so callers can show friendly UI.

import axios from 'axios'

const API_BASE = 'https://api.themoviedb.org/3'
const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const IMG_BASE = 'https://image.tmdb.org/t/p'

// Inline SVG placeholders (no network) for missing artwork.
const POSTER_PLACEHOLDER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="750"><rect width="100%" height="100%" fill="#1f2226"/><text x="50%" y="50%" fill="#9ba0a6" font-family="sans-serif" font-size="28" text-anchor="middle" dominant-baseline="middle">No Poster</text></svg>`
  )
const BACKDROP_PLACEHOLDER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720"><rect width="100%" height="100%" fill="#1f2226"/><text x="50%" y="50%" fill="#9ba0a6" font-family="sans-serif" font-size="40" text-anchor="middle" dominant-baseline="middle">No Image</text></svg>`
  )

/** Build a TMDB image URL, falling back to a placeholder when the path is null. */
export function img(path, size = 'w500') {
  if (!path) return size.startsWith('w5') || size === 'w342' ? POSTER_PLACEHOLDER : BACKDROP_PLACEHOLDER
  return `${IMG_BASE}/${size}${path}`
}
export function posterUrl(path, size = 'w500') {
  return path ? `${IMG_BASE}/${size}${path}` : POSTER_PLACEHOLDER
}
export function backdropUrl(path, size = 'w1280') {
  return path ? `${IMG_BASE}/${size}${path}` : BACKDROP_PLACEHOLDER
}

const tmdb = axios.create({ baseURL: API_BASE })

async function tmdbFetch(path, params = {}) {
  if (!API_KEY) {
    throw new Error('Missing TMDB API key — set VITE_TMDB_API_KEY in your .env file.')
  }
  const clean = {}
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== '') clean[k] = v
  }

  try {
    const res = await tmdb.get(path, { params: { api_key: API_KEY, ...clean } })
    return res.data
  } catch (err) {
    if (err.response) {
      throw new Error(`TMDB request failed (${err.response.status}). Please try again.`)
    }
    throw new Error('Network error — please check your connection and try again.')
  }
}

// --- List endpoints -------------------------------------------------
export async function getNowPlaying(page = 1) {
  const data = await tmdbFetch('/movie/now_playing', { page })
  return { results: data.results ?? [], totalPages: data.total_pages ?? 1 }
}

export async function getPopular(page = 1) {
  const data = await tmdbFetch('/movie/popular', { page })
  return { results: data.results ?? [], totalPages: data.total_pages ?? 1 }
}

export async function searchMovies(query, page = 1) {
  if (!query || !query.trim()) return { results: [], totalPages: 0 }
  const data = await tmdbFetch('/search/movie', { query: query.trim(), page, include_adult: false })
  return { results: data.results ?? [], totalPages: data.total_pages ?? 1 }
}

export async function discoverMovies({ genreId, sortBy = 'popularity.desc', page = 1 } = {}) {
  const data = await tmdbFetch('/discover/movie', {
    with_genres: genreId,
    sort_by: sortBy,
    page,
    include_adult: false,
  })
  return { results: data.results ?? [], totalPages: data.total_pages ?? 1 }
}

// --- Movie details (cached) ----------------------------------------
// FocusDetailPanel and the modal both want full details for the same id,
// so memoize by id to avoid duplicate round-trips.
const detailsCache = new Map()

export async function getMovieDetails(id) {
  if (detailsCache.has(id)) return detailsCache.get(id)
  const data = await tmdbFetch(`/movie/${id}`, { append_to_response: 'credits,videos' })

  const directors = (data.credits?.crew ?? [])
    .filter((c) => c.job === 'Director')
    .map((c) => c.name)
  const cast = (data.credits?.cast ?? []).slice(0, 6).map((c) => c.name)

  const normalized = {
    id: data.id,
    title: data.title,
    overview: data.overview,
    runtime: data.runtime,
    releaseDate: data.release_date,
    voteAverage: data.vote_average,
    posterPath: data.poster_path,
    backdropPath: data.backdrop_path,
    genres: (data.genres ?? []).map((g) => g.name),
    genreIds: (data.genres ?? []).map((g) => g.id),
    directors,
    cast,
    trailerKey: trailerKey(data.videos?.results ?? []),
  }
  detailsCache.set(id, normalized)
  return normalized
}

/** Pick the best YouTube trailer key from a TMDB videos result array. */
export function trailerKey(videos = []) {
  const yt = videos.filter((v) => v.site === 'YouTube')
  const trailer =
    yt.find((v) => v.type === 'Trailer' && v.official) ||
    yt.find((v) => v.type === 'Trailer') ||
    yt.find((v) => v.type === 'Teaser') ||
    yt[0]
  return trailer?.key ?? null
}

// --- Genres (fetched once, cached) ---------------------------------
let genrePromise = null

/** Returns { map: {id: name}, list: [{id, name}] }. */
export async function getGenres() {
  if (!genrePromise) {
    genrePromise = tmdbFetch('/genre/movie/list')
      .then((data) => {
        const list = data.genres ?? []
        const map = Object.fromEntries(list.map((g) => [g.id, g.name]))
        return { map, list }
      })
      .catch((err) => {
        genrePromise = null // allow retry on next call
        throw err
      })
  }
  return genrePromise
}
