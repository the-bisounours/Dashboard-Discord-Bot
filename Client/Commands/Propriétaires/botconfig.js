const { SlashCommandBuilder, Client, ChatInputCommandInteraction } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("botconfig")
        .setDescription("Permet configurer le robot.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(null),

    category: "Propriétaires",

    /**
     * 
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    execute: async (client, interaction) => {

        if(interaction.user.id !== process.env.ownerId) {
            return await interaction.reply({
                content: "Vous n'etes pas le propriétaire du robot.",
                ephemeral: true
            });
        };

        interaction.reply({ content: "ok"})
    }
};