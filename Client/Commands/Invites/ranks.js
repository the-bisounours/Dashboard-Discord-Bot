const { SlashCommandBuilder, Client, ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const { Guilds } = require("../../Models");
const paginations = require("../../Functions/Gestions/paginations");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ranks")
        .setDescription("Permet de regarder les récompenses des invitations.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(null),

    category: "Invites",

    /**
     * 
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    execute: async (client, interaction) => {

        const date = new Date();
        const data = await Guilds.findOne({
            guildId: interaction.guild.id
        });

        if (!data) {
            return await interaction.reply({
                content: `${client.emo.no} Impossible de trouver la base de donnée du serveur.`,
                ephemeral: true
            });
        };

        if (data.invites.ranks.length === 0) {
            return await interaction.reply({
                content: `Il y a aucune récompense disponible sur ce serveur.`,
                ephemeral: true
            });
        };

        data.invites.ranks.sort((a, b) => a.invites - b.invites);

        const embeds = [];
        for (let index = 0; index < data.invites.ranks.length; index++) {
            const rank = data.invites.ranks[index];
            
            embeds.push(
                new EmbedBuilder()
                .setTitle("Information des récompenses d'invitation")
                .setDescription(`> **Invite${rank.invites > 1 ? "s": ""}:** \`${rank.invites}\`\n> **Rôle:** ${interaction.guild.roles.cache.get(rank.roleId)}\n> **Description:** \`${rank.description ? rank.description : "Aucune"}\``)
                .setColor("Blurple")
                .setFooter({
                    text: client.user.displayName,
                    iconURL: client.user.displayAvatarURL()
                })
                .setTimestamp()
            )
        };

        return await paginations(interaction, embeds, 60 * 1000, false);
    }
};