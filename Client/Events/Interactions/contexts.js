const { Events, Client, ContextMenuCommandInteraction } = require("discord.js");

module.exports = {

    name: Events.InteractionCreate,
    once: false,

    /**
     * 
     * @param {Client} client 
     * @param {ContextMenuCommandInteraction} interaction 
     */

    execute: async (client, interaction) => {

        if (interaction.isContextMenuCommand()) {

            const context = client.context.get(interaction.contextName)
            if (!context) {
                return await interaction.reply({
                    content: "Cette contexte n'existe plus.",
                    ephemeral: true
                });
            };

            try { 
                await context.execute(client, interaction);
            } catch (err) {
                console.log("Une erreur est survenue lors de du lancement de la commande: ", err);
            };
        };
    }
};
