const { Events, Client, GuildMember } = require("discord.js");
const { Users, memberInvite } = require("../../Models");

module.exports = {
    name: Events.GuildMemberRemove,
    once: false,

    /**
     * 
     * @param {Client} client 
     * @param {GuildMember} member 
     */
    execute: async (client, member) => {

        const memberInv = await memberInvite.findOne({ memberId: member.id, guildId: member.guild.id });
        if (memberInv) {
            const inviter = await Users.findOne({ userId: memberInv.inviterId });
            if (inviter) {

                inviter.invites.real -= 1;
                inviter.invites.leave += 1;
                await inviter.save();

                console.log(`${member.user.tag} left the server. Invited by ${inviter.userId}.`);
            };
            await memberInvite.deleteOne();
        };
    }
};