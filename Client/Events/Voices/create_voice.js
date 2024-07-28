const { Events, Client, VoiceState, ChannelType, PermissionFlagsBits } = require("discord.js");
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

        if(!data || !newState || !newState.channel) return;
        if(newState.channel.id !== data.voice.voiceId) return;

        await newState.guild.channels.create({
            name: `${newState.member.user.displayName}`,
            parent: newState.channel.parentId,
            type: ChannelType.GuildVoice
        })
            .then(async voicechannel => {

                await voicechannel.permissionOverwrites.edit(newState.member.user.id, {
                    ViewChannel: true,
                    Connect: true,
                    SendMessages: true
                }).catch(async err => {
                    return voicechannel.delete().catch(err => null);
                });

                await newState.setChannel(voicechannel)
                    .then(async () => {

                        await new Voices({
                            guildId: newState.guild.id,
                            userId: newState.member.user.id,
                            voiceId: voicechannel.id
                        }).save();

                    })
                    .catch(err => {
                        return voicechannel.delete().catch(err => null);
                    });
            })
            .catch(err => null);
    }
};