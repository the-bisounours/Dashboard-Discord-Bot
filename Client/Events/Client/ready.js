const { Events, Client } = require("discord.js");
const chalk = require('chalk');

module.exports = {
    name: Events.ClientReady,
    once: false,

    /**
     * 
     * @param {Client} client 
     */
    execute: (client) => {

        console.log(chalk.blue.bold(`[Identifiant ${client.shard.ids[0]}] ${client.user.displayName} est connecté sur ${client.guilds.cache.size} serveur${client.guilds.cache.size > 1 ? "s" : ""}.`));
    }
};