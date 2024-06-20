const { Events, Client } = require("discord.js");

module.exports = {
    name: Events.ClientReady,
    once: false,

    /**
     * 
     * @param {Client} client 
     */
    execute: (client) => {

        console.log(`${client.user.displayName} est connecté sur ${client.guilds.cache.size} serveurs.`);
    }
};