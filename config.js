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

  // Default map view. Only used before any pins load — once you have
  // restaurants, the map auto-fits to show them all. Set this to your
  // home city so an empty map still looks sensible.
  map: {
    center: [51.9223719, 4.4814759], // Rotterdam — Timmerhuis
    zoom: 15,
  },
};
