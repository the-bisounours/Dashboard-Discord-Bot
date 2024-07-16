const { Guild, Client } = require("discord.js");
const { Users } = require("../../Models");

/**
 * @param {Client} client 
 * @param {Guild} guild 
 * @param {Object} giveaway 
 * @returns {Array}
 */
module.exports = async (client, guild, giveaway) => {

    let participants = giveaway.participants;

    const participantChecks = participants.map(async user => {
        if (giveaway.settings.inviteRequired !== 0) {
            const dbUser = await Users.findOne({
                guildId: guild.id,
                userId: user.userId
            });

            const realInvites = dbUser.invites.bonus + dbUser.invites.join - dbUser.invites.fake - dbUser.invites.leave;
            if (realInvites < giveaway.settings.inviteRequired) return false;
        };

        if (giveaway.settings.requiredGuild && client.guilds.cache.get(giveaway.settings.requiredGuild)) {
            if (!client.guilds.cache.get(giveaway.settings.requiredGuild)?.members.cache.get(user.userId)) return false;
        };

        for (let index = 0; index < giveaway.settings.requiredRoles.length; index++) {
            const requiredRole = giveaway.settings.requiredRoles[index];
            const role = guild.roles.cache.get(requiredRole);

            if (role && !guild.members.cache.get(user.userId)?.roles.cache.has(role.id)) return false;
        };

        return true;
    });

    const results = await Promise.all(participantChecks);
    return participants.filter((user, index) => results[index]);
};