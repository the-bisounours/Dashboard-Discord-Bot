const { Client, StringSelectMenuInteraction, EmbedBuilder } = require("discord.js");
const { Guilds } = require("../../Models");
const messagePanel = require("../../Functions/Panneaux/messagePanel");
const componentsPanel = require("../../Functions/Panneaux/componentsPanel");

module.exports = {
    id: "ticket_name_edit_",

    /**
     * 
     * @param {Client} client 
     * @param {StringSelectMenuInteraction} interaction 
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

        const panel = data.tickets.panels.find(panel => panel.panelId === interaction.customId.split("_")[3]);
        if (!panel) {
            return await interaction.reply({
                content: `${client.emo.no} Impossible de retrouver le panneau de ticket.`,
                ephemeral: true
            });
        };

        panel.name = interaction.values[0];
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
                    .addFields(messagePanel(panel, interaction))
            ],
            components: componentsPanel(panel, interaction)
        });
    }
};