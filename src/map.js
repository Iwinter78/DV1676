import L from "leaflet";
import { OpenLocationCode } from "open-location-code";
document.addEventListener("DOMContentLoaded", () => {
  const openLocationCode = new OpenLocationCode();
  const locateButton = document.getElementById("locate-user");
  const cityDropdown = document.getElementById("city-select");
  const userData = JSON.parse(
    document.querySelector('meta[name="userInfo"]').getAttribute("content"),
  );

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

    // WebSocket for bike movement
    const bikeMarker = L.marker([latitude, longitude], {
      icon: simIcon,
    }).addTo(map);

    const ws = new WebSocket("ws://localhost:5001"); // Connect to your WebSocket server
    ws.onmessage = (message) => {
      const data = JSON.parse(message.data);
      const { id, location } = data;

      // Update the bike marker's position
      bikeMarker
        .setLatLng([location[0], location[1]])
        .bindPopup(`Bike ${id}`)
        .openPopup();
    };

    async function fetchBikes() {
      try {
        const response = await fetch("http://localhost:1337/api/v1/bike", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        return response.json();
      } catch (error) {
        console.error("Error fetching bikes:", error);
        return [];
      }
    }

    async function displayBikes() {
      try {
        const data = await fetchBikes();
        const bikes = data[0];

        bikes.forEach((bike) => {
          let lat = 0;
          let lng = 0;

          if (bike.city === 1) {
            lat = 56.1;
            lng = 15.5;
          } else if (bike.city === 2) {
            lat = 59.3;
            lng = 18.1;
          } else if (bike.city === 3) {
            lat = 55.6;
            lng = 13.0;
          }

          // Decode Open Location Code
          const findCode = openLocationCode.recoverNearest(bike.gps, lat, lng);
          const decodedCoordinates = openLocationCode.decode(findCode);
          const latitude = decodedCoordinates.latitudeCenter;
          const longitude = decodedCoordinates.longitudeCenter;

          if (bike.currentuser === userData.id) {
            L.marker([latitude, longitude], { icon: bookedBikeIcon })
              .addTo(map)
              .bindPopup(
                `Cykel: ${bike.id} <br> <a href="/book/confirm/${bike.id}">Se bokning</a>`,
              )
              .openPopup();
          } else {
            L.marker([latitude, longitude], { icon: availableBikeIcon })
              .addTo(map)
              .bindPopup(
                `Cykel: ${bike.id} <br> <a href="/book/confirm/${bike.id}">Boka</a>`,
              )
              .openPopup();
          }
        });
      } catch (error) {
        console.error("Error displaying bikes:", error);
      }
    }

    displayBikes();

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
