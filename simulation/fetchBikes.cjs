const { connect } = await import('./restapi/connect.js');
const OpenLocationCode = require("open-location-code").OpenLocationCode;
const olc = new OpenLocationCode();


// Generate a random destination near the start point
function randomDest(start) {
  const [startLng, startLat] = start;
  const randomLngOffset = (Math.random() - 0.5) * 0.01;
  const randomLatOffset = (Math.random() - 0.5) * 0.01;
  return [startLng + randomLngOffset, startLat + randomLatOffset];
}


async function fetchBikes() {
  try {
    const connection = await connect();
    const [rows] = await connection.query("SELECT id, gps FROM bike");

    return rows.map((bike) => {
      const startDecoded = olc.decode(bike.gps);
      const start = [startDecoded.longitudeCenter, startDecoded.latitudeCenter]; // [lng, lat]
      const end = randomDest(start); // Random destination

      return {
        id: bike.id,
        start,
        end,
      };
    });
  } catch (error) {
    console.error("Error fetching bikes:", error);
    return [];
  }
}

module.exports = { fetchBikes };
