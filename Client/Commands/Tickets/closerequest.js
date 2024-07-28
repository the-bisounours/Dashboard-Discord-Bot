const { SlashCommandBuilder, Client, ChatInputCommandInteraction, ChannelType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require("discord.js");
const { Guilds, Tickets } = require("../../Models");
const transcript = require('discord-html-transcripts');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ticket-closerequest")
        .setDescription("Permet de demander la fermeture d'un ticket.")
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
                content: `${client.emo.no} Impossible de trouver la base de donnée du serveur.`,
                ephemeral: true
            });
        };

        const ticket = await Tickets.findOne({
            guildId: interaction.guild.id,
            channelId: interaction.channel.id
        });

        if (!ticket) {
            return await interaction.reply({
                content: `${client.emo.no} Le salon n'est pas un ticket.`,
                ephemeral: true
            });
        };

        ticket.closeReason = interaction.options.getString("raison") ? interaction.options.getString("raison") : "";
        await ticket.save();

        return await interaction.reply({
            content: `<@${ticket.userId}>`,
            embeds: [
                new EmbedBuilder()
                    .setTitle("Demande de fermeture")
                    .setDescription(`${interaction.user} a demandé la fermeture de ce ticket.\n\nVeuillez accepter ou refuser en utilisant les boutons ci-dessous.`)
                    .setColor("Blurple")
                    .setFooter({
                        text: "Fait par the_bisounours",
                        iconURL: client.user.displayAvatarURL()
                    })
            ],
            components: [
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId("accept_close")
                            .setLabel("Accepter et fermer")
                            .setDisabled(false)
                            .setEmoji("✅")
                            .setStyle(ButtonStyle.Success),
                        new ButtonBuilder()
                            .setCustomId("deny_close")
                            .setLabel("Refuser et rester ouvert")
                            .setDisabled(false)
                            .setEmoji("❌")
                            .setStyle(ButtonStyle.Danger)
                    )
            ]
        });
    }
};