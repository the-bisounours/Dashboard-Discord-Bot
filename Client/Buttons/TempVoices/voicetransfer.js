const { Client, ButtonInteraction, ActionRowBuilder, UserSelectMenuBuilder, StringSelectMenuOptionBuilder, StringSelectMenuBuilder } = require("discord.js");
const { Voices, Guilds } = require("../../Models");

module.exports = {
    id: "voicetransfer",

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

        if(interaction.guild.channels.cache.get(voice.voiceId).members.size === 0 || interaction.guild.channels.cache.get(voice.voiceId).members.size > 25) {
            return await interaction.reply({
                content: `${client.emo.no} Il y a pas assez ou trop de personne en confiance.`,
                ephemeral: true
            });
        };
        
        let options = [];
        for(const member of interaction.guild.channels.cache.get(voice.voiceId).members) {
            options.push(
                new StringSelectMenuOptionBuilder()
                .setEmoji(`${client.emo.mention}`)
                .setLabel(`${member[1].displayName}`)
                .setValue(member[0])
            );
        };

        return await interaction.reply({
            components: [
                new ActionRowBuilder()
                    .addComponents(
                        new StringSelectMenuBuilder()
                            .setCustomId("voicetransfer")
                            .setDisabled(false)
                            .setMaxValues(1)
                            .setMinValues(1)
                            .addOptions(options)
                            .setPlaceholder("L'utilisateur sera le propriétaire du salon vocal.")
                    )
            ],
            ephemeral: true
        });
    }
};