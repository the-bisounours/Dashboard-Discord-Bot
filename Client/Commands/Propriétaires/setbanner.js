const { SlashCommandBuilder, Client, ChatInputCommandInteraction, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setbanner")
        .setDescription("Permet de modifier la bannière du robot.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(null)
        .addAttachmentOption(option => option
            .setName("bannière")
            .setDescription("Permet de modifier la bannière du robot.")
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
                content: ":x: Vous n'etes pas le propriétaire du robot.",
                ephemeral: true
            });
        };

        await interaction.deferReply({ ephemeral: true });
        const attchement = interaction.options.getAttachment("bannière");
        return await client.user.setBanner(attchement.url)
            .then(async clientInfo => {
                return await interaction.followUp({
                    content: `Le robot a changé de bannière: ${clientInfo.banner ? `[\`clique ici\`](${clientInfo.bannerURL()})` : "\`Aucune\`"}`,
                    ephemeral: true
                });
            })
            .catch(async err => {
                console.log(err)
                return await interaction.followUp({
                    content: `Le robot n'a pas changé de bannière à cause d'une erreur.`,
                    ephemeral: true
                });
            });
    }
};