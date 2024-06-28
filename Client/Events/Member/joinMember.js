const { Events, Client, GuildMember } = require("discord.js");
const { Invites, Users, memberInvite, Guilds } = require("../../Models");
const replace = require("../../Functions/Invites/replace");
const checkInvites = require("../../Functions/Invites/checkInvites");

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
                userId: usedInvite.inviter.id,
                guildId: member.guild.id
            });

            if (!inviter) {
                inviter = new Users({
                    userId: usedInvite.inviter.id,
                    guildId: member.guild.id
                });
            };

            if (inviter.userId === member.user.id) {
                joinMessage = data.invites.joinMessage.self;
            } else {
                joinMessage = data.invites.joinMessage.normal;
            };

            if(inviter.userId === member.user.id) {
                inviter.invites.fake += 1;
            } else if(data.invites.fake.obligation.includes("2") && !member.user.avatar || data.invites.fake.obligation.includes("1") && (new Date() - member.user.createdAt) < 7 * 24 * 60 * 60 * 1000) {
                inviter.invites.fake += 1;
            };

            inviter.invites.join += 1;

            await inviter.save();

            await new memberInvite({
                memberId: member.id,
                inviterId: usedInvite.inviter.id,
                guildId: member.guild.id
            }).save();

            inviterName = usedInvite.inviter.tag;
            inviteCount = inviter.invites.join;

            const inviteInDb = await Invites.findOne({ code: usedInvite.code });
            inviteInDb.uses = usedInvite.uses;
            await inviteInDb.save();

        } else if (member.guild.vanityURLCode && newInvites.some(invite => invite.code === member.guild.vanityURLCode)) {
            joinMessage = data.invites.joinMessage.vanity;
        };

        let inviter = null;
        if (usedInvite) {
            inviter = await Users.findOne({
                userId: usedInvite.inviter.id,
                guildId: member.guild.id
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

        if(usedInvite) {
            await checkInvites(member, usedInvite);
        };
    }
};