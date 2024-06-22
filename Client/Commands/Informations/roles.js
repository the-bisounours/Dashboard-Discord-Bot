const { SlashCommandBuilder, Client, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("roles")
        .setDescription("Permet de connaitre les rôles.")
        .setDMPermission(true)
        .setDefaultMemberPermissions(null),

    category: "Informations",

    /**
     * 
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    execute: async (client, interaction) => {

        if(interaction.guild.roles.cache.size <= 0) {
            return await interaction.reply({
                content: `Il n'y a aucun rôle.`,
                ephemeral: true
            });
        };

        return await interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setTitle("Information de la liste des rôles")
                .setDescription(`${interaction.guild.roles.cache.filter(role => role.id !== interaction.guild.id).map(role => `${role} (\`${role.members.size} membre${role.members.size > 1 ? "s" : ""}\`)`).join("\n")}`)
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