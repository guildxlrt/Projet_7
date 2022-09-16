//importer express
import express from 'express';
import path from 'path';
import cors from 'cors';


// importer les routes
import * as userRoutes from './routes/user';
import * as postRoutes from './routes/post';

// appeller express via l'app
const app = express();

// json middleware
app.use(express.json());

// enable CORS
app.use(cors());


// connect database


// Autorisation d'acces aux ressources
app.use((req, res, next) => {
    // acceder a l'api depuis n'importe quelle origine
    res.setHeader('Access-Control-Allow-Origin', '*');
    // ajouter des en-tetes
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    // autorise des methodes
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});


// route images
app.use('/images', express.static(path.join(__dirname, 'images')))
app.use(express.static('images'));

// definir les routes
// utilisateurs
app.use('/api/auth', userRoutes.router);
// sauces
app.use('/api/posts', postRoutes.router);

// exporter l'api
export { app };