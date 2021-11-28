var port = process.env.PORT || 3000,
    http = require('http'),
    fs = require('fs'),
    html = fs.readFileSync('success.html');
const admin = require("firebase-admin");
require('dotenv').config()
const HtmlWebpackPlugin = require('html-webpack-plugin');

var key = process.env.PRIVATE_KEY;

admin.initializeApp({
    credential: admin.credential.cert({

        "private_key": key.replace(/\\n/g, '\n'),
        "client_email": process.env.CLIENT_EMAIL,
        "project_id": process.env.PROJECT_ID
    })
});

var log = function (entry) {
    fs.appendFileSync('/tmp/sample-app.log', new Date().toISOString() + ' - ' + entry + '\n');
};

var server = http.createServer(function (req, res) {
    if (req.method === 'POST') {
        var body = '';

        req.on('data', function (chunk) {
            body += chunk;
        });

        req.on('end', function () {
            if (req.url === '/') {
                log('Received message: ' + body);
            } else if (req.url = '/scheduled') {
                log('Received task ' + req.headers['x-aws-sqsd-taskname'] + ' scheduled at ' + req.headers['x-aws-sqsd-scheduled-at']);
            }

            res.writeHead(200, 'OK', { 'Content-Type': 'text/plain' });
            res.end();
        });
    } else {

        if (req.url === '/spare_parts') {
            html = fs.readFileSync('spare_parts.html');
            res.writeHead(200);
            res.write(html);
            res.end();
        } else if (req.url === '/create_cone') {
            html = fs.readFileSync('create_cone.html');
            res.writeHead(200);
            res.write(html);
            res.end();
        } else if (req.url === '/create_sp') {
            html = fs.readFileSync('create_sp.html');
            res.writeHead(200);
            res.write(html);
            res.end();
        } else {
            html = fs.readFileSync('success.html');
            res.writeHead(200);
            res.write(html);
            res.end();
        }

    }
});

// Listen on port 3000, IP defaults to 127.0.0.1
server.listen(port);

// Put a friendly message on the terminal
console.log('Server running at http://127.0.0.1:' + port + '/');