"use strict";

/* =========================================================
   Movie data
   ========================================================= */
const MOVIES = [
  { id: "inception", title: "Inception", year: 2010, genres: ["Sci-Fi", "Action", "Thriller"], rating: 8.8, runtime: 148, popularity: 97, director: "Christopher Nolan", cast: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Elliot Page", "Tom Hardy"], language: "English", icon: "🌀", colors: ["#1e3c72", "#2a5298"], overview: "A thief who steals secrets by entering people's dreams is offered a chance at redemption: plant an idea in a target's mind instead of stealing one." },
  { id: "the-dark-knight", title: "The Dark Knight", year: 2008, genres: ["Action", "Crime", "Drama"], rating: 9.0, runtime: 152, popularity: 96, director: "Christopher Nolan", cast: ["Christian Bale", "Heath Ledger", "Aaron Eckhart", "Gary Oldman"], language: "English", icon: "🦇", colors: ["#141e30", "#243b55"], overview: "Batman, Commissioner Gordon and a new district attorney team up to dismantle organized crime in Gotham, until a chaotic criminal called the Joker pushes the city to the brink." },
  { id: "interstellar", title: "Interstellar", year: 2014, genres: ["Sci-Fi", "Adventure", "Drama"], rating: 8.7, runtime: 169, popularity: 95, director: "Christopher Nolan", cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain", "Michael Caine"], language: "English", icon: "🪐", colors: ["#0f2027", "#2c5364"], overview: "With Earth's crops failing, a former pilot joins a mission through a wormhole to find humanity a new home, knowing time will pass differently for the family he leaves behind." },
  { id: "parasite", title: "Parasite", year: 2019, genres: ["Thriller", "Drama", "Comedy"], rating: 8.5, runtime: 132, popularity: 90, director: "Bong Joon-ho", cast: ["Song Kang-ho", "Choi Woo-shik", "Park So-dam", "Cho Yeo-jeong"], language: "Korean", icon: "🪨", colors: ["#3a6073", "#16222a"], overview: "A struggling family schemes its way into jobs with a wealthy household, but their carefully built arrangement unravels in unexpected and violent ways." },
  { id: "spirited-away", title: "Spirited Away", year: 2001, genres: ["Animation", "Fantasy", "Adventure"], rating: 8.6, runtime: 125, popularity: 88, director: "Hayao Miyazaki", cast: ["Rumi Hiiragi", "Miyu Irino", "Mari Natsuki"], language: "Japanese", icon: "🐉", colors: ["#c94b4b", "#4b134f"], overview: "A young girl wanders into a world of spirits and must work in a bathhouse run by a witch to free her parents, who have been turned into pigs." },
  { id: "the-godfather", title: "The Godfather", year: 1972, genres: ["Crime", "Drama"], rating: 9.2, runtime: 175, popularity: 92, director: "Francis Ford Coppola", cast: ["Marlon Brando", "Al Pacino", "James Caan", "Diane Keaton"], language: "English", icon: "🌹", colors: ["#3e2723", "#0b0b0b"], overview: "The aging head of a crime family hands control of his empire to his reluctant youngest son, who is gradually drawn into the family business." },
  { id: "pulp-fiction", title: "Pulp Fiction", year: 1994, genres: ["Crime", "Drama"], rating: 8.9, runtime: 154, popularity: 89, director: "Quentin Tarantino", cast: ["John Travolta", "Samuel L. Jackson", "Uma Thurman", "Bruce Willis"], language: "English", icon: "💼", colors: ["#f7971e", "#8e0e00"], overview: "Several interlocking stories of Los Angeles criminals, a boxer and a mysterious briefcase unfold out of order across a few eventful days." },
  { id: "the-matrix", title: "The Matrix", year: 1999, genres: ["Sci-Fi", "Action"], rating: 8.7, runtime: 136, popularity: 91, director: "The Wachowskis", cast: ["Keanu Reeves", "Laurence Fishburne", "Carrie-Anne Moss", "Hugo Weaving"], language: "English", icon: "💊", colors: ["#0f9b0f", "#000000"], overview: "A hacker learns that the world he knows is a simulation built by machines, and joins a rebellion fighting to free humanity." },
  { id: "dune-part-two", title: "Dune: Part Two", year: 2024, genres: ["Sci-Fi", "Adventure", "Drama"], rating: 8.5, runtime: 166, popularity: 98, director: "Denis Villeneuve", cast: ["Timothée Chalamet", "Zendaya", "Rebecca Ferguson", "Austin Butler"], language: "English", icon: "🏜️", colors: ["#c79081", "#5d3a1a"], overview: "Paul Atreides unites with the Fremen to seek revenge on those who destroyed his family, while trying to prevent a terrible future only he can foresee." },
  { id: "oppenheimer", title: "Oppenheimer", year: 2023, genres: ["Drama", "History"], rating: 8.3, runtime: 180, popularity: 94, director: "Christopher Nolan", cast: ["Cillian Murphy", "Emily Blunt", "Robert Downey Jr.", "Matt Damon"], language: "English", icon: "☢️", colors: ["#f12711", "#1a1a1a"], overview: "The story of J. Robert Oppenheimer, the physicist who led the development of the atomic bomb, and the political reckoning that followed." },
  { id: "spider-verse", title: "Spider-Man: Across the Spider-Verse", year: 2023, genres: ["Animation", "Action", "Adventure"], rating: 8.6, runtime: 140, popularity: 93, director: "Joaquim Dos Santos, Kemp Powers, Justin K. Thompson", cast: ["Shameik Moore", "Hailee Steinfeld", "Oscar Isaac", "Jake Johnson"], language: "English", icon: "🕷️", colors: ["#ee0979", "#1a2980"], overview: "Miles Morales is catapulted across the multiverse, where he meets a society of Spider-People and clashes with them over how to handle a new threat." },
  { id: "everything-everywhere", title: "Everything Everywhere All at Once", year: 2022, genres: ["Sci-Fi", "Comedy", "Action"], rating: 7.8, runtime: 139, popularity: 86, director: "Daniel Kwan, Daniel Scheinert", cast: ["Michelle Yeoh", "Ke Huy Quan", "Stephanie Hsu", "Jamie Lee Curtis"], language: "English", icon: "🥯", colors: ["#fc466b", "#3f5efb"], overview: "An overwhelmed laundromat owner discovers she can access the skills of her alternate selves across the multiverse, and must use them to save existence." },
  { id: "the-shawshank-redemption", title: "The Shawshank Redemption", year: 1994, genres: ["Drama"], rating: 9.3, runtime: 142, popularity: 90, director: "Frank Darabont", cast: ["Tim Robbins", "Morgan Freeman", "Bob Gunton"], language: "English", icon: "🔨", colors: ["#536976", "#292e49"], overview: "A banker sentenced to life in prison for a crime he says he didn't commit forms a lasting friendship and quietly holds on to hope over two decades." },
  { id: "get-out", title: "Get Out", year: 2017, genres: ["Horror", "Thriller"], rating: 7.8, runtime: 104, popularity: 82, director: "Jordan Peele", cast: ["Daniel Kaluuya", "Allison Williams", "Catherine Keener", "Bradley Whitford"], language: "English", icon: "☕", colors: ["#434343", "#000000"], overview: "A young man visits his girlfriend's family estate for the weekend, and their overly warm welcome slowly reveals something deeply sinister." },
  { id: "a-quiet-place", title: "A Quiet Place", year: 2018, genres: ["Horror", "Sci-Fi", "Drama"], rating: 7.5, runtime: 90, popularity: 80, director: "John Krasinski", cast: ["Emily Blunt", "John Krasinski", "Millicent Simmonds", "Noah Jupe"], language: "English", icon: "🤫", colors: ["#485563", "#29323c"], overview: "A family survives in near silence on an isolated farm, hiding from creatures that hunt anything that makes a sound." },
  { id: "la-la-land", title: "La La Land", year: 2016, genres: ["Romance", "Drama", "Music"], rating: 8.0, runtime: 128, popularity: 84, director: "Damien Chazelle", cast: ["Ryan Gosling", "Emma Stone", "John Legend"], language: "English", icon: "🎹", colors: ["#654ea3", "#eaafc8"], overview: "A jazz pianist and an aspiring actress fall in love in Los Angeles while chasing their dreams, which begin to pull them in different directions." },
  { id: "whiplash", title: "Whiplash", year: 2014, genres: ["Drama", "Music"], rating: 8.5, runtime: 106, popularity: 83, director: "Damien Chazelle", cast: ["Miles Teller", "J.K. Simmons", "Paul Reiser"], language: "English", icon: "🥁", colors: ["#cb2d3e", "#1c1c1c"], overview: "An ambitious young drummer at an elite music school is pushed to his limits by a ruthless, abusive instructor." },
  { id: "toy-story", title: "Toy Story", year: 1995, genres: ["Animation", "Comedy", "Family"], rating: 8.3, runtime: 81, popularity: 85, director: "John Lasseter", cast: ["Tom Hanks", "Tim Allen", "Don Rickles"], language: "English", icon: "🤠", colors: ["#56ccf2", "#2f80ed"], overview: "A cowboy doll feels threatened when a flashy new space-ranger toy becomes his owner's favorite, and the two rivals end up lost together." },
  { id: "coco", title: "Coco", year: 2017, genres: ["Animation", "Family", "Music"], rating: 8.4, runtime: 105, popularity: 84, director: "Lee Unkrich", cast: ["Anthony Gonzalez", "Gael García Bernal", "Benjamin Bratt"], language: "English", icon: "💀", colors: ["#f857a6", "#ff5858"], overview: "A boy who dreams of becoming a musician crosses into the Land of the Dead on the Day of the Dead and uncovers his family's hidden history." },
  { id: "mad-max-fury-road", title: "Mad Max: Fury Road", year: 2015, genres: ["Action", "Adventure", "Sci-Fi"], rating: 8.1, runtime: 120, popularity: 87, director: "George Miller", cast: ["Tom Hardy", "Charlize Theron", "Nicholas Hoult"], language: "English", icon: "🔥", colors: ["#f2994a", "#7a2e0e"], overview: "In a desert wasteland, a drifter and a rebel commander flee a tyrant across the desert in a war rig carrying his captive wives." },
  { id: "the-grand-budapest-hotel", title: "The Grand Budapest Hotel", year: 2014, genres: ["Comedy", "Adventure", "Drama"], rating: 8.1, runtime: 99, popularity: 79, director: "Wes Anderson", cast: ["Ralph Fiennes", "Tony Revolori", "Saoirse Ronan", "Adrien Brody"], language: "English", icon: "🏨", colors: ["#ffafbd", "#c9416f"], overview: "The concierge of a famous European hotel and his loyal lobby boy are caught up in the theft of a priceless painting and a fight over a family fortune." },
  { id: "the-conjuring", title: "The Conjuring", year: 2013, genres: ["Horror", "Mystery"], rating: 7.5, runtime: 112, popularity: 78, director: "James Wan", cast: ["Vera Farmiga", "Patrick Wilson", "Lili Taylor"], language: "English", icon: "👻", colors: ["#232526", "#414345"], overview: "Paranormal investigators Ed and Lorraine Warren help a family terrorized by a dark presence in their secluded farmhouse." },
  { id: "knives-out", title: "Knives Out", year: 2019, genres: ["Mystery", "Comedy", "Crime"], rating: 7.9, runtime: 130, popularity: 83, director: "Rian Johnson", cast: ["Daniel Craig", "Ana de Armas", "Chris Evans", "Jamie Lee Curtis"], language: "English", icon: "🔪", colors: ["#8e9eab", "#3b4a52"], overview: "When a wealthy crime novelist is found dead after his birthday party, an eccentric detective investigates his scheming, suspicious family." },
  { id: "titanic", title: "Titanic", year: 1997, genres: ["Romance", "Drama"], rating: 7.9, runtime: 194, popularity: 86, director: "James Cameron", cast: ["Leonardo DiCaprio", "Kate Winslet", "Billy Zane"], language: "English", icon: "🚢", colors: ["#2193b0", "#0b2e4f"], overview: "A young aristocrat falls for a penniless artist aboard the ill-fated maiden voyage of the RMS Titanic." },
  { id: "top-gun-maverick", title: "Top Gun: Maverick", year: 2022, genres: ["Action", "Drama"], rating: 8.2, runtime: 130, popularity: 89, director: "Joseph Kosinski", cast: ["Tom Cruise", "Miles Teller", "Jennifer Connelly", "Jon Hamm"], language: "English", icon: "✈️", colors: ["#ff9966", "#1f4e79"], overview: "After more than thirty years of service, Pete \"Maverick\" Mitchell returns to train a group of elite pilots for a dangerous mission." },
  { id: "your-name", title: "Your Name.", year: 2016, genres: ["Animation", "Romance", "Fantasy"], rating: 8.4, runtime: 106, popularity: 81, director: "Makoto Shinkai", cast: ["Ryunosuke Kamiki", "Mone Kamishiraishi"], language: "Japanese", icon: "☄️", colors: ["#8360c3", "#2ebf91"], overview: "Two teenagers who have never met mysteriously begin swapping bodies, and set out to find each other as a comet approaches Earth." },
  { id: "gladiator", title: "Gladiator", year: 2000, genres: ["Action", "Drama", "History"], rating: 8.5, runtime: 155, popularity: 85, director: "Ridley Scott", cast: ["Russell Crowe", "Joaquin Phoenix", "Connie Nielsen"], language: "English", icon: "⚔️", colors: ["#b79891", "#4e342e"], overview: "A betrayed Roman general is sold into slavery and rises through the gladiator arenas to seek vengeance against the corrupt emperor." },
  { id: "the-lion-king", title: "The Lion King", year: 1994, genres: ["Animation", "Family", "Drama"], rating: 8.5, runtime: 88, popularity: 84, director: "Roger Allers, Rob Minkoff", cast: ["Matthew Broderick", "James Earl Jones", "Jeremy Irons"], language: "English", icon: "🦁", colors: ["#f7b733", "#fc4a1a"], overview: "A young lion prince flees his kingdom after his father's death, and must eventually return to reclaim his place from his treacherous uncle." },
];

const PAGE_SIZE = 12;
const STORAGE_KEY = "flowingdafilms:v1";
const movieById = new Map(MOVIES.map((m) => [m.id, m]));

/* =========================================================
   Persistent state (localStorage, fail-safe)
   ========================================================= */
const store = (() => {
  const defaults = { watchlist: [], watched: [], ratings: {}, reviews: {}, recent: [], theme: null };
  let data = { ...defaults };
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && typeof saved === "object") data = { ...defaults, ...saved };
  } catch { /* storage unavailable or corrupt: use defaults */ }

  const save = () => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch { /* ignore */ }
  };
  return { data, save };
})();

const state = store.data;

/* =========================================================
   Helpers
   ========================================================= */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

function escapeHTML(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function formatRuntime(min) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return h ? `${h}h ${m}m` : `${m}m`;
}

function posterStyle(movie) {
  return `--p-bg: linear-gradient(135deg, ${movie.colors[0]}, ${movie.colors[1]}); --p-icon: "${movie.icon}";`;
}

let toastTimer;
function toast(msg) {
  const el = $("#toast");
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 2200);
}

const inWatchlist = (id) => state.watchlist.includes(id);
const isWatched = (id) => state.watched.includes(id);

function toggleWatchlist(id) {
  const movie = movieById.get(id);
  if (inWatchlist(id)) {
    state.watchlist = state.watchlist.filter((x) => x !== id);
    toast(`Removed "${movie.title}" from watchlist`);
  } else {
    state.watchlist.unshift(id);
    toast(`Added "${movie.title}" to watchlist`);
  }
  store.save();
  refreshSavedIndicators();
}

function toggleWatched(id) {
  const movie = movieById.get(id);
  if (isWatched(id)) {
    state.watched = state.watched.filter((x) => x !== id);
    toast(`Marked "${movie.title}" as not watched`);
  } else {
    state.watched.unshift(id);
    state.watchlist = state.watchlist.filter((x) => x !== id);
    toast(`Marked "${movie.title}" as watched`);
  }
  store.save();
  refreshSavedIndicators();
}

function refreshSavedIndicators() {
  $("#watchlistCount").textContent = state.watchlist.length;
  $$(".card-save").forEach((btn) => {
    const saved = inWatchlist(btn.dataset.id);
    btn.classList.toggle("saved", saved);
    btn.textContent = saved ? "✓" : "+";
    btn.setAttribute("aria-label", saved ? "Remove from watchlist" : "Add to watchlist");
  });
  if (currentRoute.name === "movie") updateDetailButtons(currentRoute.id);
  if (currentRoute.name === "watchlist") renderWatchlist();
  if (currentRoute.name === "home") updateHeroButton();
}

/* =========================================================
   Card rendering
   ========================================================= */
function cardHTML(movie) {
  const saved = inWatchlist(movie.id);
  return `
    <article class="card" tabindex="0" data-id="${movie.id}" aria-label="${escapeHTML(movie.title)} (${movie.year})">
      <span class="card-rating">★ ${movie.rating.toFixed(1)}</span>
      <button class="card-save ${saved ? "saved" : ""}" data-id="${movie.id}"
        aria-label="${saved ? "Remove from watchlist" : "Add to watchlist"}">${saved ? "✓" : "+"}</button>
      <div class="poster" style='${posterStyle(movie)}'>
        <span class="poster-title">${escapeHTML(movie.title)}</span>
        <span class="poster-year">${movie.year}</span>
      </div>
      <div class="card-info">
        <h3>${escapeHTML(movie.title)}</h3>
        <p>${movie.year} · ${movie.genres.slice(0, 2).join(", ")}</p>
      </div>
    </article>`;
}

function renderList(container, movies) {
  container.innerHTML = movies.map(cardHTML).join("");
}

// One delegated handler for every card on the page
document.addEventListener("click", (e) => {
  const saveBtn = e.target.closest(".card-save");
  if (saveBtn) {
    e.stopPropagation();
    toggleWatchlist(saveBtn.dataset.id);
    return;
  }
  const card = e.target.closest(".card");
  if (card) location.hash = `#/movie/${card.dataset.id}`;
});

document.addEventListener("keydown", (e) => {
  const card = e.target.closest?.(".card");
  if (card && e.target === card && (e.key === "Enter" || e.key === " ")) {
    e.preventDefault();
    location.hash = `#/movie/${card.dataset.id}`;
  }
});

/* =========================================================
   Home
   ========================================================= */
const featured = [...MOVIES].sort((a, b) => b.popularity - a.popularity).slice(0, 5);
let heroIndex = 0;
let heroTimer;

function showHero(i) {
  heroIndex = (i + featured.length) % featured.length;
  const m = featured[heroIndex];
  $("#heroBg").setAttribute("style", posterStyle(m));
  $("#heroTitle").textContent = m.title;
  $("#heroMeta").textContent = `★ ${m.rating} · ${m.year} · ${formatRuntime(m.runtime)} · ${m.genres.join(", ")}`;
  $("#heroDesc").textContent = m.overview;
  $$("#heroDots button").forEach((d, idx) => d.classList.toggle("active", idx === heroIndex));
  updateHeroButton();
}

function updateHeroButton() {
  const m = featured[heroIndex];
  $("#heroWatchlist").textContent = inWatchlist(m.id) ? "✓ In Watchlist" : "+ Watchlist";
}

function startHeroTimer() {
  clearInterval(heroTimer);
  heroTimer = setInterval(() => showHero(heroIndex + 1), 7000);
}

function initHero() {
  $("#heroDots").innerHTML = featured
    .map((m, i) => `<button aria-label="Show ${escapeHTML(m.title)}" data-i="${i}"></button>`)
    .join("");
  $("#heroDots").addEventListener("click", (e) => {
    const dot = e.target.closest("button");
    if (!dot) return;
    showHero(Number(dot.dataset.i));
    startHeroTimer();
  });
  $("#heroDetails").addEventListener("click", () => (location.hash = `#/movie/${featured[heroIndex].id}`));
  $("#heroWatchlist").addEventListener("click", () => toggleWatchlist(featured[heroIndex].id));
  showHero(0);
}

function renderHome() {
  renderList($("#rowTrending"), [...MOVIES].sort((a, b) => b.popularity - a.popularity).slice(0, 12));
  renderList($("#rowTopRated"), [...MOVIES].sort((a, b) => b.rating - a.rating).slice(0, 12));
  renderList($("#rowNew"), [...MOVIES].sort((a, b) => b.year - a.year).slice(0, 12));

  const recent = state.recent.map((id) => movieById.get(id)).filter(Boolean);
  $("#recentRow").hidden = recent.length === 0;
  renderList($("#rowRecent"), recent);
  startHeroTimer();
}

$("#clearRecent").addEventListener("click", () => {
  state.recent = [];
  store.save();
  renderHome();
});

/* =========================================================
   Browse (filter / sort / paginate)
   ========================================================= */
const ALL_GENRES = [...new Set(MOVIES.flatMap((m) => m.genres))].sort();
const DECADES = [...new Set(MOVIES.map((m) => Math.floor(m.year / 10) * 10))].sort((a, b) => b - a);

const filters = { genre: "All", decade: "all", minRating: 0, sort: "popularity", query: "" };
let visibleCount = PAGE_SIZE;

function initBrowse() {
  $("#genreChips").innerHTML = ["All", ...ALL_GENRES]
    .map((g) => `<button class="chip" data-genre="${g}">${g}</button>`)
    .join("");
  $("#yearFilter").insertAdjacentHTML("beforeend", DECADES.map((d) => `<option value="${d}">${d}s</option>`).join(""));

  $("#genreChips").addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    filters.genre = chip.dataset.genre;
    syncBrowseURL();
  });
  $("#yearFilter").addEventListener("change", (e) => { filters.decade = e.target.value; syncBrowseURL(); });
  $("#ratingFilter").addEventListener("change", (e) => { filters.minRating = Number(e.target.value); syncBrowseURL(); });
  $("#sortSelect").addEventListener("change", (e) => { filters.sort = e.target.value; syncBrowseURL(); });
  $("#loadMore").addEventListener("click", () => { visibleCount += PAGE_SIZE; renderBrowse(); });
  $("#resetFilters").addEventListener("click", () => { location.hash = "#/browse"; $("#searchInput").value = ""; });
}

// Filters live in the URL so browse results are shareable and survive back/forward
function syncBrowseURL() {
  const params = new URLSearchParams();
  if (filters.query) params.set("q", filters.query);
  if (filters.genre !== "All") params.set("genre", filters.genre);
  if (filters.decade !== "all") params.set("decade", filters.decade);
  if (filters.minRating) params.set("rating", filters.minRating);
  if (filters.sort !== "popularity") params.set("sort", filters.sort);
  const qs = params.toString();
  location.hash = `#/browse${qs ? "?" + qs : ""}`;
}

function readBrowseParams(params) {
  filters.query = params.get("q") || "";
  filters.genre = ALL_GENRES.includes(params.get("genre")) ? params.get("genre") : "All";
  filters.decade = params.get("decade") || "all";
  filters.minRating = Number(params.get("rating")) || 0;
  filters.sort = ["popularity", "rating", "year", "title"].includes(params.get("sort")) ? params.get("sort") : "popularity";
}

function matchesQuery(movie, q) {
  if (!q) return true;
  const hay = [movie.title, movie.director, ...movie.cast, ...movie.genres, String(movie.year)].join(" ").toLowerCase();
  return q.toLowerCase().split(/\s+/).every((word) => hay.includes(word));
}

function getFilteredMovies() {
  const sorters = {
    popularity: (a, b) => b.popularity - a.popularity,
    rating: (a, b) => b.rating - a.rating,
    year: (a, b) => b.year - a.year,
    title: (a, b) => a.title.localeCompare(b.title),
  };
  return MOVIES.filter(
    (m) =>
      (filters.genre === "All" || m.genres.includes(filters.genre)) &&
      (filters.decade === "all" || Math.floor(m.year / 10) * 10 === Number(filters.decade)) &&
      m.rating >= filters.minRating &&
      matchesQuery(m, filters.query)
  ).sort(sorters[filters.sort]);
}

function renderBrowse() {
  $$("#genreChips .chip").forEach((c) => c.classList.toggle("active", c.dataset.genre === filters.genre));
  $("#yearFilter").value = filters.decade;
  $("#ratingFilter").value = String(filters.minRating);
  $("#sortSelect").value = filters.sort;

  const results = getFilteredMovies();
  $("#browseTitle").textContent = filters.query ? `Results for "${filters.query}"` : "Browse Movies";
  $("#resultCount").textContent = `${results.length} movie${results.length === 1 ? "" : "s"}`;
  renderList($("#movieGrid"), results.slice(0, visibleCount));
  $("#browseEmpty").hidden = results.length > 0;
  $("#loadMore").hidden = visibleCount >= results.length;
}

/* =========================================================
   Search with live suggestions
   ========================================================= */
function initSearch() {
  const input = $("#searchInput");
  const list = $("#searchSuggestions");
  let activeIdx = -1;
  let debounce;

  const close = () => { list.hidden = true; activeIdx = -1; };

  const renderSuggestions = () => {
    const q = input.value.trim();
    if (!q) return close();
    const hits = MOVIES.filter((m) => matchesQuery(m, q)).slice(0, 6);
    if (!hits.length) {
      list.innerHTML = `<li class="muted">No matches</li>`;
    } else {
      list.innerHTML = hits
        .map((m) => `
          <li data-id="${m.id}">
            <div class="poster mini-poster" style='${posterStyle(m)}'></div>
            <div><strong>${escapeHTML(m.title)}</strong><small>${m.year} · ${escapeHTML(m.director)}</small></div>
          </li>`)
        .join("");
    }
    activeIdx = -1;
    list.hidden = false;
  };

  input.addEventListener("input", () => {
    clearTimeout(debounce);
    debounce = setTimeout(renderSuggestions, 150);
  });

  input.addEventListener("keydown", (e) => {
    const items = $$("li[data-id]", list);
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      if (!items.length) return;
      e.preventDefault();
      activeIdx = (activeIdx + (e.key === "ArrowDown" ? 1 : -1) + items.length) % items.length;
      items.forEach((li, i) => li.classList.toggle("active", i === activeIdx));
    } else if (e.key === "Escape") {
      close();
    }
  });

  list.addEventListener("mousedown", (e) => {
    const li = e.target.closest("li[data-id]");
    if (!li) return;
    e.preventDefault();
    location.hash = `#/movie/${li.dataset.id}`;
    input.value = "";
    close();
    input.blur();
  });

  input.addEventListener("blur", () => setTimeout(close, 100));

  $("#searchForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const items = $$("li[data-id]", list);
    if (activeIdx >= 0 && items[activeIdx]) {
      location.hash = `#/movie/${items[activeIdx].dataset.id}`;
      input.value = "";
    } else {
      filters.query = input.value.trim();
      filters.genre = "All";
      filters.decade = "all";
      filters.minRating = 0;
      syncBrowseURL();
    }
    close();
    input.blur();
  });

  // Press "/" anywhere to focus search
  document.addEventListener("keydown", (e) => {
    if (e.key === "/" && !["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName)) {
      e.preventDefault();
      input.focus();
    }
  });
}

/* =========================================================
   Movie detail
   ========================================================= */
function renderMovie(id) {
  const m = movieById.get(id);
  if (!m) return false;

  state.recent = [id, ...state.recent.filter((x) => x !== id)].slice(0, 10);
  store.save();

  document.title = `${m.title} (${m.year}) · FlowingDaFilms`;
  $("#detailHero").setAttribute("style", posterStyle(m));
  $("#detailPoster").innerHTML = `
    <div class="poster" style='${posterStyle(m)}'>
      <span class="poster-title">${escapeHTML(m.title)}</span>
      <span class="poster-year">${m.year}</span>
    </div>`;
  $("#detailTitle").textContent = m.title;
  $("#detailMeta").innerHTML = `<span class="imdb">★ ${m.rating.toFixed(1)}</span> · ${m.year} · ${formatRuntime(m.runtime)} · ${escapeHTML(m.language)}`;
  $("#detailGenres").innerHTML = m.genres
    .map((g) => `<a class="chip" href="#/browse?genre=${encodeURIComponent(g)}">${g}</a>`)
    .join("");
  $("#detailOverview").textContent = m.overview;
  $("#detailFacts").innerHTML = `
    <dt>Director</dt><dd>${escapeHTML(m.director)}</dd>
    <dt>Starring</dt><dd>${m.cast.map((c) => `<a class="link" href="#/browse?q=${encodeURIComponent(c)}">${escapeHTML(c)}</a>`).join(", ")}</dd>
    <dt>Runtime</dt><dd>${m.runtime} minutes</dd>
    <dt>Released</dt><dd>${m.year}</dd>`;

  updateDetailButtons(id);
  renderStars(id);
  renderReviews(id);

  // Similar = shares the most genres, then by rating
  const similar = MOVIES.filter((x) => x.id !== id)
    .map((x) => ({ x, score: x.genres.filter((g) => m.genres.includes(g)).length }))
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score || b.x.rating - a.x.rating)
    .slice(0, 10)
    .map((s) => s.x);
  renderList($("#rowSimilar"), similar);
  return true;
}

function updateDetailButtons(id) {
  const wl = $("#detailWatchlist");
  wl.textContent = inWatchlist(id) ? "✓ In Watchlist" : "+ Watchlist";
  wl.classList.toggle("active", inWatchlist(id));
  const w = $("#detailWatched");
  w.textContent = isWatched(id) ? "✓ Watched" : "Mark as watched";
  w.classList.toggle("active", isWatched(id));
}

function renderStars(id) {
  const current = state.ratings[id] || 0;
  $("#userStars").innerHTML = [1, 2, 3, 4, 5]
    .map((n) => `<button role="radio" aria-checked="${n === current}" aria-label="${n} star${n > 1 ? "s" : ""}"
      data-n="${n}" class="${n <= current ? "on" : ""}">★</button>`)
    .join("");
}

function renderReviews(id) {
  const reviews = state.reviews[id] || [];
  $("#reviewCount").textContent = reviews.length ? `(${reviews.length})` : "";
  $("#reviewList").innerHTML = reviews.length
    ? reviews
        .map((r, i) => `
          <li>
            <div class="review-head">
              <strong>${escapeHTML(r.name)} ${r.stars ? `<span style="color:var(--gold)">${"★".repeat(r.stars)}</span>` : ""}</strong>
              <span><small>${new Date(r.date).toLocaleDateString()}</small>
              <button class="review-del" data-i="${i}" aria-label="Delete review">Delete</button></span>
            </div>
            <p>${escapeHTML(r.text)}</p>
          </li>`)
        .join("")
    : `<li class="muted">No reviews yet. Be the first!</li>`;
}

function initDetail() {
  $("#detailWatchlist").addEventListener("click", () => toggleWatchlist(currentRoute.id));
  $("#detailWatched").addEventListener("click", () => toggleWatched(currentRoute.id));

  $("#trailerBtn").addEventListener("click", () => {
    const m = movieById.get(currentRoute.id);
    const q = encodeURIComponent(`${m.title} ${m.year} official trailer`);
    window.open(`https://www.youtube.com/results?search_query=${q}`, "_blank", "noopener");
  });

  $("#shareBtn").addEventListener("click", async () => {
    const m = movieById.get(currentRoute.id);
    const url = location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: m.title, text: `Check out ${m.title} on FlowingDaFilms`, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast("Link copied to clipboard");
      }
    } catch { /* user cancelled share */ }
  });

  const stars = $("#userStars");
  stars.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    const n = Number(btn.dataset.n);
    const id = currentRoute.id;
    if (state.ratings[id] === n) {
      delete state.ratings[id];
      toast("Rating cleared");
    } else {
      state.ratings[id] = n;
      toast(`You rated this ${n}/5`);
    }
    store.save();
    renderStars(id);
  });
  stars.addEventListener("mouseover", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    $$("button", stars).forEach((b) => b.classList.toggle("on", Number(b.dataset.n) <= Number(btn.dataset.n)));
  });
  stars.addEventListener("mouseleave", () => renderStars(currentRoute.id));

  $("#reviewForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = $("#reviewName").value.trim();
    const text = $("#reviewText").value.trim();
    if (!name || !text) return;
    const id = currentRoute.id;
    (state.reviews[id] ||= []).unshift({ name, text, stars: state.ratings[id] || 0, date: Date.now() });
    store.save();
    $("#reviewText").value = "";
    renderReviews(id);
    toast("Review posted");
  });

  $("#reviewList").addEventListener("click", (e) => {
    const del = e.target.closest(".review-del");
    if (!del) return;
    const id = currentRoute.id;
    state.reviews[id].splice(Number(del.dataset.i), 1);
    store.save();
    renderReviews(id);
    toast("Review deleted");
  });
}

/* =========================================================
   Watchlist
   ========================================================= */
let watchTab = "toWatch";

function renderWatchlist() {
  const ids = watchTab === "toWatch" ? state.watchlist : state.watched;
  const movies = ids.map((id) => movieById.get(id)).filter(Boolean);
  renderList($("#watchlistGrid"), movies);
  $("#watchlistEmpty").hidden = movies.length > 0;
  const mins = state.watchlist.reduce((sum, id) => sum + (movieById.get(id)?.runtime || 0), 0);
  $("#watchlistSummary").textContent =
    `${state.watchlist.length} to watch (${formatRuntime(mins)} total) · ${state.watched.length} watched`;
  $$("#watchTabs .tab").forEach((t) => t.classList.toggle("active", t.dataset.tab === watchTab));
}

$("#watchTabs").addEventListener("click", (e) => {
  const tab = e.target.closest(".tab");
  if (!tab) return;
  watchTab = tab.dataset.tab;
  renderWatchlist();
});

/* =========================================================
   Hash router
   ========================================================= */
let currentRoute = { name: "home" };

function parseRoute() {
  const raw = location.hash.replace(/^#\/?/, "");
  const [path, query = ""] = raw.split("?");
  const parts = path.split("/").filter(Boolean);
  const params = new URLSearchParams(query);
  if (parts.length === 0) return { name: "home" };
  if (parts[0] === "browse") return { name: "browse", params };
  if (parts[0] === "watchlist") return { name: "watchlist" };
  if (parts[0] === "movie" && parts[1]) return { name: "movie", id: decodeURIComponent(parts[1]) };
  return { name: "notfound" };
}

function router() {
  const route = parseRoute();
  const prev = currentRoute;
  currentRoute = route;
  let view = route.name;

  document.title = "FlowingDaFilms";
  if (route.name !== "home") clearInterval(heroTimer);

  if (route.name === "home") renderHome();
  else if (route.name === "browse") {
    readBrowseParams(route.params);
    if (prev.name !== "browse") visibleCount = PAGE_SIZE;
    renderBrowse();
    document.title = "Browse · FlowingDaFilms";
  } else if (route.name === "watchlist") {
    renderWatchlist();
    document.title = "Watchlist · FlowingDaFilms";
  } else if (route.name === "movie") {
    if (!renderMovie(route.id)) view = "notfound";
  }

  $$(".view").forEach((v) => (v.hidden = v.id !== `view-${view}`));
  $$(".main-nav a").forEach((a) => a.classList.toggle("active", a.dataset.route === route.name));
  $("#mainNav").classList.remove("open");
  $("#menuToggle").setAttribute("aria-expanded", "false");

  // Keep scroll position when only browse filters change
  if (!(prev.name === "browse" && route.name === "browse")) window.scrollTo(0, 0);
}

/* =========================================================
   Theme & mobile menu
   ========================================================= */
function applyTheme(theme) {
  if (theme) document.documentElement.dataset.theme = theme;
  else delete document.documentElement.dataset.theme;
}

$("#themeToggle").addEventListener("click", () => {
  const current = document.documentElement.dataset.theme === "light" ? "light" : "dark";
  state.theme = current === "light" ? "dark" : "light";
  store.save();
  applyTheme(state.theme);
});

$("#menuToggle").addEventListener("click", () => {
  const open = $("#mainNav").classList.toggle("open");
  $("#menuToggle").setAttribute("aria-expanded", String(open));
});

/* =========================================================
   Boot
   ========================================================= */
applyTheme(state.theme);
$("#year").textContent = new Date().getFullYear();
initHero();
initBrowse();
initSearch();
initDetail();
refreshSavedIndicators();
window.addEventListener("hashchange", router);
router();
