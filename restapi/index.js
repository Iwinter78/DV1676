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
    const { email, username} = req.body;
    console.log(req.body);

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

app.get('/api/v1/user/:email', async (req, res) => {
    const { email } = req.params;

    if (!email) {
        return res.status(400).json({
            message: 'Email krävs',
            status: 400
        });
    }

    try {
        const user = await user.getUser(email);
        if (user.length === 0) {
            return res.status(404).json({
                message: 'Användare hittades inte',
                status: 404
            });
        }

        res.status(200).json({
            data: user[0]
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