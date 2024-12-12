import express from 'express';
import * as user from './src/user.js';

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
    console.log(username);
    console.log(typeof username);
    let response = await user.getUser(username);
    console.log(response);
    res.status(200).json(response);
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


app.get('/api/v1/history', async (req, res) => {
    let username = req.query.username;
    console.log(username);
    console.log(typeof username);
    let response = await user.getUserLog(username);
    console.log(response);
    res.status(200).json(response);
});

app.listen(port, () => {
    console.log(`REST API is listning on ${port}`);
});

