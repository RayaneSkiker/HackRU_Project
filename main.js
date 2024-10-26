import { DATA, GEOJSON } from "./data.js";

let start = DATA[Math.floor(Math.random() * DATA.length)];
let map = L.map("map", { zoomControl: false }).setView([start.stop_lat, start.stop_lon], 19);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
	maxZoom: 19,
	// minZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles courtesy of <a href="https://www.openstreetmap.cat" target="_blank">Breton OpenStreetMap Team</a>'
}).addTo(map);
L.layerGroup().addTo(map);
L.geoJSON(GEOJSON, { fillColor: "none", color: "red" }).addTo(map);

let bounds = map.getBounds();
for (const i of DATA) {
	L.marker([i.stop_lat, i.stop_lon], {alt: i.stop_name}).addTo(map).bindPopup(i.stop_name);
	bounds.extend(L.latLng(i.stop_lat, i.stop_lon));
}
map.setMaxBounds(bounds.pad(0.20));

function setup() {
}

function draw() {
}
