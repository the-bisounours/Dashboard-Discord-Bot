const { SlashCommandBuilder, Client, ChatInputCommandInteraction, ChannelType, InviteTargetType } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("createinvite")
        .setDescription("Permet de créer une invitation.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(null)
        .addChannelOption(option => option
            .setName("salon")
            .setDescription("Permet de définir l'invitation du salon.")
            .setRequired(false)
            .addChannelTypes(
                ChannelType.GuildText, 
                ChannelType.GuildVoice, 
                ChannelType.GuildAnnouncement,
                ChannelType.GuildForum,
                ChannelType.GuildMedia,
                ChannelType.GuildStageVoice
            )
        ),

    category: "Invites",

    /**
     * 
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    execute: async (client, interaction) => {

        const channel = interaction.options.getChannel("salon") ? interaction.options.getChannel("salon") : interaction.channel

        return await interaction.guild.invites.create(channel, {
            maxAge: 0,
            temporary: false, 
            unique: true
        })
            .then(async invite => {
                return await interaction.reply({
                    content: `✅ L'invitation a été crée avec succès https://discord.gg/${invite.code}`
                });
            })
            .catch(async err => {
                console.log(err)
                return await interaction.reply({
                    content: `L'invitation n'a pas été crée a cause d'une erreur.`,
                    ephemeral: true
                });
            })
    }
};