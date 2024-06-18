const { SlashCommandBuilder, PermissionFlagsBits, Client, ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const paginations = require("../../Functions/paginations");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("banlist")
        .setDescription("Permet de lister tous les bannissements du serveur discord.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

    /**
     * 
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    execute: async (client, interaction) => {

        const bans = [...(await interaction.guild.bans.fetch())]
        if(bans.length <= 0) {
            return await interaction.reply({
                content: ":x: Il n'y a aucun bannissement dans le serveur discord.",
                ephemeral: true
            });
        };

        const embeds = [];
        for (let index = 0; index < bans.length; index++) {
            const ban = bans[index][1];

            embeds.push(
                new EmbedBuilder()
                .setTitle(`Informations des bannissements sur le serveur ${interaction.guild.name}`)
                .setThumbnail(ban.user.displayAvatarURL())
                .setColor("Blurple")
                .setDescription(`> **Utilisateur:** \`${ban.user.displayName}\` ${ban.user}\n> **Identifiant:** \`${ban.user.id}\`\n> **Raison:** \`${ban.reason ? ban.reason : "aucune raison"}\`\n> **Robot:** \`${ban.user.bot ? "oui" : "non"}\`\n> **Date de création du compte:** <t:${Math.round(ban.user.createdTimestamp / 1000)}:D> <t:${Math.round(ban.user.createdTimestamp / 1000)}:R>`)
                .setFooter({
                    text: client.user.displayName,
                    iconURL: client.user.displayAvatarURL()
                })
                .setImage(ban.user.bannerURL())
                .setTimestamp()
            );
        };

        return await paginations(interaction, embeds, 60 * 1000, false);
    }
};