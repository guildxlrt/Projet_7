//================//IMPORTS//================//
const express = require('express');
const path = require('path');
require('dotenv').config()
// securite
const cors = require('cors');
const helmet = require("helmet");
const rateLimit = require('express-rate-limit')
const slowDown = require("express-slow-down");


//================//APPLICATION//================//

//========//References
const app = express();
const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post');
const commentRoutes = require('./routes/comment');

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

const speedLimiter = slowDown({
    windowMs: 15 * 60 * 1000, // 15 minutes
    delayAfter: 100, // allow 100 requests per 15 minutes, then...
    delayMs: 500 // begin adding 500ms of delay per request above 100:
    // request # 101 is delayed by  500ms
    // request # 102 is delayed by 1000ms
    // request # 103 is delayed by 1500ms
    // etc.
  });

//========//START
app.use(express.json());
app.use(cors());
app.use(helmet());
// expresss rate limit
app.use(limiter);
// express slow down
//app.enable("trust proxy"); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS if you use an ELB, custom Nginx setup, etc)
app.use(speedLimiter);

//========//Autorisations
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

//========//Multer
app.use('/images', express.static(path.join(__dirname, 'images')))
app.use(express.static('images'));

//========//Endpoints
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comment', commentRoutes);


//================//EXPORT//================//
module.exports = app;