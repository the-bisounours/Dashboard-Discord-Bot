const { Client, ButtonInteraction, ActionRowBuilder, UserSelectMenuBuilder, StringSelectMenuOptionBuilder, StringSelectMenuBuilder } = require("discord.js");
const { Voices, Guilds } = require("../../Models");

module.exports = {
    id: "voiceclaim",

    /**
     * 
     * @param {Client} client 
     * @param {ButtonInteraction} interaction 
     */
    execute: async (client, interaction) => {

        if (!interaction.member.voice || !interaction.member.voice.channel) {
            return await interaction.reply({
                content: `${client.emo.no} Vous n'êtes pas dans un salon vocal.`,
                ephemeral: true
            });
        };

        const data = await Guilds.findOne({
            guildId: interaction.guild.id
        });

        if (!data) {
            return await interaction.reply({
                content: `${client.emo.no} Impossible de trouver la base de donnée du serveur.`,
                ephemeral: true
            });
        };

        const voice = await Voices.findOne({
            guildId: interaction.guild.id,
            voiceId: interaction.member.voice.channel.id
        });

        if (!voice || !interaction.guild.channels.cache.get(voice.voiceId) || voice.userId !== interaction.user.id && !voice.trust.includes(interaction.user.id)) {
            return await interaction.reply({
                content: `${client.emo.no} Vous devez rejoindre le salon vocal ${interaction.guild.channels.cache.get(data.voice.voiceId)}`,
                ephemeral: true
            });
        };

        if (voice.userId === interaction.user.id) {
            return await interaction.reply({
                content: `${client.emo.no} Vous êtes déjà le propritétaire du salon vocal.`,
                ephemeral: true
            });
        };

        if (interaction.guild.channels.cache.get(voice.voiceId).members.find(member => member.user.id === voice.userId)) {
            return await interaction.reply({
                content: `${client.emo.no} Le propritétaire est toujours dans le salon vocal.`,
                ephemeral: true
            });
        };

        voice.userId = interaction.user.id;
        await voice.save();

        return await interaction.guild.channels.cache.get(voice.voiceId).setName(interaction.user.displayName, "Changement du nom du salon vocal.")
            .then(async () => {

                return await interaction.reply({
                    content: `${client.emo.yes} Vous êtes maintenant le propriétaire du salon vocal.`,
                    ephemeral: true
                });
            })
            .catch(async err => {
                return await interaction.reply({
                    content: `${client.emo.no} Une erreur est survenue lors du changement de propriétaire.`,
                    ephemeral: true
                });
            });
    }
};