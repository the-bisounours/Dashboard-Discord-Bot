const { Client, UserSelectMenuInteraction } = require("discord.js");
const { Guilds, Voices } = require("../../Models");

module.exports = {
    id: "voicekick",

    /**
     * 
     * @param {Client} client 
     * @param {UserSelectMenuInteraction} interaction 
     */
    execute: async (client, interaction) => {

        if (!interaction.member.voice || !interaction.member.voice.channel) {
            return await interaction.update({
                content: `${client.emo.no} Vous n'êtes pas dans un salon vocal.`,
                ephemeral: true,
                components: [],
            });
        };

        const data = await Guilds.findOne({
            guildId: interaction.guild.id
        });

        if (!data) {
            return await interaction.update({
                content: `${client.emo.no} Impossible de trouver la base de donnée du serveur.`,
                ephemeral: true,
                components: [],
            });
        };

        const voice = await Voices.findOne({
            guildId: interaction.guild.id,
            voiceId: interaction.member.voice.channel.id
        });

        if (!voice || !interaction.guild.channels.cache.get(voice.voiceId) || voice.userId !== interaction.user.id && !voice.trust.includes(interaction.user.id)) {
            return await interaction.update({
                content: `${client.emo.no} Vous devez rejoindre le salon vocal ${interaction.guild.channels.cache.get(data.voice.voiceId)}`,
                ephemeral: true,
                components: [],
            });
        };

        interaction.values.map(async value => {
            if(interaction.guild.members.cache.get(value) && interaction.guild.members.cache.get(value).voice && interaction.guild.members.cache.get(value).voice.channel && interaction.guild.members.cache.get(value).voice.channel.id === voice.voiceId) {
                await interaction.guild.members.cache.get(value).voice.disconnect("L'utilisateur est kick.").catch(err => null);
            };
        });

        return await interaction.update({
            content: `${client.emo.yes} ${interaction.values.length === 1 ? "L'utilisateur" : "Les utilisateurs"} ${interaction.values.map(value => `\`${interaction.guild.members.cache.get(value).displayName}\``).join(", ")} ${interaction.values.length === 1 ? "a" : "ont"} été expulsé.`,
            components: [],
            ephemeral: true
        });
    }
};