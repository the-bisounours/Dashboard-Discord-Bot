const { Events, Client, VoiceState, ChannelType } = require("discord.js");
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

        if(!voice) return;
        
        if(voice.userId === oldState.member.user.id || oldState.channel.members.size === 0) {

            if(voice.waitingId && oldState.guild.channels.cache.get(voice.waitingId)) {
                await oldState.guild.channels.cache.get(voice.waitingId).delete().catch(err => null);
            };
            
            await Voices.findOneAndDelete({
                guildId: oldState.guild.id,
                voiceId: oldState.channel.id
            });

            return await oldState.channel.delete().catch(err => null);
        };
    }
};