# Noms

A tiny, no-backend map of restaurants we've eaten at, rated 1–7.

It's a plain static site: one HTML file, one JS file, and a JSON file that
holds all the data. No build step, no database, no server. The map uses
[Leaflet](https://leafletjs.com/) + OpenStreetMap (no API key needed).

## How it works

- **`restaurants.json`** — the single source of truth. Every restaurant is one
  object in this list.
- **`config.js`** — the app name (`Noms`), the rating scale, and the default map
  view. Change the name here and nowhere else.
- **`index.html` / `app.js` / `styles.css`** — the site. Rarely need touching.

## Adding a restaurant

Add an object to the list in `restaurants.json`:

```json
{
  "name": "Joe's Pizza",
  "address": "7 Carmine St, New York, NY 10014",
  "lat": 40.73058,
  "lng": -74.00265,
  "score": 6,
  "cuisine": ["pizza", "casual"],
  "wouldReturn": true,
  "notes": "Classic plain slice."
}
```

**Required:** `name`, `lat`, `lng`, `score` (an integer 1–7).
**Optional:** `address`, `cuisine` (a list), `wouldReturn` (true/false), `notes`.

Three ways to add one:

1. **Ask Claude.** Give it the name + your score + notes. It looks up the
   coordinates and commits the change for you. (On your phone this needs the
   GitHub connector enabled in the Claude app.)
2. **GitHub web UI.** Edit `restaurants.json` on github.com and commit. If you
   don't know the `lat`/`lng`, search the address on
   [openstreetmap.org](https://www.openstreetmap.org), right-click the spot →
   "Show address" to get the coordinates — or just leave them out and ask Claude
   to fill them in.
3. **Locally.** Edit the file, `git commit`, `git push`.

## Running it locally

Because the app `fetch`es a JSON file, opening `index.html` directly won't work
in some browsers. Serve the folder instead:

```bash
python -m http.server 8000
```

Then open <http://localhost:8000>.

## Publishing (GitHub Pages)

1. Create a new GitHub repo and push this folder to it.
2. Repo **Settings → Pages → Build and deployment**: source = "Deploy from a
   branch", branch = `main`, folder = `/ (root)`.
3. Your site appears at `https://<username>.github.io/<repo>/` within a minute.

The empty `.nojekyll` file tells Pages to serve everything as-is.

## Renaming the app

Change `appName` in `config.js`. That's it — the title, header, and tab name all
read from there.
