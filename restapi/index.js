import express from 'express';
import * as user from './src/user.js';

const app = express();

const port = 3000;

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
    let email = req.query.email;

    if (!email) {
        return res.status(400).json({
            message: 'Email krävs',
            status: 400
        });
    }
    
    try {
        let response = await user.getUser(email);
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({
            message: 'Något gick fel, försök igen senare',
            status: 500,
            error: error.message
        });
    }
});

app.delete('/api/v1/delete/user/:email', async (req, res) => {
    const email = req.params.email;

    if (!email) {
        return res.status(400).json({
            message: 'Email krävs',
            status: 400
        });
    }

    try {
        await user.deleteUser(email);

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

app.post('/api/v1/create/bike', async (req, res) => {
    const { gps, city } = req.body;

    if (!gps || !city) {
        return res.status(400).json({
            message: 'GPS och stad krävs',
            status: 400
        });
    }

    try {
        await user.createBike(gps, city);

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

