const { SlashCommandBuilder, Client, ChatInputCommandInteraction, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js");
const activity = require("../../Functions/activity");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setdescription")
        .setDescription("Permet de modifier la description du robot.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(null)
        .addStringOption(option => option
            .setName("description")
            .setDescription("Permet de modifier la description du robot.")
            .setRequired(false)
            .setMaxLength(400)
            .setMinLength(0)
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

        return await client.application.edit({
            description: interaction.options.getString("description") ? interaction.options.getString("description") : ""
        })
            .then(async clientInfo => {
                return await interaction.reply({
                    content: `Le robot a changé de description: \`${clientInfo.client.application.description ? clientInfo.client.application.description : "Aucune"}\``,
                    ephemeral: true
                });
            })
            .catch(async err => {
                return await interaction.reply({
                    content: `Le robot n'a pas changé da description à cause d'une erreur.`,
                    ephemeral: true
                });
            });
    }
};