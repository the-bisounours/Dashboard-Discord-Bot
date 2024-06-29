const { ButtonInteraction, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ChannelSelectMenuBuilder, ChannelType, RoleSelectMenuBuilder } = require("discord.js");

/**
 * 
 * @param {Object} panel 
 * @returns Array
 */
module.exports = (panel) => {

    const components = [
        new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId(`manage_options_panel_${panel.panelId}`)
                    .setDisabled(false)
                    .setMaxValues(1)
                    .setMinValues(1)
                    .setPlaceholder("Modifie les options.")
                    .addOptions(
                        new StringSelectMenuOptionBuilder()
                            .setLabel("Ajouter un nouveau bouton.")
                            .setValue("add_button"),
                        new StringSelectMenuOptionBuilder()
                            .setLabel("Supprimer toutes les options.")
                            .setValue("delete_all"),
                        new StringSelectMenuOptionBuilder()
                            .setLabel("Retourner au menu principal.")
                            .setValue("return")
                    )
            )
    ]

    if (panel.buttons.length > 0) {
        components.push(
            new ActionRowBuilder()
                .addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId(`option_panel_edit_${panel.panelId}`)
                        .setDisabled(false)
                        .setMaxValues(1)
                        .setMinValues(1)
                        .setPlaceholder("Modifie une option d'ouverture de ticket.")
                )
        );
    };

    for (let index = 0; index < panel.buttons.length; index++) {
        const button = panel.buttons[index];

        components[1].components[0].addOptions(
            new StringSelectMenuOptionBuilder()
                .setLabel(button.label)
                .setValue(button.customId)
        )
    }

    return components
};