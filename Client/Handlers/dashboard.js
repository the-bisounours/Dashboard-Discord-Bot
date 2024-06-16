const { Client } = require("discord.js");

/**
 * 
 * @param {Client} client 
 */
module.exports = async (client) => {
    
    require("../../Dashboard/server")(client);
};