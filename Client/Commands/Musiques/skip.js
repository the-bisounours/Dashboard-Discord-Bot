const { SlashCommandBuilder, Client, ChatInputCommandInteraction } = require("discord.js");
const { useMainPlayer } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("Permet de passer a la suivante.")
        .setDMPermission(true)
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

        const currentTrack = player.queues.get(interaction.guild.id).currentTrack;
        player.queues.get(interaction.guild.id).node.skip();
        return await interaction.reply({
            content: `${player.queues.get(interaction.guild.id).tracks.size > 0 ? `La musique \`${currentTrack.title}\` a été passée.` : `Il n'y a plus de musique dans la file d'attente.`}`
        });
    }
};