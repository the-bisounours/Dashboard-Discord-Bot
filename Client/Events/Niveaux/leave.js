const { Events, Client, GuildMember } = require("discord.js");
const { Users, Guilds } = require("../../Models");

module.exports = {
    name: Events.GuildMemberRemove,
    once: false,

    /**
     * 
     * @param {Client} client 
     * @param {GuildMember} member 
     */
    execute: async (client, member) => {

        if(!member || !member.user || !member.user.id || member.user.bot || !member.guild || !member.guild.id) return;

        const data = await Guilds.findOne({
            guildId: member.guild.id
        });

        const user = await Users.findOne({
            userId: member.user.id,
            guildId: member.guild.id
        });

        if(!user || !data || !data.level.settings.resetLeave) return;
        user.leveling.xp = 0;
        user.leveling.level = 0;
        await user.save();
    }
};