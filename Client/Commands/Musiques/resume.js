const { SlashCommandBuilder, Client, ChatInputCommandInteraction } = require("discord.js");
const { useMainPlayer } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("resume")
        .setDescription("Permet de mettre la musique.")
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

        if (!player.queues.get(interaction.guild.id).node.isPaused()) {
            return await interaction.reply({
                content: "La musique est déjà entrain de jouer.",
                ephemeral: true
            });
        };

        const currentTrack = player.queues.get(interaction.guild.id).currentTrack;
        player.queues.get(interaction.guild.id).node.resume(true);
        return await interaction.reply({
            content: `La musique \`${currentTrack.title}\` a été remis.`
        });
    }
};