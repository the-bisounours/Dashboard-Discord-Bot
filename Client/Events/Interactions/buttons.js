const { Events, Client, ButtonInteraction } = require("discord.js");
const buttonPrefixes = [];

module.exports = {

    name: Events.InteractionCreate,
    once: false,

    /**
     * 
     * @param {Client} client 
     * @param {ButtonInteraction} interaction 
     */
    execute: async (client, interaction) => {

        if (interaction.isButton()) {
            
            let buttons = null;
            if(buttonPrefixes.length > 0) {
                for (const prefix of buttonPrefixes) {
                    if (interaction.customId.startsWith(prefix)) {
                        buttons = client.buttons.get(prefix);
                    };
                };
            } else {
                buttons = client.buttons.get(interaction.customId);
            };

            if (!buttons) {
                return await interaction.reply({
                    content: "Ce bouton n'existe plus.",
                    ephemeral: true
                });
            };

            try { 
                await buttons.execute(client, interaction);
            } catch (err) {
                console.log("Une erreur est survenue lors de du lancement de la commande: ", err);
            };
        };
    }
};