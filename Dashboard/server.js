const express = require('express');
const app = express();
const path = require("path");
const ejs = require("ejs");

module.exports = client => {

    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, 'views'));

    app.get('/', (req, res) => {
        res.render('index', { message: 'Hello World', client });
    });

    app.listen(process.env.port, () => {
        console.log(`Le serveur fonctionne sur http://localhost:${process.env.port}`);
    });
};