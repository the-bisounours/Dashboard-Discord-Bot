const { Client } = require("discord.js");
const { Player } = require('discord-player');

/**
 * 
 * @param {Client} client 
 */
module.exports = async (client) => {
    
    client.player = new Player(client);
    await client.player.extractors.loadDefault((ext) => ext !== 'YouTubeExtractor');

    console.log("\x1b[32m", "La musique à bien été mit en place.");
};