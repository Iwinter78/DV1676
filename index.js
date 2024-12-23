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
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: true,
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Access-Control-Allow-Origin",
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
app.get("/admin_view", (req, res) => {
  res.render("admin_panel/main");
});

app.get("/admin_panel/customer", async (req, res) => {
  const response = await fetch(`http://localhost:1337/api/v1/allUsers`);

  if (!response.ok) {
    throw new Error(`Failed to fetch data: ${response.statusText}`);
  }

  const data = await response.json();
  const users = data[0];

  res.render("admin_panel/customer", { users });
});
// Admin bike view
app.get("/admin_panel/bike", (req, res) => {
  res.render("admin_panel/bike");
});
// Admin station view
app.get("/admin_panel/station", (req, res) => {
  res.render("admin_panel/station");
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

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
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
