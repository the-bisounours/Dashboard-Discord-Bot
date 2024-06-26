const { SlashCommandBuilder, Client, ChatInputCommandInteraction } = require("discord.js");
const { useMainPlayer } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("nowplaying")
        .setDescription("Permet de connaitre la musique actuelle.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(null),

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

        if (!player.queues.get(interaction.guild.id) || !player.queues.get(interaction.guild.id).isPlaying()) {
            return await interaction.reply({
                content: "Il n'y a pas de musique en cours.",
                ephemeral: true
            });
        };

        const track = player.queues.get(interaction.guild.id).currentTrack;
        return await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Information de la musique actuelle")
                    .setColor("Blurple")
                    .setFooter({
                        text: client.user.displayName,
                        iconURL: client.user.displayAvatarURL()
                    })
                    .setTimestamp()
                    .setThumbnail(track.thumbnail)
                    .setDescription(`> **Titre:** \`${track.title}\`\n> **Durée:** \`${track.duration}\`\n> **Auteur:** \`${track.author}\`\n> **View${track.views > 0 ? "s" : ""}:** \`${track.views}\`\n> **Ajouté par:** \`${track.requestedBy.displayName}\`\n> **Playlist:** \`${track.playlist ? "oui" : "non"}\``)
            ]
        });
    }
};