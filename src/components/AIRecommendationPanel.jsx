import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { getWatchRecommendation } from '../services/openrouter.js'

const FALLBACK =
  "We couldn't generate a recommendation for this one — check out the overview above!"

// Isolated AI "Watch Recommendation" panel (CLAUDE.md §6.5 / §7): shows a
// loader while generating, then types the result out one character at a time.
export default function AIRecommendationPanel({ movie }) {
  const [aiRec, setAiRec] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState(false)
  const [typed, setTyped] = useState('')

  useEffect(() => {
    if (!movie) return
    let cancelled = false
    setAiLoading(true)
    setAiError(false)
    setAiRec('')
    setTyped('')

    getWatchRecommendation({
      title: movie.title,
      genres: movie.genres,
      overview: movie.overview,
      voteAverage: movie.voteAverage,
      releaseDate: movie.releaseDate,
    })
      .then((text) => {
        if (!cancelled) setAiRec(text)
      })
      .catch(() => {
        if (!cancelled) setAiError(true)
      })
      .finally(() => {
        if (!cancelled) setAiLoading(false)
      })

    return () => {
      cancelled = true
    }
    // Key on the movie id only: the panel mounts after details load, so the
    // context fields are stable, and this keeps the fetch from re-firing when
    // the modal re-renders (e.g. favoriting from inside it).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movie?.id])

  const intervalRef = useRef(null)
  useEffect(() => {
    if (!aiRec) return
    setTyped('')
    let i = 0
    intervalRef.current = setInterval(() => {
      i += 1
      setTyped(aiRec.slice(0, i))
      if (i >= aiRec.length) clearInterval(intervalRef.current)
    }, 18)
    return () => clearInterval(intervalRef.current)
  }, [aiRec])

  const isTyping = aiRec && typed.length < aiRec.length

  return (
    <div
      className="rounded-squircle p-4"
      style={{
        background: 'linear-gradient(135deg, rgba(230,138,46,0.16), rgba(65,86,108,0.18))',
        border: '1px solid rgba(242,196,121,0.3)',
      }}
    >
      <div className="mb-2 flex items-center gap-2">
        <span className="text-base">✨</span>
        <h4 className="text-sm font-bold uppercase tracking-wide text-accent-bright">
          AI Watch Recommendation
        </h4>
      </div>

      {aiLoading && (
        <div className="flex items-center gap-2 py-2" role="status" aria-live="polite">
          <span className="loader-dot h-2.5 w-2.5 rounded-full bg-accent-bright" style={{ animationDelay: '0s' }} />
          <span className="loader-dot h-2.5 w-2.5 rounded-full bg-steel" style={{ animationDelay: '0.15s' }} />
          <span className="loader-dot h-2.5 w-2.5 rounded-full bg-amber" style={{ animationDelay: '0.3s' }} />
          <span className="ml-1 text-sm text-muted">Generating recommendation…</span>
        </div>
      )}

      {!aiLoading && aiError && (
        <p className="text-sm leading-relaxed text-ink/85">{FALLBACK}</p>
      )}

      {!aiLoading && !aiError && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`text-sm leading-relaxed text-ink/90 ${isTyping ? 'typing-caret' : ''}`}
          aria-live="polite"
        >
          {typed}
        </motion.p>
      )}
    </div>
  )
}
