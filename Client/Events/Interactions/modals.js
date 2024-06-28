const { Events, Client, ModalSubmitInteraction } = require("discord.js");
const modalPrefixes = [];

module.exports = {

    name: Events.InteractionCreate,
    once: false,

    /**
     * 
     * @param {Client} client 
     * @param {ModalSubmitInteraction} interaction 
     */
    execute: async (client, interaction) => {

        if(interaction.isModalSubmit()) {

            let modals = null;
            if(modalPrefixes.length > 0) {
                for (const prefix of modalPrefixes) {
                    if (interaction.customId.startsWith(prefix)) {
                        modals = client.modals.get(prefix);
                    };
                };
            };

            if(modals === null) {
                modals = client.modals.get(interaction.customId);
            };

            if (!modals) {
                return await interaction.reply({ 
                    content: ":x: Ce popup n'existe plus.", 
                    ephemeral: true 
                });
            };
            
            try { 
                await modals.execute(client, interaction);
            } catch (err) {
                console.log("Une erreur est survenue lors de du lancement de la commande: ",err);
            };
        };
    }
};