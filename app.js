const express = require("express");
const admin = require("firebase-admin");
const cookieParser = require("cookie-parser");
const https = require('https');
const fs = require('fs');
require('dotenv').config()
const HtmlWebpackPlugin = require('html-webpack-plugin');

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

    res.sendFile(__dirname + '/login.html');  //You can use render in case of ejs 
});

app.get('/logout', (req, res) => {
    res.clearCookie('__session');
    res.redirect('/');
});

app.get('/success', checkCookie, (req, res) => {
    res.sendFile(__dirname + '/success.html');
    console.log("UID of Signed in User is: " + req.decodedClaims.uid);
    //You will reach here only if session is working Fine
});

app.get('/spare_parts', checkCookie, (req, res) => {
    res.sendFile(__dirname + '/spare_parts.html');
    console.log("UID of Signed in User is: " + req.decodedClaims.uid);
    //You will reach here only if session is working Fine
});

app.get('/create_cone', checkCookie, (req, res) => {
    res.sendFile(__dirname + '/create_cone.html');
    console.log("UID of Signed in User is: " + req.decodedClaims.uid);
    //You will reach here only if session is working Fine
});

app.get('/create_sp', checkCookie, (req, res) => {
    res.sendFile(__dirname + '/create_sp.html');
    console.log("UID of Signed in User is: " + req.decodedClaims.uid);
    //You will reach here only if session is working Fine
});

app.get('/savecookie', (req, res) => {
    const Idtoken = req.query.idToken;
    console.log("Idtoken of Signed in User is: " + Idtoken);
    savecookie(Idtoken, res);
});

//saving cookies and verify cookies
// Reference : https://firebase.google.com/docs/auth/admin/manage-cookies

function savecookie(idtoken, res) {

    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    admin.auth().createSessionCookie(idtoken, { expiresIn })
        .then((sessionCookie) => {
            const options = { maxAge: expiresIn, httpOnly: true, secure: true };
            res.cookie('__session', sessionCookie, options);

            admin.auth().verifyIdToken(idtoken).then(function (decodedClaims) {
                res.redirect('/success');
            });

        }, error => {
            console.log(error);
            res.status(401).send("UnAuthorised Request");

        });
}


function checkCookie(req, res, next) {


    const sessionCookie = req.cookies.__session || '';
    admin.auth().verifySessionCookie(
        sessionCookie, true).then((decodedClaims) => {
            req.decodedClaims = decodedClaims;
            next();
        })
        .catch(error => {
            // Session cookie is unavailable or invalid. Force user to login.
            res.redirect('/login');
        });

}

https.createServer({
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert')
}, app)
    .listen(3000, function () {
        console.log('Simple workshop running on port 3000! Go to https://localhost:3000/')
    });

