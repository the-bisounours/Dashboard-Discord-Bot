const { Client, ButtonInteraction, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");
const { Voices, Guilds } = require("../../Models");

module.exports = {
    id: "voicelimit",

    /**
     * 
     * @param {Client} client 
     * @param {ButtonInteraction} interaction 
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
        
        return await interaction.showModal(
            new ModalBuilder()
                .setTitle("Modification du salon vocal")
                .setCustomId("voicelimit")
                .addComponents(
                    new ActionRowBuilder()
                        .addComponents(
                            new TextInputBuilder()
                                .setLabel("Choisir une limite pour le salon vocal")
                                .setMaxLength(2)
                                .setMinLength(1)
                                .setPlaceholder("Laisser vide pour réinialiser")
                                .setValue(`${interaction.member.voice.channel.userLimit}`)
                                .setRequired(false)
                                .setStyle(TextInputStyle.Short)
                                .setCustomId("limit")
                        )
                )
        );
    }
};