const { Client, GatewayIntentBits, Collection } = require("discord.js");
const fs = require("fs");
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates
    ]
});

client.buttons = new Collection();
client.context = new Collection();
client.selects = new Collection();
client.modals = new Collection();
client.commands = new Collection();
client.slashArray = new Array();

client.login(process.env.token);

fs.readdirSync("./Client/Handlers").forEach(file => {
    require(`./Client/Handlers/${file}`)(client);
});