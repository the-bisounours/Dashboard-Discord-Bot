const { SlashCommandBuilder, Client, ChatInputCommandInteraction } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("icon")
        .setDescription("Permet de recupérer une icon.")
        .setDMPermission(true)
        .setDefaultMemberPermissions(null),

    category: "Informations",

    /**
     * 
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    execute: async (client, interaction) => {

        return await interaction.reply({
            content: `${interaction.guild.icon ? interaction.guild.iconURL() : "Le serveur ne possède pas d'icon."}`,
            ephemeral: true
        });
    }
};