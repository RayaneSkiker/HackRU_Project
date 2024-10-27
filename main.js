import { DATA, GEOJSON } from "./data.js";

let start = DATA[Math.floor(Math.random() * DATA.length)];
let leaflet;
let canvas;

window.setup = function() {
	leaflet = L.map("map", { zoomControl: false, maxBoundsViscosity: 1.0 }).setView([start.stop_lat, start.stop_lon], 19);
	canvas = createCanvas(windowWidth, windowHeight);

	L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
		maxZoom: 19,
		// minZoom: 19,
		edgeBufferTiles: 10,
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles courtesy of <a href="https://www.openstreetmap.cat" target="_blank">Breton OpenStreetMap Team</a>'
	}).addTo(leaflet);

	L.Canvas = L.Layer.extend({
		onAdd(map) {
			let pane = map.getPane(this.options.pane);
			this._container = L.DomUtil.create("div");
			this._container.appendChild(canvas.canvas);
			pane.appendChild(this._container);
		},
		onRemove(map) {
			this._container.remove();
		}
	});
	L.canvas = () => new L.Canvas;

	leaflet.addLayer(L.canvas());
	L.layerGroup().addTo(leaflet);
	L.geoJSON(GEOJSON, { fillColor: "none", color: "red" }).addTo(leaflet);

	let bounds = leaflet.getBounds();
	for (const i of DATA) {
		L.marker([i.stop_lat, i.stop_lon], {alt: i.stop_name}).addTo(leaflet).bindPopup(i.stop_name);
		bounds.extend(L.latLng(i.stop_lat, i.stop_lon));
	}
	leaflet.setMaxBounds(bounds.pad(0.20));
}

window.resize = function() {
	resizeCanvas(windowWidth, windowHeight);
}

window.draw = function() {
}
