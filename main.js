import { DATA, GEOJSON } from "./data.js";

// set up the map
let start = DATA[Math.floor(Math.random() * DATA.length)];
let map = L.map("map", { zoomControl: false, maxBoundsViscosity: 1.0 }).setView([start.stop_lat, start.stop_lon], 19);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
	maxZoom: 19,
	minZoom: 15,
	edgeBufferTiles: 10,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles courtesy of <a href="https://www.openstreetmap.cat" target="_blank">Breton OpenStreetMap Team</a>'
}).addTo(map);
L.geoJSON(GEOJSON, { fillColor: "none", color: "red" }).addTo(map);
let bounds = map.getBounds();
for (const i of DATA) {
	L.marker([i.stop_lat, i.stop_lon], {alt: i.stop_name}).addTo(map).bindPopup(i.stop_name);
	bounds.extend(L.latLng(i.stop_lat, i.stop_lon));
}
map.setMaxBounds(bounds.pad(0.20));
// group.addTo(map);

// "snake" portion
const SIZE = 5;
let parts = [L.latLng(start.stop_lat, start.stop_lon)];
let direction = "";
let length = 0;

// find distance needed between boxes for drawing
let center = L.latLng(0, 0);
let bbounds = center.toBounds(SIZE);
let distance = bbounds.getEast() * 2.5;

// input
function handle_key(e) {
	const key = e.originalEvent.key;
	if (key == "w" && direction != "south") {
		direction = "north";
	} else if (key == "s" && direction != "north") {
		direction = "south";
	} else if (key == "d" && direction != "west") {
		direction = "east";
	} else if (key == "a" && direction != "east") {
		direction = "west";
	}
}

let group = L.layerGroup();
group.addTo(map);
function update() {
	group.clearLayers();
	// move snake parts
	for (const i = parts.len - 1; i > 0; i--) {
		parts[i] = parts[i - 1];
	}
	switch(direction) {
		case "north": parts[0].lat += distance; break;
		case "east":  parts[0].lng += distance * 1.4; break;
		case "south": parts[0].lat -= distance; break;
		case "west":  parts[0].lng -= distance * 1.4; break;
	}


	// render
	map.panTo(parts[0]);
	for (const i of parts) {
		group.addLayer(L.rectangle(i.toBounds(SIZE)));
	}
}

map.on("keypress", handle_key);
setInterval(update, 200);

