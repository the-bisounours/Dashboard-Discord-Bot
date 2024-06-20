const { SlashCommandBuilder, Client, ChatInputCommandInteraction } = require("discord.js");
const { useMainPlayer } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Permet de jouer de la musique.")
        .setDMPermission(true)
        .setDefaultMemberPermissions(null)
        .addStringOption(option => option
            .setName("song")
            .setDescription("La musique à jouer dans le salon vocal.")
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

        const query = interaction.options.getString("song");
        await interaction.deferReply({
            ephemeral: true
        });

        try {
            const { track } = await player.play(channel, query, {
                nodeOptions: {
                    metadata: interaction
                }
            });

            return await interaction.followUp({
                content: `\`${track.playlist ? track.playlist.title : track.title}\` mis en file d'attente.`
            });
        } catch (err) {
            return interaction.followUp({
                content: `Quelque chose s'est mal passé: ${err}`
            });
        };
    }
};