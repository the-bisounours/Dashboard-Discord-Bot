const { SlashCommandBuilder, Client, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("modlist")
        .setDescription("Permet de connaitre les modérateurs.")
        .setDMPermission(true)
        .setDefaultMemberPermissions(null),

    category: "Informations",

    /**
     * 
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    execute: async (client, interaction) => {

        if(interaction.guild.members.cache.filter(member => member.permissions.has(PermissionFlagsBits.ModerateMembers) && !member.user.bot).size <= 0) {
            return await interaction.reply({
                content: `${client.emo.no} Il n'y a aucun modérateur.`,
                ephemeral: true
            });
        };

        return await interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setTitle("Information de la liste des modérateurs")
                .setDescription(`${interaction.guild.members.cache.filter(member => member.permissions.has(PermissionFlagsBits.ModerateMembers) && !member.user.bot).map(member => `${member}`).join(" ")}`)
                .setColor("Blurple")
                .setFooter({
                    text: client.user.displayName,
                    iconURL: client.user.displayAvatarURL()
                })
                .setTimestamp()
            ]
        });
    }
};