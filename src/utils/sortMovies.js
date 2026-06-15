// Shared client-side sort/filter applied over the accumulated movie list.
// Keeps Load-More results coherent across re-sorts (CLAUDE.md §6.4).

export const SORT_OPTIONS = [
  { value: 'popularity', label: 'Popularity' },
  { value: 'release', label: 'Release date' },
  { value: 'rating', label: 'Rating' },
  { value: 'title', label: 'Title (A–Z)' },
]

export function applyFilters(movies, { sort = 'popularity', genreId = null } = {}) {
  let list = [...movies]

  if (genreId) {
    const gid = Number(genreId)
    list = list.filter((m) => Array.isArray(m.genre_ids) && m.genre_ids.includes(gid))
  }

  switch (sort) {
    case 'title':
      list.sort((a, b) => (a.title || '').localeCompare(b.title || ''))
      break
    case 'release':
      list.sort((a, b) => (b.release_date || '').localeCompare(a.release_date || ''))
      break
    case 'rating':
      list.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0))
      break
    case 'popularity':
    default:
      list.sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
      break
  }

  return list
}
