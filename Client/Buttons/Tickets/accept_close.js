const { Client, ButtonInteraction, ChannelType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { Tickets, Guilds } = require("../../Models");
const transcript = require('discord-html-transcripts');

module.exports = {
    id: "accept_close",

    /**
     * 
     * @param {Client} client 
     * @param {ButtonInteraction} interaction 
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

        if (interaction.user.id !== ticket.userId) {
            return await interaction.reply({
                content: "Vous n'êtes pas l'auteur de ce ticket.",
                ephemeral: true
            });
        };

        ticket.closed = true;
        await ticket.save();

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

        const attachment = await transcript.createTranscript(interaction.channel);

        if (ticket && interaction.channel.type === ChannelType.GuildText) {
            await interaction.update({ fetchReply: true });
            await interaction.channel.delete().catch(err => err);
        } else {
            await interaction.channel.setLocked(true).catch(err => err);
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Ticket Fermé")
                        .setColor("Blurple")
                        .setFooter({
                            text: "Fait par the_bisounours",
                            iconURL: client.user.displayAvatarURL()
                        })
                        .setDescription(`Le ticket a été fermé par ${interaction.user}`)
                ]
            });
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

        if(data.tickets.settings.transcriptId && interaction.guild.channels.cache.get(data.tickets.settings.transcriptId)) {
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