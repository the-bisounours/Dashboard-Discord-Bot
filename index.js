const { Client, GatewayIntentBits, Events } = require("discord.js");
const fs = require("fs");
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers
    ]
});

client.on(Events.ClientReady, () => {
    console.log("\x1b[34m", `${client.user.displayName} est connecté sur ${client.guilds.cache.size} serveurs.`);
});

client.login(process.env.token);

fs.readdirSync("./Client/Handlers").forEach(file => {
    require(`./Client/Handlers/${file}`)(client);
});