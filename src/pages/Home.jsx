import { useState, useEffect } from 'react'
import { getPopular } from '../services/tmdb.js'
import HomeHero from '../components/HomeHero.jsx'
import Loader from '../components/Loader.jsx'
import ErrorState from '../components/ErrorState.jsx'

// Home (CLAUDE.md §6.3): a random movie from the TMDB Popular list as the
// hero on every load.
export default function Home() {
  const [hero, setHero] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const load = () => {
    setLoading(true)
    setError(false)
    getPopular(1)
      .then(({ results }) => {
        if (!results.length) throw new Error('No movies returned.')
        // Prefer entries that have a backdrop so the hero looks good.
        const withBackdrop = results.filter((m) => m.backdrop_path)
        const pool = withBackdrop.length ? withBackdrop : results
        setHero(pool[Math.floor(Math.random() * pool.length)])
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  if (loading) return <Loader label="Loading featured movie…" className="min-h-[70vh]" />
  if (error)
    return (
      <div className="pt-24">
        <ErrorState message="Couldn’t load the featured movie." onRetry={load} />
      </div>
    )

  return <HomeHero movie={hero} />
}
