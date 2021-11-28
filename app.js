var port = process.env.PORT || 3000,
    http = require('http'),
    fs = require('fs'),
    html = fs.readFileSync('success.html');
const express = require("express");
const admin = require("firebase-admin");
const cookieParser = require("cookie-parser");
require('dotenv').config()
const HtmlWebpackPlugin = require('html-webpack-plugin');
const port = process.env.port || 3000;
const app = express();
app.use(cookieParser());

var key = process.env.PRIVATE_KEY;

admin.initializeApp({
    credential: admin.credential.cert({

        "private_key": key.replace(/\\n/g, '\n'),
        "client_email": process.env.CLIENT_EMAIL,
        "project_id": process.env.PROJECT_ID
    })
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/success.html');  //You can use render in case of ejs 
});

app.get('/logout', (req, res) => {
    res.clearCookie('__session');
    res.redirect('/');
});

app.get('/success', (req, res) => {
    res.sendFile(__dirname + '/success.html');
});

app.get('/spare_parts', (req, res) => {
    res.sendFile(__dirname + '/spare_parts.html');
});

app.get('/create_cone', (req, res) => {
    res.sendFile(__dirname + '/create_cone.html');
});

app.get('/create_sp', (req, res) => {
    res.sendFile(__dirname + '/create_sp.html');
});

var log = function(entry) {
    fs.appendFileSync('/tmp/sample-app.log', new Date().toISOString() + ' - ' + entry + '\n');
};

var server = http.createServer(function (req, res) {
    if (req.method === 'POST') {
        var body = '';

        req.on('data', function(chunk) {
            body += chunk;
        });

        req.on('end', function() {
            if (req.url === '/') {
                log('Received message: ' + body);
            } else if (req.url = '/scheduled') {
                log('Received task ' + req.headers['x-aws-sqsd-taskname'] + ' scheduled at ' + req.headers['x-aws-sqsd-scheduled-at']);
            }

            res.writeHead(200, 'OK', {'Content-Type': 'text/plain'});
            res.end();
        });
    } else {
        res.writeHead(200);
        res.write(html);
        res.end();
    }
});

https.createServer({
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert')
}, app)
    .listen(port, function () {
        console.log('Simple workshop running on port ', port, '! Go to https://localhost:',port,'/')
    });

// Listen on port 3000, IP defaults to 127.0.0.1
server.listen(port);

// Put a friendly message on the terminal
console.log('Server running at http://127.0.0.1:' + port + '/');

module.exports = app;