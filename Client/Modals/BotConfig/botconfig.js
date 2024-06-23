const { Client, ModalSubmitInteraction } = require("discord.js");

module.exports = {
    id: "botconfig",

    /**
     * 
     * @param {Client} client 
     * @param {ModalSubmitInteraction} interaction 
     */
    execute: async (client, interaction) => {

        const name = interaction.fields.getTextInputValue("name");
        const description = interaction.fields.getTextInputValue("description");
        console.log(name);
        console.log(description)
    }
};