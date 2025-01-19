import L from "leaflet";

// Default position for the map
const latitude = 56.161444;
const longitude = 15.586355;

// Function to create a custom marker icon
function createIcon(color) {
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="font-size: 30px; color: ${color}; font-weight: bold;">●</div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
}

const availableBikeIcon = createIcon("#00ff00");
const bookedBikeIcon = createIcon("#ff0000");

const map = L.map("map").setView([latitude, longitude], 18);
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 20,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

const bikeMarkers = {};
// Websocket connection
const ws = new WebSocket("ws://localhost:5001");

ws.onopen = () => {
  console.log("WebSocket connection established.");
};

ws.onmessage = (message) => {
  const bikeUpdates = JSON.parse(message.data);
  bikeUpdates.forEach((bike) => {
    const { id, location, speed, currentuser } = bike;

    console.log(`Processing bike ${id}:`, { location, speed, currentuser });

    if (bikeMarkers[id]) {
      bikeMarkers[id].setLatLng([location[1], location[0]]);
      bikeMarkers[id].setPopupContent(`
            <div>
              <p><strong>Bike ID:</strong> ${id}</p>
              <p><strong>User:</strong> ${currentuser || "None"}</p>
              <p><strong>Speed:</strong> ${speed} km/h</p>
            </div>
          `);
    } else {
      bikeMarkers[id] = L.marker([location[1], location[0]], {
        icon: currentuser ? bookedBikeIcon : availableBikeIcon,
      }).addTo(map).bindPopup(`
          <div>
            <p><strong>Bike ID:</strong> ${id}</p>
            <p><strong>User:</strong> ${currentuser || "None"}</p>
            <p><strong>Speed:</strong> ${speed} km/h</p>
          </div>
        `);
    }
  });
};

async function fetchStations() {
  try {
    const response = await fetch("http://localhost:1337/api/v1/stations", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return response.json();
  } catch (error) {
    console.error("Error fetching stations:", error);
    return [];
  }
}

async function displayStations() {
  try {
    const data = await fetchStations();
    const stations = data[0];

    stations.forEach((station) => {
      console.log("Station data:", station);

      // Parse the GPS string into an array
      let coordinates;

      coordinates = JSON.parse(station.gps);

      // Ensure coordinates are valid
      if (!Array.isArray(coordinates) || coordinates.length < 3) {
        console.error("Insufficient GPS coordinates for station:", station.id);
        return;
      }

      // Draw the polygon
      L.polygon(coordinates, {
        color: "blue",
        fillColor: "#30a1ff",
        fillOpacity: 0.4,
      })
        .addTo(map)
        .bindPopup(
          `Station ID: ${station.id}<br>Charging Size: ${station.charging_size}`,
        );
    });
  } catch (error) {
    console.error("Error displaying stations:", error);
  }
}

displayStations();

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded");
  const locateButton = document.getElementById("locate-user");
  const cityDropdown = document.getElementById("city-select");

  locateButton.addEventListener("click", () => {
    map.locate({ setView: true, maxZoom: 18 });
  });

  fetch("/cities.json")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((city) => {
        const option = document.createElement("option");
        option.value = JSON.stringify({ lat: city.lat, lng: city.lng });
        option.textContent = city.name;
        cityDropdown.appendChild(option);
      });
    });

  cityDropdown.addEventListener("change", (e) => {
    const selectedCity = JSON.parse(e.target.value);
    map.setView([selectedCity.lat, selectedCity.lng], 16);
  });
});
