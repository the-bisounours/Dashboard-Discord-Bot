const { SlashCommandBuilder, Client, ChatInputCommandInteraction } = require("discord.js");
const { useMainPlayer } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("filtre")
        .setDescription("Permet de mettre un filtre.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(null)
        .addStringOption(option => option
            .setName("filtre")
            .setDescription("Permet de mettre un filte.")
            .setRequired(true)
            .addChoices(
                { name: "8D", value: "8D" },
                { name: "bassboost", value: "bassboost" },
                { name: "bassboost_high", value: "bassboost_high" },
                { name: "bassboost_low", value: "bassboost_low" },
                { name: "chorus", value: "chorus" },
                { name: "chorus2d", value: "chorus2d" },
                { name: "chorus3d", value: "chorus3d" },
                { name: "compressor", value: "compressor" },
                { name: "dim", value: "dim" },
                { name: "earrape", value: "earrape" },
                { name: "expander", value: "expander" },
                { name: "fadein", value: "fadein" },
                { name: "flanger", value: "flanger" },
                { name: "gate", value: "gate" },
                { name: "haas", value: "haas" },
                { name: "karaoke", value: "karaoke" },
                { name: "lofi", value: "lofi" },
                { name: "mcompand", value: "mcompand" },
                { name: "mono", value: "mono" },
                { name: "mstlr", value: "mstlr" },
                { name: "mstrr", value: "mstrr" },
                { name: "nightcore", value: "nightcore" },
                { name: "normalizer", value: "normalizer" },
                { name: "normalizer2", value: "normalizer2" },
                { name: "phaser", value: "phaser" }
            )
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

        player.queues.get(interaction.guild.id).filters.filters.setFilters([interaction.options.getString("filtre")])
        return await interaction.reply({
            content: `Le filtre \`${interaction.options.getString("filtre")}\` a été mis sur la musique.`
        });
    }
};