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
            voiceId: newState.channel.id
        });

        if (!voice || !voice.threadId || !newState.guild.channels.cache.get(voice.threadId) || !data.voice.interfaceId || !newState.guild.channels.cache.get(data.voice.interfaceId)) return;

        return await newState.guild.channels.cache.get(voice.threadId).members.add(newState.member.user.id).catch(err => null);
    }
};