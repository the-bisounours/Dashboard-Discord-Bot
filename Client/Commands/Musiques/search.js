const { SlashCommandBuilder, Client, ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const paginations = require("../../Functions/Gestions/paginations");
const { useMainPlayer } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("search")
        .setDescription("Permet de regarde la liste.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(null)
        .addStringOption(option => option
            .setName("song")
            .setDescription("La musique à chercher.")
            .setRequired(true)
        ),

    category: "Musiques",

    /**
     * 
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    execute: async (client, interaction) => {

        const player = useMainPlayer();

        const channel = interaction.member.voice?.channel;
        if (!channel) {
            return await interaction.reply({
                content: "Vous n'êtes connecté à aucun canal vocal.",
                ephemeral: true
            });
        };

        const embeds = [];
        const tracks = (await player.search(interaction.options.getString("song"))).tracks;

        for (let index = 0; index < tracks.length; index++) {
            const track = tracks[index]
            embeds.push(
                new EmbedBuilder()
                .setTitle("Information de la recherche des musiques")
                .setColor("Blurple")
                .setFooter({
                    text: client.user.displayName,
                    iconURL: client.user.displayAvatarURL()
                })
                .setTimestamp()
                .setThumbnail(track.thumbnail)
                .setDescription(`> **Titre:** \`${track.title}\`\n> **Durée:** \`${track.duration}\`\n> **Auteur:** \`${track.author}\`\n> **View${track.views > 0 ? "s" : ""}:** \`${track.views}\`\n> **Playlist:** \`${track.playlist ? "oui" : "non"}\``)
            )
        };

        return await paginations(interaction, embeds, 60 * 1000, false);
    }
};