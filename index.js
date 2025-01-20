import express from "express";
import session from "express-session";
import cors from "cors";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import process from "process";

import { exchangeCodeForToken, getUserInfo } from "./src/login.js";
// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config();

const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: true,
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Access-Control-Allow-Origin",
      "default-src",
    ],
    credentials: true,
  }),
);

app.options("*", cors());
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("src"));
app.use(express.static("public"));
app.use(express.static(join(__dirname, "views")));

app.use(
  session({
    secret: "Tl29wV0Cq0URN+XSsoJeYGwPVxbBnXqzKmDxkcki9Nw9WyeXxq6o1xmtIodBx9sb",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  }),
);

// Login page
app.get("/", (req, res) => {
  const data = {
    client_id: process.env.GITHUB_CLIENT_ID,
  };

  res.render("login/index", data);
});

//Callback page
app.get("/callback", async (req, res) => {
  const code = req.query.code;

  if (!code || code === null) {
    return res.status(302).redirect("/");
  }
  const token = await exchangeCodeForToken(code);
  const userInfo = await getUserInfo(token);
  const email = userInfo.email || null;

  let profile = await fetch(
    `http://localhost:1337/api/v1/user?username=${userInfo.login}`,
  ).then((response) => response.json());

  console.log("profile information from database", profile);

  if (!profile || profile.length === 0 || !profile[0][0]?.email) {
    console.log("Profile is empty or missing email...");
    req.session.userInfo = {
      login: userInfo.login,
      id: userInfo.id,
      email: email,
      avatar_url: userInfo.avatar_url,
      created_at: userInfo.created_at,
    };

    return res.redirect("/email");
  }
  const profileData = profile[0][0];
  req.session.userInfo = {
    login: userInfo.login,
    id: profileData.id,
    email: profileData.email || email,
    avatar_url: userInfo.avatar_url,
    created_at: userInfo.created_at,
  };
  return res.redirect("/home");
});

// Logout page
app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

// Users home page
app.get("/home", (req, res) => {
  const userInfo = req.session.userInfo;
  if (!userInfo) {
    res.redirect("/");
  }

  const data = {
    userInfo: userInfo,
  };

  res.render("home/index", data);
});

// Users home page
app.get("/sim", (req, res) => {
  res.render("sim/index");
});

// Admin first view after login
app.get("/admin_view", async (req, res) => {
  const userInfo = req.session.userInfo;

  const userresponse = await fetch(
    `http://localhost:1337/api/v1/user?username=${userInfo.login}`,
  );
  const userData = await userresponse.json();

  const isAdmin = userData.role === "admin";

  res.render("admin_panel/main", {
    userInfo: userData[0][0],
    isAdmin,
  });
});

app.get("/admin_panel/customer", async (req, res) => {
  const response = await fetch(`http://localhost:1337/api/v1/getAllUsers`);
  const userInfo = req.session.userInfo;

  if (!response.ok) {
    throw new Error(`Failed to fetch data: ${response.statusText}`);
  }

  const userresponse = await fetch(
    `http://localhost:1337/api/v1/user?username=${userInfo.login}`,
  );
  const userData = await userresponse.json();
  if (userData[0][0].role !== "admin") {
    return res.redirect("/home");
  }

  const data = await response.json();
  const users = data[0];

  res.render("admin_panel/customer", { users });
});

// Admin bike view
app.get("/admin_panel/bike", async (req, res) => {
  const response = await fetch(`http://localhost:1337/api/v1/bike`);
  const userInfo = req.session.userInfo;

  if (!response.ok) {
    throw new Error(`Failed to fetch data: ${response.statusText}`);
  }

  const userresponse = await fetch(
    `http://localhost:1337/api/v1/user?username=${userInfo.login}`,
  );
  const userData = await userresponse.json();
  if (userData[0][0].role !== "admin") {
    return res.redirect("/home");
  }

  const data = await response.json();
  const bikes = data[0];

  res.render("admin_panel/bike", { bikes });
});

// Admin station view
app.get("/admin_panel/station", async (req, res) => {
  const userInfo = req.session.userInfo;
  const response = await fetch(`http://localhost:1337/api/v1/stations`);

  if (!response.ok) {
    throw new Error(`Failed to fetch data: ${response.statusText}`);
  }
  const userresponse = await fetch(
    `http://localhost:1337/api/v1/user?username=${userInfo.login}`,
  );
  const userData = await userresponse.json();
  if (userData[0][0].role !== "admin") {
    return res.redirect("/home");
  }

  const data = await response.json();
  const stations = data[0];
  res.render("admin_panel/station", { stations });
});

app.get("/email", (req, res) => {
  res.render("login/email");
});

app.post("/email", async (req, res) => {
  const email = req.body.email;

  if (email) {
    req.session.userInfo.email = email;
    await fetch("http://localhost:1337/api/v1/create/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: req.session.userInfo.login,
        email: req.session.userInfo.email,
        balance: 0,
        debt: 0,
        role: "user",
      }),
    });

    return res.redirect("/home");
  }

  return res.redirect("/");
});

// Update balance for the user
app.get("/balance", async (req, res) => {
  res.render("client/balance");
});

app.post("/balance", async (req, res) => {
  const { balance } = req.body;
  const username = req.session.userInfo.login;

  await fetch(
    `http://localhost:1337/api/v1/update/user/balance?username=${username}&balance=${balance}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    },
  );

  res.redirect("/profile");
});

app.get("/profile", async (req, res) => {
  const userInfo = req.session.userInfo;

  if (!userInfo) {
    return res.redirect("/"); // Om användaren inte är inloggad, skicka dem till startsidan
  }
  const profileResponse = await fetch(
    `http://localhost:1337/api/v1/user?username=${userInfo.login}`,
  );
  const profile = await profileResponse.json();
  const profileData = profile["0"][0];
  const data = {
    ...userInfo,
    ...profileData,
  };
  res.render("client/client_detail", data);
});

app.get("/history", async (req, res) => {
  const userInfo = req.session.userInfo;

  if (!userInfo) {
    return res.redirect("/"); //back to home if the user is not logd in
  }

  const profileResponse = await fetch(
    `http://localhost:1337/api/v1/history?id=${userInfo.id}`,
  );
  const trips = await profileResponse.json();
  console.log("Profile from /history:", trips);

  let data = { trips };

  res.render("client/client_travel_history", data);
});

app.get("/book/confirm/:id", async (req, res) => {
  let userInfo = req.session.userInfo;
  let bikeData = await fetch(
    `http://localhost:1337/api/v1/bike/${req.params.id}`,
  ).then((response) => response.json());

  let data = {
    id: req.params.id,
    userInfo,
    bike: bikeData,
  };

  res.render("client/client_book", data);
});

// Users home page
app.get("/sim", (req, res) => {
  res.render("sim/index");
});

app.post("/book/confirm/:id", async (req, res) => {
  let userInfo = req.session.userInfo;
  let bikeData = await fetch(
    `http://localhost:1337/api/v1/bike/${req.params.id}`,
  ).then((response) => response.json());

  if (Boolean(bikeData[0][0].bike_status) === false) {
    return res.redirect("/home");
  }
  const response = await fetch(`http://localhost:1337/api/v1/bike/book`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: req.params.id,
      userid: userInfo.id,
    }),
  });

  if (response.status === 402) {
    return res.send(`
      <script>
        alert("Fyll på saldot innan du boka en cykel");
        window.location.href = "/balance";
      </script>
    `);
  }
  res.redirect("/home");
});

app.post("/book/return/:id", async (req, res) => {
  const tripId = req.body.tripId;
  let bikeData = await fetch(
    `http://localhost:1337/api/v1/bike/${req.params.id}`,
  ).then((response) => response.json());

  if (Boolean(bikeData[0][0].bike_status) === true) {
    return res.redirect("/home");
  }

  await fetch(`http://localhost:1337/api/v1/bike/return`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: req.params.id,
    }),
  });

  res.redirect(`/book/pay/${tripId}`);
});

app.post("/deleteUser/:username", async (req, res) => {
  const username = req.params.username;

  try {
    const response = await fetch(
      `http://localhost:1337/api/v1/delete/user/${username}`,
      {
        method: "DELETE",
      },
    );

    if (response.ok) {
      console.log(`User ${username} deleted successfully`);
    } else {
      console.log(`Failed to delete user: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error occurred while trying to delete the user:", error);
  }

  res.redirect("/admin_panel/customer");
});

app.put("/editUser/:username", async (req, res) => {
  console.log("Route hit: /editUser/:username");
  const username = req.params.username;
  const balance = req.body.balance;
  const debt = req.body.debt;

  console.log("Balance:", balance);
  console.log("Debt:", debt);

  try {
    const response = await fetch(
      `http://localhost:1337/api/v1/update/editUserAdminPanel/${username}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          balance: balance,
          debt: debt,
        }),
      },
    );

    if (response.ok) {
      return res.status(200).send("done");
    }

    console.log("User updated successfully");
  } catch (error) {
    // Catch any errors during fetch or other operations
    console.error("Error during fetch:", error);
    return res.status(500).send("Internal Server Error");
  }
});

app.put("/editChargingSize/:id", async (req, res) => {
  const id = req.params.id;
  const charging_size = req.body.charging_size;

  try {
    const response = await fetch(
      `http://localhost:1337/api/v1/stations/editChargingSize/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
          charging_size: charging_size,
        }),
      },
    );

    if (response.ok) {
      return res.status(200).send("done");
    }

    res.redirect("/admin_panel/station");
  } catch (error) {
    console.error("Error in /editChargingSize:", error);
    return res.status(500).send("Internal Server Error");
  }
});

app.get("/book/pay/:id", async (req, res) => {
  const tripId = req.params.id;

  let tripData = await fetch(
    `http://localhost:1337/api/v1/book/pay/${tripId}`,
  ).then((response) => response.json());

  let data = {
    id: req.params.id,
    tripData: tripData,
  };

  res.render("client/trip_summary", data);
});

app.get("/thank-you", async (req, res) => {
  res.render("client/thank-you");
});

app.post("/book/pay/confirm/:tripId", async (req, res) => {
  const tripId = req.body.tripId;

  try {
    const response = await fetch(
      `http://localhost:1337/api/v1/book/pay/confirm/${tripId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (response.ok) {
      return res.redirect("/thank-you");
    }
  } catch (error) {
    return res.status(500).send(`Error occurred: ${error}`);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
