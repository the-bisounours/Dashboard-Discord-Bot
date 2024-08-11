const { ShardingManager } = require("discord.js");
require('dotenv').config();

const manager = new ShardingManager("./bot.js", {
    token: process.env.token
});

manager.spawn();