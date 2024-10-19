/* eslint-disable no-undef */
import express from 'express';
import cors from 'cors'
import mongoConnect from './config/mongodb.config.js';
import { createProxyMiddleware } from 'http-proxy-middleware';
import routeProtection from './middleware/routeProtection.js';

import authRoute from './routes/auth.route.js'

const app = express();
const port = process.env.PORT || 1998;
const microservices = JSON.parse(process.env.MICROSERVICES || '{}');

mongoConnect()

app.use(cors())
// app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.send('Tigga');
})

app.use('/api/auth', express.json(), authRoute)

app.get('/api/services', routeProtection, (req, res) => {
    res.json(microservices);
});

app.use('/api/:service', routeProtection, (req, res, next) => {
    const serviceName = req.params.service;
    const serviceUrl = microservices[serviceName];

    if (serviceUrl) {
        createProxyMiddleware({
            target: serviceUrl,
            changeOrigin: true,
            pathRewrite: {
                [`^/api/${serviceName}`]: '',
            },
            logger: console
        })(req, res, next);
    } else {
        res.status(404).json({ error: `Service '${serviceName}' not found` });
    }
});

app.listen(port, () => {
    console.log(`Tigga server running at port : ${port}`);
});