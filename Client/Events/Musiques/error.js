const { PlayerEvent } = require("discord-player");
const { Client } = require("discord.js");

module.exports = {
    name: PlayerEvent.error,
    once: false,

    /**
     * 
     * @param {Client} client 
     * @param {Error} error
     */
    execute: (client, error) => {
        
        console.log(error)
    }
};