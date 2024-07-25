const { Client, StringSelectMenuInteraction, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ChannelSelectMenuBuilder, ChannelType, RoleSelectMenuBuilder, ButtonBuilder, ButtonStyle, TextInputBuilder, ModalBuilder, TextInputStyle } = require("discord.js");
const { Guilds } = require("../../Models");
const option = require("../../Functions/Panneaux/option");
const options = require("../../Functions/Panneaux/options");
const componentsOptions = require("../../Functions/Panneaux/componentsOptions");

module.exports = {
    id: "button_panel_edit_",

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
                content: ":x: Impossible de trouver la base de donnée du serveur.",
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

        const button = panel.buttons.find(button => button.customId === interaction.customId.split("_")[4]);
        if (!button) {
            return await interaction.reply({
                content: ":x: Impossible de retrouver le bouton du ticket.",
                ephemeral: true
            });
        };

        switch (interaction.values[0]) {
            case "label":

                const modal1 = new ModalBuilder()
                    .setCustomId(`button_label_edit_${panel.panelId}_${button.customId}`)
                    .setTitle("Modifie le label du bouton");

                const titre = new TextInputBuilder()
                    .setCustomId("label")
                    .setLabel("Quelle est le label du bouton ?")
                    .setMaxLength(40)
                    .setMinLength(1)
                    .setValue(button.label)
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true);

                const actionRowTitle = new ActionRowBuilder().addComponents(titre);
                modal1.addComponents(actionRowTitle);

                await interaction.showModal(modal1);

                break;
            case "color":

                const modal = new ModalBuilder()
                    .setCustomId(`button_color_edit_${panel.panelId}_${button.customId}`)
                    .setTitle("Modifie la couleur du bouton");

                const couleur = new TextInputBuilder()
                    .setCustomId("color")
                    .setLabel("Quelle est la couleur du bouton ?")
                    .setMaxLength(1)
                    .setMinLength(1)
                    .setValue(button.color)
                    .setPlaceholder(`${ButtonStyle.Primary}: Bleu, ${ButtonStyle.Secondary}: Gris, ${ButtonStyle.Success}: Vert, ${ButtonStyle.Danger}: Rouge`)
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true);

                const ActionRowCouleur = new ActionRowBuilder().addComponents(couleur);
                modal.addComponents(ActionRowCouleur);

                await interaction.showModal(modal);

                break;
            case "delete":

                const index = panel.buttons.findIndex(btn => btn.customId === button.customId);
                panel.buttons.splice(index, 1);
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
            default:
                break;
        }
    }
};