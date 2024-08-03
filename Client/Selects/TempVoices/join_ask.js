const { Client, StringSelectMenuInteraction } = require("discord.js");
const { Guilds, Voices } = require("../../Models");

module.exports = {
    id: "join_ask",

    /**
     * 
     * @param {Client} client 
     * @param {StringSelectMenuInteraction} interaction 
     */
    execute: async (client, interaction) => {

        let userId;
        const ids = interaction.message.content.match(/<@[0-9]+>/g);
        if (ids && ids.length >= 2) {
            const secondId = ids[1].replace(/[<@>]/g, '');
            userId = secondId
        };

        const member = interaction.guild.members.cache.get(userId);

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
            waitingId: member.voice.channel.id
        });

        if (!voice || !interaction.guild.channels.cache.get(voice.voiceId)) {
            return await interaction.reply({
                content: `${client.emo.no} Vous devez rejoindre le salon vocal ${interaction.guild.channels.cache.get(data.voice.voiceId)}`,
                ephemeral: true
            });
        };

        if (voice.userId !== interaction.user.id) {
            return await interaction.reply({
                content: `${client.emo.no} Vous n'êtes pas le propriétaire de ce salon vocal.`,
                ephemeral: true
            });
        };

        if(!userId || !member || !member.voice || !member.voice.channel || member.voice.channel.id !== voice.waitingId) {
            return await interaction.reply({
                content: `${client.emo.no} L'utilisateur n'est pas dans un salon vocal.`,
                ephemeral: true
            });
        };

        switch (interaction.values[0]) {
            case "accept":

                if(voice.threadId && interaction.guild.channels.cache.get(voice.threadId)) {
                    await interaction.guild.channels.cache.get(voice.threadId).members.add(interaction.user.id).catch(err => null);
                };

                await member.voice.setChannel(interaction.guild.channels.cache.get(voice.voiceId))
                    .then(async () => {
                        await interaction.update({ fetchReply: true });
                        return await interaction.message.delete();
                    })
                    .catch(async err => {
                        await interaction.update({ fetchReply: true });
                        return await interaction.message.delete();
                    });
                break;
            case "deny":
                await member.voice.disconnect()
                    .then(async () => {
                        await interaction.update({ fetchReply: true });
                        return await interaction.message.delete();
                    })
                    .catch(async err => {
                        await interaction.update({ fetchReply: true });
                        return await interaction.message.delete();
                    });
                break;

            default:
                break;
        };
    }
};