const { Client, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ChannelSelectMenuInteraction } = require("discord.js");
const { Guilds } = require("../../Models");

module.exports = {
    id: "xp_message_channel",

    /**
     * 
     * @param {Client} client 
     * @param {ChannelSelectMenuInteraction} interaction 
     */
    execute: async (client, interaction) => {

        const data = await Guilds.findOne({
            guildId: interaction.guild.id
        });

        if (!data) {
            return await interaction.reply({
                content: `${client.emo.no} Impossible de trouver la base de donnée du serveur.`,
                ephemeral: true
            });
        };

        data.level.settings.message.channel =  interaction.values[0];
        await data.save();

        await interaction.update({
            fetchReply: true,
            content: `${client.emo.yes} Le salon d'expérience est maintenant ${interaction.guild.channels.cache.get(interaction.values[0])}.`,
            components: []
        });

        return await (await interaction.message.fetchReference()).edit({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Information du système de niveaux")
                    .setThumbnail(client.user.displayAvatarURL())
                    .setColor("Blurple")
                    .setFooter({
                        text: client.user.displayName,
                        iconURL: client.user.displayAvatarURL()
                    })
                    .setTimestamp()
                    .setDescription(`> ${client.emo.messages} **Message:** \`${data.level.settings.message.enabled ? `Activé` : "Désactivé"}\`\n> ${client.emo.peinture} **Image:** \`${data.level.settings.message.image ? `Activé` : "Désactivé"}\`\n> ${client.emo.salon} **Salon:** ${data.level.settings.message.channel && interaction.guild.channels.cache.get(data.level.settings.message.channel) ? `${interaction.guild.channels.cache.get(data.level.settings.message.channel)}` : "\`Salon Actuel\`"}`)
            ],
            components: [
                new ActionRowBuilder()
                    .addComponents(
                        new StringSelectMenuBuilder()
                            .setCustomId("xp_message")
                            .setDisabled(false)
                            .setMaxValues(1)
                            .setMinValues(1)
                            .setPlaceholder("Permet de configurer le système de message.")
                            .addOptions(
                                new StringSelectMenuOptionBuilder()
                                    .setEmoji(`${data.level.settings.message.enabled ? client.emo.no : client.emo.yes}`)
                                    .setLabel(`${data.level.settings.message.enabled ? "Désactivé les messages" : "Activé les messages"}`)
                                    .setValue("message_enabled"),
                                new StringSelectMenuOptionBuilder()
                                    .setEmoji(`${data.level.settings.message.image ? client.emo.no : client.emo.yes}`)
                                    .setLabel(`${data.level.settings.message.image ? "Désactivé les images" : "Activé les images"}`)
                                    .setValue("image_enabled"),
                                new StringSelectMenuOptionBuilder()
                                    .setEmoji(`${client.emo.salon}`)
                                    .setLabel("Configurez le salon")
                                    .setValue("channel"),
                                new StringSelectMenuOptionBuilder()
                                    .setEmoji(`${client.emo.fleche}`)
                                    .setLabel("Retournez au menu principal")
                                    .setValue("return")
                            )
                    )
            ]
        });
    }
};