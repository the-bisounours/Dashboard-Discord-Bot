const { SlashCommandBuilder, Client, ChatInputCommandInteraction, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js");
const activity = require("../../Functions/activity");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setavatar")
        .setDescription("Permet de modifier l'avatar du robot.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(null)
        .addAttachmentOption(option => option
            .setName("avatar")
            .setDescription("Permet de modifier l'avatar du robot.")
            .setRequired(true)
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

        const attchement = interaction.options.getAttachment("avatar");
        return await client.user.setAvatar(attchement.url)
            .then(async err => {
                return await interaction.reply({
                    content: `Le robot n'a pas changé de nom à cause d'une erreur.`,
                    ephemeral: true
                });
            })
            .catch(async err => {
                console.log(err)
                return await interaction.reply({
                    content: `Le robot n'a pas changé de nom à cause d'une erreur.`,
                    ephemeral: true
                });
            });
    }
};