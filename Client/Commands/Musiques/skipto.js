const { SlashCommandBuilder, Client, ChatInputCommandInteraction, AutocompleteInteraction } = require("discord.js");
const { useMainPlayer } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("skipto")
        .setDescription("Permet de passer la musique.")
        .setDMPermission(true)
        .setDefaultMemberPermissions(null)
        .addStringOption(option => option
            .setName("song")
            .setDescription("Permet de passer la musique")
            .setAutocomplete(true)
            .setRequired(true)
        ),

    category: "Musiques",

    /**
     * 
     * @param {Client} client 
     * @param {AutocompleteInteraction} interaction 
     */
    autocomplete: async (client, interaction) => {

        const player = useMainPlayer();
        const tracks = player.queues.get(interaction.guild.id).tracks

        const focusedValue = interaction.options.getFocused();
        const filtered = tracks.data.filter(choice => choice.title.startsWith(focusedValue));
        await interaction.respond(filtered.slice(0, 25).map(choice =>
            ({ 
                name: choice.title, 
                value: choice.id
            })
        ));
    },

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

        const track = player.queues.get(interaction.guild.id).tracks.find(song => song.id === interaction.options.getString("song"));
        if (!track) {
            return await interaction.reply({
                content: "Je n'arrive pas a trouver la musique.",
                ephemeral: true
            });
        };
        
        player.queues.get(interaction.guild.id).node.skipTo(track);

        return await interaction.reply({
            content: `La musique a été passée à \`${track.title}\`.`
        });
    }
};