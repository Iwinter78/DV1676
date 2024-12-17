import L from "leaflet";
import { OpenLocationCode } from 'open-location-code';
document.addEventListener('DOMContentLoaded', () => {
    const openLocationCode = new OpenLocationCode();
    const locateButton = document.getElementById('locate-user');
    const cityDropdown = document.getElementById('city-select');

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            
            const customIcon = L.divIcon({
                className: 'custom-marker',
                html: '<div style="font-size: 30px; color: #ff00ce; font-weight: bold;">●</div>',
                iconSize: [20, 20],
                iconAnchor: [10, 10]
            });

            const bikeIcon = L.divIcon({
                className: 'custom-marker',
                html: '<div style="font-size: 30px; color: #00ff00; font-weight: bold;">🚲</div>',
                iconSize: [20, 20],
                iconAnchor: [10, 10]
            })

            const map = L.map('map').setView([latitude, longitude], 16);
            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 18,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            }).addTo(map);

            L.marker([latitude, longitude], {icon: customIcon}).addTo(map)
                .bindPopup("Här är du!")
                .openPopup();
            
            let bikeCordinates = fetch("http://localhost:1337/api/v1/bike", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include'
            })
                .then((response) => response.json())
            
            

            bikeCordinates.then((data) => {
                data.forEach((bike) => {
                    let findCode = openLocationCode.recoverNearest(bike.gps, 56.1, 15.5);
                    let decodedCordinates = openLocationCode.decode(findCode);
                    let latitude = decodedCordinates.latitudeCenter;
                    let longitude = decodedCordinates.longitudeCenter;
                    
                    console.log(latitude, longitude);
                    L.marker([latitude, longitude], {icon: bikeIcon}).addTo(map)
                        .bindPopup("Här är en cykel!")
                        .openPopup();
                });
            });
            locateButton.addEventListener('click', () => {
                map.locate({ setView: true, maxZoom: 16 });
            });

            fetch('/cities.json')
                .then((response) => response.json())
                .then((data) => {
                    data.forEach((city) => {
                        const option = document.createElement('option');
                        option.value = JSON.stringify({ lat: city.lat, lng: city.lng });
                        option.textContent = city.name;
                        cityDropdown.appendChild(option);
                    });
                });

            cityDropdown.addEventListener('change', (e) => {
                const selectedCity = JSON.parse(e.target.value);
                map.setView([selectedCity.lat, selectedCity.lng], 15);
            });
        }
    );
});
