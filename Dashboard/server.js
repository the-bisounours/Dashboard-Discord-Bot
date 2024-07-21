const express = require('express');
const session = require('express-session');
const app = express();
const path = require("path");
const ejs = require("ejs");

module.exports = client => {

    app.use(session({
        secret: ";oksdflnsefgjwieofamdaoli;k",
        resave: false,
        saveUninitialized: false,
    }));

    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, 'views'));
    app.use(express.static('public'));

    app.locals.client = client;
    
    app.use('/', require("./routes/index"));
    app.use('/auth', require("./routes/auth"));
    app.use('/invite', require("./routes/index"));
    app.use('/support', require("./routes/index"));
    app.use('/commandes', require("./routes/index"));
    app.use('/dashboard', require("./routes/index"));

    app.listen(process.env.port, () => {
        console.log(`Le serveur fonctionne sur http://localhost:${process.env.port}`);
    });
};