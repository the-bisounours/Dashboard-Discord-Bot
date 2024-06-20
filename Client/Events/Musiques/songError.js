const { GuildQueueEvent, GuildQueue } = require("discord-player");
const { Client } = require("discord.js");

module.exports = {
    name: GuildQueueEvent.error,
    once: false,

    /**
     * 
     * @param {Client} client 
     * @param {GuildQueue} queue 
     * @param {Error} error 
     */
    execute: (client, queue, error) => {
        
        queue.node.skip();
    }
};