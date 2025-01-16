import express from "express";
import cors from "cors";
import * as user from "./src/user.js";
import * as bike from "./src/bike.js";
import * as station from "./src/station.js";
import * as parking from "./src/parking.js";

const app = express();

const port = 1337;

app.use(
  cors({
    origin: true,
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Access-Control-Allow-Origin",
    ],
    esposedHeaders: "*",
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/api/v1/create/user", async (req, res) => {
  const username = req.body.username;
  const email = req.body.email;

  if (!email || !username) {
    return res.status(400).json({
      message: "Email och användarnamn krävs",
      status: 400,
    });
  }

  try {
    await user.createUser(username, email);

    const response = {
      message: "Användare skapad",
      status: 201,
      data: {
        email,
        username,
      },
    };

    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({
      message: "Något gick fel, försök igen senare",
      status: 500,
      error: error.message,
    });
  }
});

app.get("/api/v1/user", async (req, res) => {
  let username = req.query.username;

  if (!username) {
    return res.status(400).json({
      message: "Email krävs",
      status: 400,
    });
  }

  try {
    let response = await user.getUser(username);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      message: "Något gick fel, försök igen senare",
      status: 500,
      error: error.message,
    });
  }
});

app.get("/api/v1/getAllUsers", async (req, res) => {
  try {
    let response = await user.getAllUsers();
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Något gick fel, försök igen senare",
      status: 500,
      error: error.message,
    });
  }
});

app.get("/api/v1/history", async (req, res) => {
  const username = req.query.username;
  console.log("Username:", username);

  if (!username) {
    return res.status(400).json({
      message: "Användarnamn krävs",
      status: 400,
    });
  }

  try {
    let response = await user.getUserLog(username);
    console.log("Database Response:", response);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      message: "Något gick fel, försök igen senare",
      status: 500,
      error: error.message,
    });
  }
});

app.put("/api/v1/update/user/balance", async (req, res) => {
  console.log("Query Params:", req.query);

  const username = req.query.username;
  const balance = req.query.balance;

  if (!username || isNaN(balance)) {
    return res.status(400).json({
      message: "Användarnamn och saldo krävs",
      status: 400,
    });
  }

  try {
    await user.updateUserBalance(username, balance);

    res.status(200).json({
      message: "Användarens saldo uppdaterat",
      status: 200,
    });
  } catch (error) {
    res.status(500).json({
      message: "Något gick fel, försök igen senare",
      status: 500,
      error: error.message,
    });
  }
});

app.delete("/api/v1/delete/user/:username", async (req, res) => {
  const username = req.params.username;

  if (!username) {
    return res.status(400).json({
      message: "username krävs",
      status: 400,
    });
  }

  try {
    await user.deleteUser(username);

    res.status(200).json({
      message: "Användare raderad",
      status: 200,
    });
  } catch (error) {
    res.status(500).json({
      message: "Något gick fel, försök igen senare",
      status: 500,
      error: error,
    });
  }
});

app.get("/api/v1/bike", async (req, res) => {
  try {
    let response = await bike.getAllBikes();
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Något gick fel, försök igen senare",
      status: 500,
      error: error.message,
    });
  }
});

app.get("/api/v1/bike/:id", async (req, res) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({
      message: "Id krävs",
      status: 400,
    });
  }

  try {
    let response = await bike.getBike(id);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      message: "Något gick fel, försök igen senare",
      status: 500,
      error: error.message,
    });
  }
});

app.post("/api/v1/create/bike", async (req, res) => {
  const { gps, city } = req.body;

  if (!gps || !city) {
    return res.status(400).json({
      message: "GPS och stad krävs",
      status: 400,
    });
  }

  try {
    await bike.createBike(gps, city);

    const response = {
      message: "Cykel skapad",
      status: 201,
      data: {
        gps,
        city,
      },
    };

    res.status(201).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Något gick fel, försök igen senare",
      status: 500,
      error: error.message,
    });
  }
});

app.put("/api/v1/update/bike", async (req, res) => {
  const { id, gps } = req.body;

  if (!gps || !id) {
    return res.status(400).json({
      message: "GPS och id krävs",
      status: 400,
    });
  }

  try {
    await bike.updateBikePosition(id, gps);

    res.status(200).json({
      message: "Cykel uppdaterad",
      status: 200,
    });
  } catch (error) {
    res.status(500).json({
      message: "Något gick fel, försök igen senare",
      status: 500,
      error: error.message,
    });
  }
});

app.post("/api/v1/bike/book", async (req, res) => {
  const { id, userid } = req.body;
  console.log(id);
  console.log(userid);

  if (!id || !userid) {
    return res.status(400).json({
      message: "Id och användarnamn krävs",
      status: 400
    });
  }

  try {

    let userBalance = await user.getUserBalance(userid);
    console.log("User balance:", userBalance);

    if (userBalance <= 0) {
      return res.status(402).json({
        message: "Fyll på saldot innan du boka en cykel",
        status: 402,
      });
    }

    await bike.bookBike(id, userid);

    res.status(200).json({
      message: "Cykel bokad",
      status: 200,
    });
  } catch (error) {
    res.status(500).json({
      message: "Något gick fel, försök igen senare",
      status: 500,
      error: error.message,
    });
  }
});

app.post("/api/v1/bike/return", async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({
      message: "Id krävs",
      status: 400,
    });
  }

  try {
    await bike.returnBike(id);

    res.status(200).json({
      message: "Cykel återlämnad",
      status: 200,
    });
  } catch (error) {
    res.status(500).json({
      message: "Något gick fel, försök igen senare",
      status: 500,
      error: error.message,
    });
  }
});

// STATIONS

app.get("/api/v1/stations", async (req, res) => {
  try {
    let response = await station.AllStations();
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Något gick fel, försök igen senare",
      status: 500,
      error: error.message,
    });
  }
});

// PARKING ZONES

app.get("/api/v1/parking", async (req, res) => {
  try {
    let response = await parking.allParking();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      message: "Något gick fel, försök igen senare",
      status: 500,
      error: error.message,
    });
  }
});

app.put("/api/v1/parking/:id", async (req, res) => {
  const id = req.params.id;
  const { amount } = req.body;

  if (!id) {
    return res.status(400).json({
      message: "Id krävs",
      status: 400,
    });
  }

  try {
    await parking.updateAmountOfBikes(id, amount);

    res.status(200).json({
      message: "Parkering uppdaterad",
      status: 200,
    });
  } catch (error) {
    res.status(500).json({
      message: "Något gick fel, försök igen senare",
      status: 500,
      error: error.message,
    });
  }
});

app.put("/api/v1/stations/editChargingSize/:id", async (req, res) => {
  const id = req.params.id;
  const newSize = req.body.charging_size;
  try {
    let result = await station.editChargingSize(id, newSize);

    if (result.affectedRows > 0) {
      // Assuming affectedRows is returned from the DB operation
      return res.status(200).send("Charging size changed");
    } else {
      return res.status(404).send("Station not found or no change made");
    }
  } catch (error) {
    console.error("Error in editChargingSize API:", error); // Added for debugging
    res.status(500).send("Internal Server Error");
  }
});

app.put("/api/v1/update/editUserAdminPanel/:username", async (req, res) => {
  console.log("Request Body:", req.body);

  const usernameFromUrl = req.params.username;
  const balance = req.body.balance;
  const debt = req.body.debt;

  console.log("Before calling editUser");

  try {
    let result = await user.editUser(usernameFromUrl, balance, debt);

    if (result.affectedRows > 0) {
      return res.status(200).send("Fixed");
    } else {
      return res.status(404).send("User not found or no changes made");
    }
  } catch (error) {
    console.error("Error in editUserAdminPanel API:", error);
    res.status(500).send("Internal Server Error");
  }

  console.log("After calling editUser");

  console.log("User updated successfully");
});

app.put("/api/v1/stations/editChargingSize/:id", async (req, res) => {
  const id = req.params.id;
  const newSize = req.body.charging_size;
  try {
    let result = await station.editChargingSize(id, newSize);

    if (result.affectedRows > 0) {
      return res.status(200).send("Charging size changed");
    } else {
      return res.status(404).send("Station not found or no change made");
    }
  } catch (error) {
    console.error("Error in editChargingSize API:", error); // Added for debugging
    res.status(500).send("Internal Server Error");
  }
});

app.put("/api/v1/update/editUserAdminPanel/:username", async (req, res) => {
  console.log("Request Body:", req.body);

  const usernameFromUrl = req.params.username;
  const balance = req.body.balance;
  const debt = req.body.debt;

  console.log("Before calling editUser");

  try {
    let result = await user.editUser(usernameFromUrl, balance, debt);

    if (result.affectedRows > 0) {
      return res.status(200).send("Fixed");
    } else {
      return res.status(404).send("User not found or no changes made");
    }
  } catch (error) {
    console.error("Error in editUserAdminPanel API:", error);
    res.status(500).send("Internal Server Error");
  }

  console.log("After calling editUser");

  console.log("User updated successfully");
});

app.listen(port, () => {
  console.log(`REST API is listning on ${port}`);
});
