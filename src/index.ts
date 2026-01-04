import 'dotenv/config';
import express from 'express';
import env from './config/env';

const app = express();

app.get('/', (req, res) => {
    res.send('Server is running!');
});

app.listen(env, () => {
    console.log(`🚀 Server running on http://localhost:${env.port}`);
});