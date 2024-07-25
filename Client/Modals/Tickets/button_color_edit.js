const { Client, ModalSubmitInteraction, EmbedBuilder, ButtonStyle, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js");
const option = require("../../Functions/Panneaux/option");
const { Guilds } = require("../../Models");

module.exports = {
    id: "button_color_edit_",

    /**
     * 
     * @param {Client} client 
     * @param {ModalSubmitInteraction} interaction 
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

        let color = interaction.fields.getTextInputValue("color");
        if (![`${ButtonStyle.Primary}`, `${ButtonStyle.Secondary}`, `${ButtonStyle.Danger}`, `${ButtonStyle.Success}`].includes(color)) {
            color = `${ButtonStyle.Primary}`;
        };

        const index = panel.buttons.findIndex(button => button.customId === interaction.customId.split("_")[4]);
        panel.buttons[index].color = color;
        await data.updateOne({
            [`tickets.panels.${data.tickets.panels.findIndex(panel => panel.panelId === interaction.customId.split("_")[3])}.buttons.${index}.color`]: color,
        });

        await interaction.update({
            embeds: [
                option(button, new EmbedBuilder())
                    .setTitle("Informations des panneaux des tickets")
                    .setThumbnail(client.user.displayAvatarURL())
                    .setColor("Blurple")
                    .setFooter({
                        text: client.user.displayName,
                        iconURL: client.user.displayAvatarURL()
                    })
                    .setTimestamp()
            ],
            components: [
                new ActionRowBuilder()
                    .addComponents(
                        new StringSelectMenuBuilder()
                            .setCustomId(`button_panel_edit_${panel.panelId}_${button.customId}`)
                            .setDisabled(false)
                            .setMaxValues(1)
                            .setMinValues(1)
                            .setPlaceholder("Modifie les paramètres du bouton.")
                            .addOptions(
                                new StringSelectMenuOptionBuilder()
                                    .setLabel("Modifier le label du bouton.")
                                    .setValue("label"),
                                new StringSelectMenuOptionBuilder()
                                    .setLabel("Modifier la couleur du bouton.")
                                    .setValue("color"),
                                new StringSelectMenuOptionBuilder()
                                    .setLabel("Supprimer le bouton.")
                                    .setValue("delete"),
                                new StringSelectMenuOptionBuilder()
                                    .setLabel("Retourner au menu principal.")
                                    .setValue("return")
                            )
                    )
            ]
        });
    }
};