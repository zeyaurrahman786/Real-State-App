const mapToken = "pk.eyJ1IjoiZGVsdGEtc3R1ZGVudHMiLCJhIjoiY2x5dnpsY3h6MHRqeTJsc2xmNW52a2h3NSJ9.7IP4f7Gk1WF1MAH-q-NPTg"; // Replace with your actual access token
mapboxgl.accessToken = mapToken;

// Define the 'listing' object with geometry and location details
const listing = {
  geometry: {
    coordinates: [78.9629, 20.5937], // Example coordinates [longitude, latitude]
  },
  location: "Sample Location", // Example title for the location
};

const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/outdoors-v12", // style URL
  center: listing.geometry.coordinates, // starting position [lng, lat]
  zoom: 5, // starting zoom
});

const marker = new mapboxgl.Marker({ color: "red" })
  .setLngLat(listing.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 24 }).setHTML(
      `<h4>${listing.location}</h4><p>Exact Location will be provided after booking</p>`
    )
  )
  .addTo(map);

map.addControl(new mapboxgl.FullscreenControl());
map.addControl(new mapboxgl.NavigationControl());
map.addControl(new mapboxgl.ScaleControl());

map.zoomTo(14, {
  duration: 8000,
  offset: [0, 0],
});





// ----------------Add an animated icon to the map------------------------------
const size = 200;
const pulsingDot = {
  width: size,
  height: size,
  data: new Uint8Array(size * size * 4),

  onAdd: function () {
    const canvas = document.createElement("canvas");
    canvas.width = this.width;
    canvas.height = this.height;
    this.context = canvas.getContext("2d");
  },

  render: function () {
    const duration = 1000;
    const t = (performance.now() % duration) / duration;
    const radius = (size / 2) * 0.3;
    const outerRadius = (size / 2) * 0.7 * t + radius;
    const context = this.context;

    context.clearRect(0, 0, this.width, this.height);
    context.beginPath();
    context.arc(this.width / 2, this.height / 2, outerRadius, 0, Math.PI * 2);
    context.fillStyle = `rgba(255, 150, 150, ${1 - t})`;
    context.fill();

    context.beginPath();
    context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2);
    context.fillStyle = "rgba(255, 100, 100, 10)";
    context.strokeStyle = "white";
    context.lineWidth = 2 + 4 * (1 - t);
    context.fill();
    context.stroke();

    this.data = context.getImageData(0, 0, this.width, this.height).data;
    map.triggerRepaint();

    return true;
  },
};

map.on("load", () => {
  map.addImage("pulsing-dot", pulsingDot, { pixelRatio: 2 });
  map.addSource("dot-point", {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: listing.geometry.coordinates,
          },
        },
      ],
    },
  });

  map.addLayer({
    id: "layer-with-pulsing-dot",
    type: "symbol",
    source: "dot-point",
    layout: {
      "icon-image": "pulsing-dot",
    },
  });
});

const geocoder = new MapboxGeocoder({
  accessToken: mapboxgl.accessToken,
  types: "poi",
  render: function (item) {
    const maki = item.properties.maki || "marker";
    return `<div class='geocoder-dropdown-item'>
      <img class='geocoder-dropdown-icon' src='https://unpkg.com/@mapbox/maki@6.1.0/icons/${maki}-15.svg'>
      <span class='geocoder-dropdown-text'>${item.text}</span>
    </div>`;
  },
  mapboxgl: mapboxgl,
});
map.addControl(geocoder);
