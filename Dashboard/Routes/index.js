const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    if (req.session.loggedIn) {
        res.render('index', { user: req.session.user, client: req.app.locals.client });
    } else {
        res.render('index');
    };
});

router.get('/dashboard', (req, res) => {
    if (!req.session.loggedIn) {
        res.redirect("/auth/login");
    } else {
        res.render('dashboard', { user: req.session.user, client: req.app.locals.client });
    };
});

module.exports = router;