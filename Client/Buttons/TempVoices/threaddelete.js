const { Client, ButtonInteraction, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { Voices, Guilds } = require("../../Models");

module.exports = {
    id: "threaddelete",

    /**
     * 
     * @param {Client} client 
     * @param {ButtonInteraction} interaction 
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
            voiceId: interaction.member.voice.channel.id
        });

        if (!voice || !interaction.guild.channels.cache.get(voice.voiceId) || voice.userId !== interaction.user.id && !voice.trust.includes(interaction.user.id)) {
            return await interaction.update({
                content: `${client.emo.no} Vous devez rejoindre le salon vocal ${interaction.guild.channels.cache.get(data.voice.voiceId)}`,
                ephemeral: true,
                components: [],
            });
        };

        if (!voice.threadId || !interaction.guild.channels.cache.get(voice.threadId)) {
            return await interaction.update({
                content: `${client.emo.no} Vous n'avez pas de fil de discussion.`,
                ephemeral: true,
                components: [],
            });
        };

        await interaction.guild.channels.cache.get(voice.threadId).delete()
            .then(async () => {
                
                voice.threadId = "";
                await voice.save();

                return await interaction.update({
                    content: `${client.emo.yes} Votre fil de discussion a bien été supprimé.`,
                    ephemeral: true,
                    components: [],
                });
            })
            .catch(async err => {
                return await interaction.update({
                    content: `${client.emo.no} Une erreur est survenue lors de la suppression du fil de discussion.`,
                    ephemeral: true,
                    components: [],
                });
            });
    }
};