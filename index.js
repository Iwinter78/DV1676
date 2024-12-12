import express from 'express';
import session from 'express-session';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import process from 'process';


import { exchangeCodeForToken, getUserInfo } from './src/login.js';

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config();


const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.static('src'));
app.use(express.static('public'));
app.use(express.static(join(__dirname, 'views')));

app.use(session({
    secret: 'Tl29wV0Cq0URN+XSsoJeYGwPVxbBnXqzKmDxkcki9Nw9WyeXxq6o1xmtIodBx9sb',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
}))

app.get('/', (req, res) => {
    const data = {
        client_id: process.env.GITHUB_CLIENT_ID,
    }
    res.render('login/index', data);
});

app.get('/callback', async (req, res) => {
    const code = req.query.code; 

    if (!code || code === null) {
        res.status(302).redirect('/');
    }
    const token = await exchangeCodeForToken(code);
    const userInfo = await getUserInfo(token);

    req.session.userInfo = userInfo;

    res.redirect('/home');
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

app.get('/home', (req, res) => {
    const userInfo = req.session.userInfo;
    if (!userInfo) {
        res.redirect('/');
    }
    res.render('home/index', userInfo);
});

// Admin first view after login
app.get('/admin_view', (req, res) => {
    res.render('admin_panel/main');
});

app.get('/admin_panel/customer', (req, res) => {
    res.render('admin_panel/customer');
});

app.get('/admin_panel/bike', (req, res) => {
    res.render('admin_panel/bike');
});

app.get('/admin_panel/station', (req, res) => {
    res.render('admin_panel/station');
});

app.get('/admin_panel/log', (req, res) => {

});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

// Route to show the users profile
app.get('/profile', async (req, res) => {
    const userInfo = req.session.userInfo;

    if (!userInfo) {
        return res.redirect('/'); // Om användaren inte är inloggad, skicka dem till startsidan
    }

    res.render('client/client_detail.ejs');

});

app.get('/history', async (req, res) => {
    const userInfo = req.session.userInfo;

    if (!userInfo) {
        return res.redirect('/'); //back to home if the user is not logd in
    }

    res.render('client/client_travel_history');

});
