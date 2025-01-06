import L from "leaflet";
import { OpenLocationCode } from "open-location-code";

document.addEventListener("DOMContentLoaded", () => {
  const openLocationCode = new OpenLocationCode();
  const locateButton = document.getElementById("locate-user");
  const cityDropdown = document.getElementById("city-select");
  const userData = JSON.parse(
    document.querySelector('meta[name="userInfo"]').getAttribute("content"),
  );

  async function getRole(user) {
    const response = await fetch(
      `http://localhost:1337/api/v1/user?username=${user}`,
    );
    const data = await response.json();
    return data[0][0].role;
  }

  navigator.geolocation.getCurrentPosition(async (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    function createIcon(color) {
      return L.divIcon({
        className: "custom-marker",
        html: `<div style="font-size: 30px; color: ${color}; font-weight: bold;">●</div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      });
    }

    const customIcon = createIcon("#ff00ce");
    const availableBikeIcon = createIcon("#00ff00");
    const bookedBikeIcon = createIcon("#ff0000");
    const simIcon = createIcon("#FF7518");
    const needsAttentionIcon = createIcon("#FFA500");

    const map = L.map("map").setView([latitude, longitude], 16);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    L.marker([latitude, longitude], { icon: customIcon })
      .addTo(map)
      .bindPopup("Här är du!")
      .openPopup();

    async function fetchBikes() {
      try {
        const response = await fetch("http://localhost:1337/api/v1/bike", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        const data = await response.json();
        console.log("Fetched bikes data:", data);

        return data.map((bike) => {
          const decoded = openLocationCode.decode(bike.gps);
          console.log("Decoded OLC:", decoded);
          return {
            id: bike.id,
            start: [decoded.latitudeCenter, decoded.longitudeCenter],
            city: bike.city,
            status: bike.status,
          };
        });
      } catch (error) {
        console.error("Error fetching bikes:", error);
        return [];
      }
    }

    async function displayBikes() {
      const bikes = await fetchBikes();

      bikes.forEach(async (bike) => {
        const { id, start, currentuser, status } = bike;

        let markerIcon = availableBikeIcon;

        if (
          currentuser === userData.id ||
          (await getRole(userData.id)) === "admin"
        ) {
          markerIcon = bookedBikeIcon;
        } else if (status === 1) {
          markerIcon = needsAttentionIcon;
        }

        if (!bikeMarkers[id]) {
          // Create marker if it doesn't exist
          bikeMarkers[id] = L.marker(start, { icon: markerIcon })
            .addTo(map)
            .bindPopup(`Bike ${id}`);
        }
      });
    }

    displayBikes();

    const bikeMarkers = {};

    const ws = new WebSocket("ws://localhost:5001");

    ws.onopen = () => {
      console.log("WebSocket connection established.");
    };

    ws.onmessage = (message) => {
      const bikeUpdates = JSON.parse(message.data);

      bikeUpdates.forEach((bike) => {
        const { id, location } = bike;
        console.log(`Processing bike ${id} at location:`, location);

        if (bikeMarkers[id]) {
          // Update existing marker
          bikeMarkers[id].setLatLng([location[1], location[0]]);
        } else {
          // Create a new marker if it doesn't exist
          bikeMarkers[id] = L.marker([location[1], location[0]], {
            icon: simIcon,
          })
            .addTo(map)
            .bindPopup(`Bike ${id}`);
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
            console.error(
              "Insufficient GPS coordinates for station:",
              station.id,
            );
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

    locateButton.addEventListener("click", () => {
      map.locate({ setView: true, maxZoom: 16 });
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
      map.setView([selectedCity.lat, selectedCity.lng], 15);
    });
  });
});
