const { Client, ModalSubmitInteraction } = require("discord.js");

module.exports = {
    id: "configDescription",

    /**
     * 
     * @param {Client} client 
     * @param {ModalSubmitInteraction} interaction 
     */
    execute: async (client, interaction) => {

        const description = interaction.fields.getTextInputValue("description");

        return await client.application.edit({
            description: description
        })
            .then(async clientInfo => {
                return await interaction.reply({
                    content: `Le robot a changé de description: \`${clientInfo.client.application.description ? clientInfo.client.application.description : "Aucune"}\``,
                    ephemeral: true
                });
            })
            .catch(async err => {
                return await interaction.reply({
                    content: `Le robot n'a pas changé de description à cause d'une erreur.`,
                    ephemeral: true
                });
            });
    }
};