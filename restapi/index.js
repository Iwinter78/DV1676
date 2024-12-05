import express from 'express';
import { createUser } from './src/user.js';

const app = express();

const port = 1337;

app.get('/', (req, res) => {
    res.json({ message: 'Hello World!' });
});

app.post('/api/v1/create/user/:email/:username', async (req, res) => {
    const email = req.params.email;
    const username = req.params.username;
    const response = await createUser(username, email);
    res.json({ response });
});

app.listen(port, () => {
    console.log(`REST API is listning on ${port}`);
});