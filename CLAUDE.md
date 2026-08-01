# CLAUDE.md — working instructions for this repo

Noms is a personal restaurant-rating map. This file tells you (Claude) how to
work on it. Read the README for the human-facing overview.

## What this is

A **pure static site, no backend.** Git is the database, GitHub is the admin
panel, GitHub Pages serves it. There is nothing to build and nothing to run in
production.

- Data lives in **`restaurants.json`** (the single source of truth).
- **`config.js`** holds the app name, rating scale, default map view, and the
  home marker. Change the app name here and nowhere else.
- **`index.html` / `app.js` / `styles.css`** are the site. Rarely need changes.
- Map: **Leaflet + OpenStreetMap**, no API key.
- Live site: https://generalsev.github.io/Noms/
- Repo: https://github.com/GeneralSev/Noms

## The main task: adding a restaurant

When the user says something like *"add <name>, score <n>, notes …, tags …,
would/wouldn't return"*, do this:

1. **Geocode it.** The places are almost all in **Rotterdam, Netherlands** —
   assume Rotterdam unless the user says otherwise. Fetch:
   `https://nominatim.openstreetmap.org/search?format=json&limit=3&q=<name>,+Rotterdam`
   Take the best match; use its `lat`, `lon`, and a clean street address.
2. **Append** one object to the array in `restaurants.json` (see schema below).
3. **Commit and push** to `main` (see conventions). It goes live in ~1 min.

Confirm the geocoded location back to the user if the match is at all ambiguous.

## Data schema (one object per restaurant)

```json
{
  "name": "Ristorante Napoli",
  "address": "Meent 81a, 3011 JG Rotterdam, Netherlands",
  "lat": 51.9226158,
  "lng": 4.4832388,
  "score": 7,
  "cuisine": ["Italian", "Carbonara"],
  "wouldReturn": true,
  "notes": "Best carbonara in town"
}
```

- **Required:** `name`, `lat`, `lng`, `score`.
- **`score`:** integer **1–7** only (no decimals). Pins are colored red→green
  across this scale.
- **Optional:** `address`, `cuisine` (array of strings), `wouldReturn`
  (true/false), `notes`.
- Store both `address` (human) and `lat`/`lng` (from geocoding) so the live site
  never makes a geocoding call.

## Conventions

- **Branch:** `main`. Commit and push directly (this is a personal project).
- **Git identity** is set locally in the repo (GeneralSev). Commit with plain
  `git commit -m "…"` — do NOT pass `-c user.name=…`; the allow-rules match the
  plain form.
- **Commit messages:** short imperative subject, e.g. `Add Little V (Vietnamese,
  score 6)`. Keep the `Co-Authored-By: Claude …` trailer.
- The `LF will be replaced by CRLF` git warning is harmless — ignore it.
- Permissions for geocoding and git add/commit/push are pre-approved in
  `.claude/settings.local.json` (gitignored, machine-local).

## Home marker

`config.js` has a `home` entry (currently Rotterdam — Timmerhuis) shown as a 🏠
on the map. It is not a restaurant and is excluded from the list/search. Set
`home: null` to hide it.
