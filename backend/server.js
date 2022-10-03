//========//IMPORTS
const http = require('http');
const https = require('https');
const app = require('./app');
const fs = require('fs')
const path = require('path');

//========//CONFIG

const server = http.createServer(app);

const sslServer = https.createServer({
    key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem'))
}, app);

function startMessage (protocol, port) {
    console.log(protocol + " server run on port " + port)
}

//========//CREATE SERVERS
server.listen(process.env.PORT_HTTP, startMessage('HTTP', process.env.PORT_HTTP)); 

sslServer.listen(process.env.PORT_HTTPS, startMessage('HTTPS', process.env.PORT_HTTPS)); 