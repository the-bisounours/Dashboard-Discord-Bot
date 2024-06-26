const { SlashCommandBuilder, Client, ChatInputCommandInteraction } = require("discord.js");
const { useMainPlayer } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("back")
        .setDescription("Permet de revenir en arrière.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(null)
        .addBooleanOption(option => option
            .setName("préserver-actuel")
            .setDescription("Permet de préserver la musique actuelle.")
            .setRequired(false)
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

        if (!player.queues.get(interaction.guild.id) || !player.queues.get(interaction.guild.id).isPlaying()) {
            return await interaction.reply({
                content: "Il n'y a pas de musique en cours.",
                ephemeral: true
            });
        };

        if (!player.queues.get(interaction.guild.id).history.previousTrack) {
            return await interaction.reply({
                content: "Il n'y a pas eu de musique avant celle-ci.",
                ephemeral: true
            });
        };
        
        const previousTrack = player.queues.get(interaction.guild.id).history.previousTrack
        player.queues.get(interaction.guild.id).history.back(interaction.options.getBoolean("préserver-actuel"))
        return await interaction.reply({
            content: `La musique \`${previousTrack.title}\` vient d'être rejouer.`
        });
    }
};