const { SlashCommandBuilder, Client, ChatInputCommandInteraction } = require("discord.js");
const { useMainPlayer } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("save")
        .setDescription("Permet d'envoyer la musique.")
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

        try {

            const currentTrack = player.queues.get(interaction.guild.id).currentTrack;
            await interaction.member.send({
                content: `${currentTrack.url}`
            });

            return await interaction.reply({
                content: `J'ai envoyé la musique en message privé.`,
                ephemeral: true
            });
        } catch (err) {
            return await interaction.reply({
                content: `Je n'ai pas pu vous envoyez la musique en message privé.`,
                ephemeral: true
            });  
        };
    }
};