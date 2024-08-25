const { Client, ButtonInteraction, ChannelType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { Tickets, Guilds } = require("../../Models");
const transcript = require('discord-html-transcripts');

module.exports = {
    id: "deny_close",

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
                content: `${client.emo.no} Impossible de trouver la base de donnée du serveur.`,
                ephemeral: true
            });
        };

        const ticket = await Tickets.findOne({
            guildId: interaction.guild.id,
            channelId: interaction.channel.id
        });

        if (interaction.user.id !== ticket.userId) {
            return await interaction.reply({
                content: `${client.emo.no} Vous n'êtes pas l'auteur de ce ticket.`,
                ephemeral: true
            });
        };

        ticket.closeReason = "";
        await ticket.save();

        return await interaction.update({
            content: "",
            embeds: [
                new EmbedBuilder()
                    .setTitle("Demande de fermeture")
                    .setDescription(`${interaction.user} a refusé la demande de fermeture`)
                    .setColor("Blurple")
                    .setFooter({
                        text: "Fait par the_bisounours",
                        iconURL: client.user.displayAvatarURL()
                    })
            ],
            components: []
        });
    }
};