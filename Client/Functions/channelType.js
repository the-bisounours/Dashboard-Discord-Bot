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
            return 'Annonces';
        case ChannelType.GuildCategory:
            return 'Catégorie';
        case ChannelType.GuildDirectory:
            return 'Répertoire';
        case ChannelType.GuildForum:
            return 'Forum';
        case ChannelType.GuildMedia:
            return 'Média';
        case ChannelType.GuildStageVoice:
            return 'Vocal';
        case ChannelType.GuildText:
            return 'Textuel';
        case ChannelType.GuildVoice:
            return 'Vocal ';
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