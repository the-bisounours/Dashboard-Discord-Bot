const { Client, ButtonInteraction, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { Voices, Guilds } = require("../../Models");

module.exports = {
    id: "voicethread",

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

        if (!interaction.guild.channels.cache.get(data.voice.interfaceId)) {
            return await interaction.reply({
                content: `${client.emo.no} Le salon d'interface du système de vocal temporaire n'est pas configuré.`,
                ephemeral: true
            });
        };

        if (voice.threadId || interaction.guild.channels.cache.get(voice.threadId)) {
            return await interaction.reply({
                content: `${client.emo.no} Vous avez déjà un fil de discussion ouvert.`,
                components: [
                    new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId("threaddelete")
                                .setDisabled(false)
                                .setEmoji(`${client.emo.delete}`)
                                .setStyle(ButtonStyle.Danger)
                        )
                ],
                ephemeral: true
            });
        };

        await interaction.guild.channels.cache.get(data.voice.interfaceId).threads.create({
            name: `${interaction.user.displayName}`,
            type: ChannelType.PrivateThread
        })
            .then(async threadchannel => {

                await interaction.member.voice.channel.members.map(async member => {
                    await threadchannel.members.add(member).catch(err => null);
                });

                voice.threadId = threadchannel.id;
                await voice.save();

                return await interaction.reply({
                    content: `${client.emo.yes} Votre fil de discussion est prêt.`,
                    ephemeral: true
                });
            })
            .catch(async err => {
                console.log(err)
                return await interaction.reply({
                    content: `${client.emo.no} Une erreur est survenue lors de la création du fil de discussion.`,
                    ephemeral: true
                });
            });
    }
};