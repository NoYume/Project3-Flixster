# LittleFilm Planning Document

LittleFilm is a movie browsing app with a Shanghai at night look. People can browse popular movies, search for a title, save favorites, mark movies they have watched, and read a short recommendation written for them by AI. The mood is dark and warm, with golden city light glows and a soft glassy feel.

## 1. Component Architecture

This is the list of parts that make up the app, what each one does, what it shows, and whether it keeps track of anything on its own.

**App frame.** The outer shell that holds everything together. It sets the background, the top bar, the footer, and the popup layer, and it decides which screen shows based on the page you are on.

**Top bar.** Stays fixed at the top with a glassy blur. It holds the LittleFilm name, links to Home, Movies, and My Favorites, a search icon, and a profile icon. The link for the page you are on gets a warm glowing underline.

**Search box.** Starts as a small search icon. When you tap it, it slides open into a text field. As you type, it quietly looks up matches and shows a small preview list. Pressing enter takes you to the full search results page. It remembers what you typed, whether it is open, and the matches it found.

**Search preview list.** The little drop down under the search box. It shows a poster and title for the top few matches, plus a link to see all results. Tapping one opens that movie.

**Filter menu.** Sits in the top right of the movie pages. It lets you sort by popularity, release date, rating, or title from A to Z, and narrow the list down to a single genre. It remembers whether it is open and the genre choices it has loaded.

**Home featured area.** The big image at the top of the Home screen. It shows one movie filling the space with its title and a short description on the left, plus a Play button and a More Info button.

**Movie carousel.** The centered, spinning row of movie posters that you swipe through. The poster in the middle is the one in focus. At the end of the row there is a button to load more movies.

**Movie poster card.** A single movie poster. Tapping it opens the full details popup. In the corner it has a heart to favorite the movie and an eye to mark it as watched, and a favorited movie gets a small tag.

**Focus detail area.** The panel right under the centered poster. It shows the movie name, a star rating, the genres, the director, the main actors, a short description, and Play and Favorite buttons.

**Movie details popup.** The window that opens when you pick a movie. At the top it plays the trailer or shows a large image. Below that are the full details, then the AI recommendation, and finally Play and Favorite buttons. It closes when you tap outside it or press escape.

**AI recommendation area.** A panel of its own inside the popup. It shows a short suggestion about whether the movie is worth watching. While the suggestion is being created, a set of bouncing dots shows. Then the text types itself out one letter at a time.

**Star rating.** Turns a movie score into a row of five stars plus the number, so the rating is easy to read at a glance.

**Favorites sidebar.** On the My Favorites screen, this lets you narrow the list to favorited movies, watched movies, or both, and shows a count for each.

**Load more button.** Brings in the next set of movies and adds them to the end of the row.

**Loading and error displays.** A friendly set of bouncing dots shows whenever something is loading. If something fails, a calm and themed message shows instead of a broken screen.

**Footer.** Sits at the bottom on every screen. It credits the movie data and AI sources and shows the app name.

### Parent and child layout

The App frame holds the top bar, the current screen, the footer, and the popup. The top bar holds the search box, which holds the search preview list. The Home screen holds the featured area. The Movies, My Favorites, and Search Results screens each hold the filter menu, the movie carousel, and the focus detail area, and My Favorites also holds the sidebar. The popup holds the AI recommendation area and the star rating.

## 2. API Contracts

This is where the app gets its information and what the person sees if a request does not work. All of the movie content comes from The Movie Database, and the recommendations come from an AI service called OpenRouter.

**Popular movies.** Used for the featured movie on Home and the main row on the Movies screen. It brings back a page of well known movies with their posters, background images, titles, short descriptions, scores, and release dates.

**Search.** Used when someone types a title. It brings back movies that match the words, with the same poster, title, score, and release date details. An empty search simply returns nothing.

**Movie details.** Used when a movie popup opens. It brings back the deeper information the list does not have, like how long the movie runs, its genres, the cast and director, and a trailer to play. This is saved after the first look, so reopening the same movie is instant.

**Genre list.** A simple list of genre names used to fill the filter menu. It is loaded once and kept.

**AI recommendation.** Sends a few details about the movie to the AI service and gets back a short written suggestion.

**When something goes wrong.** If a request fails, times out, or comes back empty, the person sees a friendly message and a way to try again, never a broken screen. If a poster or background image is missing, a simple placeholder takes its place. If a movie has no trailer, the large image shows instead.

## 3. State Architecture

These are the things the app keeps track of as you use it, and what makes each one change.

**The movies being shown.** Starts empty and fills in when the screen loads. It grows each time you load more.

**What you searched for.** Starts empty and updates as you type, then shapes the search results.

**How many movies are loaded.** Starts at the first set and goes up each time you load more.

**The movie open in the popup.** Starts as nothing. It is set when you tap a poster, the More Info button, or Play, and clears when you close the popup.

**The sort and filter choice.** Starts on popularity with no genre. It changes when you pick something in the filter menu.

**The movie in focus.** The poster centered in the carousel. It changes as you swipe.

**The featured movie on Home.** Picked at random from popular movies each time the Home screen loads.

**Favorites and watched lists.** The movies you have hearted and the ones you have marked as watched. They are saved on your device, so they are still there after you close the app. They change when you tap the heart or the eye.

**Loading and error markers.** Simple on or off flags that track whether something is loading or has failed, so the right message can show.

**The AI recommendation.** The suggestion text, whether it is still being written, whether it failed, and how much of it has typed out so far.

**The saved movie details.** The deeper information for the movie in focus or open in the popup, loaded when that movie changes.

## 4. Data Flow

Movie information starts at The Movie Database and comes into the app in small batches. The app keeps a running list, removes any repeats, and shows ten movies at a time, adding ten more each time you load more. Before the movies appear, the chosen sort and genre are applied so the list matches what you picked. Each movie becomes a poster card in the carousel, and a missing poster is swapped for a placeholder. When you tap a card, the app remembers that movie and opens the popup, then fills in the deeper details by looking up that one movie. The poster centered in the carousel also feeds the detail panel below it. Favorites and watched movies are kept in one shared place and saved on your device, so the cards, the detail panel, the popup, and the My Favorites screen all stay in sync.

## 5. AI Feature Spec

**Where it shows.** Inside the movie details popup, in its own panel.

**Its personality.** An enthusiastic but honest film reviewer.

**What it does.** Writes a short recommendation of two to three sentences about whether the movie is worth watching.

**What it is told about the movie.** The title, the genres, the short description, and the rating and release year when those are known.

**What it gives back.** Plain text, two to three sentences, with no spoilers and no first person wording.

**What it avoids.** No giving away the plot, no comparing to other movies unless it truly helps, and no tired phrases like calling something a must see.

**While it loads.** A set of bouncing dots shows, then the recommendation types itself out one letter at a time.

**If it fails.** A friendly backup message shows instead: We couldn't generate a recommendation for this one, check out the overview above.

## 6. AI Decisions Log

**The model we chose.** We picked a free AI option so it costs nothing to use. It quietly passes the request to whichever free model is open at the time, which means the writing can vary a little from one movie to the next.

**The problem we found.** At first the recommendations often came back blank. The model was spending all of its effort thinking behind the scenes and ran out of room before writing anything we could show.

**The fix.** We gave it more room to write and told it to skip showing its private thinking. After that, the recommendations came back as clean two to three sentence notes across the different free models.

**Tuning the wording.** We kept the personality and rules apart from the movie details, and added a clear instruction to write the recommendation now so the model stops repeating the description back. The rating and year are only included when we actually have them, so older or unrated titles do not show a zero or a blank.

**What we learned.** Free AI models are unpredictable in both which one answers and how it writes, so giving it enough room, turning off the visible thinking, and keeping clear rules all matter. The friendly backup message is the safety net for the times it still comes back empty.
