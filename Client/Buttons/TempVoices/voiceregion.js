const { Client, ButtonInteraction, ActionRowBuilder, UserSelectMenuBuilder, StringSelectMenuOptionBuilder, StringSelectMenuBuilder } = require("discord.js");
const { Voices, Guilds } = require("../../Models");

module.exports = {
    id: "voiceregion",

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
            voiceId: interaction.member.voice.channel.id
        });

        if (!voice || !interaction.guild.channels.cache.get(voice.voiceId) || voice.userId !== interaction.user.id && !voice.trust.includes(interaction.user.id)) {
            return await interaction.reply({
                content: `${client.emo.no} Vous devez rejoindre le salon vocal ${interaction.guild.channels.cache.get(data.voice.voiceId)}`,
                ephemeral: true
            });
        };

        return await interaction.reply({
            components: [
                new ActionRowBuilder()
                    .addComponents(
                        new StringSelectMenuBuilder()
                            .setCustomId("voiceregion")
                            .setDisabled(false)
                            .setMaxValues(1)
                            .setMinValues(1)
                            .setPlaceholder("Impose la région de ton salon vocal.")
                            .addOptions(
                                new StringSelectMenuOptionBuilder()
                                    .setEmoji(`${client.emo.region}`)
                                    .setLabel(`Automatique`)
                                    .setValue("null"),
                                new StringSelectMenuOptionBuilder()
                                    .setEmoji(`${client.emo.region}`)
                                    .setLabel(`Brazil`)
                                    .setValue("brazil"),
                                new StringSelectMenuOptionBuilder()
                                    .setEmoji(`${client.emo.region}`)
                                    .setLabel(`Hong Kong`)
                                    .setValue("hongkong"),
                                new StringSelectMenuOptionBuilder()
                                    .setEmoji(`${client.emo.region}`)
                                    .setLabel(`India`)
                                    .setValue("india"),
                                new StringSelectMenuOptionBuilder()
                                    .setEmoji(`${client.emo.region}`)
                                    .setLabel(`Japan`)
                                    .setValue("japan"),
                                new StringSelectMenuOptionBuilder()
                                    .setEmoji(`${client.emo.region}`)
                                    .setLabel(`Rotterdam`)
                                    .setValue("rotterdam"),
                                new StringSelectMenuOptionBuilder()
                                    .setEmoji(`${client.emo.region}`)
                                    .setLabel(`Russia`)
                                    .setValue("russia"),
                                new StringSelectMenuOptionBuilder()
                                    .setEmoji(`${client.emo.region}`)
                                    .setLabel(`Singapore`)
                                    .setValue("singapore"),
                                new StringSelectMenuOptionBuilder()
                                    .setEmoji(`${client.emo.region}`)
                                    .setLabel(`South Africa`)
                                    .setValue("southafrica"),
                                new StringSelectMenuOptionBuilder()
                                    .setEmoji(`${client.emo.region}`)
                                    .setLabel(`Sydney`)
                                    .setValue("sydney"),
                                new StringSelectMenuOptionBuilder()
                                    .setEmoji(`${client.emo.region}`)
                                    .setLabel(`Us Central`)
                                    .setValue("us-central"),
                                new StringSelectMenuOptionBuilder()
                                    .setEmoji(`${client.emo.region}`)
                                    .setLabel(`Us East`)
                                    .setValue("us-east"),
                                new StringSelectMenuOptionBuilder()
                                    .setEmoji(`${client.emo.region}`)
                                    .setLabel(`Us South`)
                                    .setValue("us-south"),
                                new StringSelectMenuOptionBuilder()
                                    .setEmoji(`${client.emo.region}`)
                                    .setLabel(`Us West`)
                                    .setValue("us-west")
                            )
                    )
            ],
            ephemeral: true
        });
    }
};