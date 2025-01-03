const WebSocket = require("ws");
const OpenRouteService = require("openrouteservice-js");

const ors = new OpenRouteService.Directions({
  api_key: "5b3ce3597851110001cf6248a6977bb43400480abfda387d8979d491",
});

const wss = new WebSocket.Server({ port: 5001 });

const bike = {
  id: "SIM",
  location: [59.3293, 18.0686], // Start point
  route: [], // Holds the calculated route
  step: 0, // Current step in the route
};

// Function to calculate a route
async function calculateRoute(start, end) {
  try {
    const response = await ors.calculate({
      coordinates: [start, end],
      profile: "cycling-regular", // Use cycling profile
      format: "geojson",
    });
    return response.features[0].geometry.coordinates; // Return the route as an array of [lng, lat] pairs
  } catch (error) {
    console.error("Error calculating route:", error);
    return [];
  }
}

function moveBike() {
  if (bike.route.length > 0 && bike.step < bike.route.length) {
    const [lng, lat] = bike.route[bike.step];
    bike.location = [lat, lng]; // Update location (convert to [lat, lng] format)
    bike.step++;

    if (bike.step >= bike.route.length) {
      console.log("Bike reached the destination!");
    }
  }
}

function broadcastBike() {
  const bikeUpdate = {
    id: bike.id,
    location: bike.location,
  };

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(bikeUpdate));
    }
  });
}

// Initialize route and start simulation
(async function initializeRoute() {
  const start = [18.0686, 59.3293]; //[lng, lat]
  const end = [18.075248, 59.323439];

  bike.route = await calculateRoute(start, end); // Calculate the route
  bike.step = 0; // Reset step

  console.log("Route initialized with", bike.route.length, "steps.");
})();

setInterval(() => {
  moveBike();
  broadcastBike();
}, 1000); // Update every second

console.log(
  "Simulation started. WebSocket server running on ws://localhost:5001",
);
