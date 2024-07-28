const { Client, ModalSubmitInteraction, EmbedBuilder, ButtonStyle } = require("discord.js");
const { Voices, Guilds } = require("../../Models");

module.exports = {
    id: "voicelimit",

    /**
     * 
     * @param {Client} client 
     * @param {ModalSubmitInteraction} interaction 
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
        }

        const voice = await Voices.findOne({
            guildId: interaction.guild.id,
            voiceId: interaction.member.voice.channel.id,
            userId: interaction.user.id
        });

        if (!voice || !interaction.guild.channels.cache.get(voice.voiceId)) {
            return await interaction.reply({
                content: `${client.emo.no} Vous devez rejoindre le salon vocal ${interaction.guild.channels.cache.get(data.voice.voiceId)}`,
                ephemeral: true
            });
        };

        let limit = parseInt(interaction.fields.getTextInputValue("limit"));
        if (isNaN(limit)) {
            return 0;
        };

        await interaction.guild.channels.cache.get(voice.voiceId).setUserLimit(limit, "Changement de la limite d'utilisateur du salon vocal.")
            .then(async () => {
                return await interaction.reply({
                    content: `${client.emo.yes} La limite de votre salon vocal a bien été modifié. \`${limit}\``,
                    ephemeral: true
                });
            })
            .catch(async err => {
                return await interaction.reply({
                    content: `${client.emo.no} Une erreur est survenue lors du changement de la limite d'utilisateur du salon vocal.`,
                    ephemeral: true
                });
            });
    }
};