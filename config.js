// ─────────────────────────────────────────────────────────────
// Noms — configuration
//
// This is the ONLY place the app name and core settings live.
// To rename the app, change `appName` below and nothing else.
// ─────────────────────────────────────────────────────────────
const CONFIG = {
  appName: "Noms",
  tagline: "Places we've eaten, rated 1–7",

  // Where the restaurant data lives (a file in this repo).
  dataUrl: "restaurants.json",

  // The rating scale. Change these two numbers to rescore everything.
  score: { min: 1, max: 7 },

  // Default map view. This is where the map opens.
  //
  // `lockView: true` keeps the map fixed on this center/zoom on load
  // (recommended once you have pins spread across cities or countries, so
  // one far-away restaurant doesn't zoom the whole map out to a continent).
  // Set `lockView: false` to instead auto-fit the view to show every pin.
  // Either way you can still pan/zoom freely, and clicking a list item flies
  // to that restaurant.
  map: {
    center: [51.9223719, 4.4814759], // Rotterdam — Timmerhuis
    zoom: 15,
    lockView: true,
  },

  // A "home" marker shown on the map (not a restaurant). Set to null to hide.
  home: {
    lat: 51.9223719,
    lng: 4.4814759,
    label: "Sha's lair",
  },
};
