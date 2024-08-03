const { Events, Client, VoiceState } = require("discord.js");
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

        if (!voice || !voice.block.includes(newState.member.user.id)) return;

        return await newState.member.voice.disconnect("L'utilisateur est bloquer.").catch(err => null);
    }
};