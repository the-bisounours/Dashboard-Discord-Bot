const { Events, Client, GuildMember } = require("discord.js");
const { Invites, Users, memberInvite, Guilds } = require("../../Models");
const replace = require("../../Functions/replace");

module.exports = {
    name: Events.GuildMemberAdd,
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

        if (!data || !data.invites.joinChannel || !member.guild.channels.cache.get(data.invites.joinChannel)) return;

        const guildInvites = await Invites.find({ guildId: member.guild.id });
        const newInvites = await member.guild.invites.fetch();

        const usedInvite = newInvites.find(invite => {
            const oldInvite = guildInvites.find(i => i.code === invite.code);
            return oldInvite && invite.uses > oldInvite.uses;
        });

        let joinMessage = data.invites.joinMessage.unknown;

        if (usedInvite) {
            let inviter = await Users.findOne({
                userId: usedInvite.inviter.id
            });

            if (!inviter) {
                inviter = new Users({
                    userId: usedInvite.inviter.id
                });
            };

            if (inviter.userId === member.user.id) {
                inviter.invites.fake += 1;
                joinMessage = data.invites.joinMessage.self;
            } else {
                inviter.invites.real += 1;
                joinMessage = data.invites.joinMessage.normal;
            };

            await inviter.save();

            await new memberInvite({
                memberId: member.id,
                inviterId: usedInvite.inviter.id,
                guildId: member.guild.id
            }).save();

            inviterName = usedInvite.inviter.tag;
            inviteCount = inviter.invites.real;

            const inviteInDb = await Invites.findOne({ code: usedInvite.code });
            inviteInDb.uses = usedInvite.uses;
            await inviteInDb.save();

        } else if (member.guild.vanityURLCode && newInvites.some(invite => invite.code === member.guild.vanityURLCode)) {
            joinMessage = data.invites.joinMessage.vanity;
        };

        let inviter = null;
        if (usedInvite) {
            inviter = await Users.findOne({
                userId: usedInvite.inviter.id
            });
        };

        member.guild.channels.cache.get(data.invites.joinChannel).send({
            content: `${replace(joinMessage, {
                member: member,
                invite: usedInvite ? usedInvite : null,
                invites: inviter ? inviter.invites : null,
                guild: member.guild
            })}`
        });
    }
};