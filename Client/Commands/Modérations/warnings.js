const { SlashCommandBuilder, PermissionFlagsBits, Client, ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const paginations = require("../../Functions/paginations");
const { Warns } = require("../../Models");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("warnings")
        .setDescription("Liste tous les avertissements")
        .setDMPermission(true)
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .addUserOption(option => option
            .setName("membre")
            .setDescription("Le membre à lister tous les avertissements.")
            .setRequired(false)
        ),

    category: "Modérations",

    /**
     * 
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    execute: async (client, interaction) => {

        const user = interaction.options.getUser("membre") ? interaction.options.getUser("membre") : interaction.user;
        if(!interaction.guild && interaction.user.id !== user.id) {
            return await interaction.reply({
                content: ":x: Vous ne pouvez seulement vous informez sur les avertissements de vous en message privé.",
                ephemeral: true
            });
        };

        let member = interaction.user;
        if(interaction.user.id !== user.id) {
            member = interaction.guild.members.cache.get(user.id);
        };

        if (!member) {
            return await interaction.reply({
                content: ":x: Je n'arrive pas a trouver le membre.",
                ephemeral: true
            });
        };

        const warns = await Warns.find(
            interaction.guild ? 
            { guildId: interaction.guild.id, userId: user.id } : 
            { userId: user.id }
        );

        if(warns.length <= 0) {
            return await interaction.reply({
                content: `${interaction.guild ? ":x: Il n'y a aucun avertissements dans le serveur discord." : ":x: Vous n'avez aucun avertissement."}`,
                ephemeral: true
            });
        };

        warns.sort((a, b) => new Date(a.time) - new Date(b.time));

        const embeds = [];
        for (let index = 0; index < warns.length; index++) {
            const warn = warns[index];
            const user = await client.users.fetch(warn.userId, { force: true });

            embeds.push(
                new EmbedBuilder()
                .setTitle(`Informations des avertissementss sur le serveur ${interaction.guild.name}`)
                .setThumbnail(user.displayAvatarURL())
                .setColor("Blurple")
                .setDescription(`> **Utilisateur:** \`${user.displayName}\` ${user}\n> **Identifiant:** \`${warn.warnId}\`\n> **Raison:** \`${warn.raison ? warn.raison : "aucune raison"}\`\n> **Par:** \`${interaction.guild.members.cache.get(warn.by).displayName}\` ${interaction.guild.members.cache.get(warn.by)}\n> **Date de l'avertissement:** <t:${Math.round(warn.time / 1000)}:D> <t:${Math.round(warn.time / 1000)}:R>`)
                .setFooter({
                    text: client.user.displayName,
                    iconURL: client.user.displayAvatarURL()
                })
                .setImage(warn.preuve ? warn.preuve : null)
                .setTimestamp()
            );
        };

        return await paginations(interaction, embeds, 60 * 1000, false);
    }
};