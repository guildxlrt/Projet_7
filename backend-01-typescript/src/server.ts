// importer le package http de node
import http from 'http';


// importer l'appli
import {app} from './app';

// par defaut on utilise le port 3000 pour lancer l'application
app.set('port', process.env.PORT || 3000);

// appeller la methode create server du package https
const server = http.createServer(app);

// le serveur doit ecouter, attendre les requetes
server.listen(process.env.PORT || 3000);