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
        
        if(queue.metadata && queue.metadata.channel) {
            queue.metadata.channel.send({
                content: `Une erreur est survenue \`${error.name}\`.`
            });
        };
    }
};