import fs from "fs";
import { WebSocketServer } from "ws";
import { connect } from "../restapi/src/connect.js";

let db;

(async () => {
  try {
    db = await connect();
    console.log("Connected to the database!");
  } catch (err) {
    console.error("Error connecting to the database:", err);
    process.exit(1);
  }
})();

const wss = new WebSocketServer({ port: 5001 });

const savedRoutes = JSON.parse(fs.readFileSync("routes.json", "utf-8"));

const bikes = savedRoutes.map((bike) => {

  const speedms = Math.random() * 5 + 2;
  const speed = (speedms * 3.6).toFixed(2);

  return {
    id: bike.id,
    route: bike.route,
    location: bike.route[0],
    step: 0,
    totalSteps: bike.route.length,
    speed,
  };
});

function moveBike(bike) {
  if (bike.step < bike.totalSteps - 1) {
    const [startLng, startLat] = bike.route[bike.step];
    const [endLng, endLat] = bike.route[bike.step + 1];


    const distance = Math.sqrt(
      Math.pow(endLng - startLng, 2) + Math.pow(endLat - startLat, 2),
    );

    const progress = bike.speed / distance;

    if (progress >= 1) {
      bike.location = [endLat, endLng];
      bike.step++;
    } else {

      const lng = startLng + (endLng - startLng) * progress;
      const lat = startLat + (endLat - startLat) * progress;
      bike.location = [lat, lng];
    }

    if (bike.step >= bike.totalSteps - 1) {
      bike.step = 0;
    }
  }
}

async function fetchBikeDetails() {
  if (!db) {
    console.error("Database connection is not ready!");
    return [];
  }
  const [rows] = await db.execute("SELECT id, currentuser FROM bike");
  return rows;
}

async function broadcastBikes() {
  try {
    const bikeDetails = await fetchBikeDetails();

    const updates = bikes.map((bike) => {
      const bikeDetail = bikeDetails.find(
        (b) => String(b.id) === String(bike.id),
      );

      return {
        id: bike.id,
        location: [bike.location[1], bike.location[0]], // Format to [lng, lat]
        currentuser: bikeDetail ? bikeDetail.currentuser : null,
        speed: bike.speed,
      };
    });

    console.log("bikes:", updates);

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(updates));
      }
    });
  } catch (err) {
    console.error("Error bikes:", err);
  }
}

setInterval(() => {
  bikes.forEach((bike) => {
    moveBike(bike);
    console.log(`Bike ${bike.id} current location:`, bike.location);
  });

  broadcastBikes();
}, 1000);

