const {Client, ButtonInteraction } = require("discord.js");

module.exports = {
    id: "delete",

    /**
     * 
     * @param {Client} client 
     * @param {ButtonInteraction} interaction 
     */
    execute: async (client, interaction) => {

        await interaction.update({ fetchReply: true });
        return await interaction.message.delete();
    }
};