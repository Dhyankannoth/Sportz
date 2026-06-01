const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();



app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(helmet());
app.use(express.json());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP, please try again later",
    standardHeaders: true,
    legacyHeaders: false,
});


app.use(limiter);


app.use('/api/auth', require('./routes/auth'));
app.use('/api/matches', require('./routes/match'));

app.get("/health", (req, res) => {
    res.json({ status: "ok" });
});

module.exports = app;