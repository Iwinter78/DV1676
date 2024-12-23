import express from 'express';
import * as user from './src/user.js';
import * as bike from './src/bike.js';

const app = express();

const port = 1337;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.json({ message: 'Hello World!' });
});

app.post('/api/v1/create/user', async (req, res) => {
    const username = req.body.username;
    const email = req.body.email;

    if (!email || !username) {
        return res.status(400).json({
            message: 'Email och användarnamn krävs',
            status: 400
        });
    }

    try {
        await user.createUser(username, email);

        const response = {
            message: 'Användare skapad',
            status: 201,
            data: {
                email,
                username
            }
        }
    
        res.status(201).json(response);
    } catch (error) {
        res.status(500).json({
            message: 'Något gick fel, försök igen senare',
            status: 500,
            error: error.message
        });
    }
});

app.get('/api/v1/user', async (req, res) => {
    let username = req.query.username;

    if (!username) {
        return res.status(400).json({
            message: 'Användarnamn krävs',
            status: 400
        });
    }
    
    try {
        let response = await user.getUser(username);
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({
            message: 'Något gick fel, försök igen senare',
            status: 500,
            error: error.message
        });
    }
});
app.get('/api/v1/history', async (req, res) => {
    const username = req.query.username;
    console.log('Username:', username);

    if (!username) {
        return res.status(400).json({
            message: 'Användarnamn krävs',
            status: 400
        });
    }

    try {
        let response = await user.getUserLog(username);
        console.log('Database Response:', response);
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({
            message: 'Något gick fel, försök igen senare',
            status: 500,
            error: error.message
        });
    }
});

app.put('/api/v1/update/user/balance', async (req, res) => {
    console.log('Query Params:', req.query);

    const username = req.query.username;
    const balance = req.query.balance;

    if (!username || isNaN(balance)) {
        return res.status(400).json({
            message: 'Användarnamn och saldo krävs',
            status: 400
        });
    }

    try {
        await user.updateUserBalance(username, balance);

        res.status(200).json({
            message: 'Användarens saldo uppdaterat',
            status: 200
        });
    } catch (error) {
        res.status(500).json({
            message: 'Något gick fel, försök igen senare',
            status: 500,
            error: error.message
        });
    }
});

app.delete('/api/v1/delete/user/:username', async (req, res) => {
    const username = req.params.username;

    if (!username) {
        return res.status(400).json({
            message: 'username krävs',
            status: 400
        });
    }

    try {
        await user.deleteUser(username);

        res.status(200).json({
            message: 'Användare raderad',
            status: 200
        });
    } catch (error) {
        res.status(500).json({
            message: 'Något gick fel, försök igen senare',
            status: 500,
            error: error
        });
    }
});

// BIKES

app.get('/api/v1/bike', async (req, res) => {
    try {
        let response = await bike.getAllBikesPosition();
        res.status(200).json(response);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Något gick fel, försök igen senare',
            status: 500,
            error: error.message
        });
    }
});

app.post('/api/v1/create/bike', async (req, res) => {
    const {gps, city} = req.body;

    if (!gps || !city) {
        return res.status(400).json({
            message: 'GPS och stad krävs',
            status: 400
        });
    }

    try {
        await bike.createBike(gps, city);

        const response = {
            message: 'Cykel skapad',
            status: 201,
            data: {
                gps,
                city,
            }
        }
    
        res.status(201).json(response);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Något gick fel, försök igen senare',
            status: 500,
            error: error.message
        });
    }
});

app.put('/api/v1/update/bike', async (req, res) => {
    const {id, gps} = req.body;

    if (!gps || !id) {
        return res.status(400).json({
            message: 'GPS och id krävs',
            status: 400
        });
    }

    try {
        await bike.updateBikePosition(id, gps);

        res.status(200).json({
            message: 'Cykel uppdaterad',
            status: 200
        });
    } catch (error) {
        res.status(500).json({
            message: 'Något gick fel, försök igen senare',
            status: 500,
            error: error.message
        });
    }
});

app.listen(port, () => {
    console.log(`REST API is listning on ${port}`);
});

app.get('/api/v1/allUsers', async (req, res) => {
    let response = await user.getAllUsers();
    console.log(response);
    res.status(200).json(response);
});