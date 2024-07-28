const { Events, Client, StringSelectMenuInteraction } = require("discord.js");
const selectPrefixes = [
    "channel_panel_edit_",
    "category_panel_edit_",
    "roles_panel_edit_",
    "options_panel_edit_",
    "ticket_name_edit_",
    "manage_options_panel_",
    "option_panel_edit_",
    "button_panel_edit_"
];

module.exports = {

    name: Events.InteractionCreate,
    once: false,

    /**
     * 
     * @param {Client} client 
     * @param {StringSelectMenuInteraction} interaction 
     */
    execute: async (client, interaction) => {

        if(interaction.isAnySelectMenu()) {
            
            let selects = null;
            if(selectPrefixes.length > 0) {
                for (const prefix of selectPrefixes) {
                    if (interaction.customId.startsWith(prefix)) {
                        selects = client.selects.get(prefix);
                    };
                };
            };

            if(selects === null) {
                selects = client.selects.get(interaction.customId);
            };

            if (!selects) {
                return await interaction.reply({ 
                    content: `${client.emo.no} Ce select-menu n'existe plus.`, 
                    ephemeral: true 
                });
            };

            try { 
                await selects.execute(client, interaction); 
            } catch (err) {
                console.log("Une erreur est survenue lors de du lancement de la commande: ", err);
            };
        };
    }
};