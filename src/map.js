import L from "leaflet";
import { OpenLocationCode } from "open-location-code";

// Global state
let stationCounters = {};
let parkingZoneCounters = {};

// Utility Functions
function createIcon(color) {
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="font-size: 30px; color: ${color}; font-weight: bold;">●</div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
}

function isPointInStation(bikeCords, stationCords) {
  const polygonCords = stationCords.map((cord) => L.latLng(cord));
  const polygon = L.polygon(polygonCords);
  const bikePoint = L.latLng(bikeCords);
  return polygon.getBounds().contains(bikePoint);
}

// API Functions
async function getRole(user) {
  const response = await fetch(
    `http://localhost:1337/api/v1/user?username=${user}`,
  );
  const data = await response.json();
  return data[0][0].role;
}

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

async function fetchParking() {
  try {
    const response = await fetch("http://localhost:1337/api/v1/parking", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return response.json();
  } catch (error) {
    console.error("Error fetching parking:", error);
    return [];
  }
}

// Location Check Functions
async function checkBikeInAnyStation(bike) {
  const response = await fetch("http://localhost:1337/api/v1/parking");
  const data = await response.json();
  const parkingZones = data[0];

  for (const zone of parkingZones) {
    const zoneCoordinates = JSON.parse(zone.gps);

    if (isPointInStation(bike, zoneCoordinates)) {
      if (!stationCounters[zone.id]) {
        stationCounters[zone.id] = 1;
      } else {
        stationCounters[zone.id]++;
      }

      console.log(stationCounters);

      return {
        isInParking: true,
        zoneId: zone.id,
        bikeCount: stationCounters[zone.id],
      };
    }
  }
  return {
    isInParking: false,
    zoneId: null,
    bikeCount: 0,
  };
}

async function checkBikeInAnyParking(bike) {
  const response = await fetch("http://localhost:1337/api/v1/parking");
  const data = await response.json();
  const parkingZones = data[0];

  for (const zone of parkingZones) {
    const zoneCoordinates = JSON.parse(zone.gps);

    if (isPointInStation(bike, zoneCoordinates)) {
      if (!parkingZoneCounters[zone.id]) {
        parkingZoneCounters[zone.id] = 1;
      } else {
        parkingZoneCounters[zone.id]++;
      }

      return {
        isInParking: true,
        zoneId: zone.id,
        bikeCount: parkingZoneCounters[zone.id],
      };
    }
  }

  return {
    isInParking: false,
    zoneId: null,
    bikeCount: 0,
  };
}

// Display Functions
async function displayBikes(map, userData, openLocationCode, icons) {
  try {
    const data = await fetchBikes();
    const bikes = data[0];
    const userRole = await getRole(userData.login);

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

      const findCode = openLocationCode.recoverNearest(bike.gps, lat, lng);
      const decodedCoordinates = openLocationCode.decode(findCode);
      const latitude = decodedCoordinates.latitudeCenter;
      const longitude = decodedCoordinates.longitudeCenter;

      const stationCheck = await checkBikeInAnyStation([latitude, longitude]);
      const parkingCheck = await checkBikeInAnyParking([latitude, longitude]);

      let bikeIcon;
      let popupContent;

      if (stationCheck.isInParking) {
        if (bike.status === 1) {
          bikeIcon = icons.charging;
          popupContent = `Cykel: ${bike.id} <br> I laddningsstation ${stationCheck.stationId} <br> Laddning pågår`;
        } else if (bike.status === 2) {
          bikeIcon = icons.outOfOrder;
          popupContent = `Cykel: ${bike.id} <br> I laddningsstation ${stationCheck.stationId} <br> Ur funktion`;
        } else {
          bikeIcon = icons.availableBike;
          popupContent = `Cykel: ${bike.id} <br> I laddningsstation ${stationCheck.stationId} <br> <a href="/book/confirm/${bike.id}">Boka</a>`;
        }
      } else if (parkingCheck.isInParking) {
        if (userRole === "admin") {
          if (bike.status === 1) {
            bikeIcon = icons.needsAttention;
          } else if (bike.status === 2) {
            bikeIcon = icons.outOfOrder;
          } else {
            bikeIcon = icons.availableBike;
          }
          popupContent = `
            Cykel: ${bike.id} <br>
            Status: ${bike.status} <br>
            Används av: ${bike.currentuser || "Ingen"} <br>
            Battery: ${bike.battery}% <br>
            I parkeringszon ${parkingCheck.zoneId} <br>
            <a href="/book/confirm/${bike.id}">Boka</a>
          `;
        } else {
          if (bike.currentuser === userData.id) {
            bikeIcon = icons.bookedBike;
            popupContent = `Cykel: ${bike.id} <br> I parkeringszon ${parkingCheck.zoneId} <br> <a href="/book/confirm/${bike.id}">Se bokning</a>`;
          } else if (bike.status === 1) {
            bikeIcon = icons.needsAttention;
            popupContent = `Cykel: ${bike.id} <br> I parkeringszon ${parkingCheck.zoneId} <br> <a href="/book/confirm/${bike.id}">Boka</a>`;
          } else if (bike.status === 2) {
            bikeIcon = icons.outOfOrder;
            popupContent = `Cykel: ${bike.id} <br> I parkeringszon ${parkingCheck.zoneId} <br> Ur funktion`;
          } else {
            bikeIcon = icons.availableBike;
            popupContent = `Cykel: ${bike.id} <br> I parkeringszon ${parkingCheck.zoneId} <br> <a href="/book/confirm/${bike.id}">Boka</a>`;
          }
        }
      } else {
        if (userRole === "admin") {
          if (bike.status === 1) {
            bikeIcon = icons.needsAttention;
          } else if (bike.status === 2) {
            bikeIcon = icons.outOfOrder;
          } else {
            bikeIcon = icons.availableBike;
          }
          popupContent = `
            Cykel: ${bike.id} <br>
            Status: ${bike.status} <br>
            Används av: ${bike.currentuser || "Ingen"} <br>
            Battery: ${bike.battery}% <br>
            <a href="/book/confirm/${bike.id}">Boka</a>
          `;
        } else {
          if (bike.currentuser === userData.id) {
            bikeIcon = icons.bookedBike;
            popupContent = `Cykel: ${bike.id} <br> <a href="/book/confirm/${bike.id}">Se bokning</a>`;
          } else if (bike.status === 1) {
            bikeIcon = icons.needsAttention;
            popupContent = `Cykel: ${bike.id} <br> <a href="/book/confirm/${bike.id}">Boka</a>`;
          } else if (bike.status === 2) {
            bikeIcon = icons.outOfOrder;
            popupContent = `Cykel: ${bike.id} <br> Ur funktion`;
          } else {
            bikeIcon = icons.availableBike;
            popupContent = `Cykel: ${bike.id} <br> <a href="/book/confirm/${bike.id}">Boka</a>`;
          }
        }
      }

      L.marker([latitude, longitude], { icon: bikeIcon })
        .addTo(map)
        .bindPopup(popupContent);
    });
  } catch (error) {
    console.error("Error displaying bikes:", error);
  }
}

async function displayStations(map) {
  try {
    const data = await fetchStations();
    const stations = data[0];

    stations.forEach((station) => {
      let coordinates = JSON.parse(station.gps);
      const bikeCount = stationCounters[station.id] || 0;

      if (!Array.isArray(coordinates) || coordinates.length < 3) {
        console.error("Insufficient GPS coordinates for station:", station.id);
        return;
      }

      L.polygon(coordinates, {
        color: "blue",
        fillColor: "#30a1ff",
        fillOpacity: 0.4,
      })
        .addTo(map)
        .bindPopup(
          `Station ID: ${station.id}
          <br>Charging Size: ${station.charging_size}
          <br>Antal cyklar i station: ${bikeCount}`,
        );
    });
  } catch (error) {
    console.error("Error displaying stations:", error);
  }
}

async function drawParkingZones(map) {
  const data = await fetchParking();
  const parkingZones = data[0];

  parkingZones.forEach((zone) => {
    const coordinates = JSON.parse(zone.gps);
    const currentCount = parkingZoneCounters[zone.id] || 0;

    L.polygon(coordinates, {
      color: "pink",
      fillColor: "#ff00ff",
      fillOpacity: 0.4,
    }).addTo(map).bindPopup(`
          Parkeringzon <br> ID: ${zone.id} 
          <br> Antal cyklar i zon: ${currentCount}
          `);
  });
}

// Main Initialization
document.addEventListener("DOMContentLoaded", () => {
  const openLocationCode = new OpenLocationCode();
  const locateButton = document.getElementById("locate-user");
  const cityDropdown = document.getElementById("city-select");
  const userData = JSON.parse(
    document.querySelector('meta[name="userInfo"]').getAttribute("content"),
  );

  // Create icons
  const icons = {
    custom: createIcon("#ff00ce"),
    availableBike: createIcon("#00ff00"),
    bookedBike: createIcon("#ff0000"),
    sim: createIcon("#FF7518"),
    needsAttention: createIcon("#FFA500"),
    outOfOrder: createIcon("#000000"),
    charging: createIcon("#ff0000"), // Same as bookedBike
  };

  navigator.geolocation.getCurrentPosition(async (position) => {
    const { latitude, longitude } = position.coords;

    // Initialize map
    const map = L.map("map").setView([latitude, longitude], 16);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    // Initialize WebSocket
    const bikeMarker = L.marker([latitude, longitude], {
      icon: icons.sim,
    }).addTo(map);

    const ws = new WebSocket("ws://localhost:5001");
    ws.onmessage = (message) => {
      const data = JSON.parse(message.data);
      const { id, location } = data;
      bikeMarker
        .setLatLng([location[0], location[1]])
        .bindPopup(`Bike ${id}`)
        .openPopup();
    };

    // Display all map elements
    await displayBikes(map, userData, openLocationCode, icons);
    await displayStations(map);
    await drawParkingZones(map);

    // Add user marker
    L.marker([latitude, longitude], { icon: icons.custom })
      .addTo(map)
      .bindPopup("Här är du!")
      .openPopup();

    // Event Listeners
    locateButton.addEventListener("click", () => {
      map.locate({ setView: true, maxZoom: 16 });
    });

    // Initialize city dropdown
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
