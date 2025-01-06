const fs = require("fs");
const OpenRouteService = require("openrouteservice-js");
const { fetchBikes } = require("./fetchBikes.cjs");

const ors = new OpenRouteService.Directions({
  api_key: "5b3ce3597851110001cf6248a6977bb43400480abfda387d8979d491",
});

async function calculateAndSaveRoutes() {
  const bikes = await fetchBikes();
  const savedRoutes = [];

  for (const bike of bikes) {
    try {
      console.log("Sending coordinates to ORS:", bike.start, bike.end);

      const response = await ors.calculate({
        coordinates: [bike.start, bike.end],
        profile: "cycling-regular",
        format: "geojson",
      });

      const coordinates = response.features[0].geometry.coordinates; // Array of [lng, lat]
      savedRoutes.push({ id: bike.id, route: coordinates });

      console.log(
        `Route for Bike ${bike.id} calculated with ${coordinates.length} steps.`,
      );
    } catch (error) {
      console.error(`Error calculating route for Bike ${bike.id}:`, error);
    }
  }

  // Save routes to a JSON file
  fs.writeFileSync("routes.json", JSON.stringify(savedRoutes, null, 2));
  console.log("All routes saved to routes.json");
}

// Call the function
calculateAndSaveRoutes();
