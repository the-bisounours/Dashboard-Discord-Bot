const { Client } = require("discord.js");
const { Player } = require('discord-player');

/**
 * 
 * @param {Client} client 
 */
module.exports = async (client) => {
    
    const player = new Player(client);
    await player.extractors.loadDefault((ext) => ext !== 'YouTubeExtractor');
};