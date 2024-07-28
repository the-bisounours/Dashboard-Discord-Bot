const { Client, StringSelectMenuInteraction, PermissionFlagsBits } = require("discord.js");
const { Guilds, Voices } = require("../../Models");

module.exports = {
    id: "voiceprivacy",

    /**
     * 
     * @param {Client} client 
     * @param {StringSelectMenuInteraction} interaction 
     */
    execute: async (client, interaction) => {

        if (!interaction.member.voice || !interaction.member.voice.channel) {
            return await interaction.update({
                content: `${client.emo.no} Vous n'êtes pas dans un salon vocal.`,
                ephemeral: true,
                components: [],
            });
        };

        const data = await Guilds.findOne({
            guildId: interaction.guild.id
        });

        if (!data) {
            return await interaction.update({
                content: `${client.emo.no} Impossible de trouver la base de donnée du serveur.`,
                ephemeral: true,
                components: [],
            });
        };

        const voice = await Voices.findOne({
            guildId: interaction.guild.id,
            voiceId: interaction.member.voice.channel.id,
            userId: interaction.user.id
        });

        if (!voice || !interaction.guild.channels.cache.get(voice.voiceId)) {
            return await interaction.update({
                content: `${client.emo.no} Vous devez rejoindre le salon vocal ${interaction.guild.channels.cache.get(data.voice.voiceId)}`,
                ephemeral: true,
                components: [],
            });
        };

        if (voice.waitingId || interaction.guild.channels.cache.get(voice.waitingId)) {
            return await interaction.update({
                content: `${client.emo.no} Vous ne pouvez pas faire cette action si vous avez un salon d'attente.`,
                ephemeral: true,
                components: [],
            });
        };

        let permissions = {
            ViewChannel: true,
            Connect: true,
            Speak: true,
            SendMessages: true
        };

        interaction.values.forEach(option => {
            switch (option) {
                case "lock":
                    permissions.Connect = false;
                    break;
                case "unlock":
                    permissions.Connect = true;
                    break;
                case "invisible":
                    permissions.ViewChannel = false;
                    break;
                case "visible":
                    permissions.ViewChannel = true;
                    break;
                case "closechat":
                    permissions.SendMessages = false;
                    break;
                case "openchat":
                    permissions.SendMessages = true;
                    break;
                default:
                    break;
            }
        });

        await interaction.guild.channels.cache.get(voice.voiceId).permissionOverwrites.edit(interaction.guild.id, permissions)
            .then(async () => {
                return await interaction.update({
                    content: `${client.emo.yes} Les permissions de votre salon vocal ont été mises à jour.`,
                    components: [],
                    ephemeral: true
                });
            })
            .catch(async err => {
                return await interaction.update({
                    content: `${client.emo.no} Une erreur est survenue lors de la modification des permissions.`,
                    components: [],
                    ephemeral: true
                });
            });
    }
};