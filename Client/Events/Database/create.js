const { Events, Client, Guild } = require("discord.js");
const { Guilds } = require("../../Models");

module.exports = {
    name: Events.GuildCreate,
    once: false,

    /**
     * 
     * @param {Client} client 
     * @param {Guild} client 
     */
    execute: async (client, guild) => {

        const data = await Guilds.findOne({
            guildId: guild.id
        });

        if(!data) {
            await new Guilds({
                guildId: guild.id
            }).save();
        };
    }
};