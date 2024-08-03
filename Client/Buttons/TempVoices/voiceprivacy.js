const { Client, ButtonInteraction, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js");
const { Voices, Guilds } = require("../../Models");

module.exports = {
    id: "voiceprivacy",

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
            voiceId: interaction.member.voice.channel.id,
            userId: interaction.user.id
        });

        if (!voice || !interaction.guild.channels.cache.get(voice.voiceId)) {
            return await interaction.reply({
                content: `${client.emo.no} Vous devez rejoindre le salon vocal ${interaction.guild.channels.cache.get(data.voice.voiceId)}`,
                ephemeral: true
            });
        };

        if (voice.waitingId || interaction.guild.channels.cache.get(voice.waitingId)) {
            return await interaction.reply({
                content: `${client.emo.no} Vous ne pouvez pas faire cette action si vous avez un salon d'attente.`,
                ephemeral: true
            });
        };

        return await interaction.reply({
            components: [
                new ActionRowBuilder()
                    .addComponents(
                        new StringSelectMenuBuilder()
                            .setCustomId("voiceprivacy")
                            .setDisabled(false)
                            .setMaxValues(3)
                            .setMinValues(1)
                            .setPlaceholder("Veuillez selectionné l'option de confidentialité")
                            .addOptions(
                                new StringSelectMenuOptionBuilder()
                                    .setLabel("Vérouillé")
                                    .setDescription("Seul les utilisateurs de confiance peuvent rejoindre votre salon vocal.")
                                    .setValue("lock")
                                    .setEmoji(`${client.emo.lock}`),
                                new StringSelectMenuOptionBuilder()
                                    .setLabel("Dévérouillé")
                                    .setDescription("Tous les utilisateurs peuvent rejoindre votre salon vocal.")
                                    .setValue("unlock")
                                    .setEmoji(`${client.emo.unlock}`),
                                new StringSelectMenuOptionBuilder()
                                    .setLabel("Invisible")
                                    .setDescription("Seul les utilisateurs de confiance peuvent voir votre salon vocal.")
                                    .setValue("invisible")
                                    .setEmoji(`${client.emo.user_block}`),
                                new StringSelectMenuOptionBuilder()
                                    .setLabel("Visible")
                                    .setDescription("Tous les utilisateurs peuvent voir votre salon vocal.")
                                    .setValue("visible")
                                    .setEmoji(`${client.emo.user_unblock}`),
                                new StringSelectMenuOptionBuilder()
                                    .setLabel("Vérouillé la discussion")
                                    .setDescription("Seul les utilisateurs de confiance peuvent écrire dans votre salon vocal.")
                                    .setValue("closechat")
                                    .setEmoji(`${client.emo.messages_no}`),
                                new StringSelectMenuOptionBuilder()
                                    .setLabel("Dévérouillé la discussion")
                                    .setDescription("Tous les utilisateurs peuvent écrire dans votre salon vocal.")
                                    .setValue("openchat")
                                    .setEmoji(`${client.emo.messages}`)
                            )
                    )
            ],
            ephemeral: true
        });
    }
};