const { Client, UserSelectMenuInteraction } = require("discord.js");
const { Guilds, Voices } = require("../../Models");

module.exports = {
    id: "voiceregion",

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
            voiceId: interaction.member.voice.channel.id
        });

        if (!voice || !interaction.guild.channels.cache.get(voice.voiceId) || voice.userId !== interaction.user.id && !voice.trust.includes(interaction.user.id)) {
            return await interaction.update({
                content: `${client.emo.no} Vous devez rejoindre le salon vocal ${interaction.guild.channels.cache.get(data.voice.voiceId)}`,
                ephemeral: true,
                components: [],
            });
        };

        return await interaction.guild.channels.cache.get(voice.voiceId).setRTCRegion(interaction.values[0] === "null" ? null : interaction.values[0])
            .then(async () => {
                return await interaction.update({
                    content: `${client.emo.yes} La région du salon vocal a été modifié: \`${interaction.values[0] === "null" ? "Automatique" : interaction.values[0]}\``,
                    components: [],
                    ephemeral: true
                });
            })
            .catch(async err => {
                console.log(err)
                return await interaction.update({
                    content: `${client.emo.no} Une erreur est survenue lors de la modification de la région.`,
                    components: [],
                    ephemeral: true
                });
            });
    }
};