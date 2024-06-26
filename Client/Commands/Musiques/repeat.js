const { SlashCommandBuilder, Client, ChatInputCommandInteraction } = require("discord.js");
const { useMainPlayer, QueueRepeatMode } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("repeat")
        .setDescription("Permet de repéter la musique.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(null)
        .addStringOption(option => option
            .setName("mode")
            .setDescription("Permet de répeter la musique")
            .setRequired(true)
            .addChoices(
                { name: "Désactivé", value: `${QueueRepeatMode.OFF}` },
                { name: "Autoplay", value: `${QueueRepeatMode.AUTOPLAY}` },
                { name: "Queue", value: `${QueueRepeatMode.QUEUE}` },
                { name: "Song", value: `${QueueRepeatMode.TRACK}` }
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
        
        let mode;
        let mode1;
        switch (interaction.options.getString("mode")) {
            case `${QueueRepeatMode.AUTOPLAY}`:
                mode = "Autoplay";
                mode1 = 3
            break;
            case `${QueueRepeatMode.OFF}`:
                mode = "Désactivé";
                mode1 = 0;
            break;
            case `${QueueRepeatMode.QUEUE}`:
                mode = "Queue";
                mode1 = 2;
            break;
            case `${QueueRepeatMode.TRACK}`:
                mode = "Song";
                mode1 = 1;
            break;
            default:
                mode = "Inconnu";
            break;
        }

        if (player.queues.get(interaction.guild.id).repeatMode === mode1) {
            return await interaction.reply({
                content: "Ce mode est déjà en cours.",
                ephemeral: true
            });
        };

        player.queues.get(interaction.guild.id).setRepeatMode(mode1);
        return await interaction.reply({
            content: `Le mode a bien été mis \`${mode}\`.`
        });
    }
};