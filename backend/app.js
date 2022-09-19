//================//IMPORTS//================//
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config()

//========//References
const app = express();
app.use(express.json());
const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post');
const commentRoutes = require('./routes/comment');
app.use(cors());

//================//CONFIG//================//

//========//Autorisation
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