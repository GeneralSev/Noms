// ─────────────────────────────────────────────────────────────
// Noms — app logic
//
// Reads restaurants.json, draws pins on a map, and lists them
// underneath. No framework, no build step. Keep it simple.
// ─────────────────────────────────────────────────────────────

let map;
let markersLayer;
const markersByName = new Map(); // name -> Leaflet marker, for list→map clicks
let restaurants = [];

document.addEventListener("DOMContentLoaded", init);

async function init() {
  applyBranding();
  map = initMap();
  addHome();
  try {
    restaurants = await loadData();
  } catch (err) {
    return showStatus(`Couldn't load restaurants: ${err.message}`);
  }
  document.getElementById("search").addEventListener("input", (e) =>
    render(filter(restaurants, e.target.value))
  );
  render(restaurants);
}

// ── Branding: everything user-facing comes from CONFIG ──────────
function applyBranding() {
  document.title = CONFIG.appName;
  document.getElementById("app-name").textContent = CONFIG.appName;
  document.getElementById("app-tagline").textContent = CONFIG.tagline;
}

// ── Map ─────────────────────────────────────────────────────────
function initMap() {
  const m = L.map("map").setView(CONFIG.map.center, CONFIG.map.zoom);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "© OpenStreetMap contributors",
  }).addTo(m);
  markersLayer = L.layerGroup().addTo(m);
  return m;
}

// A persistent "home" marker — not a restaurant, so it lives directly on the
// map (survives search/filter) rather than in markersLayer.
function addHome() {
  const h = CONFIG.home;
  if (!h || typeof h.lat !== "number" || typeof h.lng !== "number") return;
  const icon = L.divIcon({
    className: "home-pin",
    html: `<span class="home-badge">🏠</span>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
  L.marker([h.lat, h.lng], { icon, zIndexOffset: 1000 })
    .addTo(map)
    .bindPopup(`<div class="popup"><strong>${escapeHtml(h.label || "Home")}</strong></div>`);
}

// ── Data ────────────────────────────────────────────────────────
async function loadData() {
  const res = await fetch(CONFIG.dataUrl, { cache: "no-store" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  if (!Array.isArray(data)) throw new Error("data is not a list");
  return data;
}

function filter(list, query) {
  const q = query.trim().toLowerCase();
  if (!q) return list;
  return list.filter((r) =>
    [r.name, r.notes, ...(r.cuisine || [])]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(q)
  );
}

// ── Rendering ───────────────────────────────────────────────────
function render(list) {
  renderMarkers(list);
  renderList(list);
  const total = restaurants.length;
  document.getElementById("count").textContent =
    list.length === total
      ? `${total} place${total === 1 ? "" : "s"}`
      : `${list.length} of ${total}`;
}

function renderMarkers(list) {
  markersLayer.clearLayers();
  markersByName.clear();
  const points = [];

  for (const r of list) {
    if (!hasCoords(r)) continue;
    const marker = L.marker([r.lat, r.lng], { icon: makeIcon(r.score) })
      .addTo(markersLayer)
      .bindPopup(popupHtml(r));
    markersByName.set(r.name, marker);
    points.push([r.lat, r.lng]);
  }

  const h = CONFIG.home;
  if (h && typeof h.lat === "number" && typeof h.lng === "number") {
    points.push([h.lat, h.lng]); // keep home in view when the map auto-fits
  }

  if (points.length) map.fitBounds(points, { padding: [40, 40], maxZoom: 15 });
}

function renderList(list) {
  const ul = document.getElementById("list");
  ul.innerHTML = "";

  const sorted = [...list].sort((a, b) => (b.score || 0) - (a.score || 0));
  for (const r of sorted) {
    const li = document.createElement("li");
    li.className = "card";
    li.innerHTML = cardHtml(r);
    if (hasCoords(r)) {
      li.classList.add("clickable");
      li.addEventListener("click", () => focusOn(r));
    }
    ul.appendChild(li);
  }
}

function focusOn(r) {
  const marker = markersByName.get(r.name);
  if (!marker) return;
  map.setView([r.lat, r.lng], Math.max(map.getZoom(), 15));
  marker.openPopup();
  document.getElementById("map").scrollIntoView({ behavior: "smooth" });
}

// ── Small view helpers ──────────────────────────────────────────
function hasCoords(r) {
  return typeof r.lat === "number" && typeof r.lng === "number";
}

function scoreColor(score) {
  const { min, max } = CONFIG.score;
  const t = Math.max(0, Math.min(1, (score - min) / (max - min)));
  return `hsl(${Math.round(t * 120)}, 65%, 42%)`; // red → green
}

function makeIcon(score) {
  return L.divIcon({
    className: "pin",
    html: `<span class="pin-badge" style="background:${scoreColor(score)}">${escapeHtml(
      score
    )}</span>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -16],
  });
}

function scoreBadge(score) {
  return `<span class="badge" style="background:${scoreColor(score)}">${escapeHtml(
    score
  )}</span>`;
}

function cuisineTags(cuisine) {
  if (!cuisine || !cuisine.length) return "";
  return `<div class="tags">${cuisine
    .map((c) => `<span class="tag">${escapeHtml(c)}</span>`)
    .join("")}</div>`;
}

function returnFlag(wouldReturn) {
  if (wouldReturn === true) return `<span class="ret yes">↺ would return</span>`;
  if (wouldReturn === false) return `<span class="ret no">✗ wouldn't return</span>`;
  return "";
}

function cardHtml(r) {
  return `
    <div class="card-head">
      ${scoreBadge(r.score)}
      <div class="card-title">
        <strong>${escapeHtml(r.name)}</strong>
        ${r.address ? `<span class="addr">${escapeHtml(r.address)}</span>` : ""}
      </div>
    </div>
    ${cuisineTags(r.cuisine)}
    ${r.notes ? `<p class="notes">${escapeHtml(r.notes)}</p>` : ""}
    ${returnFlag(r.wouldReturn)}
  `;
}

function popupHtml(r) {
  return `
    <div class="popup">
      <strong>${escapeHtml(r.name)}</strong> ${scoreBadge(r.score)}
      ${r.notes ? `<p class="notes">${escapeHtml(r.notes)}</p>` : ""}
      ${returnFlag(r.wouldReturn)}
    </div>
  `;
}

function showStatus(msg) {
  const el = document.getElementById("status");
  el.textContent = msg;
  el.hidden = false;
}

function escapeHtml(value) {
  return String(value ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );
}
