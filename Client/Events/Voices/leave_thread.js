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

        if (!data || !oldState || !oldState.channel) return;

        const voice = await Voices.findOne({
            guildId: oldState.guild.id,
            voiceId: oldState.channel.id
        });

        if (!voice || !voice.threadId || !oldState.guild.channels.cache.get(voice.threadId) || !data.voice.interfaceId || !oldState.guild.channels.cache.get(data.voice.interfaceId)) return;

        return await oldState.guild.channels.cache.get(voice.threadId).members.remove(oldState.member.user.id).catch(err => null);
    }
};