const { Client, ButtonInteraction, ActionRowBuilder, UserSelectMenuBuilder, StringSelectMenuOptionBuilder, StringSelectMenuBuilder } = require("discord.js");
const { Voices, Guilds } = require("../../Models");

module.exports = {
    id: "voiceunblock",

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

        if(voice.block.length === 0 || voice.block.length > 25) {
            return await interaction.reply({
                content: `${client.emo.no} Il y a pas assez ou trop de personne bloquer.`,
                ephemeral: true
            });
        };
        
        let options = [];
        for(const block of voice.block) {
            options.push(
                new StringSelectMenuOptionBuilder()
                .setEmoji(`${client.emo.mention}`)
                .setLabel(`${interaction.guild.members.cache.get(block)?.displayName}`)
                .setValue(block)
            );
        };

        return await interaction.reply({
            components: [
                new ActionRowBuilder()
                    .addComponents(
                        new StringSelectMenuBuilder()
                            .setCustomId("voiceunblock")
                            .setDisabled(false)
                            .setMaxValues(voice.block.length)
                            .setMinValues(1)
                            .addOptions(options)
                            .setPlaceholder("Les utilisateurs sélectionnés ne seront plus de bloquer.")
                    )
            ],
            ephemeral: true
        });
    }
};