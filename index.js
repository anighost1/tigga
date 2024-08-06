import express from 'express';
import cors from 'cors'
import mongoConnect from './config/mongodb.config.js';

import authRoute from './routes/auth.route.js'

const app = express();
// eslint-disable-next-line no-undef
const port = process.env.PORT || 1998;

mongoConnect()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.send('Tigga');
})

app.use('/api/auth',authRoute)

app.listen(port, () => {
    console.log(`Tigga server running at port : ${port}`);
});