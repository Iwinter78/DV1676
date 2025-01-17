import L from "leaflet";
import { OpenLocationCode } from "open-location-code";

let stationCounters = {};
let parkingZoneCounters = {};

function createIcon(color) {
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="font-size: 30px; color: ${color}; font-weight: bold;">●</div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
}

function isPointInStation(bikeCoords, stationCoords) {
  if (!bikeCoords || !stationCoords || !Array.isArray(stationCoords)) {
      return false;
  }

  const point = L.latLng(bikeCoords[0], bikeCoords[1]);
  const polygonCoords = stationCoords.map(coord => L.latLng(coord[0], coord[1]));
  const polygon = L.polygon(polygonCoords);
  
  return polygon.getBounds().contains(point);
}

async function getRole(user) {
  const response = await fetch(
    `http://restapi:1337/api/v1/user?username=${user}`,
  );
  const data = await response.json();
  return data[0][0].role;
}

async function fetchBikes() {
  try {
    const response = await fetch("http://restapi:1337/api/v1/bike", {
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
    const response = await fetch("http://restapi:1337/api/v1/stations", {
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
    const response = await fetch("http://restapi:1337/api/v1/parking", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return response.json();
  } catch (error) {
    console.error("Error fetching parking:", error);
    return [];
  }
}

async function checkBikeInAnyStation(bike) {
  const response = await fetch("http://restapi:1337/api/v1/parking");
  const data = await response.json();
  const parkingZones = data[0];

  for (const zone of parkingZones) {
    const zoneCoordinates = JSON.parse(zone.gps);
    parkingZoneCounters[zone.id] = 0;

    if (isPointInStation(bike, zoneCoordinates)) {
      console.log(zone.id);
      if (!stationCounters[zone.id]) {
        stationCounters[zone.id] = 1;
      } else {
        stationCounters[zone.id]++;
      }

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
  if (!bike || !Array.isArray(bike)) {
      console.error('Invalid bike data:', bike);
      return { isInParking: false, zoneId: null, bikeCount: 0 };
  }

  const response = await fetch("http://restapi:1337/api/v1/parking");
  const data = await response.json();
  const parkingZones = data[0];

  const bikePoint = {
      lat: bike[0],
      lng: bike[1]
  };

  for (const zone of parkingZones) {
      const zoneCoordinates = JSON.parse(zone.gps);
      console.log(`Checking bike coordinates [${bikePoint.lat}, ${bikePoint.lng}] against zone ${zone.id}`);

      if (isPointInStation([bikePoint.lat, bikePoint.lng], zoneCoordinates)) {
          console.log(`Found bike in zone ${zone.id}`);
          
          if (!parkingZoneCounters[zone.id]) {
              parkingZoneCounters[zone.id] = 1;
          } else {
              parkingZoneCounters[zone.id]++;
          }

          return {
              isInParking: true,
              zoneId: zone.id,
              bikeCount: parkingZoneCounters[zone.id]
          };
      }
  }

  return {
      isInParking: false,
      zoneId: null,
      bikeCount: 0
  };
}

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
    stationCounters = {};
    
    const [bikesResponse, stationsResponse] = await Promise.all([
      fetchBikes(),
      fetchStations()
    ]);

    const bikes = bikesResponse[0];
    const stations = stationsResponse[0];

    // Count bikes in stations first
    for (const bike of bikes) {
      const findCode = new OpenLocationCode().recoverNearest(
        bike.gps,
        bike.city === 1 ? 56.1 : bike.city === 2 ? 59.3 : 55.6,
        bike.city === 1 ? 15.5 : bike.city === 2 ? 18.1 : 13.0
      );
      const coords = new OpenLocationCode().decode(findCode);
      
      for (const station of stations) {
        const stationCoords = JSON.parse(station.gps);
        if (isPointInStation([coords.latitudeCenter, coords.longitudeCenter], stationCoords)) {
          stationCounters[station.id] = (stationCounters[station.id] || 0) + 1;
          break;
        }
      }
    }

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
          <br>Antal cyklar i station: ${bikeCount}`
        );
    });
  } catch (error) {
    console.error("Error displaying stations:", error);
  }
}

async function drawParkingZones(map) {
  parkingZoneCounters = {};
  
  const [bikesResponse, parkingResponse] = await Promise.all([
    fetchBikes(),
    fetchParking()
  ]);

  const bikes = bikesResponse[0];
  const parkingZones = parkingResponse[0];

  for (const bike of bikes) {
    const findCode = new OpenLocationCode().recoverNearest(
      bike.gps,
      bike.city === 1 ? 56.1 : bike.city === 2 ? 59.3 : 55.6,
      bike.city === 1 ? 15.5 : bike.city === 2 ? 18.1 : 13.0
    );
    const coords = new OpenLocationCode().decode(findCode);
    
    for (const zone of parkingZones) {
      const zoneCoords = JSON.parse(zone.gps);
      if (isPointInStation([coords.latitudeCenter, coords.longitudeCenter], zoneCoords)) {
        parkingZoneCounters[zone.id] = (parkingZoneCounters[zone.id] || 0) + 1;
        break;
      }
    }
  }

  parkingZones.forEach(zone => {
    const coordinates = JSON.parse(zone.gps);
    const bikeCount = parkingZoneCounters[zone.id] || 0;

    L.polygon(coordinates, {
      color: "pink",
      fillColor: "#ff00ff",
      fillOpacity: 0.4
    })
    .addTo(map)
    .bindPopup(`Parkeringszon ${zone.id}<br>Antal cyklar: ${bikeCount}`);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const openLocationCode = new OpenLocationCode();
  const locateButton = document.getElementById("locate-user");
  const cityDropdown = document.getElementById("city-select");
  const userData = JSON.parse(
    document.querySelector('meta[name="userInfo"]').getAttribute("content"),
  );

  const icons = {
    custom: createIcon("#ff00ce"),
    availableBike: createIcon("#00ff00"),
    bookedBike: createIcon("#ff0000"),
    sim: createIcon("#FF7518"),
    needsAttention: createIcon("#FFA500"),
    outOfOrder: createIcon("#000000"),
    charging: createIcon("#ff0000"),
  };

  navigator.geolocation.getCurrentPosition(async (position) => {
    const { latitude, longitude } = position.coords;

    const map = L.map("map").setView([latitude, longitude], 16);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);


    await displayBikes(map, userData, openLocationCode, icons);
    await displayStations(map);
    await drawParkingZones(map);

    L.marker([latitude, longitude], { icon: icons.custom })
      .addTo(map)
      .bindPopup("Här är du!")
      .openPopup();

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