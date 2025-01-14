const fs = require("fs");
const WebSocket = require("ws");
const { connect } = require("../restapi/src/connect.js");

let db;

// Connect to the database
(async () => {
  try {
    db = await connect();
    console.log("Connected to the database!");

    // Start the WebSocket server only after the database connection is ready
    console.log(
      "Simulation started. WebSocket server running on ws://localhost:5001",
    );

    // Update cache for the first time
    await updateBikeDetailsCache();
  } catch (err) {
    console.error("Error connecting to the database:", err);
    process.exit(1); // Exit if the database connection fails
  }
})();

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

let bikeDetailsCache = [];

async function updateBikeDetailsCache() {
  try {
    bikeDetailsCache = await fetchBikeDetails();
    console.log("Updated bike details cache:", bikeDetailsCache);
  } catch (err) {
    console.error("Error updating bike details cache:", err);
  }
}

async function fetchBikeDetails() {
  if (!db) {
    console.error("Database connection is not ready!");
    return [];
  }
  try {
    const [rows] = await db.execute("SELECT id, currentuser FROM bike");
    return rows;
  } catch (err) {
    console.error("Error fetching bike details:", err);
    return [];
  }
}

async function broadcastBikes() {
  const updates = bikes.map((bike) => {
    const bikeDetail = bikeDetailsCache.find(
      (b) => String(b.id) === String(bike.id),
    );

    return {
      id: bike.id,
      location: [bike.location[1], bike.location[0]],
      currentuser: bikeDetail ? bikeDetail.currentuser : null,
    };
  });

  console.log("Broadcasting bikes:", updates);

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(updates));
    }
  });
}

// Simulate movement
setInterval(() => {
  bikes.forEach((bike) => {
    moveBike(bike);
    console.log(`Bike ${bike.id} current location:`, bike.location);
  });

  broadcastBikes();
}, 1000);

// Update bike details cache every 5 seconds
setInterval(updateBikeDetailsCache, 5000);

console.log(
  "Simulation started. WebSocket server running on ws://localhost:5001",
);
