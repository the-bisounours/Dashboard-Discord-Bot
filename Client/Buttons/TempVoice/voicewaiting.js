const { Client, ButtonInteraction, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { Voices, Guilds } = require("../../Models");

module.exports = {
    id: "voicewaiting",

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
                content: `${client.emo.no} Vous avez déjà un salon vocal d'attente.`,
                components: [
                    new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId("waitingdelete")
                                .setDisabled(false)
                                .setEmoji(`${client.emo.delete}`)
                                .setStyle(ButtonStyle.Danger)
                        )
                ],
                ephemeral: true
            });
        };

        await interaction.guild.channels.create({
            name: `Ask ${interaction.user.displayName}`,
            parent: interaction.channel.parentId,
            type: ChannelType.GuildVoice
        })
            .then(async voicechannel => {

                await voicechannel.permissionOverwrites.edit(interaction.guild.id, {
                    ViewChannel: true,
                    Connect: true,
                    Speak: false,
                    SendMessages: false
                }).catch(async err => {
                    return voicechannel.delete().catch(async err => {
                        return await interaction.reply({
                            content: `${client.emo.no} Une erreur est survenue lors de la modification des permissions.`,
                            ephemeral: true
                        });
                    });
                });

                interaction.guild.channels.cache.get(voice.voiceId).permissionOverwrites.edit(interaction.guild.id, {
                    ViewChannel: true,
                    Connect: false,
                    Speak: true,
                    SendMessages: true
                }).catch(async err => {
                    return voicechannel.delete().catch(async err => {
                        return await interaction.reply({
                            content: `${client.emo.no} Une erreur est survenue lors de la modification des permissions.`,
                            ephemeral: true
                        });
                    });
                });

                voice.waitingId = voicechannel.id;
                await voice.save();

                return await interaction.reply({
                    content: `${client.emo.yes} Votre salon vocal d'attente est prêt.`,
                    ephemeral: true
                });
            })
            .catch(async err => {
                return await interaction.reply({
                    content: `${client.emo.no} Une erreur est survenue lors de la modification des permissions.`,
                    ephemeral: true
                });
            });
    }
};