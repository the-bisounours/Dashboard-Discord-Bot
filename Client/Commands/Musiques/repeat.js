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
                {
                    name: "Désactivé",
                    value: QueueRepeatMode.OFF
                },
                {
                    name: "Autoplay",
                    value: QueueRepeatMode.AUTOPLAY
                },
                {
                    name: "Queue",
                    value: QueueRepeatMode.QUEUE
                },
                {
                    name: "Song",
                    value: QueueRepeatMode.TRACK
                }
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
        
        if (player.queues.get(interaction.guild.id).repeatMode === interaction.options.getString("mode")) {
            return await interaction.reply({
                content: "Ce mode est déjà en cours.",
                ephemeral: true
            });
        };

        player.queues.get(interaction.guild.id).setRepeatMode(interaction.options.getString("mode"));

        let mode;
        switch (interaction.options.getString("mode")) {
            case QueueRepeatMode.AUTOPLAY:
                mode = "Autoplay"
            break;
            case QueueRepeatMode.OFF:
                mode = "Désactivé"
            break;
            case QueueRepeatMode.QUEUE:
                mode = "Queue"
            break;
            case QueueRepeatMode.TRACK:
                mode = "Song"
            break;
            default:
                mode = "Inconnu"
            break;
        }
        return await interaction.reply({
            content: `Le mode a bien été mis \`${mode}\`.`
        });
    }
};