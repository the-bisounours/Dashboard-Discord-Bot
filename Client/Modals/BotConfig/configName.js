const { Client, ModalSubmitInteraction } = require("discord.js");

module.exports = {
    id: "configName",

    /**
     * 
     * @param {Client} client 
     * @param {ModalSubmitInteraction} interaction 
     */
    execute: async (client, interaction) => {

        const name = interaction.fields.getTextInputValue("name");

        return await client.user.setUsername(name)
            .then(async clientInfo => {
                return await interaction.reply({
                    content: `Le robot a changé de nom: \`${clientInfo.username}\``,
                    ephemeral: true
                });
            })
            .catch(async err => {
                return await interaction.reply({
                    content: `Le robot n'a pas changé de nom à cause d'une erreur.`,
                    ephemeral: true
                });
            });
    }
};