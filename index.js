import express from 'express';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const app = express();
const port = 3001;

app.use(express.static(join(__dirname, 'views')));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Admin first view after login
app.get('/admin_view', (req, res) => {
  res.sendFile(join(__dirname, 'admin_panel/views', 'main.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
