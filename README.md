## Unit Assignment: Flixster — **LittleFilm**

Submitted by: **Daniel Lam**

Estimated time spent: **16** hours spent in total

Deployed Application (optional): [Flixster Deployed Site](https://project3-flixster.onrender.com/)

### Application Features

#### REQUIRED FEATURES

- [x] **Display Movies**
  - [x] Users can view a list of current movies from The Movie Database API _(cover-flow carousel presentation)_.
    - [x] Movie tiles are reasonably sized and legible.
  - [x] For each movie displayed, users can see the movie's:
    - [x] Title
    - [x] Poster image
    - [x] Vote average _(star rating in the focus panel)_
  - [x] Users can load more current movies by clicking a "Load More" button which appends 10 more movies without reloading the page.
- [x] **Search Functionality**
  - [x] Users can use a search bar to search for movies by title.
  - [x] The search bar includes:
    - [x] Text input field
    - [x] Submit/Search button _(Enter key + "see all results")_
    - [x] Clear button
  - [x] Movies matching the query are displayed when the user:
    - [x] Presses the Enter key
    - [x] Triggers the search (live debounced preview dropdown)
  - [x] Users can clear the search. When cleared:
    - [x] The input is emptied
    - [x] Results clear and the default Now Playing list is shown
- [x] **Design Features**
  - [x] Website implements accessibility features:
    - [x] Semantic HTML _(header/nav/main/footer, aria labels, roles)_
    - [x] [Color contrast](https://webaim.org/resources/contrastchecker/) _(near-white text on dark scrim)_
    - [x] Alt text for images
  - [x] Website implements responsive web design.
    - [x] Uses CSS Flexbox / Grid
    - [x] Movie tiles and images shrink/grow with window size
  - [x] Users can click a movie cover to view details in a pop-up modal.
    - [x] The modal is centered and does not occupy the entire screen.
    - [x] The modal has a shadow and floats above a darkened backdrop.
    - [x] The backdrop dims the page behind the modal.
    - [x] The modal displays additional details including:
      - [x] Runtime in minutes
      - [x] Backdrop poster
      - [x] Release date
      - [x] Genres
      - [x] An overview
  - [x] Users can sort movies (Filter menu, top-right):
    - [x] Sort by:
      - [x] Title (alphabetic, A-Z)
      - [x] Release date (most recent → oldest)
      - [x] Vote average (highest → lowest)
      - [x] Popularity + Genre filter
    - [x] Selecting a sort re-orders the displayed movies.
  - [x] Website displays:
    - [x] Header section _(glass top nav)_
    - [x] Banner section _(Home hero)_
    - [x] Search bar
    - [x] Movie list _(cover-flow carousel)_
    - [x] Footer section
    - [x] **VIDEO WALKTHROUGH SPECIAL INSTRUCTIONS**: To ease the grading process, please use the [color contrast checker](https://webaim.org/resources/contrastchecker/) to demonstrate to the grading team that text and background colors on your website have appropriate contrast. The Contrast Ratio should be above 4.5:1 and should have a green box surrounding it.
- [x] **Planning Documentation**
  - [x] Repository includes a `planning.md` file with:
    - [x] A **Component Architecture** section listing at least 5 components, each with its responsibility, what it renders, and its props.
    - [x] An **API Contracts** section documenting at least 2 TMDb endpoints used, with URL, query parameters, and relevant response fields for each.
    - [x] A **State Architecture** section listing state variables with name, type, initial value, owner component, and what user action triggers an update.
    - [x] A **Data Flow** section explaining how data flows from the TMDb API response through the component hierarchy to the `MovieCard`, including transformations.
- [x] **AI Watch Recommendation**
  - [x] When a movie's detail modal is opened, an AI-generated watch recommendation is displayed alongside the movie details.
  - [x] A loading state is shown while the AI response is being generated, and a graceful fallback message is shown if the AI call fails.
  - [x] `planning.md` includes an **AI Feature Spec** documenting role, task, inputs, output format, constraints, and failure behavior for the AI call.
  - [x] **VIDEO WALKTHROUGH SPECIAL INSTRUCTIONS**: To ease the grading process, open your browser's DevTools **Network** tab, trigger the AI recommendation (open a movie modal), and show the outbound request going **directly to an AI API URL** (e.g., `openrouter.ai`) — not to a backend server URL. Graders need to see this call in the Network tab to award full credit.

#### STRETCH FEATURES

- [x] **Deployment**
  - [x] Website is deployed via Render.
  - [x] **VIDEO WALKTHROUGH SPECIAL INSTRUCTIONS**: For ease of grading, please use the deployed version of your website when creating your walkthrough.
- [x] **Embedded Movie Trailers**
  - [x] Within the pop-up modal, the movie trailer is embedded (TMDB videos endpoint → YouTube iframe).
    - [x] Users can play the trailer directly in the modal.
- [x] **Favorite Button**
  - [x] For each movie displayed, users can favorite the movie.
  - [x] A heart icon on each tile shows favorited state (also in focus panel + modal).
  - [x] Not favorited → clicking favorites it, heart fills/glows magenta.
  - [x] Already favorited → clicking unfavorites it, heart returns to outline.
  - [x] Persisted in `localStorage` (survives reload).
- [x] **Watched Checkbox**
  - [x] For each movie displayed, users can mark the movie as watched.
  - [x] An eye icon on each tile shows watched state.
  - [x] Not watched → clicking marks it watched, eye fills/glows cyan.
  - [x] Already watched → clicking unmarks it.
  - [x] Persisted in `localStorage`.
- [x] **Sidebar**
  - [x] The Favorites page includes a sidebar filter panel.
  - [x] Navigation (top nav): Home, Movies, My Favorites _(+ Search results page)_.
  - [x] Home shows the featured hero; Movies shows the full carousel + search + filter.
  - [x] My Favorites shows only favorited movies in the carousel.
  - [x] Sidebar narrows favorites to watched titles.

### Walkthrough Video

**Walkthrough video:** [Flixster Walkthrough](https://www.loom.com/share/7dfa2f5db46b4f1b960f1f6fb8b51d94)

### Reflection

- Did the topics discussed in your labs prepare you to complete the assignment? Be specific, which features in your weekly assignment did you feel unprepared to complete?

The topics over react, routing, and axios helped me learn how to config API calling in an easier way and also organize my web pages within the user experience and my codebase. I was unprepared on creating hooks and setting up the correct file formatting for the APIs, context management, and utils for sorting movies.

- If you had more time, what would you have done differently? Would you have added additional features? Changed the way your project responded to a particular event, etc.

If I had more time, I would have worked on the UI experience when navigating as the website to me feels a bit clunky at times. I would have added a login feature to save favorites and watched across different devices. I would also like to reformat the mobile viewing experience since it seems like a water-downed version of the desktop version.

- Reflect on your project demo, what went well? Were there things that maybe didn't go as planned? Did you notice something that your peer did that you would like to try next time?

I was able to demonstrate all my features during my demo but my speaking on my project could've been more clear and energetic. Things that didn't go as planned was my presentation flow, I got a little off tracked but managed to showoff everything I wanted to. I would have liked implementing a different mobile view in comparison to the desktop version like moving the buttons at the bottom of the phone screen.

### Open-source libraries used

- [React](https://react.dev/) + [Vite](https://vitejs.dev/) — UI framework & build tool
- [React Router](https://reactrouter.com/) — client-side routing
- [Tailwind CSS v4](https://tailwindcss.com/) — utility-first styling (Shanghai-night theme tokens)
- [Swiper](https://swiperjs.com/) — cover-flow carousel
- [Framer Motion](https://www.framer.com/motion/) — animations (modal, typing, spring transitions)
- [TMDB API](https://developer.themoviedb.org/) — movie data, imagery, trailers
- [OpenRouter API](https://openrouter.ai/) — AI watch recommendations

### Shout out

Give a shout out to somebody from your cohort that especially helped you during your project. This can be a fellow peer, instructor, TA, mentor, etc.

- Devarsh
- Enes
- Della
