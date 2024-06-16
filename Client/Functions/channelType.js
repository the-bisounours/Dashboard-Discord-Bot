const { ChannelType } = require("discord.js");

function channelType(channelType) {
    switch (channelType) {
        case ChannelType.AnnouncementThread:
            return 'Discussion d\'annonce';
        case ChannelType.DM:
            return 'Messages privés';
        case ChannelType.GroupDM:
            return 'Messages de groupe';
        case ChannelType.GuildAnnouncement:
            return 'Annonces de serveur';
        case ChannelType.GuildCategory:
            return 'Catégorie de serveur';
        case ChannelType.GuildDirectory:
            return 'Répertoire de serveur';
        case ChannelType.GuildForum:
            return 'Forum de serveur';
        case ChannelType.GuildMedia:
            return 'Média de serveur';
        case ChannelType.GuildStageVoice:
            return 'Salon vocal de scène';
        case ChannelType.GuildText:
            return 'Salon textuel de serveur';
        case ChannelType.GuildVoice:
            return 'Salon vocal de serveur';
        case ChannelType.PrivateThread:
            return 'Discussion privée';
        case ChannelType.PublicThread:
            return 'Discussion publique';
        default:
            return 'Inconnu';
    }
}

module.exports = {
    channelType
};