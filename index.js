const { Client, GatewayIntentBits, Collection } = require("discord.js");
const fs = require("fs");
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers
    ]
});

client.commands = new Collection();

client.login(process.env.token);

fs.readdirSync("./Client/Handlers").forEach(file => {
    require(`./Client/Handlers/${file}`)(client);
});