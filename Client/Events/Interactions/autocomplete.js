const { Events, Client, AutocompleteInteraction } = require("discord.js");

module.exports = {

    name: Events.InteractionCreate,
    once: false,

    /**
     * 
     * @param {Client} client 
     * @param {AutocompleteInteraction} interaction 
     */
    execute: async (client, interaction) => {

        if (interaction.isAutocomplete()) {

            const command = client.commands.get(interaction.commandName)
            if (command) {
                try { 
                    await command.autocomplete(client, interaction);
                } catch (err) { 
                    console.log("Une erreur est survenue lors de du lancement de la commande: ", err);
                };
            };
        };
    }
};