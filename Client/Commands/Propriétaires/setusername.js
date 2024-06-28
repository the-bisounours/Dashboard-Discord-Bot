const { SlashCommandBuilder, Client, ChatInputCommandInteraction, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setusername")
        .setDescription("Permet de modifier le nom du robot.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(null)
        .addStringOption(option => option
            .setName("nom")
            .setDescription("Permet de modifier le nom du robot.")
            .setRequired(true)
            .setMaxLength(32)
            .setMinLength(2)
            .setAutocomplete(false)
        ),

    category: "Propriétaires",

    /**
     * 
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    execute: async (client, interaction) => {

        if (interaction.user.id !== process.env.ownerId) {
            return await interaction.reply({
                content: "Vous n'etes pas le propriétaire du robot.",
                ephemeral: true
            });
        };

        return await client.user.setUsername(interaction.options.getString("nom"))
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