const { formatDistanceToNow } = require('date-fns');
const { fr } = require('date-fns/locale');

/**
 * Remplace les placeholders dans la chaîne par les valeurs fournies dans l'objet
 * 
 * @param {String} string La chaîne contenant les placeholders
 * @param {Object} object L'objet contenant les informations de remplacement
 * @returns {String} La chaîne avec les valeurs remplacées
 */
module.exports = (string, object) => {
    // Extraire les propriétés de l'objet avec des valeurs par défaut
    const member = object?.member || {};
    const invite = object?.invite || {};
    const invites = object?.invites || {};
    const guild = object?.guild || {};
    const { level = 'N/A', xp = 'N/A', rank = 'N/A' } = object;

    const user = member.user || {};
    const userId = user.id || 'N/A';
    const createdAt = user.createdAt || new Date(0);
    const createdTimestamp = user.createdTimestamp ? Math.floor(user.createdTimestamp / 1000) : null;

    const replacements = {
        '{member}': user || 'N/A',
        '{memberName}': user.username || 'N/A',
        '{memberId}': member.id || 'N/A',
        '{memberFullName}': user.username ? `${user.username}#${user.discriminator || '0000'}` : 'N/A',
        '{memberMention}': userId ? `<@${userId}>` : 'N/A',
        '{memberImage}': user.displayAvatarURL() || 'N/A',
        '{memberCreatedDate}': createdAt.toLocaleString('fr-FR', { dateStyle: 'long', timeStyle: 'short' }),
        '{memberCreatedDateNew}': createdTimestamp ? `<t:${createdTimestamp}:f>` : 'N/A',
        '{memberCreatedDuration}': createdAt ? formatDistanceToNow(createdAt, { locale: fr }) : 'N/A',
        '{memberCreatedSince}': createdAt ? formatDistanceToNow(createdAt, { locale: fr, addSuffix: true }) : 'N/A',
        '{memberCreatedSinceNew}': createdTimestamp ? `<t:${createdTimestamp}:R>` : 'N/A',

        '{guildMemberCount}': guild.memberCount || 'N/A',
        '{guildName}': guild.name || 'N/A',
        '{guildIcon}': guild.icon && guild.iconURL() || 'N/A',

        '{inviteCode}': invite.code || 'N/A',
        '{inviteValidCount}': (invites.join || 0) - (invites.leave || 0) || '0',
        '{inviteCount}': invites.join || '0',
        '{inviteBonusCount}': invites.bonus || '0',
        '{inviteFakeCount}': invites.fake || '0',
        '{inviteLeaveCount}': invites.leave || '0',
        '{inviteTotalCount}': (invites.join || 0) + (invites.bonus || 0) - (invites.fake || 0) - (invites.leave || 0) || '0',
        '{inviterName}': invite.inviter?.username || invite.username || 'N/A',
        '{inviterId}': invite.inviter?.id || invite.id || 'N/A',
        '{inviterMention}': invite.inviter ? `<@${invite.inviter.id}>` : invite.id ? `<@${invite.id}>` : 'N/A',
        '{inviterFullName}': invite.inviter ? `${invite.inviter.username}#${invite.inviter.discriminator}` : invite.username ? `${invite.username}#${invite.discriminator}` : 'N/A',
        '{inviterCreatedDate}': invite.inviter?.createdTimestamp ? `<t:${Math.floor(invite.inviter.createdTimestamp / 1000)}:f>` : invite.createdTimestamp ? `<t:${Math.floor(invite.createdTimestamp / 1000)}:f>` : 'N/A',
        '{inviterCreatedSince}': invite.inviter?.createdTimestamp ? `<t:${Math.floor(invite.inviter.createdTimestamp / 1000)}:R>` : invite.createdTimestamp ? `<t:${Math.floor(invite.createdTimestamp / 1000)}:R>` : 'N/A',

        '{level}': level,
        '{xp}': xp,
        '{rank}': rank
    };

    return string.replace(/{\w+}/g, match => replacements[match] || match);
};