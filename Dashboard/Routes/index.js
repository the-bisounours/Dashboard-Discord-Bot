const { OAuth2Scopes, PermissionFlagsBits } = require('discord.js');
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    if (req.session.loggedIn) {
        res.render('index', { user: req.session.user, client: req.app.locals.client });
    } else {
        res.render('index');
    };
});

router.get('/invite', (req, res) => {
    res.redirect(req.app.locals.client.generateInvite({
        scopes: [OAuth2Scopes.Bot, OAuth2Scopes.ApplicationsCommands],
        permissions: [
            PermissionFlagsBits.Administrator,
          ],
    }));
});

router.get('/premium', (req, res) => {
    res.redirect(`https://discord.com/application-directory/${req.app.locals.client.user.id}/store`);
});

router.get('/support', (req, res) => {
    res.redirect(process.env.supportInvite);
});

router.get('/dashboard', (req, res) => {
    if (!req.session.loggedIn) {
        res.redirect("/auth/login");
    } else {
        res.render('dashboard', { user: req.session.user, client: req.app.locals.client });
    };
});

module.exports = router;