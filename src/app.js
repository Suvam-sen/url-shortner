import express from 'express'
import cors from 'cors'
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express()

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true
    })
)

// Common middlewares
app.use(express.json({ limit: '16kb' }))
app.use(express.urlencoded({ extended: true, limit: '16kb' }))
app.use(express.static(path.join(__dirname,'public')));

// import routes
import { generateShortId, redirectUrl, getUrlStats } from './controllers/url.controller.js';



// ✅ Define all routes directly here
app.post('/url/shorten', generateShortId);
app.get('/:shortId', redirectUrl);
app.get('/url/stats/:shortId', getUrlStats);


export { app }