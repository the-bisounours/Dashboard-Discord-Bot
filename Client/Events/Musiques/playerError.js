const { GuildQueueEvent, GuildQueue, Track } = require("discord-player");
const { Client } = require("discord.js");

module.exports = {
    name: GuildQueueEvent.playerError,
    once: false,

    /**
     * 
     * @param {Client} client 
     * @param {GuildQueue} queue 
     * @param {Error} error 
     * @param {Track} track 
     */
    execute: (client, queue, error, track) => {
        
        queue.node.skip();
    }
};