import L from "leaflet";
import { OpenLocationCode } from "open-location-code";
document.addEventListener("DOMContentLoaded", () => {
  const openLocationCode = new OpenLocationCode();
  const locateButton = document.getElementById("locate-user");
  const cityDropdown = document.getElementById("city-select");
  const userData = JSON.parse(
    document.querySelector('meta[name="userInfo"]').getAttribute("content"),
  );
  console.log(userData);

  navigator.geolocation.getCurrentPosition((position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    const customIcon = L.divIcon({
      className: "custom-marker",
      html: '<div style="font-size: 30px; color: #ff00ce; font-weight: bold;">●</div>',
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });

    const bikeIcon = L.divIcon({
      className: "custom-marker",
      html: '<div style="font-size: 30px; color: #00ff00; font-weight: bold;">●</div>',
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });

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

    let bike = fetch("http://localhost:1337/api/v1/bike", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }).then((response) => response.json());

    bike.then((data) => {
      let bikes = data[0];
      bikes.forEach((bike) => {
        if (bike.currentuser !== userData.id) {
          return;
        }

        let lat = 0;
        let lng = 0;

        if (bike.city === "Karlskrona") {
          lat = 56.1;
          lng = 15.5;
        } else if (bike.city === "Stockholm") {
          lat = 59.3;
          lng = 18.1;
        } else if (bike.city === "Malmö") {
          lat = 55.6;
          lng = 13.0;
        }

        let findCode = openLocationCode.recoverNearest(bike.gps, lat, lng);
        let decodedCordinates = openLocationCode.decode(findCode);
        let latitude = decodedCordinates.latitudeCenter;
        let longitude = decodedCordinates.longitudeCenter;

        L.marker([latitude, longitude], { icon: bikeIcon })
          .addTo(map)
          .bindPopup(
            bike.bike_status
              ? `Cykel: ${bike.id} <br> <a href="/book/confirm/${bike.id}">Boka</a>`
              : `Cykel: ${bike.id} <br> <a href="/book/confirm/${bike.id}">Se bokning</a> `,
          )
          .openPopup();
      });
    });
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
