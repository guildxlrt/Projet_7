//================//IMPORTS//================//
const express = require('express');
const path = require('path');
require('dotenv').config()
const cookieParser = require('cookie-parser');
// Securite
const cors = require('cors');
const helmet = require("helmet");
const rateLimit = require('express-rate-limit')
const slowDown = require("express-slow-down");


//================//APPLICATION//================//

//========//CONFIG//========//
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
    windowMs: 1000 * 60 * 15, //15 minutes
    delayAfter: 100,
    delayMs: 500
  });

const corsOptions = {
  origin : process.env.CLIENT_URL,
  credential : true,
  'allowedHeaders' : ['sessionId','Content-Type'],
  'exposedHeaders' : ['sessionId'],
  'methods' : 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
  'preflightContinue' : false,
  'Strict-Transport-Security' : 'max-age=31536000; includeSubDomains',
  'Cross-Origin-Resource-Policy' : 'same-site'
}

//========//START//========//
app.use(express.json());
app.use(cookieParser())
app.use(cors(corsOptions));
app.use(helmet());
//---expresss rate limit
app.use(limiter);
//---express slow down
// app.enable("trust proxy"); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS if you use an ELB, custom Nginx setup, etc)
app.use(speedLimiter);

//========//Autorisations
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', process.env.CLIENT_URL);
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Expose-Headers', 'sessionId')
  res.setHeader('Cross-Origin-Resource-Policy', 'same-site');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  next();
});

//========//Multer
app.use('/images', express.static(path.join(__dirname, 'images')))
app.use(express.static('images'));

//========//Endpoints
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);


//================//EXPORT//================//
module.exports = app;