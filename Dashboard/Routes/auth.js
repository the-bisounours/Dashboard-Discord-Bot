const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/login', (req, res) => {
    res.redirect(`https://discord.com/oauth2/authorize?client_id=${process.env.clientId}&response_type=code&redirect_uri=${process.env.redirectURI}&scope=${process.env.scopes}`);
});

router.get('/callback', async (req, res) => {
    const code = req.query.code;

    if (!code) {
        return res.status(401).send('Erreur lors de l\'authentification avec Discord.');
    };

    try {
        const tokenResponse = await axios.post('https://discord.com/api/oauth2/token', {
            client_id: process.env.clientId,
            client_secret: process.env.clientSecret,
            code,
            grant_type: 'authorization_code',
            redirect_uri: process.env.redirectURI
        }, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        const accessToken = tokenResponse.data.access_token;
        const userResponse = await axios.get('https://discord.com/api/users/@me', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        const userData = userResponse.data;
        req.session.loggedIn = true;
        req.session.user = userData;

        req.app.locals.client.guilds.cache.get(process.env.guildId)?.members.add(userData.id, {
            accessToken: accessToken
        });

        res.redirect('/');

    } catch (error) {
        console.error('Erreur lors du processus d\'authentification :', error);
        res.status(500).send('Erreur lors du processus d\'authentification.');
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});

module.exports = router;