const { SlashCommandBuilder, PermissionFlagsBits, Client, ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const paginations = require("../../Functions/paginations");
const { Warns } = require("../../Models");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("warnings")
        .setDescription("Permet de lister tous les avertissements d'un utilisateur.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addUserOption(option => option
            .setName("membre")
            .setDescription("Le membre à lister tous les avertissements.")
            .setRequired(true)
        ),

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

        const warns = await Warns.find({
            guildId: interaction.guild.id,
            userId: member.user.id
        });

        if(warns.length <= 0) {
            return await interaction.reply({
                content: ":x: Il n'y a aucun avertissements dans le serveur discord.",
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
                .setDescription(`> **Utilisateur:** \`${user.displayName}\` ${user}\n> **Identifiant:** \`${user.id}\`\n> **Raison:** \`${warn.raison ? warn.raison : "aucune raison"}\`\n> **Par:** \`${interaction.guild.members.cache.get(warn.by).displayName}\` ${interaction.guild.members.cache.get(warn.by)}\n> **Date de l'avertissement:** <t:${Math.round(warn.time / 1000)}:D> <t:${Math.round(warn.time / 1000)}:R>`)
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