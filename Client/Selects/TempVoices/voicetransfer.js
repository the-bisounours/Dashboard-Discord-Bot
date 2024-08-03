const { Client, UserSelectMenuInteraction } = require("discord.js");
const { Guilds, Voices } = require("../../Models");

module.exports = {
    id: "voicetransfer",

    /**
     * 
     * @param {Client} client 
     * @param {UserSelectMenuInteraction} interaction 
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

        if (voice.userId !== interaction.user.id) {
            return await interaction.reply({
                content: `${client.emo.no} Vous n'êtes pas le propritétaire du salon vocal.`,
                ephemeral: true
            });
        };

        if (voice.userId === interaction.values[0]) {
            return await interaction.reply({
                content: `${client.emo.no} \`${interaction.guild.members.cache.get(interaction.values[0]).displayName}\` est déjà le propritétaire du salon vocal.`,
                ephemeral: true
            });
        };

        voice.userId = interaction.values[0];
        await voice.save();

        await interaction.guild.channels.cache.get(voice.voiceId).setName(interaction.guild.members.cache.get(interaction.values[0]).displayName, "Changement du nom du salon vocal.")
            .then(async () => {

                return await interaction.reply({
                    content: `${client.emo.yes} \`${interaction.guild.members.cache.get(interaction.values[0]).displayName}\` est maintenant le propriétaire du salon vocal.`,
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