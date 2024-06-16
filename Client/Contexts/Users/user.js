const { ContextMenuCommandBuilder, ApplicationCommandType, Client, ContextMenuCommandInteraction, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new ContextMenuCommandBuilder()
    .setName("user")
    .setDMPermission(false)
    .setDefaultMemberPermissions(null)
    .setType(ApplicationCommandType.User),

    /**
     * 
     * @param {Client} client 
     * @param {ContextMenuCommandInteraction} interaction 
     */
    execute: async (client, interaction) => {

        const member = interaction.guild.members.cache.get(interaction.targetId);

        if(!member) { 
            return await interaction.reply({
                content: ":x: Je n'arrive pas a trouver le membre.",
                ephemeral: true
            });
        };

        return await interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setTitle(`Information sur l'utilisateur ${member.displayName}`)
                .addFields(
                    {
                        name: "Information sur l'utilisateur",
                        value: `> **Nom:** \`${member.displayName}\` ${member}\n> **Identifiant:** \`${member.id}\`\n> **Robot:** \`${member.user.bot ? "oui" : "non"}\`\n> **Date de création du compte:** <t:${Math.round(member.user.createdTimestamp / 1000)}:D> <t:${Math.round(member.user.createdTimestamp / 1000)}:R>`
                    },
                    {
                        name: "Information sur le membre",
                        value: `> **Surnom:** \`${member.nickname ? member.nickname : "Aucun"}\`\n> **Date:** <t:${Math.round(member.joinedTimestamp / 1000)}:D> <t:${Math.round(member.joinedTimestamp / 1000)}:R>\n> **Rôle le plus haut:** ${member.roles.highest}`
                    }
                )
                .setThumbnail(member.displayAvatarURL())
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