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

// game portion

class Stop {
	constructor(lat, lon) {
		this.latLon = L.latLng(lat, lon);
		this.passengers = 0;
		this.sweeped = false;
	}

	collides(latLon) {
		return this.latLon.distanceTo(latLon) <= 3 && this.passengers > 0 && !this.sweeped;
	}

	add_passengers(int) {
		this.passengers += int;
	}

	sub_passengers(int) {
		this.passengers -= int;
		if (this.passengers < 0) {
			this.passengers = 0;
		}
	}
}

const SIZE = 5;
let parts = [L.latLng(start.stop_lat, start.stop_lon)];
let stops = DATA.map(i => new Stop(i.stop_lat, i.stop_lon));
let direction = "";

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

	for (let stop of stops) {
		if (stop.collides(parts[0])) {
			stop.sweeped = true;
			let amount = Math.floor(Math.random() * stop.passengers);
			stop.sub_passengers(amount);
			for (let i = 0; i < amount; i++) {
				parts.push(L.latLng(0, 0));
			}
		}
	}

	// move snake parts
	for (let i = parts.length - 1; i > 0; i--) {
		console.log(i + ": " + parts[i]);
		parts[i].lat = parts[i - 1].lat;
		parts[i].lng = parts[i - 1].lng;
	}

	switch(direction) {
		case "north": parts[0].lat += distance; break;
		case "east":  parts[0].lng += distance * 1.4; break;
		case "south": parts[0].lat -= distance; break;
		case "west":  parts[0].lng -= distance * 1.4; break;
	}

	console.log(parts);
	// render
	map.panTo(parts[0]);
	for (const i of parts) {
		if (i) {
			group.addLayer(L.rectangle(i.toBounds(SIZE)));
		}
	}
}

function random_range(min, max) {
	return Math.random() * (max - min) + min;
}

let pass_group = L.layerGroup();
pass_group.addTo(map);
function update_passengers() {
	pass_group.clearLayers();
	for (let stop of stops) {
		stop.sweeped = false;
		let add = Math.random() > 0.5
		if (Math.random() > 0.4) {
			stop.add_passengers(Math.random() * 4);
		} else {
			stop.sub_passengers(Math.random() * 3);
		}
		for (let i = 0; i < stop.passengers; i++) {
			let bounds = stop.latLon.toBounds(Math.random() * 7);
			let lat = random_range(bounds.getSouth(), bounds.getNorth());
			let lon = random_range(bounds.getWest(), bounds.getEast());
			pass_group.addLayer(L.circle([lat, lon], {
				radius: 1,
				color: "red",
			}));
		}
	}
}

map.on("keypress", handle_key);
setInterval(update, 200);
setInterval(update_passengers, 7500);

