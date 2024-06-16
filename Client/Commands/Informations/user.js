const { SlashCommandBuilder, Client, ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const { channelType } = require("../../Functions/channelType");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("user")
    .setDescription("Permet d'avoir des informations sur un utilisateur.")
    .setDMPermission(false)
    .setDefaultMemberPermissions(null)
    .addUserOption(option => option
        .setName("membre")
        .setDescription("Le membre pour avoir les informations.")
        .setRequired(false)
    ),

    /**
     * 
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    execute: async (client, interaction) => {
    
        const user = interaction.options.getUser("membre") ? interaction.options.getUser("membre") : interaction.user;
        const member = interaction.guild.members.cache.get(user.id);

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
                        value: `> **Nom:** \`${member.displayName}\` ${member}\n> **Identifiant:** \`${member.id}\`\n> **Robot:** \`${user.bot ? "oui" : "non"}\`\n> **Date de création du compte:** <t:${Math.round(user.createdTimestamp / 1000)}:D> <t:${Math.round(user.createdTimestamp / 1000)}:R>`
                    },
                    {
                        name: "Information sur le membre",
                        value: `> **Surnom:** \`${member.nickname ? member.nickname : "Aucun"}\`\n> **Date:** <t:${Math.round(member.joinedTimestamp / 1000)}:D> <t:${Math.round(member.joinedTimestamp / 1000)}:R>\n> **Rôle le plus haut:** ${member.roles.highest}`
                    }
                )
                .setThumbnail(member.displayAvatarURL())
                .setImage(member.user.bannerURL())
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