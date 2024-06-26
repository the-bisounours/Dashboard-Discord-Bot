const { Events, Client, GuildMember } = require("discord.js");
const { Users, memberInvite, Guilds } = require("../../Models");
const replace = require("../../Functions/replace");

module.exports = {
    name: Events.GuildMemberRemove,
    once: false,

    /**
     * 
     * @param {Client} client 
     * @param {GuildMember} member 
     */
    execute: async (client, member) => {

        const data = await Guilds.findOne({
            guildId: member.guild.id
        });

        if (!data || !data.invites.leaveChannel || !member.guild.channels.cache.get(data.invites.leaveChannel)) return;

        let leaveMessage = data.invites.leaveMessage.unknown;

        inviter = null;
        const memberInv = await memberInvite.findOne({ memberId: member.id, guildId: member.guild.id });
        if (memberInv) {
            inviter = await Users.findOne({ 
                userId: memberInv.inviterId,
                guildId: member.guild.id
            });
            if (inviter) {

                inviter.invites.leave += 1;
                await inviter.save();

                leaveMessage = data.invites.leaveMessage.normal;
                await memberInvite.deleteOne({ memberId: member.id, guildId: member.guild.id });
            } else {
                leaveMessage = data.invites.leaveMessage.unknown;
            };
        } else if (member.guild.vanityURLCode) {
            leaveMessage = data.invites.leaveMessage.vanity;
        };

        member.guild.channels.cache.get(data.invites.leaveChannel).send({
            content: `${replace(leaveMessage, {
                member: member,
                invite: memberInv && await client.users.fetch(memberInv.inviterId) ? await client.users.fetch(memberInv.inviterId) : null,
                invites: inviter ? inviter.invites : null,
                guild: member.guild
            })}`
        });
    }
};