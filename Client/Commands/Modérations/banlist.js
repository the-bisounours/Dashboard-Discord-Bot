const { SlashCommandBuilder, PermissionFlagsBits, Client, ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const paginations = require("../../Functions/Gestions/paginations");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("banlist")
        .setDescription("Liste tous les bannissements.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

    category: "Modérations",

    /**
     * 
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    execute: async (client, interaction) => {

        const bans = [...(await interaction.guild.bans.fetch())]
        if(bans.length <= 0) {
            return await interaction.reply({
                content: `${client.emo.no} Il n'y a aucun bannissement dans le serveur discord.`,
                ephemeral: true
            });
        };

        const embeds = [];
        for (let index = 0; index < bans.length; index++) {
            const ban = bans[index][1];
            const user = await ban.user.fetch({ force: true });

            embeds.push(
                new EmbedBuilder()
                .setTitle(`Informations des bannissements sur le serveur ${interaction.guild.name}`)
                .setThumbnail(user.displayAvatarURL())
                .setColor("Blurple")
                .setDescription(`> **Utilisateur:** \`${user.displayName}\` ${user}\n> **Identifiant:** \`${user.id}\`\n> **Raison:** \`${ban.reason ? ban.reason : "aucune raison"}\`\n> **Robot:** \`${user.bot ? "oui" : "non"}\`\n> **Date de création du compte:** <t:${Math.round(user.createdTimestamp / 1000)}:D> <t:${Math.round(user.createdTimestamp / 1000)}:R>`)
                .setFooter({
                    text: client.user.displayName,
                    iconURL: client.user.displayAvatarURL()
                })
                .setImage(user.banner ? `https://cdn.discordapp.com/banners/${user.id}/${user.banner}.png?size=1024` : null)
                .setTimestamp()
            );
        };

        return await paginations(interaction, embeds, 60 * 1000, false);
    }
};