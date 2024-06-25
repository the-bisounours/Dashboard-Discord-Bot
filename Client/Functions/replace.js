const { formatDistanceToNow, format } = require('date-fns');
const { fr } = require('date-fns/locale');

/**
 * 
 * @param {String} string 
 * @param {Object} object
 * @returns {String}
 */
module.exports = (string, object) => {

    const member = object.member;
    const invite = object.invite;
    const invites = object.invites;
    const guild = object.guild;

    const replacements = {
        '{memberName}': member.user.username,
        '{memberId}': member.id,
        '{memberFullName}': `${member.user.username}#${member.user.discriminator}`,
        '{memberMention}': `<@${member.id}>`,
        '{memberImage}': member.user.displayAvatarURL(),
        '{memberCreatedDate}': member.user.createdAt.toLocaleString('fr-FR', { dateStyle: 'long', timeStyle: 'short' }),
        '{memberCreatedDateNew}': `<t:${Math.floor(member.user.createdTimestamp / 1000)}:f>`,
        '{memberCreatedDuration}': formatDistanceToNow(member.user.createdAt, { locale: fr }),
        '{memberCreatedSince}': formatDistanceToNow(member.user.createdAt, { locale: fr, addSuffix: true }),
        '{memberCreatedSinceNew}': `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`,
        '{inviteCode}': invite ? invite.code : 'N/A',
        '{inviteValidCount}': invites ? invites.real : 0,
        '{inviteCount}': invites ? invites.real : 0,
        '{inviteBonusCount}': invites ? invites.bonus : 0,
        '{inviteFakeCount}': invites ? invites.fake : 0,
        '{inviteLeaveCount}': invites ? invites.leave : 0,
        '{inviteTotalCount}': invites ? invites.real + invites.bonus + invites.fake : 0,
        '{inviterName}': invite ? invite.inviter ? invite.inviter.username : invite.username : 'N/A',
        '{inviterId}': invite ? invite.inviter ? invite.inviter.id : invite.id : 'N/A',
        '{inviterMention}': invite ? `<@${invite.inviter ? invite.inviter.id : invite.id}>` : 'N/A',
        '{inviterFullName}': invite ? `${invite.inviter ? invite.inviter.username : invite.username}#${invite.inviter ? invite.inviter.discriminator : invite.discriminator}` : 'N/A',
        '{inviterCreatedDate}': invite ? `<t:${Math.floor(invite.inviter ? invite.inviter.createdTimestamp : invite.createdTimestamp / 1000)}:f>` : 'N/A',
        '{inviterCreatedSince}': invite ? `<t:${Math.floor(invite.inviter ? invite.inviter.createdTimestamp : invite.createdTimestamp / 1000)}:R>` : 'N/A',
        '{guildMemberCount}': guild.memberCount,
        '{guildName}': guild.name,
        '{guildIcon}': guild.iconURL()
    };

    return string.replace(/{\w+}/g, (match) => replacements[match] || match);
};