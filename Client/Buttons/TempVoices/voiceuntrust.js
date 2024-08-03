const { Client, ButtonInteraction, ActionRowBuilder, UserSelectMenuBuilder, StringSelectMenuOptionBuilder, StringSelectMenuBuilder } = require("discord.js");
const { Voices, Guilds } = require("../../Models");

module.exports = {
    id: "voiceuntrust",

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

        if(voice.trust.length === 0 || voice.trust.length > 25) {
            return await interaction.reply({
                content: `${client.emo.no} Il y a pas assez ou trop de personne en confiance.`,
                ephemeral: true
            });
        };
        
        let options = [];
        for(const trust of voice.trust) {
            options.push(
                new StringSelectMenuOptionBuilder()
                .setEmoji(`${client.emo.mention}`)
                .setLabel(`${interaction.guild.members.cache.get(trust)?.displayName}`)
                .setValue(trust)
            );
        };

        return await interaction.reply({
            components: [
                new ActionRowBuilder()
                    .addComponents(
                        new StringSelectMenuBuilder()
                            .setCustomId("voiceuntrust")
                            .setDisabled(false)
                            .setMaxValues(voice.trust.length)
                            .setMinValues(1)
                            .addOptions(options)
                            .setPlaceholder("Les utilisateurs sélectionnés ne seront plus de confiance.")
                    )
            ],
            ephemeral: true
        });
    }
};