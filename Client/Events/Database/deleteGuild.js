const { Events, Client, Guild } = require("discord.js");
const { Guilds } = require("../../Models");

module.exports = {
    name: Events.GuildDelete,
    once: false,

    /**
     * 
     * @param {Client} client 
     * @param {Guild} guild 
     */
    execute: async (client, guild) => {

        const data = await Guilds.findOne({
            guildId: guild.id
        });

        if(data) {
            await data.deleteOne();
        };
    }
};