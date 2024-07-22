const { Events, Client, Guild } = require("discord.js");
const { Guilds } = require("../../Models");

module.exports = {
    name: Events.ClientReady,
    once: false,

    /**
     * 
     * @param {Client} client 
     */
    execute: async (client) => {

        client.guilds.cache.map(async guild => {
            const data = await Guilds.findOne({
                guildId: guild.id
            });
    
            if(!data) {
                await new Guilds({
                    guildId: guild.id
                }).save();
            };
        });
    }
};