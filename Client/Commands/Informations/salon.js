const { SlashCommandBuilder, Client, ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const { channelType } = require("../../Functions/channelType");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("salon")
    .setDescription("Permet d'avoir des informations sur un salon.")
    .setDMPermission(false)
    .setDefaultMemberPermissions(null)
    .addChannelOption(option => option
        .setName("salon")
        .setDescription("Le salon pour avoir les informations.")
        .setRequired(false)
    ),

    /**
     * 
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    execute: async (client, interaction) => {
    
        const channel = interaction.options.getChannel("salon") ? interaction.options.getChannel("salon") : interaction.channel;

        let permUtilisateur = 0;
        let permRole = 0;
        channel.permissionOverwrites.cache.map(permission => {
            if(permission.type === 1) {
                permUtilisateur++;
            } else permRole++;
        })

        return await interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setTitle(`Information sur le salon ${channel.name}`)
                .addFields(
                    {
                        name: "Information sur le salon",
                        value: `> **Nom:** \`${channel.name}\`\n> **Identifiant:** \`${channel.id}\`\n> **Type:** \`${channelType(channel.type)}\`\n> **Description:** \`${channel.topic ? channel.topic : "Aucune"}\`\n> **Position:** \`${channel.position} / ${channel.rawPosition}\`\n> **NSFW:** \`${channel.nsfw ? "oui" : "non"}\`\n> **Ralentissement:** \`${channel.rateLimitPerUser === 0 ? "Aucun" : `${channel.rateLimitPerUser} secondes`}\`\n> **Date de création:** <t:${Math.round(channel.createdTimestamp / 1000)}:D> <t:${Math.round(channel.createdTimestamp / 1000)}:R>`
                    },
                    {
                        name: "Information sur les permissions",
                        value: `> **Nombre de rôles:** \`${permUtilisateur}\`\n> **Nombre d'utilisateurs:** \`${permRole}\``
                    }
                )
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