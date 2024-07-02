const { SlashCommandBuilder, Client, ChatInputCommandInteraction, ChannelType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require("discord.js");
const { Guilds, Tickets } = require("../../Models");
const transcript = require('discord-html-transcripts');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("close")
        .setDescription("Permet de fermer un ticket.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .addStringOption(option => option
            .setName("raison")
            .setDescription("Permet de mettre une raison de fermeture.")
            .setRequired(false)
            .setAutocomplete(false)
        ),

    category: "Tickets",

    /**
     * 
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    execute: async (client, interaction) => {

        const data = await Guilds.findOne({
            guildId: interaction.guild.id
        });

        if (!data) {
            return await interaction.reply({
                content: "Impossible de trouver la base de donnée du serveur.",
                ephemeral: true
            });
        };

        const ticket = await Tickets.findOne({
            guildId: interaction.guild.id,
            channelId: interaction.channel.id
        });

        if (!ticket) {
            return await interaction.reply({
                content: "Le salon n'est pas un ticket.",
                ephemeral: true
            });
        };

        ticket.closed = true;
        ticket.closeReason = interaction.options.getString("raison") ? interaction.options.getString("raison") : "";
        await ticket.save();

        if (ticket && interaction.channel.type === ChannelType.GuildText) {
            await interaction.reply({
                content: "Ticket fermé",
                ephemeral: true
            });
            await interaction.channel.delete().catch(err => err);
        } else {
            await interaction.channel.setLocked(true).catch(err => err);
            
            const embed = new EmbedBuilder()
                .setTitle("Ticket Fermé")
                .setColor("Blurple")
                .setFooter({
                    text: "Fait par the_bisounours",
                    iconURL: client.user.displayAvatarURL()
                })

            if (interaction.options.getString("raison")) {
                embed.addFields(
                    {
                        name: "Raison",
                        value: `\`\`\`\n${ticket.closeReason}\n\`\`\``
                    }
                )
            }
            await interaction.reply({
                embeds: [embed]
            });
        };

        const attachment = await transcript.createTranscript(interaction.channel);

        const components = [
            new ButtonBuilder()
                .setCustomId("send")
                .setStyle(ButtonStyle.Secondary)
                .setLabel(`Envoyé depuis ${interaction.guild.name}`)
                .setDisabled(true)
        ];

        if (interaction.channel.type !== ChannelType.GuildText) {
            components.push(
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Link)
                    .setLabel("Voir le fil")
                    .setURL(interaction.channel.url)
            )
        };

        try {

            await interaction.member.send({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Ticket fermé")
                        .addFields(
                            {
                                name: `Identifiant Ticket`,
                                value: `\`${ticket.ticketId}\``,
                                inline: true
                            },
                            {
                                name: `Ouvert par`,
                                value: `${interaction.guild.members.cache.get(ticket.userId) ? interaction.guild.members.cache.get(ticket.userId) : `\`${ticket.userId}\``}`,
                                inline: true
                            },
                            {
                                name: `Fermé par`,
                                value: `${interaction.user}`,
                                inline: true
                            },
                            {
                                name: `Ouvert le`,
                                value: `<t:${Math.round(ticket.createdAt / 1000)}:D>`,
                                inline: true
                            },
                            {
                                name: `Réclamé par`,
                                value: `${ticket.claimed && ticket.claimedId && interaction.guild.members.cache.get(ticket.claimedId) ? interaction.guild.members.cache.get(ticket.claimedId) : "\`Aucun\`"}`,
                                inline: true
                            },
                            {
                                name: `\u200B`,
                                value: `\u200B`,
                                inline: true
                            },
                            {
                                name: `Raison`,
                                value: `\`${ticket.closeReason ? ticket.closeReason : "Aucune"}\``,
                                inline: false
                            }
                        )
                        .setFooter({
                            text: "Fait par the_bisounours",
                            iconURL: client.user.displayAvatarURL()
                        })
                        .setColor("Blurple")
                ],
                components: [new ActionRowBuilder().addComponents(components)],
                files: [attachment]
            });
        } catch (err) { };

        if (data.tickets.settings.transcriptId && interaction.guild.channels.cache.get(data.tickets.settings.transcriptId)) {
            return await interaction.guild.channels.cache.get(data.tickets.settings.transcriptId).send({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Ticket fermé")
                        .addFields(
                            {
                                name: `Identifiant Ticket`,
                                value: `\`${ticket.ticketId}\``,
                                inline: true
                            },
                            {
                                name: `Ouvert par`,
                                value: `${interaction.guild.members.cache.get(ticket.userId) ? interaction.guild.members.cache.get(ticket.userId) : `\`${ticket.userId}\``}`,
                                inline: true
                            },
                            {
                                name: `Fermé par`,
                                value: `${interaction.user}`,
                                inline: true
                            },
                            {
                                name: `Ouvert le`,
                                value: `<t:${Math.round(ticket.createdAt / 1000)}:D>`,
                                inline: true
                            },
                            {
                                name: `Réclamé par`,
                                value: `${ticket.claimed && ticket.claimedId && interaction.guild.members.cache.get(ticket.claimedId) ? interaction.guild.members.cache.get(ticket.claimedId) : "\`Aucun\`"}`,
                                inline: true
                            },
                            {
                                name: `\u200B`,
                                value: `\u200B`,
                                inline: true
                            },
                            {
                                name: `Raison`,
                                value: `\`${ticket.closeReason ? ticket.closeReason : "Aucune"}\``,
                                inline: false
                            }
                        )
                        .setFooter({
                            text: "Fait par the_bisounours",
                            iconURL: client.user.displayAvatarURL()
                        })
                        .setColor("Blurple")
                ],
                components: [new ActionRowBuilder().addComponents(components)],
                files: [attachment]
            });
        };
    }
};