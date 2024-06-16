const { Events, Client, StringSelectMenuInteraction } = require("discord.js");
const selectPrefixes = [];

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
            } else {
                selects = client.selects.get(interaction.customId)
            };

            if (!selects) {
                return await interaction.reply({ 
                    content: ":x: Ce select-menu n'existe plus.", 
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