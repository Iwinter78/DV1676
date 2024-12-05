import L from "leaflet";
document.addEventListener('DOMContentLoaded', () => {
    const locateButton = document.getElementById('locate-user');
    const cityDropdown = document.getElementById('city-select');

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            const map = L.map('map').setView([latitude, longitude], 16);
            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 18,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            }).addTo(map);

            L.marker([latitude, longitude]).addTo(map)
                .bindPopup("Här är du!")
                .openPopup();

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
