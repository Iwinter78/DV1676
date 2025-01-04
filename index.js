import express from "express";
import session from "express-session";
import cors from "cors";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import process from "process";
import { showLogs } from "./src/functions.js";

import { exchangeCodeForToken, getUserInfo } from "./src/login.js";
// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config();

const app = express();
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

app.get("/callback", async (req, res) => {
  const code = req.query.code;

  if (!code || code === null) {
    return res.status(302).redirect("/");
  }
  const token = await exchangeCodeForToken(code);
  const userInfo = await getUserInfo(token);
  const email = userInfo.email || null;
  // Get user info from the database
  let profile = await fetch(
    `http://localhost:1337/api/v1/user?username=${userInfo.login}`,
  ).then((response) => response.json());

  console.log("profile information from database", profile);
  // Check if the user exists in the database or if the email is missing
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

  console.log(data);
  res.render("home/index", data);
});

// Admin first view after login
app.get("/admin_view", async (req, res) => {
  const userInfo = req.session.userInfo;

  // Fetch the user data from the API
  const userresponse = await fetch(
    `http://localhost:1337/api/v1/user?username=${userInfo.login}`,
  );
  const userData = await userresponse.json();

  // Check if the user is an admin
  const isAdmin = userData.role === "admin";

  // Render the admin panel with dynamic meta tag behavior
  res.render("admin_panel/main", {
    userInfo: isAdmin ? null : JSON.stringify(userData),
    isAdmin,
  });
});

app.get("/admin_panel/customer", async (req, res) => {
  const response = await fetch(`http://localhost:1337/api/v1/getAllUsers`);

  if (!response.ok) {
    throw new Error(`Failed to fetch data: ${response.statusText}`);
  }

  const data = await response.json();
  const users = data[0];
  console.log(data[0]);

  res.render("admin_panel/customer", { users });
});
// Admin bike view
app.get("/admin_panel/bike", async (req, res) => {
  const response = await fetch(`http://localhost:1337/api/v1/bike`);

  if(!response.ok) {
    throw new Error(`Failed to fetch data: ${response.statusText}`);
  }

  const data = await response.json();
  const bikes = data[0];
  console.log(data[0]);

  res.render("admin_panel/bike", { bikes });
});
// Admin station view
app.get("/admin_panel/station", async (req, res) => {
  const response = await fetch(`http://localhost:1337/api/v1/stations`);

  if(!response.ok) {
    throw new Error(`Failed to fetch data: ${response.statusText}`);
  }

  const data = await response.json();
  const stations = data[0];
  console.log(data[0]);

  res.render("admin_panel/station", { stations });
});

app.get('/admin_panel/log', async (req, res) => {
  const type = req.query.type || null;
  try {
    const logs = await showLogs(type);
    console.log("Fetched logs:", logs);
    res.render('admin_panel/log', { logs, type });
  } catch (error) {
    console.error("Error fetching logs:", error);
    res.status(500).send("Internal Server Error")
  }

});

app.get("/email", (req, res) => {
  res.render("login/email");
});

app.post("/email", async (req, res) => {
  const email = req.body.email;

  if (email) {
    req.session.userInfo.email = email;
    console.log("Email updated in session:", req.session.userInfo);
    const createResponse = await fetch(
      "http://localhost:1337/api/v1/create/user",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: req.session.userInfo.login,
          email: req.session.userInfo.email,
          balance: 0,
          debt: 0,
          role: "user",
        }),
      },
    );

    const result = await createResponse.json();
    console.log("User creation response:", result);

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

  const profileResponse = await fetch(
    `http://localhost:1337/api/v1/update/user/balance?username=${username}&balance=${balance}`,
    {
      method: "PUT", // PUT update
      headers: { "Content-Type": "application/json" },
    },
  );
  const profile = await profileResponse.json();

  console.log(profile);

  res.redirect("/profile");
});

// Route to show the users profile
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
    `http://localhost:1337/api/v1/history?username=${userInfo.login}`,
  );
  const profile = await profileResponse.json();
  const trips = profile[0] || [];
  const data = {
    ...userInfo,
    trips,
  };

  console.log(trips);
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
    bike: bikeData[0][0],
  };
  res.render("client/client_book", data);
});

app.post("/book/confirm/:id", async (req, res) => {
  let userInfo = req.session.userInfo;
  let bikeData = await fetch(
    `http://localhost:1337/api/v1/bike/${req.params.id}`,
  ).then((response) => response.json());

  if (Boolean(bikeData[0][0].bike_status) === false) {
    return res.redirect("/home");
  }

  await fetch(`http://localhost:1337/api/v1/bike/book`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: req.params.id,
      username: userInfo.id,
    }),
  });
  res.redirect("/home");
});

app.post("/book/return/:id", async (req, res) => {
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

  res.redirect("/home");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
