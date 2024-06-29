const { Client, RoleSelectMenuInteraction, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ChannelSelectMenuBuilder, ChannelType, RoleSelectMenuBuilder } = require("discord.js");
const { Guilds } = require("../../Models");
const messagePanel = require("../../Functions/Panneaux/messagePanel");
const componentsPanel = require("../../Functions/Panneaux/componentsPanel");

module.exports = {
    id: "roles_panel_edit_",

    /**
     * 
     * @param {Client} client 
     * @param {RoleSelectMenuInteraction} interaction 
     */
    execute: async (client, interaction) => {

        if (interaction.user.id !== interaction.message.interaction.user.id) {
            return await interaction.reply({
                content: "Vous n'êtes pas l'auteur de cette commande.",
                ephemeral: true
            });
        };

        const data = await Guilds.findOne({
            guildId: interaction.guild.id
        });

        if (!data) {
            return await interaction.reply({
                content: "Impossible de trouver la base de donnée du serveur.",
                ephemeral: true
            });
        };

        const panel = data.tickets.panels.find(panel => panel.panelId === interaction.customId.split("_")[3]);
        if (!panel) {
            return await interaction.reply({
                content: "Impossible de retrouver le panneau de ticket.",
                ephemeral: true
            });
        };

        panel.roles = interaction.values;
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