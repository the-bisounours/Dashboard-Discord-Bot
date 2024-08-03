const { Client, ModalSubmitInteraction, EmbedBuilder, ButtonStyle } = require("discord.js");
const { Voices, Guilds } = require("../../Models");

module.exports = {
    id: "voicename",

    /**
     * 
     * @param {Client} client 
     * @param {ModalSubmitInteraction} interaction 
     */
    execute: async (client, interaction) => {

        if(!interaction.member.voice || !interaction.member.voice.channel) {
            return await interaction.reply({
                content: `${client.emo.no} Vous n'êtes pas dans un salon vocal.`,
                ephemeral: true
            });
        };

        const data = await Guilds.findOne({
            guildId: interaction.guild.id
        });

        if(!data) {
            return await interaction.reply({
                content: `${client.emo.no} Impossible de trouver la base de donnée du serveur.`,
                ephemeral: true
            });
        }

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

        const name = interaction.fields.getTextInputValue("name");
        await interaction.guild.channels.cache.get(voice.voiceId).setName(name ? name : interaction.user.displayName, "Changement du nom du salon vocal.")
            .then(async () => {
                return await interaction.reply({
                    content: `${client.emo.yes} Le nom de votre salon vocal a bien été modifié. \`${name ? name : interaction.user.displayName}\``,
                    ephemeral: true
                });
            })
            .catch(async err => {
                return await interaction.reply({
                    content: `${client.emo.no} Une erreur est survenue lors du changement du nom du salon vocal.`,
                    ephemeral: true
                });
            });
    }
};