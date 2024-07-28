const { Events, Client, VoiceState, ChannelType, PermissionFlagsBits, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js");
const { Guilds, Voices } = require("../../Models");

module.exports = {
    name: Events.VoiceStateUpdate,
    once: false,

    /**
     * 
     * @param {Client} client 
     * @param {VoiceState} oldState
     * @param {VoiceState} newState
     */
    execute: async (client, oldState, newState) => {

        const data = await Guilds.findOne({
            guildId: newState.guild.id || oldState.guild.id
        });

        if (!data || !newState || !newState.channel) return;

        const voice = await Voices.findOne({
            guildId: newState.guild.id,
            waitingId: newState.channel.id
        });

        if (!voice) return;

        return await newState.guild.channels.cache.get(voice.voiceId)?.send({
            content: `<@${voice.userId}> ${newState.member.user} ${newState.channel}`,
            components: [
                new ActionRowBuilder()
                    .addComponents(
                        new StringSelectMenuBuilder()
                            .setCustomId("join_ask")
                            .setDisabled(false)
                            .setMaxValues(1)
                            .setMinValues(1)
                            .setPlaceholder(`${newState.member.user.displayName} à envie de rejoindre votre salon vocal.`)
                            .addOptions(
                                new StringSelectMenuOptionBuilder()
                                    .setDescription("L'utilisateur va etre déplacer dans ton salon vocal")
                                    .setLabel("Accepter")
                                    .setEmoji(`${client.emo.user_trust}`)
                                    .setValue("accept"),
                                new StringSelectMenuOptionBuilder()
                                    .setDescription("L'utilisateur va etre expulser et bloquer")
                                    .setLabel("Refuser")
                                    .setEmoji(`${client.emo.user_block}`)
                                    .setValue("deny")
                            )
                    )
            ]
        });
    }
};