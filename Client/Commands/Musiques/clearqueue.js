const { SlashCommandBuilder, Client, ChatInputCommandInteraction } = require("discord.js");
const { useMainPlayer } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("clearqueue")
        .setDescription("Permet de supprimer les musiques.")
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

        if (!player.queues.get(interaction.guild.id).history.nextTrack) {
            return await interaction.reply({
                content: "Il n'y a pas eu de musique après celle-ci.",
                ephemeral: true
            });
        };
        
        player.queues.get(interaction.guild.id).tracks.clear();
        return await interaction.reply({
            content: `La liste de musique a été réinitialisée.`
        });
    }
};