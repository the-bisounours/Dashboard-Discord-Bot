const { GuildMember, Invite } = require("discord.js");
const { Users, Guilds } = require("../Models");

/**
 * 
 * @param {GuildMember} member
 * @param {Invite} invite
 */
module.exports = async (member, invite) => {

    const user = await Users.findOne({
        userId: invite.inviter.id,
        guildId: member.guild.id
    });

    const data = await Guilds.findOne({
        guildId: member.guild.id
    });

    if(!user || !data) return;
    
    for (let index = 0; index < data.invites.ranks.length; index++) {
        const rank = data.invites.ranks[index];
        const inviterInvite = member.guild.members.cache.get(invite.inviter.id);

        if((user.invites.join + user.invites.bonus - user.invites.leave - user.invites.fake) >= rank.invites) {
            if(rank.roleId && inviterInvite && member.guild.roles.cache.get(rank.roleId)) {

                if(!inviterInvite.roles.cache.has(rank.roleId)) {
                    inviterInvite.roles.add(inviterInvite.roles.cache.get(rank.roleId), `Récompenses des ${rank.invites} invitations.`)
                    .then(async () => {
                        try {
                            return await member.send({
                                content: `Vous avez \`${user.invites.join + user.invites.bonus - user.invites.leave - user.invites.fake}\` invitations sur le serveur \`${member.guild.name}\` et pour vous récompensez vous obtenez le rôle \`${member.guild.roles.cache.get(rank.roleId).name}\`.`
                            });
                        } catch (err) {};
                    })
                    .catch(async () => {
                        try {
                            return await member.guild.members.cache.get(member.guild.ownerId).send({
                                content: `${inviterInvite} a atteint \`${user.invites.join + user.invites.bonus - user.invites.leave - user.invites.fake}\` invitations et obtient le rôle \`${member.guild.roles.cache.get(rank.roleId).name}\`. **Mais je ne peux pas lui donné**.`
                            });
                        } catch (err) {};
                    })
                }
            }
        };
    };
};