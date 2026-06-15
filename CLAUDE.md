# LittleFilm — Development Spec

> This file is the source of truth for agents and developers working in this repo.
> Build **LittleFilm**, a Netflix-style movie browser with a **Shanghai-night-city** visual
> theme. The minimum required features are defined in [project_req.md](project_req.md) and
> **must** all be implemented. Every stretch feature **except Render deployment** is also in
> scope (see [Requirement Traceability](#11-requirement-traceability)).

---

## 1. Project Overview

LittleFilm lets users browse, search, favorite, and get AI-powered watch recommendations for
movies. Data comes from TMDB; recommendations come from OpenRouter. The look is a moody
Shanghai-at-night aesthetic: deep charcoal and slate grays with a warm amber-gold glow (sampled
from the golden tower lights of the background photo) and a steel-blue secondary accent, layered
glassmorphism, and smooth spring motion.

---

## 2. Tech Stack

- **Framework:** React 18 + Vite
- **Package manager:** Bun
- **Styling:** Tailwind CSS (with custom Shanghai-night theme tokens)
- **Routing:** React Router
- **Carousel:** Swiper (cover-flow effect)
- **Animation:** Framer Motion (transitions, modal, AI typing/loading)
- **Movie data / imagery / trailers:** TMDB API
- **AI watch recommendations:** OpenRouter API

**Commands**

```bash
bun install        # install dependencies
bun run dev        # start the Vite dev server
bun run build      # production build
bun run lint       # eslint
```

When adding the new dependencies: `bun add react-router-dom swiper framer-motion` and
`bun add -d tailwindcss postcss autoprefixer`.

---

## 3. Environment Setup

Vite only exposes env vars prefixed with `VITE_`. Required `.env` variables:

```
VITE_TMDB_API_KEY=<your TMDB key>
VITE_OPENROUTER_API_KEY=<your OpenRouter key>
```

---

## 4. Design System — "Shanghai Night"

This replaces any prior design language. The app should feel like the warm Shanghai skyline at
night: deep charcoal, glassy, with golden tower-light glows.

### Background

- Use `src/assets/background-2.jpg` as a **fixed, full-viewport app backdrop**, darkened with a
  gradient/overlay scrim (e.g. `rgba(17,19,21,0.55)`) so foreground content stays legible.

### Palette (define as Tailwind theme tokens + CSS variables)

- **Bases:** `#111315` (app background), `#1f2226` (panels), slate grays `#262a2f`–`#333a42`.
- **Accents (sampled from the warm skyline photo):**
  - Golden amber — `#e68a2e` / `#f2c479` (primary accent, CTAs, active states, Favorite)
  - Steel-blue — `#7c94ac` / `#41566c` (secondary accent: Watched, links, filter highlights)
  - Star gold — `#e6a33c` (rating stars)
- **Text:** off-white `#f5f5f5`, muted gray `#9ba0a6`.

### Materials & motion

- **Glassmorphism:** the top nav and the Universal Modal use `backdrop-filter: blur(20px)` over
  a translucent dark panel (e.g. `background: rgba(31,34,38,0.6)`). No flat opaque overlays.
- **Squircle radii**, soft diffused shadows (avoid harsh boxes), subtle **warm amber glow** on
  active/hover (`box-shadow` in the accent color).
- **8pt grid** for spacing (8 / 16 / 24 / 32 / 48).
- **Spring transitions** via Framer Motion (custom `cubic-bezier`, not linear). Cards scale up
  slightly on hover (`scale: 1.03`) and scale down on press.

---

## 5. Routing & Pages (React Router)

| Path         | Page           |
| ------------ | -------------- |
| `/`          | Home           |
| `/movies`    | Movies         |
| `/favorites` | My Favorites   |
| `/search`    | Search Results |

The Universal Movie Modal is route-independent (rendered as an overlay from any page).

---

## 6. Core Features & Workflows

Each item is tagged **[REQUIRED]** (a project_req.md minimum) or **[STRETCH]**.

### 6.1 Global Top Navigation Bar — [REQUIRED]

- Items, left→right: **Home**, **Movies**, **My Favorites**, **Search** (icon), **Profile** icon.
- Fixed at top, glassmorphic blur. Active route gets a neon-accent underline/glow.
- A **Filter** control sits at the **top-right** on pages that list movies (Movies, Search,
  Favorites), matching the site theme.

### 6.2 Footer — [REQUIRED]

- Present site-wide (app shell), themed to match.

### 6.3 Home Page — [REQUIRED]

- On every load, pick a **random movie from the TMDB Popular list** as the hero.
- Layout mirrors the Stranger-Things reference: large immersive backdrop image, **text overlay
  on the left** (title + short overview), with two buttons: **[Play]** and **[More Info]**.
- **[More Info]** opens the Universal Movie Modal for that movie.

### 6.4 Movies Page — [REQUIRED core + carousel presentation]

- A centered **cover-flow carousel** (Swiper) of movie posters.
- **Focus detail area** directly below the centered/in-focus card displays:
  - Movie **name**, **star rating**, **genres**, **directors**, **key actors**,
    **short description**, plus **[Play]** and **[Favorite]** (heart) buttons.
- **Pagination:** preload **10 movies** initially. A **"Load More"** trigger at the end of the
  carousel fetches and **appends the next 10**, repeatable infinitely (TMDB paginated calls).
- **Filter control (top-right)** sorts/filters by: **Popularity**, **Release date**, **Rating**,
  **Genre** (selected general genres), and **Title** (alphabetical A–Z).
  - _Note:_ this satisfies the required sort-by (title / release date / vote average) and the
    Load More requirement; the carousel is the richer presentation of the required movie list.

### 6.5 Universal Movie Modal

Triggered by clicking a movie **cover image** or a **More Info** button. Centered glassmorphic
overlay with a darkened backdrop; closes on backdrop click / Esc.

- **Top — Embedded Trailer** _[STRETCH]_: fetch the official trailer via the TMDB videos
  endpoint and embed (YouTube iframe by video key).
- **Details** _[REQUIRED]_: backdrop image, title, runtime, release date, genres, overview,
  plus cast & crew.
- **AI Watch Recommendation** _[REQUIRED]_: rendered in its **own isolated panel** with an
  **animated typing** effect for the result and a **loading animation** while generating. See
  §7 for the prompt spec and failure behavior.
- **Actions:** **[Play Movie]** and **[Favorite Movie]** buttons.

### 6.6 My Favorites Page — [STRETCH]

- Reuses the **same carousel + focus-detail component** as the Movies page, populated
  **only** from the user's favorited movies.

### 6.7 Favorites & Watched — [STRETCH]

- **Favorite (heart):** toggle from the focus area and modal; favorited movies are visually
  distinguished and drive the My Favorites page.
- **Watched checkbox:** users can mark movies watched; watched movies are visually distinguished.
- Persist both in **localStorage** (survives reload).
- **Sidebar / filter panel** lets users filter the list by **favorited** and/or **watched**.

### 6.8 Search Experience — [REQUIRED]

- The nav **Search icon expands** into a typeable search bar.
- As the user types, show a **quick-preview dropdown** of matching movies (poster + title) using
  the TMDB search endpoint (debounced).
- On **Enter**, navigate to the dedicated **Search Results** page (`/search?q=…`).
- The results page has the **Filter** control (top-right) and supports clearing the query to
  return to the default Now Playing / Popular list.

### 6.9 Loading & Error States — [REQUIRED]

- Every fetch (TMDB and OpenRouter) shows a **loading animation**.
- Failed API calls show a **friendly, themed message** — never a broken UI.

---

## 7. AI Watch Recommendation — Prompt Spec

Implemented in the modal's isolated AI panel; uses OpenRouter.

- **Role:** an enthusiastic but honest film critic.
- **Task:** write a 2–3 sentence watch recommendation.
- **Inputs (movie context sent):** title, genres (comma-separated list), overview; include
  rating and release year when available.
- **Output format:** plain text, 2–3 sentences, **no spoilers**, **no "I" statements**.
- **Constraints:** no plot spoilers; no comparisons to other films unless genuinely helpful;
  avoid generic phrases like "this film is a must-see".
- **Failure behavior:** on any AI error, show a friendly fallback —
  _"We couldn't generate a recommendation for this one — check out the overview above!"_
- **Endpoint / model:** OpenRouter chat-completions endpoint; model is configurable (default to
  a current, capable, low-latency chat model). Authenticate with `VITE_OPENROUTER_API_KEY`.
- **State:** hold the response in component state — `aiRec` (string), `aiLoading` (bool),
  `aiError` (bool). Display `aiRec` with the typing animation; show the loader while `aiLoading`;
  show the fallback when `aiError`.
- **Documentation:** keep a decisions log in `planning.md` (what the AI generated, what was
  changed, what was learned), per project_req.md.

---

## 8. TMDB API Contracts

Image base: `https://image.tmdb.org/t/p/<size>` (e.g. `w500` posters, `original`/`w1280`
backdrops). Auth via API key.

| Purpose                           | Endpoint                                                 | Key fields used                                                                        |
| --------------------------------- | -------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Now Playing (default list)        | `GET /movie/now_playing`                                 | `id, title, poster_path, vote_average, release_date`                                   |
| Popular (Home hero + Movies feed) | `GET /movie/popular` (`page`)                            | `id, title, backdrop_path, poster_path, overview, vote_average`                        |
| Search                            | `GET /search/movie` (`query`, `page`)                    | `id, title, poster_path, vote_average, release_date`                                   |
| Movie Details                     | `GET /movie/{id}` (`append_to_response=credits,videos`)  | `runtime, genres[], overview, release_date, credits.cast[], credits.crew[] (Director)` |
| Trailer                           | `GET /movie/{id}/videos` (or appended)                   | `results[].key` where `site=YouTube, type=Trailer`                                     |
| Genre list (filter)               | `GET /genre/movie/list`                                  | `genres[].{id,name}`                                                                   |
| Discover (genre/sort filters)     | `GET /discover/movie` (`with_genres`, `sort_by`, `page`) | list fields as above                                                                   |

**Error cases to handle:** non-OK HTTP status, network failure, empty `results`, missing
`poster_path`/`backdrop_path` (use a placeholder), no trailer available.

---

## 9. Suggested Component Architecture

```
App (router + app shell: background, Nav, Footer, Modal portal)
├── Nav                  — top bar; nav links, ExpandingSearchBar, Profile icon, FilterMenu slot
│   ├── ExpandingSearchBar → SearchPreviewDropdown
│   └── FilterMenu        — popularity / release date / rating / genre / Title A–Z
├── Footer
├── pages/
│   ├── Home              — random popular hero → HomeHero
│   ├── Movies            — MovieCarousel + LoadMoreButton + FilterMenu
│   ├── Favorites         — MovieCarousel fed from favorites store + Sidebar
│   └── SearchResults     — results grid/carousel + FilterMenu
├── HomeHero              — backdrop + left text overlay + [Play]/[More Info]
├── MovieCarousel (Swiper cover-flow)
│   ├── MovieCard         — poster; click → modal; favorite/watched badges
│   └── FocusDetailPanel  — name, rating, genres, directors, actors, desc, [Play]/[Favorite]
├── UniversalModal        — trailer + details + AIRecommendationPanel + actions
│   └── AIRecommendationPanel — isolated panel; typing + loading animations
├── Sidebar               — filter by favorited / watched
└── LoadMoreButton
```

**Services & state**

- `src/services/tmdb.js` — all TMDB fetches (typed helpers per endpoint above).
- `src/services/openrouter.js` — AI recommendation call + prompt assembly.
- `src/store/useFavorites.js` (or Context) — favorites + watched, persisted to localStorage.

This satisfies the `planning.md` requirement of ≥5 components (App, MovieList/Carousel,
MovieCard, SearchBar, MovieModal, Header/Nav, Footer, sort/Filter control).

---

## 10. Planning Documentation

Keep [planning.md](planning.md) updated per project_req.md. It must contain: Component
Architecture (≥5 components with responsibility/render/props), API Contracts (≥2 TMDB endpoints),
State Architecture (name, type, initial value, owner, update trigger), Data Flow, the AI feature
spec (mirror §7), and an AI decisions log.

---

## 11. Requirement Traceability

**Required (project_req.md) — all must ship:**

| Requirement                                                                 | Where           |
| --------------------------------------------------------------------------- | --------------- |
| Display movies (Now Playing) in list/cards w/ title, poster, vote avg       | §6.4 Movies, §8 |
| Search by title + return to default list                                    | §6.8            |
| Load More appends results                                                   | §6.4            |
| Detail **modal** (backdrop, title, runtime, release date, genres, overview) | §6.5            |
| Sort by title / release date / vote average                                 | §6.4 FilterMenu |
| Header **and** footer                                                       | §6.1, §6.2      |
| Graceful error handling                                                     | §6.9            |
| Loading states                                                              | §6.9            |
| planning.md spec (architecture, contracts, state, data flow)                | §10             |
| AI watch recommendation in modal (+ loading + fallback + decisions log)     | §6.5, §7, §10   |

**Stretch — in scope:**

| Stretch                                   | Where |
| ----------------------------------------- | ----- |
| Embedded trailers (TMDB videos)           | §6.5  |
| Favorite button (visually distinguished)  | §6.7  |
| Watched checkbox (visually distinguished) | §6.7  |
| Sidebar filter (favorited / watched)      | §6.7  |

> **Out of scope:** Render **deployment** is intentionally excluded.

---

## 12. Development Instructions

1. Install deps with Bun: `bun add react-router-dom swiper framer-motion` and
   `bun add -d tailwindcss postcss autoprefixer`; init Tailwind.
2. Configure Tailwind with the Shanghai-night tokens (§4) and wire `background.jpg` as the
   fixed app backdrop with a darkening scrim.
3. Set up React Router with the routes in §5 and the app shell (Nav + Footer + Modal portal).
4. Build the service layer: `tmdb.js` (§8) and `openrouter.js` (§7).
5. Build reusable components (§9): Nav/ExpandingSearchBar/FilterMenu, MovieCarousel/MovieCard/
   FocusDetailPanel, UniversalModal/AIRecommendationPanel, HomeHero, Sidebar, LoadMoreButton.
6. Wire pages: Home (random-popular hero), Movies (carousel + Load More + filter), Favorites,
   Search Results.
7. Implement favorites/watched persistence (localStorage) and the sidebar filter.
8. Add loading + error handling to every fetch (§6.9).
9. Keep `planning.md` updated as you go (§10).
