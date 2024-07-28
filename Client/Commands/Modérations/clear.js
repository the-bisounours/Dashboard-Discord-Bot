const { SlashCommandBuilder, PermissionFlagsBits, Client, ChatInputCommandInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("clear")
        .setDescription("Permet de supprimer des messages.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .addNumberOption(option => option
            .setName("nombre")
            .setDescription('Le nombre de messages à supprimer.')
            .setMinValue(1)
            .setMaxValue(99)
            .setRequired(true)
        )
        .addChannelOption(option => option
            .setName("salon")
            .setDescription('Le salon où supprimer les messages')
            .setRequired(false)
            .addChannelTypes(
                ChannelType.GuildText,
                ChannelType.GuildVoice,
                ChannelType.GuildAnnouncement,
                ChannelType.GuildStageVoice,
                ChannelType.PrivateThread,
                ChannelType.PublicThread
            )
        )
        .addUserOption(option => option
            .setName("membre")
            .setDescription('L\'utilisateur dont les messages doivent être supprimés')
            .setRequired(false)
        ),

    category: "Modérations",

    /**
     * 
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    execute: async (client, interaction) => {

        const number = interaction.options.getNumber("nombre");
        const channel = interaction.options.getChannel("salon") || interaction.channel;
        const member = interaction.options.getUser("membre");

        if(![
            ChannelType.GuildText,
            ChannelType.GuildVoice,
            ChannelType.GuildAnnouncement,
            ChannelType.GuildStageVoice,
            ChannelType.PrivateThread,
            ChannelType.PublicThread
        ].includes(channel.type)) {
            return await interaction.reply({
                content: `${client.emo.no} Vous ne pouvez pas supprimer des messages sur ce type de salon.`,
                ephemeral: true
            });
        };

        let fetched = await channel.messages.fetch({
            limit: number
        });

        if (member) {
            fetched = fetched.filter(msg => msg.author.id === member.id);
        };

        await channel.bulkDelete(fetched, true)
            .then(async messages => {
                return await interaction.reply({
                    content: member ? `\`${messages.size}\` message${messages.size > 1 ? "s" : ""} de ${member.username} ${messages.size > 1 ? "ont" : "a"} été supprimé${messages.size > 1 ? "s" : ""}.` : `\`${messages.size}\` message${messages.size > 1 ? "s" : ""} ${messages.size > 1 ? "ont" : "a"} été supprimé${messages.size > 1 ? "s" : ""}.`,
                    ephemeral: true
                });
            })
            .catch(async err => {
                return await interaction.reply({
                    content: member ? `Les messages de ${member.username} n'ont pas été supprimés à cause d'une erreur.` : `\`${number}\` messages n'ont pas été supprimés à cause d'une erreur.`,
                    ephemeral: true
                });
            });
    }
};