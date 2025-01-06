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
    const chargingMode = bookedBikeIcon;

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

    function isPointInStation(bikeCords, stationCords) {
      const polygonCords = stationCords.map((cord) => L.latLng(cord));

      const polygon = L.polygon(polygonCords);

      const bikePoint = L.latLng(bikeCords);

      return polygon.getBounds().contains(bikePoint);
    }

    async function checkBikeInAnyStation(bike) {
      const response = await fetch("http://localhost:1337/api/v1/stations");
      const data = await response.json();
      const stations = data[0];

      for (const station of stations) {
        const stationCoordinates = JSON.parse(station.gps);

        if (isPointInStation(bike, stationCoordinates)) {
          return {
            isInStation: true,
            stationId: station.id,
            chargingSize: station.charging_size,
          };
        }
      }

      return {
        isInStation: false,
        stationId: null,
        chargingSize: null,
      };
    }

    async function displayBikes() {
      try {
        const data = await fetchBikes();
        const bikes = data[0];

        bikes.forEach(async (bike) => {
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

          // Check if bike is in a station
          const stationCheck = await checkBikeInAnyStation([
            latitude,
            longitude,
          ]);

          let bikeIcon;
          let popupContent;

          if (stationCheck.isInStation) {
            // Bike is in a charging station
            if (bike.status === 1) {
              bikeIcon = needsAttentionIcon;
              popupContent = `Cykel: ${bike.id} <br> I laddningsstation ${stationCheck.stationId} <br> Behöver laddas`;
            } else if (bike.status === 2) {
              bikeIcon = chargingMode;
              popupContent = `Cykel: ${bike.id} <br> Laddning pågår i station ${stationCheck.stationId}`;
            } else {
              bikeIcon = availableBikeIcon;
              popupContent = `Cykel: ${bike.id} <br> I laddningsstation ${stationCheck.stationId} <br> <a href="/book/confirm/${bike.id}">Boka</a>`;
            }
          } else {
            if (
              bike.currentuser === userData.id ||
              getRole(userData.login) === "admin"
            ) {
              bikeIcon = bookedBikeIcon;
              popupContent = `Cykel: ${bike.id} <br> <a href="/book/confirm/${bike.id}">Se bokning</a>`;
            } else if (bike.status === 1) {
              bikeIcon = needsAttentionIcon;
              popupContent = `Cykel: ${bike.id} <br> <a href="/book/confirm/${bike.id}">Boka</a>`;
            } else {
              bikeIcon = availableBikeIcon;
              popupContent = `Cykel: ${bike.id} <br> <a href="/book/confirm/${bike.id}">Boka</a>`;
            }
          }

          L.marker([latitude, longitude], { icon: bikeIcon })
            .addTo(map)
            .bindPopup(popupContent)
            .openPopup();
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
