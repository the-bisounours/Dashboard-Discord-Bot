const { SlashCommandBuilder, PermissionFlagsBits, Client, ChatInputCommandInteraction, ChannelType } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("renew")
        .setDescription("Supprime tous les messages.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .addChannelOption(option => option
            .setName("salon")
            .setDescription('Le salon a supprimer les messages')
            .setRequired(false)
            .addChannelTypes(
                ChannelType.GuildText,
                ChannelType.GuildVoice,
                ChannelType.GuildAnnouncement,
                ChannelType.GuildStageVoice,
                ChannelType.GuildCategory,
                ChannelType.GuildForum,
                ChannelType.GuildMedia
            )
        ),

    category: "Modérations",

    /**
     * 
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    execute: async (client, interaction) => {

        const channel = interaction.options.getChannel("salon") || interaction.channel;

        if(![
            ChannelType.GuildText,
            ChannelType.GuildVoice,
            ChannelType.GuildAnnouncement,
            ChannelType.GuildStageVoice,
            ChannelType.GuildCategory,
            ChannelType.GuildForum,
            ChannelType.GuildMedia
        ].includes(channel.type)) {
            return await interaction.reply({
                content: `${client.emo.no} Vous ne pouvez pas faire cette action sur ce type de salon.`,
                ephemeral: true
            });
        };

        if(channel.id === interaction.channel.id || interaction.channel.parentId === channel.id) {
            await interaction.reply({
                content: "👍",
                ephemeral: true
            });
        };

        await interaction.guild.channels.create({
            name: channel.name,
            topic: channel.topic,
            type: channel.type,
            nsfw: channel.nsfw,
            bitrate: channel.bitrate,
            userLimit: channel.userLimit,
            parent: channel.parent,
            position: channel.position,
            permissionOverwrites: channel.permissions,
            rateLimitPerUser: channel.rateLimitPerUser,
            rtcRegion: channel.rtcRegion,
            videoQualityMode: channel.videoQualityMode,
            defaultThreadRateLimitPerUser: channel.defaultThreadRateLimitPerUser,
            availableTags: channel.availableTags,
            defaultReactionEmoji: channel.defaultReactionEmoji,
            defaultAutoArchiveDuration: channel.defaultAutoArchiveDuration,
            defaultSortOrder: channel.defaultSortOrder,
            defaultForumLayout: channel.defaultForumLayout
        })
            .then(async renew => {

                if(channel.type === ChannelType.GuildCategory) {
                    await Promise.all(interaction.guild.channels.cache.filter(c => c.parentId === channel.id).map(async (childChannel) => {
                        await interaction.guild.channels.create({
                            name: childChannel.name,
                            topic: childChannel.topic,
                            type: childChannel.type,
                            nsfw: childChannel.nsfw,
                            bitrate: childChannel.bitrate,
                            userLimit: childChannel.userLimit,
                            parent: renew.id,
                            position: childChannel.position,
                            permissionOverwrites: childChannel.permissions,
                            rateLimitPerUser: childChannel.rateLimitPerUser,
                            rtcRegion: childChannel.rtcRegion,
                            videoQualityMode: childChannel.videoQualityMode,
                            defaultThreadRateLimitPerUser: childChannel.defaultThreadRateLimitPerUser,
                            availableTags: childChannel.availableTags,
                            defaultReactionEmoji: childChannel.defaultReactionEmoji,
                            defaultAutoArchiveDuration: childChannel.defaultAutoArchiveDuration,
                            defaultSortOrder: childChannel.defaultSortOrder,
                            defaultForumLayout: childChannel.defaultForumLayout
                        });
    
                        await childChannel.delete();
                    })).catch(async err => {
                        return await interaction.reply({
                            content: `Je n'ai pas pu créer le salon à cause d'une erreur.`,
                            ephemeral: true
                        });
                    });

                    return await channel.delete().catch(err => err);
                };

                await channel.delete().catch(err => err);

                return await interaction.reply({
                    content: `J'ai supprimer et créer le nouveau salon ${renew}.`
                });
            })
            .catch(async err => {
                return await interaction.reply({
                    content: `Je n'ai pas pu créer le salon à cause d'une erreur.`,
                    ephemeral: true
                });
            })
    }
};