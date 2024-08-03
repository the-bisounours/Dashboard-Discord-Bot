const { Client, UserSelectMenuInteraction } = require("discord.js");
const { Guilds, Voices } = require("../../Models");

module.exports = {
    id: "voiceblock",

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
            voiceId: interaction.member.voice.channel.id,
            userId: interaction.user.id
        });

        if (!voice || !interaction.guild.channels.cache.get(voice.voiceId)) {
            return await interaction.update({
                content: `${client.emo.no} Vous devez rejoindre le salon vocal ${interaction.guild.channels.cache.get(data.voice.voiceId)}`,
                ephemeral: true,
                components: [],
            });
        };

        interaction.values.map(value => {
            if(!voice.block.includes(value)) {
                voice.block.push(value);
            };
        });

        await voice.save();

        return await interaction.update({
            content: `${client.emo.yes} ${interaction.values.length === 1 ? "L'utilisateur" : "Les nouveaux utilisateurs"} ${interaction.values.map(value => `\`${interaction.guild.members.cache.get(value).displayName}\``).join(", ")} ${interaction.values.length === 1 ? "est" : "sont"} bloquer.`,
            components: [],
            ephemeral: true
        });
    }
};