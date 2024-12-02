import express from 'express';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config();


const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');

app.use(express.static(join(__dirname, 'public')));
app.use(express.static(join(__dirname, 'views')));

app.get('/', (req, res) => {
    const data = {
        client_id: process.env.GITHUB_CLIENT_ID,
    }
    res.render('login/index', data);
});

app.get('/home', (req, res) => {
    res.render('home/index');
});

// Admin first view after login
app.get('/admin_view', (req, res) => {
  res.sendFile(join(__dirname, 'views/admin_panel', 'main.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
