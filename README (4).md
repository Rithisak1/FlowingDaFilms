# FlowingDaFilms

A movie discovery website built with only three files — `index.html`, `style.css` and `script.js`. No frameworks, no build step, no API keys.

## Run it

Open `index.html` in a browser, or serve the folder (e.g. `python3 -m http.server`) / deploy it to GitHub Pages.

## Features

- **Home** — rotating featured hero, Trending / Top Rated / New Releases rows, Recently Viewed
- **Browse** — filter by genre, decade and minimum rating; sort by popularity, rating, year or title; load more
- **Search** — live suggestions with keyboard navigation (press `/` to focus); matches title, cast, director, genre, year
- **Movie page** — details, cast links, trailer (YouTube), share/copy link, 1–5 star rating, reviews, "More Like This"
- **Watchlist** — "To Watch" and "Watched" tabs with total runtime
- Light/dark theme, responsive mobile layout, shareable URLs (hash routing)

Watchlist, ratings, reviews and theme are saved in the browser's `localStorage`.

To add a movie, append an entry to the `MOVIES` array at the top of `script.js`.
