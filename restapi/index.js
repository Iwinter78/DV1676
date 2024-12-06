import express from 'express';
import { createUser } from './src/user.js';

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
        await createUser(email, username);

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



app.listen(port, () => {
    console.log(`REST API is listning on ${port}`);
});