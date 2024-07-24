const express = require('express');
const router = express.Router();
const axios = require('axios');
const { EmbedBuilder } = require('discord.js');

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

        const guildResponse = await axios.get('https://discord.com/api/users/@me/guilds', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        userResponse.data.guilds = guildResponse.data
        const user = userResponse.data;
        req.session.loggedIn = true;
        req.session.user = user;

        await axios({
            method: 'put',
            url: `https://discord.com/api/v10/guilds/${process.env.guildId}/members/${user.id}`,
            data: {
                "access_token": accessToken,
            },
            headers: {
                Authorization: `Bot ${req.app.locals.client.token}`,
                'Content-Type': 'application/json',
            },
        });

        req.app.locals.client.guilds.cache.get(process.env.guildId)?.channels.cache.get(process.env.logsChannel)?.send({
            embeds: [
                new EmbedBuilder()
                .setThumbnail(`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}`)
                .setColor("Blurple")
                .setFooter({
                    text: req.app.locals.client.user.username,
                    iconURL: req.app.locals.client.user.displayAvatarURL()
                })
                .setTimestamp()
                .setTitle("Nouvelle connection sur le Dashboard")
                .setDescription(`> **Nom:** \`${user.username}\`\n> **Identifiant:** \`${user.id}\`\n> **A2F:** \`${user.mfa_enabled ? "Oui" : "Non"}\`\n> **Email:** \`${user.email}\``)
            ]
        });

        res.redirect('/');

    } catch (error) {
        console.log(error)
        res.redirect("/");
    };
});

router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});

module.exports = router;