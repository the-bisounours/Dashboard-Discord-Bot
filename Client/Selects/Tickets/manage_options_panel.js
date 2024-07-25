const { Client, StringSelectMenuInteraction, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ChannelSelectMenuBuilder, ChannelType, RoleSelectMenuBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");
const { Guilds } = require("../../Models");
const messagePanel = require("../../Functions/Panneaux/messagePanel");
const options = require("../../Functions/Panneaux/options");
const componentsOptions = require("../../Functions/Panneaux/componentsOptions");
const componentsPanel = require("../../Functions/Panneaux/componentsPanel");

module.exports = {
    id: "manage_options_panel_",

    /**
     * 
     * @param {Client} client 
     * @param {StringSelectMenuInteraction} interaction 
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
                content: `${client.emo.no} Impossible de trouver la base de donnée du serveur.`,
                ephemeral: true
            });
        };

        const panel = data.tickets.panels.find(panel => panel.panelId === interaction.customId.split("_")[3]);
        if (!panel) {
            return await interaction.reply({
                content: ":x: Impossible de retrouver le panneau de ticket.",
                ephemeral: true
            });
        };

        switch (interaction.values[0]) {
            case "add_button":

                if (panel.buttons.length >= 7) {
                    return await interaction.reply({
                        content: "Vous avez atteint la limite de bouton.",
                        ephemeral: true
                    });
                };

                const modal = new ModalBuilder()
                    .setCustomId(`add_button_${panel.panelId}`)
                    .setTitle("Ajouter un bouton au ticket");

                const titre = new TextInputBuilder()
                    .setCustomId("label")
                    .setLabel("Quelle est le label du bouton ?")
                    .setMaxLength(40)
                    .setMinLength(1)
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true);
                const couleur = new TextInputBuilder()
                    .setCustomId("color")
                    .setLabel("Quelle est la couleur du bouton ?")
                    .setMaxLength(1)
                    .setMinLength(1)
                    .setPlaceholder(`${ButtonStyle.Primary}: Bleu, ${ButtonStyle.Secondary}: Gris, ${ButtonStyle.Success}: Vert, ${ButtonStyle.Danger}: Rouge`)
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true);

                const actionRowTitle = new ActionRowBuilder().addComponents(titre);
                const ActionRowCouleur = new ActionRowBuilder().addComponents(couleur);
                modal.addComponents(actionRowTitle, ActionRowCouleur);

                await interaction.showModal(modal);

                break;
            case "delete_all":

                if (panel.buttons.length === 0) {
                    return await interaction.reply({
                        content: "Il n'y a aucun bouton.",
                        ephemeral: true
                    });
                };

                panel.buttons = [];
                await data.save();

                await interaction.update({
                    embeds: [
                        options(panel, new EmbedBuilder())
                            .setColor("Blurple")
                            .setTitle("Informations des panneaux des tickets")
                            .setThumbnail(client.user.displayAvatarURL())
                            .setFooter({
                                text: client.user.displayName,
                                iconURL: client.user.displayAvatarURL()
                            })
                            .setTimestamp()
                            .setDescription(`- Personnalise tes options d'ouverture de ticket:\n> **Identifiant:** \`${panel.panelId}\`\n> **Boutons:** \`${panel.buttons.length}/7\``)
                    ],
                    components: componentsOptions(panel)
                });

                break;
            case "return":

                await interaction.update({
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

                break;
            default:
                break;
        }
    }
};