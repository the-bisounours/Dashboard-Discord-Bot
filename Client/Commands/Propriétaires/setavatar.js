const { SlashCommandBuilder, Client, ChatInputCommandInteraction, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js");

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

        await interaction.deferReply({ ephemeral: true });
        const attchement = interaction.options.getAttachment("avatar");
        return await client.user.setAvatar(attchement.url)
            .then(async clientInfo => {
                return await interaction.followUp({
                    content: `Le robot a changé d'avatar: [\`clique ici\`](${clientInfo.displayAvatarURL()})`,
                    ephemeral: true
                });
            })
            .catch(async err => {
                return await interaction.followUp({
                    content: `Le robot n'a pas changé d'avatar à cause d'une erreur.`,
                    ephemeral: true
                });
            });
    }
};