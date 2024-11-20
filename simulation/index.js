import express from 'express';

const app = express();

const port = 5000;

app.get('/', (req, res) => {
    res.send("Simulation server!");
});

app.listen(port, () => {
    console.log(`Simulation server is listning on ${port}`);
});