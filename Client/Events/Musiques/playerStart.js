const { GuildQueueEvent, GuildQueue, Track } = require("discord-player");
const { Client, EmbedBuilder } = require("discord.js");

module.exports = {
    name: GuildQueueEvent.playerStart,
    once: false,

    /**
     * 
     * @param {Client} client 
     * @param {GuildQueue} queue 
     * @param {Track} track 
     */
    execute: (client, queue, track) => {

        if(queue.metadata && queue.metadata.channel) {
            queue.metadata.channel.send({
                content: `La musique \`${track.title}\` pendant \`${track.duration}\` demandée par \`${track.requestedBy.displayName}\` est diffusée.`
            });
        };
    }
};