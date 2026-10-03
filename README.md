# FlowingDaFilms

A real movie website powered by [The Movie Database (TMDB)](https://www.themoviedb.org/), built with only three files — `index.html`, `style.css` and `script.js`. No frameworks, no build step.

## Setup: add your TMDB API key

1. Create a free account at [themoviedb.org](https://www.themoviedb.org/signup).
2. Go to **Settings → API** and request a key (choose "Developer").
3. Give the site the key in **one** of two ways:
   - **Settings page (easiest):** open the site, paste the key at `#/settings` and click *Save & connect*. It is stored only in your browser.
   - **For all visitors:** put it in `TMDB_API_KEY` at the top of `script.js`. Note this makes the key public once deployed (TMDB keys are free and read-only).

Both the **API Key** (v3) and the **API Read Access Token** (v4, starts with `eyJ`) work.

## Run it

Open `index.html` in a browser, or serve the folder (`python3 -m http.server`) / deploy to GitHub Pages.

## Features

- **Home** — trending hero carousel; Trending, In Theaters, Popular, Top Rated and Coming Soon rows; Recently Viewed
- **Browse** — every movie on TMDB: filter by genre, decade and minimum rating, sort by popularity / rating / newest / box office / title, load more
- **Search** — live suggestions for movies *and* people (keyboard navigable, `/` to focus) plus full results
- **Movie page** — real posters and backdrops, in-page trailer player, cast, director, budget and box office, age rating, **where to watch** (streaming/rent/buy for your region), TMDB reviews, recommendations
- **Person page** — photo, biography and filmography
- **Watchlist** — "To Watch" and "Watched" tabs, personal 1–5 star ratings and your own reviews
- Light/dark theme, responsive mobile layout, shareable URLs

Watchlist, ratings, reviews, theme and a saved key live in the browser's `localStorage`.

---

This product uses the TMDB API but is not endorsed or certified by TMDB. Streaming availability data is provided by JustWatch.
