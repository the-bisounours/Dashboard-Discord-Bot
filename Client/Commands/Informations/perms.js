const { SlashCommandBuilder, Client, ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("perms")
        .setDescription("Permet de recupérer les permissions d'un membre.")
        .setDMPermission(true)
        .setDefaultMemberPermissions(null)
        .addUserOption(option => option
            .setName("membre")
            .setDescription("Permet de recupérer les permissions du membre.")
            .setRequired(false)
        ),

    category: "Informations",

    /**
     * 
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    execute: async (client, interaction) => {

        const user = interaction.options.getUser("membre") ? interaction.options.getUser("membre") : interaction.user;
        const member = interaction.guild.members.cache.get(user.id);

        if (!member) {
            return await interaction.reply({
                content: ":x: Je n'arrive pas a trouver le membre.",
                ephemeral: true
            });
        };

        if (member.permissions.toArray().length <= 0) {
            return await interaction.reply({
                content: ":x: Le membre n'a aucune permission.",
                ephemeral: true
            });
        };

        return await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`Information des permissions de ${member.user.displayName}`)
                    .setColor("Blurple")
                    .setFooter({
                        text: client.user.displayName,
                        iconURL: client.user.displayAvatarURL()
                    })
                    .setTimestamp()
                    .setDescription(member.permissions.toArray().map(permission => `[\`${permission}\`](${process.env.supportInvite})`).join(" "))
            ],
            ephemeral: true
        });
    }
};