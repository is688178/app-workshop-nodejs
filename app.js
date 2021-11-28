const express = require("express");
const admin = require("firebase-admin");
const cookieParser = require("cookie-parser");
const http = require('http');
const fs = require('fs');
require('dotenv').config()
const HtmlWebpackPlugin = require('html-webpack-plugin');
var port = process.env.port || 3000;

const app = express();

var key = process.env.PRIVATE_KEY;

admin.initializeApp({
    credential: admin.credential.cert({

        "private_key": key.replace(/\\n/g, '\n'),
        "client_email": process.env.CLIENT_EMAIL,
        "project_id": process.env.PROJECT_ID
    })
});

app.get('/', (req, res) => {

    res.sendFile(__dirname + '/success.html');
});

app.get('/logout', (req, res) => {
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

http.createServer(app)
    .listen(port, function () {
        console.log('Simple workshop running on port 3000! Go to http://localhost:3000/')
    });

