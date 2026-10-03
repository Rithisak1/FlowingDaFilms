"use strict";

/* =========================================================
   Configuration
   ---------------------------------------------------------
   Paste your TMDB key here to give every visitor live data,
   or leave it empty and each visitor can add their own key
   on the Settings page (#/settings).

   Accepts either the "API Key" (v3, 32 characters) or the
   "API Read Access Token" (v4, starts with "eyJ").

   NOTE: anything in this file is public once the site is
   deployed. TMDB keys are free and read-only, but TMDB's
   terms still apply to whoever's key it is.
   ========================================================= */
const TMDB_API_KEY = "";

const TMDB_BASE = "https://api.themoviedb.org/3";
const IMG = "https://image.tmdb.org/t/p/";
const LANG = navigator.language || "en-US";
const REGION = (LANG.split("-")[1] || "US").toUpperCase();
const STORAGE_KEY = "flowingdafilms:v2";
const CACHE_TTL = 5 * 60 * 1000;

/* =========================================================
   Persistent state (localStorage, fail-safe)
   ========================================================= */
const store = (() => {
  const defaults = { watchlist: [], watched: [], ratings: {}, reviews: {}, recent: [], theme: null, apiKey: "" };
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
  return String(str ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

const yearOf = (date) => (date || "").slice(0, 4) || "TBA";
const formatRuntime = (min) => (min ? (min >= 60 ? `${Math.floor(min / 60)}h ${min % 60}m` : `${min}m`) : "");
const formatMoney = (n) => (n ? `$${n.toLocaleString()}` : "—");
const todayISO = () => new Date().toISOString().slice(0, 10);

let toastTimer;
function toast(msg) {
  const el = $("#toast");
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 2400);
}

/* =========================================================
   TMDB client
   ========================================================= */
class ApiError extends Error {
  constructor(code, message) { super(message || code); this.code = code; }
}

const getKey = () => (TMDB_API_KEY || state.apiKey || "").trim();
const isToken = (key) => /^eyJ/.test(key);
const apiCache = new Map();

async function tmdb(path, params = {}, keyOverride) {
  const key = keyOverride || getKey();
  if (!key) throw new ApiError("nokey", "No API key configured");

  const query = { language: LANG, ...params };
  const cacheKey = path + JSON.stringify(query);
  const hit = apiCache.get(cacheKey);
  if (!keyOverride && hit && Date.now() - hit.t < CACHE_TTL) return hit.data;

  const url = new URL(TMDB_BASE + path);
  for (const [k, v] of Object.entries(query)) {
    if (v !== "" && v != null) url.searchParams.set(k, v);
  }
  const headers = { accept: "application/json" };
  if (isToken(key)) headers.Authorization = `Bearer ${key}`;
  else url.searchParams.set("api_key", key);

  let res;
  try {
    res = await fetch(url, { headers });
  } catch {
    throw new ApiError("network", "Can't reach TMDB");
  }
  if (res.status === 401) throw new ApiError("auth", "TMDB rejected the API key");
  if (res.status === 404) throw new ApiError("notfound", "Not found");
  if (res.status === 429) throw new ApiError("ratelimit", "Too many requests");
  if (!res.ok) throw new ApiError("http", `TMDB error ${res.status}`);

  const data = await res.json();
  if (!keyOverride) apiCache.set(cacheKey, { t: Date.now(), data });
  return data;
}

function describeError(err) {
  switch (err.code) {
    case "network": return ["Connection problem", "Couldn't reach TMDB. Check your internet connection and try again."];
    case "ratelimit": return ["Slow down", "TMDB is rate limiting requests. Wait a moment and try again."];
    case "notfound": return ["404", "That movie or person doesn't exist."];
    default: return ["Something went wrong", err.message || "Unexpected error."];
  }
}

/* =========================================================
   Images & cards
   ========================================================= */
const movieCache = new Map(); // id -> snapshot used for watchlist / recents

function snap(m) {
  const s = { id: m.id, title: m.title, poster_path: m.poster_path || null, release_date: m.release_date || "", vote_average: m.vote_average || 0 };
  movieCache.set(s.id, s);
  return s;
}

function posterHTML(path, title, size = "w342") {
  return path
    ? `<img src="${IMG}${size}${path}" alt="" loading="lazy" decoding="async">`
    : `<div class="poster-fallback">${escapeHTML(title)}</div>`;
}

const inList = (list, id) => state[list].some((m) => m.id === id);

function cardHTML(m) {
  const s = snap(m);
  const saved = inList("watchlist", s.id);
  return `
    <article class="card" tabindex="0" data-id="${s.id}" aria-label="${escapeHTML(s.title)} (${yearOf(s.release_date)})">
      ${s.vote_average ? `<span class="card-rating">★ ${s.vote_average.toFixed(1)}</span>` : ""}
      <button class="card-save ${saved ? "saved" : ""}" data-id="${s.id}"
        aria-label="${saved ? "Remove from watchlist" : "Add to watchlist"}">${saved ? "✓" : "+"}</button>
      <div class="poster">${posterHTML(s.poster_path, s.title)}</div>
      <div class="card-info">
        <h3>${escapeHTML(s.title)}</h3>
        <p>${yearOf(s.release_date)}</p>
      </div>
    </article>`;
}

const skeletonCards = (n) =>
  Array.from({ length: n }, () => `<div class="card skeleton"><div class="poster"></div><div class="skeleton-line"></div><div class="skeleton-line short"></div></div>`).join("");

function renderList(container, movies, append = false) {
  const html = movies.map(cardHTML).join("");
  if (append) container.insertAdjacentHTML("beforeend", html);
  else container.innerHTML = html;
}

/* =========================================================
   Watchlist / watched
   ========================================================= */
function toggleWatchlist(id) {
  const s = movieCache.get(id);
  if (!s) return;
  if (inList("watchlist", id)) {
    state.watchlist = state.watchlist.filter((m) => m.id !== id);
    toast(`Removed "${s.title}" from watchlist`);
  } else {
    state.watchlist.unshift(s);
    toast(`Added "${s.title}" to watchlist`);
  }
  store.save();
  refreshSavedIndicators();
}

function toggleWatched(id) {
  const s = movieCache.get(id);
  if (!s) return;
  if (inList("watched", id)) {
    state.watched = state.watched.filter((m) => m.id !== id);
    toast(`Marked "${s.title}" as not watched`);
  } else {
    state.watched.unshift(s);
    state.watchlist = state.watchlist.filter((m) => m.id !== id);
    toast(`Marked "${s.title}" as watched`);
  }
  store.save();
  refreshSavedIndicators();
}

function refreshSavedIndicators() {
  $("#watchlistCount").textContent = state.watchlist.length;
  $$(".card-save").forEach((btn) => {
    const saved = inList("watchlist", Number(btn.dataset.id));
    btn.classList.toggle("saved", saved);
    btn.textContent = saved ? "✓" : "+";
    btn.setAttribute("aria-label", saved ? "Remove from watchlist" : "Add to watchlist");
  });
  if (currentRoute.name === "movie") updateDetailButtons(currentRoute.id);
  if (currentRoute.name === "watchlist") renderWatchlist();
  if (currentRoute.name === "home") updateHeroButton();
}

// One delegated handler for every card on the page
document.addEventListener("click", (e) => {
  const saveBtn = e.target.closest(".card-save");
  if (saveBtn) {
    e.stopPropagation();
    toggleWatchlist(Number(saveBtn.dataset.id));
    return;
  }
  const card = e.target.closest(".card[data-id]");
  if (card) { location.hash = `#/movie/${card.dataset.id}`; return; }
  const person = e.target.closest("[data-person]");
  if (person) { location.hash = `#/person/${person.dataset.person}`; return; }
  if (e.target.closest("[data-back]")) {
    if (history.length > 1) history.back();
    else location.hash = "#/";
  }
});

document.addEventListener("keydown", (e) => {
  const el = e.target.closest?.(".card[data-id], [data-person]");
  if (el && e.target === el && (e.key === "Enter" || e.key === " ")) {
    e.preventDefault();
    location.hash = el.dataset.person ? `#/person/${el.dataset.person}` : `#/movie/${el.dataset.id}`;
  }
});

/* =========================================================
   Home
   ========================================================= */
const HOME_ROWS = [
  { id: "rowTrending", title: "Trending Now", path: "/trending/movie/day", link: "#/browse" },
  { id: "rowNowPlaying", title: "In Theaters", path: "/movie/now_playing", params: { region: REGION }, link: "#/browse?sort=primary_release_date.desc" },
  { id: "rowPopular", title: "Popular", path: "/movie/popular", link: "#/browse" },
  { id: "rowTopRated", title: "Top Rated", path: "/movie/top_rated", link: "#/browse?sort=vote_average.desc" },
  { id: "rowUpcoming", title: "Coming Soon", path: "/movie/upcoming", params: { region: REGION } },
];

let heroMovies = [];
let heroIndex = 0;
let heroTimer;

function initHomeRows() {
  const anchor = $("#recentRow");
  anchor.insertAdjacentHTML("beforebegin", HOME_ROWS.map((r) => `
    <section class="row">
      <div class="row-head"><h2>${r.title}</h2>${r.link ? `<a href="${r.link}" class="link">See all →</a>` : ""}</div>
      <div class="carousel" id="${r.id}"></div>
    </section>`).join(""));
}

function showHero(i) {
  if (!heroMovies.length) return;
  heroIndex = (i + heroMovies.length) % heroMovies.length;
  const m = heroMovies[heroIndex];
  $("#heroBg").style.backgroundImage = `url(${IMG}w1280${m.backdrop_path})`;
  $("#heroTitle").textContent = m.title;
  $("#heroMeta").textContent = `★ ${m.vote_average.toFixed(1)} · ${yearOf(m.release_date)}`;
  $("#heroDesc").textContent = m.overview;
  $$("#heroDots button").forEach((d, idx) => d.classList.toggle("active", idx === heroIndex));
  updateHeroButton();
}

function updateHeroButton() {
  const m = heroMovies[heroIndex];
  if (m) $("#heroWatchlist").textContent = inList("watchlist", m.id) ? "✓ In Watchlist" : "+ Watchlist";
}

function startHeroTimer() {
  clearInterval(heroTimer);
  if (heroMovies.length > 1) heroTimer = setInterval(() => showHero(heroIndex + 1), 8000);
}

function initHero() {
  $("#heroDots").addEventListener("click", (e) => {
    const dot = e.target.closest("button");
    if (!dot) return;
    showHero(Number(dot.dataset.i));
    startHeroTimer();
  });
  $("#heroDetails").addEventListener("click", () => heroMovies[heroIndex] && (location.hash = `#/movie/${heroMovies[heroIndex].id}`));
  $("#heroWatchlist").addEventListener("click", () => heroMovies[heroIndex] && toggleWatchlist(heroMovies[heroIndex].id));
}

async function renderHome(token) {
  const recent = state.recent;
  $("#recentRow").hidden = recent.length === 0;
  recent.forEach((m) => movieCache.set(m.id, m));
  renderList($("#rowRecent"), recent);

  HOME_ROWS.forEach((r) => { if (!$(`#${r.id}`).children.length) $(`#${r.id}`).innerHTML = skeletonCards(8); });

  const results = await Promise.allSettled(HOME_ROWS.map((r) => tmdb(r.path, r.params)));
  if (token !== routeToken) return;

  // If every request failed, surface the error instead of leaving skeletons
  const failed = results.filter((r) => r.status === "rejected");
  if (failed.length === results.length) throw failed[0].reason;

  results.forEach((res, i) => {
    const el = $(`#${HOME_ROWS[i].id}`);
    if (res.status === "fulfilled") renderList(el, res.value.results.slice(0, 20));
    else el.innerHTML = `<p class="muted">Couldn't load this row.</p>`;
  });

  if (results[0].status === "fulfilled") {
    heroMovies = results[0].value.results.filter((m) => m.backdrop_path && m.overview).slice(0, 6);
    $("#heroDots").innerHTML = heroMovies.map((m, i) => `<button aria-label="Show ${escapeHTML(m.title)}" data-i="${i}"></button>`).join("");
    heroMovies.forEach(snap);
    showHero(0);
    startHeroTimer();
  }
}

$("#clearRecent").addEventListener("click", () => {
  state.recent = [];
  store.save();
  $("#recentRow").hidden = true;
});

/* =========================================================
   Browse (discover / search)
   ========================================================= */
const filters = { genre: "", decade: "all", minRating: 0, sort: "popularity.desc", query: "" };
let browsePage = 1;
let browseTotalPages = 1;
let genres = null;

async function loadGenres() {
  if (genres) return genres;
  genres = (await tmdb("/genre/movie/list")).genres;
  return genres;
}

function initBrowse() {
  const thisYear = new Date().getFullYear();
  const decades = [];
  for (let d = Math.floor(thisYear / 10) * 10; d >= 1920; d -= 10) decades.push(d);
  $("#yearFilter").insertAdjacentHTML("beforeend", decades.map((d) => `<option value="${d}">${d}s</option>`).join(""));

  $("#genreChips").addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    filters.genre = chip.dataset.genre;
    syncBrowseURL();
  });
  $("#yearFilter").addEventListener("change", (e) => { filters.decade = e.target.value; syncBrowseURL(); });
  $("#ratingFilter").addEventListener("change", (e) => { filters.minRating = Number(e.target.value); syncBrowseURL(); });
  $("#sortSelect").addEventListener("change", (e) => { filters.sort = e.target.value; syncBrowseURL(); });
  $("#loadMore").addEventListener("click", () => loadBrowse(false).catch(handleError));
  $("#resetFilters").addEventListener("click", () => { $("#searchInput").value = ""; location.hash = "#/browse"; });
}

// Filters live in the URL so results are shareable and survive back/forward
function syncBrowseURL() {
  const params = new URLSearchParams();
  if (filters.query) params.set("q", filters.query);
  if (filters.genre) params.set("genre", filters.genre);
  if (filters.decade !== "all") params.set("decade", filters.decade);
  if (filters.minRating) params.set("rating", filters.minRating);
  if (filters.sort !== "popularity.desc") params.set("sort", filters.sort);
  const qs = params.toString();
  location.hash = `#/browse${qs ? "?" + qs : ""}`;
}

const SORTS = ["popularity.desc", "vote_average.desc", "primary_release_date.desc", "revenue.desc", "original_title.asc"];

function readBrowseParams(params) {
  filters.query = params.get("q") || "";
  filters.genre = /^\d+$/.test(params.get("genre") || "") ? params.get("genre") : "";
  filters.decade = /^\d{4}$/.test(params.get("decade") || "") ? params.get("decade") : "all";
  filters.minRating = Number(params.get("rating")) || 0;
  filters.sort = SORTS.includes(params.get("sort")) ? params.get("sort") : "popularity.desc";
}

async function loadBrowse(reset, token = routeToken) {
  if (reset) {
    browsePage = 1;
    $("#movieGrid").innerHTML = skeletonCards(12);
    $("#browseEmpty").hidden = true;
    $("#loadMore").hidden = true;
  } else {
    browsePage += 1;
    $("#loadMore").disabled = true;
  }

  let data;
  try {
    if (filters.query) {
      data = await tmdb("/search/movie", { query: filters.query, page: browsePage, include_adult: false });
    } else {
      const p = { page: browsePage, sort_by: filters.sort, include_adult: false };
      if (filters.genre) p.with_genres = filters.genre;
      if (filters.decade !== "all") {
        p["primary_release_date.gte"] = `${filters.decade}-01-01`;
        p["primary_release_date.lte"] = `${Number(filters.decade) + 9}-12-31`;
      }
      if (filters.minRating) p["vote_average.gte"] = filters.minRating;
      if (filters.minRating || filters.sort === "vote_average.desc") p["vote_count.gte"] = 200;
      if (filters.sort === "primary_release_date.desc") {
        p["primary_release_date.lte"] = p["primary_release_date.lte"] && p["primary_release_date.lte"] < todayISO() ? p["primary_release_date.lte"] : todayISO();
        p["vote_count.gte"] = 5;
      }
      data = await tmdb("/discover/movie", p);
    }
  } finally {
    $("#loadMore").disabled = false;
  }
  if (token !== routeToken) return;

  browseTotalPages = Math.min(data.total_pages, 500); // TMDB caps paging at 500
  renderList($("#movieGrid"), data.results, !reset);
  $("#resultCount").textContent = `${data.total_results.toLocaleString()} movie${data.total_results === 1 ? "" : "s"}`;
  $("#browseEmpty").hidden = data.results.length > 0 || !reset;
  $("#loadMore").hidden = browsePage >= browseTotalPages;
}

async function renderBrowse(token) {
  const list = await loadGenres();
  if (token !== routeToken) return;
  $("#genreChips").innerHTML = [{ id: "", name: "All" }, ...list]
    .map((g) => `<button class="chip ${String(g.id) === filters.genre ? "active" : ""}" data-genre="${g.id}">${escapeHTML(g.name)}</button>`)
    .join("");
  $("#yearFilter").value = filters.decade;
  $("#ratingFilter").value = String(filters.minRating);
  $("#sortSelect").value = filters.sort;
  $("#browseFilters").classList.toggle("disabled", Boolean(filters.query));

  const genreName = list.find((g) => String(g.id) === filters.genre)?.name;
  $("#browseTitle").textContent = filters.query ? `Results for "${filters.query}"` : genreName ? `${genreName} Movies` : "Browse Movies";
  await loadBrowse(true, token);
}

/* =========================================================
   Search with live suggestions (movies + people)
   ========================================================= */
function initSearch() {
  const input = $("#searchInput");
  const list = $("#searchSuggestions");
  let activeIdx = -1;
  let debounce;
  let seq = 0;

  const close = () => { list.hidden = true; activeIdx = -1; };

  const renderSuggestions = async () => {
    const q = input.value.trim();
    if (!q || !getKey()) return close();
    const mine = ++seq;
    let data;
    try { data = await tmdb("/search/multi", { query: q, include_adult: false }); }
    catch { return close(); }
    if (mine !== seq) return; // a newer keystroke superseded this request

    const hits = data.results.filter((r) => r.media_type === "movie" || r.media_type === "person").slice(0, 6);
    if (!hits.length) {
      list.innerHTML = `<li class="muted">No matches</li>`;
    } else {
      list.innerHTML = hits.map((r) => r.media_type === "movie"
        ? `<li data-href="#/movie/${r.id}">
             ${r.poster_path ? `<img class="thumb" src="${IMG}w92${r.poster_path}" alt="">` : `<span class="thumb"></span>`}
             <div><strong>${escapeHTML(r.title)}</strong><small>Movie · ${yearOf(r.release_date)}</small></div>
           </li>`
        : `<li data-href="#/person/${r.id}">
             ${r.profile_path ? `<img class="thumb round" src="${IMG}w92${r.profile_path}" alt="">` : `<span class="thumb round"></span>`}
             <div><strong>${escapeHTML(r.name)}</strong><small>${escapeHTML(r.known_for_department || "Person")}</small></div>
           </li>`).join("") + `<li class="see-all" data-search="${escapeHTML(q)}">See all results</li>`;
    }
    activeIdx = -1;
    list.hidden = false;
  };

  const go = (li) => {
    if (li.dataset.href) location.hash = li.dataset.href;
    else if (li.dataset.search) runSearch(li.dataset.search);
    input.value = "";
    close();
    input.blur();
  };

  input.addEventListener("input", () => {
    clearTimeout(debounce);
    debounce = setTimeout(renderSuggestions, 250);
  });

  input.addEventListener("keydown", (e) => {
    const items = $$("li[data-href], li[data-search]", list);
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
    const li = e.target.closest("li[data-href], li[data-search]");
    if (!li) return;
    e.preventDefault();
    go(li);
  });

  input.addEventListener("blur", () => setTimeout(close, 100));

  $("#searchForm").addEventListener("submit", (e) => {
    e.preventDefault();
    clearTimeout(debounce);
    seq++;
    const items = $$("li[data-href], li[data-search]", list);
    if (activeIdx >= 0 && items[activeIdx]) go(items[activeIdx]);
    else if (input.value.trim()) {
      runSearch(input.value.trim());
      close();
      input.blur();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "/" && !["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName)) {
      e.preventDefault();
      input.focus();
    }
  });
}

function runSearch(q) {
  filters.query = q;
  filters.genre = "";
  filters.decade = "all";
  filters.minRating = 0;
  syncBrowseURL();
}

/* =========================================================
   Movie detail
   ========================================================= */
let currentMovie = null;

function pickTrailer(videos) {
  const yt = (videos?.results || []).filter((v) => v.site === "YouTube");
  return (
    yt.find((v) => v.type === "Trailer" && v.official) ||
    yt.find((v) => v.type === "Trailer") ||
    yt.find((v) => v.type === "Teaser") ||
    null
  );
}

function certification(m) {
  const entry = m.release_dates?.results?.find((r) => r.iso_3166_1 === REGION) || m.release_dates?.results?.find((r) => r.iso_3166_1 === "US");
  return entry?.release_dates?.find((r) => r.certification)?.certification || "";
}

async function renderMovie(id, token) {
  const m = await tmdb(`/movie/${id}`, { append_to_response: "videos,credits,similar,recommendations,reviews,release_dates,watch/providers" });
  if (token !== routeToken) return;
  currentMovie = m;
  const s = snap(m);

  state.recent = [s, ...state.recent.filter((x) => x.id !== s.id)].slice(0, 12);
  store.save();

  document.title = `${m.title} (${yearOf(m.release_date)}) · FlowingDaFilms`;
  $("#detailHero").style.backgroundImage = m.backdrop_path ? `url(${IMG}w1280${m.backdrop_path})` : "none";
  $("#detailPoster").innerHTML = `<div class="poster">${posterHTML(m.poster_path, m.title, "w500")}</div>`;
  $("#detailTitle").textContent = m.title;
  $("#detailTagline").textContent = m.tagline || "";

  const cert = certification(m);
  $("#detailMeta").innerHTML = [
    m.vote_average ? `<span class="score">★ ${m.vote_average.toFixed(1)}</span> (${m.vote_count.toLocaleString()})` : "",
    yearOf(m.release_date),
    formatRuntime(m.runtime),
    cert ? `<span class="cert">${escapeHTML(cert)}</span>` : "",
  ].filter(Boolean).join(" · ");

  $("#detailGenres").innerHTML = m.genres
    .map((g) => `<a class="chip" href="#/browse?genre=${g.id}">${escapeHTML(g.name)}</a>`).join("");
  $("#detailOverview").textContent = m.overview || "No overview available.";

  const director = m.credits?.crew?.filter((c) => c.job === "Director") || [];
  const facts = [
    director.length && ["Director", director.map((d) => `<a class="link" href="#/person/${d.id}">${escapeHTML(d.name)}</a>`).join(", ")],
    ["Status", escapeHTML(m.status)],
    m.release_date && ["Release date", new Date(m.release_date + "T00:00").toLocaleDateString(undefined, { dateStyle: "long" })],
    m.original_language && ["Language", escapeHTML(m.spoken_languages?.[0]?.english_name || m.original_language.toUpperCase())],
    m.budget > 0 && ["Budget", formatMoney(m.budget)],
    m.revenue > 0 && ["Box office", formatMoney(m.revenue)],
    m.production_companies?.length && ["Studios", m.production_companies.slice(0, 3).map((c) => escapeHTML(c.name)).join(", ")],
  ].filter(Boolean);
  $("#detailFacts").innerHTML = facts.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join("");

  $("#trailerBtn").hidden = !pickTrailer(m.videos);

  renderProviders(m);
  updateDetailButtons(id);
  renderStars(id);
  renderReviews(id);

  const cast = (m.credits?.cast || []).slice(0, 20);
  $("#castRow").hidden = cast.length === 0;
  $("#castList").innerHTML = cast.map((c) => `
    <div class="cast-card" tabindex="0" data-person="${c.id}" role="link" aria-label="${escapeHTML(c.name)}">
      <div class="photo">${c.profile_path ? `<img src="${IMG}w185${c.profile_path}" alt="" loading="lazy">` : "👤"}</div>
      <strong>${escapeHTML(c.name)}</strong>
      <small>${escapeHTML(c.character || "")}</small>
    </div>`).join("");

  const similar = (m.recommendations?.results?.length ? m.recommendations.results : m.similar?.results || []).slice(0, 14);
  $("#similarRow").hidden = similar.length === 0;
  renderList($("#rowSimilar"), similar);
}

function renderProviders(m) {
  const region = m["watch/providers"]?.results?.[REGION] ? REGION : "US";
  const p = m["watch/providers"]?.results?.[region];
  const groups = [["flatrate", "Stream"], ["rent", "Rent"], ["buy", "Buy"]];
  const items = p ? groups.flatMap(([key, label]) => (p[key] || []).map((x) => ({ ...x, label }))) : [];
  const seen = new Set();
  const unique = items.filter((x) => !seen.has(x.provider_id) && seen.add(x.provider_id));
  $("#providers").hidden = unique.length === 0;
  $("#providerRegion").textContent = `(${region})`;
  $("#providerList").innerHTML = unique.slice(0, 8).map((x) => `
    <a class="provider" ${p.link ? `href="${escapeHTML(p.link)}" target="_blank" rel="noopener"` : ""} title="${escapeHTML(x.provider_name)}">
      <img src="${IMG}w92${x.logo_path}" alt="" loading="lazy">
      <span>${escapeHTML(x.provider_name)}<small>${x.label}</small></span>
    </a>`).join("");
}

function updateDetailButtons(id) {
  const wl = $("#detailWatchlist");
  wl.textContent = inList("watchlist", id) ? "✓ In Watchlist" : "+ Watchlist";
  wl.classList.toggle("active", inList("watchlist", id));
  const w = $("#detailWatched");
  w.textContent = inList("watched", id) ? "✓ Watched" : "Mark as watched";
  w.classList.toggle("active", inList("watched", id));
}

function renderStars(id) {
  const current = state.ratings[id] || 0;
  $("#userStars").innerHTML = [1, 2, 3, 4, 5]
    .map((n) => `<button role="radio" aria-checked="${n === current}" aria-label="${n} star${n > 1 ? "s" : ""}"
      data-n="${n}" class="${n <= current ? "on" : ""}">★</button>`).join("");
}

function renderReviews(id) {
  const mine = state.reviews[id] || [];
  const theirs = currentMovie?.id === id ? currentMovie.reviews?.results || [] : [];
  $("#reviewCount").textContent = mine.length + theirs.length ? `(${mine.length + theirs.length})` : "";

  const myHTML = mine.map((r, i) => `
    <li>
      <div class="review-head">
        <strong>${escapeHTML(r.name)} ${r.stars ? `<span style="color:var(--gold)">${"★".repeat(r.stars)}</span>` : ""}</strong>
        <span><small>${new Date(r.date).toLocaleDateString()}</small>
        <button class="review-del" data-i="${i}" aria-label="Delete review">Delete</button></span>
      </div>
      <p>${escapeHTML(r.text)}</p>
    </li>`);

  const theirHTML = theirs.slice(0, 6).map((r) => {
    const long = r.content.length > 450;
    const rating = r.author_details?.rating;
    return `
    <li>
      <div class="review-head">
        <strong>${escapeHTML(r.author)}<span class="review-source">TMDB</span>${rating ? ` <span style="color:var(--gold)">★ ${rating}/10</span>` : ""}</strong>
        <small>${new Date(r.created_at).toLocaleDateString()}</small>
      </div>
      <p class="${long ? "clamped" : ""}">${escapeHTML(r.content)}</p>
      ${long ? `<button class="review-more">Read more</button>` : ""}
    </li>`;
  });

  const all = [...myHTML, ...theirHTML];
  $("#reviewList").innerHTML = all.length ? all.join("") : `<li class="muted">No reviews yet. Be the first!</li>`;
}

function openTrailer() {
  const v = pickTrailer(currentMovie?.videos);
  if (!v) return;
  $("#trailerTitle").textContent = `${currentMovie.title} — ${v.name}`;
  $("#trailerFrame").innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(v.key)}?autoplay=1&rel=0"
    title="Trailer" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`;
  $("#trailerModal").hidden = false;
  document.body.style.overflow = "hidden";
}

function closeTrailer() {
  $("#trailerModal").hidden = true;
  $("#trailerFrame").innerHTML = ""; // stops playback
  document.body.style.overflow = "";
}

function initDetail() {
  $("#detailWatchlist").addEventListener("click", () => toggleWatchlist(currentRoute.id));
  $("#detailWatched").addEventListener("click", () => toggleWatched(currentRoute.id));
  $("#trailerBtn").addEventListener("click", openTrailer);
  $("#trailerModal").addEventListener("click", (e) => e.target.closest("[data-close]") && closeTrailer());
  document.addEventListener("keydown", (e) => e.key === "Escape" && !$("#trailerModal").hidden && closeTrailer());

  $("#shareBtn").addEventListener("click", async () => {
    const url = location.href;
    try {
      if (navigator.share) await navigator.share({ title: currentMovie.title, text: `Check out ${currentMovie.title} on FlowingDaFilms`, url });
      else { await navigator.clipboard.writeText(url); toast("Link copied to clipboard"); }
    } catch { /* user cancelled share */ }
  });

  const stars = $("#userStars");
  stars.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    const n = Number(btn.dataset.n);
    const id = currentRoute.id;
    if (state.ratings[id] === n) { delete state.ratings[id]; toast("Rating cleared"); }
    else { state.ratings[id] = n; toast(`You rated this ${n}/5`); }
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
    const id = currentRoute.id;
    const del = e.target.closest(".review-del");
    if (del) {
      state.reviews[id].splice(Number(del.dataset.i), 1);
      store.save();
      renderReviews(id);
      toast("Review deleted");
      return;
    }
    const more = e.target.closest(".review-more");
    if (more) {
      const p = more.previousElementSibling;
      const open = p.classList.toggle("clamped");
      more.textContent = open ? "Read more" : "Show less";
    }
  });
}

/* =========================================================
   Person
   ========================================================= */
async function renderPerson(id, token) {
  const p = await tmdb(`/person/${id}`, { append_to_response: "movie_credits" });
  if (token !== routeToken) return;
  document.title = `${p.name} · FlowingDaFilms`;
  $("#personPhoto").innerHTML = `<div class="poster">${posterHTML(p.profile_path, p.name, "w500")}</div>`;
  $("#personName").textContent = p.name;
  $("#personMeta").textContent = [
    p.known_for_department,
    p.birthday && `Born ${new Date(p.birthday + "T00:00").toLocaleDateString(undefined, { dateStyle: "long" })}`,
    p.place_of_birth,
  ].filter(Boolean).join(" · ");

  const bio = $("#personBio");
  bio.textContent = p.biography || "No biography available.";
  const long = (p.biography || "").length > 700;
  bio.classList.toggle("clamped", long);
  $("#bioToggle").hidden = !long;
  $("#bioToggle").textContent = "Read more";

  const seen = new Set();
  const movies = (p.movie_credits?.cast || [])
    .filter((m) => m.poster_path && !seen.has(m.id) && seen.add(m.id))
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 24);
  renderList($("#personMovies"), movies);
}

$("#bioToggle").addEventListener("click", () => {
  const clamped = $("#personBio").classList.toggle("clamped");
  $("#bioToggle").textContent = clamped ? "Read more" : "Show less";
});

/* =========================================================
   Watchlist
   ========================================================= */
let watchTab = "watchlist";

function renderWatchlist() {
  const movies = state[watchTab];
  movies.forEach((m) => movieCache.set(m.id, m));
  renderList($("#watchlistGrid"), movies);
  $("#watchlistEmpty").hidden = movies.length > 0;
  $("#watchlistSummary").textContent = `${state.watchlist.length} to watch · ${state.watched.length} watched`;
  $$("#watchTabs .tab").forEach((t) => t.classList.toggle("active", t.dataset.tab === watchTab));
}

$("#watchTabs").addEventListener("click", (e) => {
  const tab = e.target.closest(".tab");
  if (!tab) return;
  watchTab = tab.dataset.tab;
  renderWatchlist();
});

/* =========================================================
   Settings (API key)
   ========================================================= */
function setKeyStatus(msg, kind = "") {
  const el = $("#keyStatus");
  el.textContent = msg;
  el.className = `key-status ${kind}`;
}

function renderSettings() {
  const fromScript = Boolean(TMDB_API_KEY);
  const saved = Boolean(state.apiKey);
  $("#keySource").textContent = fromScript
    ? "A key is set in script.js and is used for all visitors. A key saved here overrides it in this browser only."
    : saved ? "A key is saved in this browser." : "No key yet.";
  $("#keyClear").hidden = !saved;
  $("#keyInput").value = "";
  if (!getKey()) setKeyStatus("Add your TMDB key to start loading movies.");
  else setKeyStatus("");
}

function initSettings() {
  $("#keyForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const key = $("#keyInput").value.trim();
    if (!key) return;
    const btn = $("#keySave");
    btn.disabled = true;
    setKeyStatus("Checking key…");
    try {
      await tmdb("/configuration", {}, key); // cheap authenticated call
      state.apiKey = key;
      store.save();
      apiCache.clear();
      genres = null;
      setKeyStatus("Connected!", "ok");
      toast("TMDB connected");
      setTimeout(() => (location.hash = "#/"), 600);
    } catch (err) {
      setKeyStatus(
        err.code === "auth" ? "TMDB rejected that key. Double-check you copied the whole thing." :
        err.code === "network" ? "Couldn't reach TMDB to check the key. Check your connection." :
        `Couldn't verify the key (${err.message}).`,
        "err"
      );
    } finally {
      btn.disabled = false;
    }
  });

  $("#keyClear").addEventListener("click", () => {
    state.apiKey = "";
    store.save();
    apiCache.clear();
    genres = null;
    toast("Saved key removed");
    renderSettings();
  });
}

/* =========================================================
   Hash router
   ========================================================= */
let currentRoute = { name: "home" };
let routeToken = 0;
let retryHandler = null;

function parseRoute() {
  const raw = location.hash.replace(/^#\/?/, "");
  const [path, query = ""] = raw.split("?");
  const parts = path.split("/").filter(Boolean);
  const params = new URLSearchParams(query);
  if (parts.length === 0) return { name: "home" };
  if (parts[0] === "browse") return { name: "browse", params };
  if (parts[0] === "watchlist") return { name: "watchlist" };
  if (parts[0] === "settings") return { name: "settings" };
  if ((parts[0] === "movie" || parts[0] === "person") && /^\d+$/.test(parts[1] || "")) return { name: parts[0], id: Number(parts[1]) };
  return { name: "notfound" };
}

function showView(name) {
  $$(".view").forEach((v) => (v.hidden = v.id !== `view-${name}`));
  $("#pageLoader").hidden = name !== "loading";
}

function showError(title, text, retry) {
  $("#errorTitle").textContent = title;
  $("#errorText").textContent = text;
  retryHandler = retry || null;
  $("#errorRetry").hidden = !retry;
  showView("error");
}

function handleError(err) {
  if (err.code === "auth" || err.code === "nokey") {
    if (err.code === "auth") toast("Your TMDB key was rejected. Please enter a valid key.");
    if (location.hash !== "#/settings") location.hash = "#/settings";
    else router();
    return;
  }
  if (err.code !== "notfound") console.error(err);
  const [title, text] = describeError(err);
  showError(title, text, err.code === "notfound" ? null : router);
}

async function router() {
  const token = ++routeToken;
  const route = parseRoute();
  const prev = currentRoute;
  currentRoute = route;
  document.title = "FlowingDaFilms";
  clearInterval(heroTimer);

  $$(".main-nav a").forEach((a) => a.classList.toggle("active", a.dataset.route === route.name));
  $("#mainNav").classList.remove("open");
  $("#menuToggle").setAttribute("aria-expanded", "false");
  if (!(prev.name === "browse" && route.name === "browse")) window.scrollTo(0, 0);

  try {
    if (route.name === "settings") {
      renderSettings();
      showView("settings");
      document.title = "Settings · FlowingDaFilms";
    } else if (!getKey()) {
      location.replace("#/settings");
      return;
    } else if (route.name === "home") {
      showView("home");
      await renderHome(token);
    } else if (route.name === "browse") {
      readBrowseParams(route.params);
      showView("browse");
      document.title = "Browse · FlowingDaFilms";
      await renderBrowse(token);
    } else if (route.name === "watchlist") {
      renderWatchlist();
      showView("watchlist");
      document.title = "Watchlist · FlowingDaFilms";
    } else if (route.name === "movie") {
      showView("loading");
      await renderMovie(route.id, token);
      if (token === routeToken) showView("movie");
    } else if (route.name === "person") {
      showView("loading");
      await renderPerson(route.id, token);
      if (token === routeToken) showView("person");
    } else {
      showError("404", "That page doesn't exist.");
    }
  } catch (err) {
    if (token === routeToken) handleError(err);
  }
}

$("#errorRetry").addEventListener("click", () => retryHandler && retryHandler());

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
initHomeRows();
initHero();
initBrowse();
initSearch();
initDetail();
initSettings();
refreshSavedIndicators();
window.addEventListener("hashchange", router);
router();
