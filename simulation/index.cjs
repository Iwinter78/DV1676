const fs = require("fs");
const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 5001 });

// Load saved routes
const savedRoutes = JSON.parse(fs.readFileSync("routes.json", "utf-8"));

// Initialize bikes
const bikes = savedRoutes.map((bike) => ({
  id: bike.id,
  route: bike.route,
  location: bike.route[0],
  step: 0,
  totalSteps: bike.route.length,
}));

function moveBike(bike) {
  if (bike.step < bike.totalSteps - 1) {
    const [startLng, startLat] = bike.route[bike.step];
    const [endLng, endLat] = bike.route[bike.step + 1];

    const progress = 0.1; // 10% progress
    const lng = startLng + (endLng - startLng) * progress;
    const lat = startLat + (endLat - startLat) * progress;

    bike.location = [lat, lng];
    bike.step++;

    // Restart route when it ends
    if (bike.step >= bike.totalSteps - 1) {
      bike.step = 0;
    }
  }
}

function broadcastBikes() {
  const updates = bikes.map((bike) => ({
    id: bike.id,
    location: [bike.location[1], bike.location[0]],
  }));
  console.log("Broadcasting bikes:", updates);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(
        JSON.stringify(
          bikes.map((bike) => ({
            id: bike.id,
            location: [bike.location[1], bike.location[0]], // Convert to [lat, lng] for the client
          })),
        ),
      );
    }
  });
}

// Simulate movement
setInterval(() => {
  bikes.forEach((bike) => {
    const [lng, lat] = bike.location; //convert to [lng, lat]
    bike.location = [lat, lng];
    moveBike(bike);
    console.log(`Bike ${bike.id} current location:`, bike.location);
  });

  const updates = bikes.map((bike) => ({
    id: bike.id,
    location: [bike.location[1], bike.location[0]],
  }));

  console.log("Broadcasting bikes:", updates);
  broadcastBikes(updates);
}, 1000);

console.log(
  "Simulation started. WebSocket server running on ws://localhost:5001",
);
