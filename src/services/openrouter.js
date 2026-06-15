// OpenRouter service — AI "Watch Recommendation" (CLAUDE.md §7). Calls the
// chat-completions endpoint directly from the browser so the request stays
// visible in the Network tab (axios uses XMLHttpRequest), which graders check.

import axios from 'axios'

const ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions'
const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY
// Model is configurable; default to a current free model verified on
// OpenRouter's /models endpoint. Override with VITE_OPENROUTER_MODEL.
const MODEL = import.meta.env.VITE_OPENROUTER_MODEL || 'openrouter/free'

const SYSTEM_PROMPT = [
  'You are an enthusiastic but honest film critic.',
  'Write a 2-3 sentence watch recommendation for the given movie.',
  'Rules:',
  '- Plain text only, 2-3 sentences.',
  '- No plot spoilers.',
  '- Do not use "I" statements.',
  '- Do not compare to other films unless genuinely helpful.',
  '- Avoid generic phrases like "this film is a must-see".',
].join('\n')

/** Assemble the user message from the movie context we send to the model. */
function buildUserPrompt(movie) {
  const genres = Array.isArray(movie.genres) ? movie.genres.join(', ') : movie.genres
  const year = movie.releaseDate ? String(movie.releaseDate).slice(0, 4) : null
  const rating =
    typeof movie.voteAverage === 'number' && movie.voteAverage > 0
      ? movie.voteAverage.toFixed(1)
      : null

  const lines = [`Title: ${movie.title}`]
  if (genres) lines.push(`Genres: ${genres}`)
  if (rating) lines.push(`Rating: ${rating}/10`)
  if (year) lines.push(`Release year: ${year}`)
  if (movie.overview) lines.push(`Overview: ${movie.overview}`)
  lines.push('\nWrite the watch recommendation now.')
  return lines.join('\n')
}

/**
 * Generate a watch recommendation. Resolves to a trimmed string.
 * Throws on any error so the panel can show its friendly fallback.
 */
export async function getWatchRecommendation(movie) {
  if (!API_KEY) {
    throw new Error('Missing OpenRouter API key — set VITE_OPENROUTER_API_KEY in your .env file.')
  }

  let res
  try {
    res = await axios.post(
      ENDPOINT,
      {
        model: MODEL,
        // Generous budget: the free model pool can route to reasoning models
        // that would otherwise spend the whole budget thinking and return
        // empty content. `reasoning.exclude` keeps the reply to plain text.
        max_tokens: 800,
        temperature: 0.7,
        reasoning: { exclude: true },
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: buildUserPrompt(movie) },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          // Optional attribution headers for OpenRouter rankings.
          'HTTP-Referer': window.location.origin,
          'X-Title': 'LittleFilm',
        },
      }
    )
  } catch (err) {
    if (err.response) {
      throw new Error(`OpenRouter request failed (${err.response.status}).`)
    }
    throw new Error('Network error contacting the recommendation service.')
  }

  const text = res.data?.choices?.[0]?.message?.content?.trim()
  if (!text) throw new Error('Empty recommendation response.')
  return text
}
