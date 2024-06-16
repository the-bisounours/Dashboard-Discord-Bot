const { Events, Client } = require("discord.js");

module.exports = {
    name: Events.ClientReady,
    once: false,

    /**
     * 
     * @param {Client} client 
     */
    execute: (client) => {

        console.log("\x1b[34m", `${client.user.displayName} est connecté sur ${client.guilds.cache.size} serveurs.`);
    }
};