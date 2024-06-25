const { Events, Client, GuildMember } = require("discord.js");
const { Invites, Users, memberInvite } = require("../../Models");

module.exports = {
    name: Events.GuildMemberAdd,
    once: false,

    /**
     * 
     * @param {Client} client 
     * @param {GuildMember} member 
     */
    execute: async (client, member) => {

        const guildInvites = await Invites.find({ guildId: member.guild.id });
        const newInvites = await member.guild.invites.fetch();

        const usedInvite = newInvites.find(invite => {
            const oldInvite = guildInvites.find(i => i.code === invite.code);
            return oldInvite && invite.uses > oldInvite.uses;
        });

        if (usedInvite) {

            let inviter = await Users.findOne({ 
                userId: usedInvite.inviter.id 
            });

            if (!inviter) {
                inviter = new Users({ 
                    userId: usedInvite.inviter.id 
                });
            };

            inviter.invites.real += 1;
            await inviter.save();

            await new memberInvite({
                memberId: member.id,
                inviterId: usedInvite.inviter.id,
                guildId: member.guild.id
            }).save();

            let newUser = await Users.findOne({ 
                userId: member.id 
            });

            if (!newUser) {
                newUser = new Users({ 
                    userId: member.id 
                });
                await newUser.save();
            };

            const inviteInDb = await Invites.findOne({ code: usedInvite.code });
            inviteInDb.uses = usedInvite.uses;
            await inviteInDb.save();

            console.log(`${member.user.tag} a été invité par ${usedInvite.inviter.tag}. Il a maintenant ${inviter.invites} invites.`);
        }
    }
};