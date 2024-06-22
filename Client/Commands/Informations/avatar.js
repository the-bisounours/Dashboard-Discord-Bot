const { SlashCommandBuilder, Client, ChatInputCommandInteraction } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("avatar")
        .setDescription("Permet de recupérer un avatar.")
        .setDMPermission(true)
        .setDefaultMemberPermissions(null)
        .addUserOption(option => option
            .setName("membre")
            .setDescription("Permet de recupérer l'avatar.")
            .setRequired(false)
        ),

    category: "Informations",

    /**
     * 
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    execute: async (client, interaction) => {

        return await interaction.reply({
            content: `${interaction.options.getUser("membre") && interaction.options.getUser("membre").avatar ? interaction.options.getUser("membre").displayAvatarURL() : interaction.user.avatar ? interaction.user.displayAvatarURL() : "La personne n'a pas d'avatar." }`,
            ephemeral: true
        });
    }
};