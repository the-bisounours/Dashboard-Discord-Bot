const { Client, ButtonInteraction, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ChannelSelectMenuBuilder, ChannelType, RoleSelectMenuBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { Guilds } = require("../../Models");

module.exports = {
    id: "autoclose_enabled",

    /**
     * 
     * @param {Client} client 
     * @param {ButtonInteraction} interaction 
     */
    execute: async (client, interaction) => {

        if (interaction.user.id !== interaction.message.interaction.user.id) {
            return await interaction.reply({
                content: `${client.emo.no} Vous n'êtes pas l'auteur de cette commande.`,
                ephemeral: true
            });
        };

        const data = await Guilds.findOne({
            guildId: interaction.guild.id
        });

        if (!data) {
            return await interaction.reply({
                content: `${client.emo.no} Impossible de trouver la base de donnée du serveur.`,
                ephemeral: true
            });
        };

        data.tickets.settings.autoclose = data.tickets.settings.autoclose ? false : true;
        await data.save();

        return await interaction.update({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Informations des panneaux des tickets")
                    .setThumbnail(client.user.displayAvatarURL())
                    .setColor("Blurple")
                    .setFooter({
                        text: client.user.displayName,
                        iconURL: client.user.displayAvatarURL()
                    })
                    .setTimestamp()
                    .setDescription(`> **Tickets:** \`${data.tickets.settings.enabled ? "Activé" : "Désactivé"}\`\n> **Autoclose:** \`${data.tickets.settings.autoclose ? "Activé" : "Désactivé"}\`\n> **Threads:** ${data.tickets.settings.threads.enabled ? `\`Activé\` ${data.tickets.settings.threads.channelId && interaction.guild.channels.cache.get(data.tickets.settings.threads.channelId) ? interaction.guild.channels.cache.get(data.tickets.settings.threads.channelId) : "\`Aucun salon\`"}` : "\`Désactivé\`"}\n> **Ticket ouvert:** \`${data.tickets.settings.openedTicketPerUser}/utilisateur\`\n> **Support:** ${data.tickets.settings.support && interaction.guild.roles.cache.get(data.tickets.settings.support) ? interaction.guild.roles.cache.get(data.tickets.settings.support) : "\`Aucun\`"}\n> **Transcript:** ${data.tickets.settings.transcriptId && interaction.guild.channels.cache.get(data.tickets.settings.transcriptId) ? interaction.guild.channels.cache.get(data.tickets.settings.transcriptId) : `\`Aucun\``}`)
            ],
            components: [
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId("ticket_enabled")
                            .setDisabled(false)
                            .setEmoji(data.tickets.settings.enabled ? `${client.emo.no}` : `${client.emo.yes}`)
                            .setLabel(data.tickets.settings.enabled ? "Désactivé les tickets" : "Activé les tickets")
                            .setStyle(data.tickets.settings.enabled ? ButtonStyle.Danger : ButtonStyle.Success),
                        new ButtonBuilder()
                            .setCustomId("autoclose_enabled")
                            .setDisabled(false)
                            .setEmoji(data.tickets.settings.autoclose ? `${client.emo.no}` : `${client.emo.yes}`)
                            .setLabel(data.tickets.settings.autoclose ? "Désactivé l'autoclose" : "Activé l'autoclose")
                            .setStyle(data.tickets.settings.autoclose ? ButtonStyle.Danger : ButtonStyle.Success),
                        new ButtonBuilder()
                            .setCustomId("threads_enabled")
                            .setDisabled(false)
                            .setEmoji(data.tickets.settings.threads.enabled ? `${client.emo.no}` : `${client.emo.yes}`)
                            .setLabel(data.tickets.settings.threads.enabled ? "Désactivé les threads" : "Activé les threads")
                            .setStyle(data.tickets.settings.threads.enabled ? ButtonStyle.Danger : ButtonStyle.Success)
                    ),
                new ActionRowBuilder()
                    .addComponents(
                        new ChannelSelectMenuBuilder()
                            .setCustomId("threads_channel")
                            .setDisabled(data.tickets.settings.threads.enabled ? false : true)
                            .setDefaultChannels(data.tickets.settings.threads.channelId ? [data.tickets.settings.threads.channelId] : [])
                            .setChannelTypes(ChannelType.GuildText)
                            .setMaxValues(1)
                            .setMinValues(1)
                            .setPlaceholder("Modifie le salon des notifications des threads.")
                    ),
                new ActionRowBuilder()
                    .addComponents(
                        new ChannelSelectMenuBuilder()
                            .setCustomId("transcript_channel")
                            .setDisabled(false)
                            .setDefaultChannels(data.tickets.settings.transcriptId ? [data.tickets.settings.transcriptId] : [])
                            .setChannelTypes(ChannelType.GuildText)
                            .setMaxValues(1)
                            .setMinValues(1)
                            .setPlaceholder("Modifie le salon des transcriptions")
                    ),
                new ActionRowBuilder()
                    .addComponents(
                        new RoleSelectMenuBuilder()
                            .setCustomId("role_support")
                            .setDisabled(false)
                            .setDefaultRoles(data.tickets.settings.support ? [data.tickets.settings.support] : [])
                            .setMaxValues(1)
                            .setMinValues(1)
                            .setPlaceholder("Modifie le rôle support.")
                    )
            ]
        });
    }
};