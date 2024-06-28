const { ButtonInteraction, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ChannelSelectMenuBuilder, ChannelType, RoleSelectMenuBuilder } = require("discord.js");

/**
 * 
 * @param {Object} panel 
 * @returns Array
 */
module.exports = (panel) => {
    return [
        new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId(`options_panel_edit_${panel.panelId}`)
                    .setDisabled(false)
                    .setMaxValues(1)
                    .setMinValues(1)
                    .setPlaceholder("Configurez les options des tickets.")
                    .addOptions(
                        new StringSelectMenuOptionBuilder()
                            .setLabel("Configurez les options d'ouverture.")
                            .setValue("options"),
                        new StringSelectMenuOptionBuilder()
                            .setLabel("Configurez les noms des tickets.")
                            .setValue("name"),
                        new StringSelectMenuOptionBuilder()
                            .setLabel("Supprimez le panneau de ticket.")
                            .setValue("delete"),
                        new StringSelectMenuOptionBuilder()
                            .setLabel("Envoyez le panneau de ticket.")
                            .setValue("send"),
                        new StringSelectMenuOptionBuilder()
                            .setLabel("Retournez au menu principal.")
                            .setValue("return")
                    )
            ),
        new ActionRowBuilder()
            .addComponents(
                new ChannelSelectMenuBuilder()
                    .setCustomId(`channel_panel_edit_${panel.panelId}`)
                    .addDefaultChannels(panel.channelId ? [panel.channelId] : [])
                    .addChannelTypes(ChannelType.GuildText)
                    .setMaxValues(1)
                    .setMinValues(1)
                    .setPlaceholder("Configurez le salon des tickets.")
            ),
        new ActionRowBuilder()
            .addComponents(
                new ChannelSelectMenuBuilder()
                    .setCustomId(`category_panel_edit_${panel.panelId}`)
                    .addDefaultChannels(panel.categoryId ? [panel.categoryId] : [])
                    .addChannelTypes(ChannelType.GuildCategory)
                    .setMaxValues(1)
                    .setMinValues(1)
                    .setPlaceholder("Configurez la catégorie des tickets.")
            ),
            new ActionRowBuilder()
                .addComponents(
                    new RoleSelectMenuBuilder()
                        .setCustomId(`roles_panel_edit_${panel.panelId}`)
                        .setDefaultRoles(panel.roles)
                        .setMaxValues(1)
                        .setMinValues(1)
                        .setPlaceholder("Configurez les rôles des tickets.")
                )
    ]
};