const { Client, ButtonInteraction, ActionRowBuilder, UserSelectMenuBuilder } = require("discord.js");
const { Voices, Guilds } = require("../../Models");

module.exports = {
    id: "voicekick",

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

        return await interaction.reply({
            components: [
                new ActionRowBuilder()
                    .addComponents(
                        new UserSelectMenuBuilder()
                            .setCustomId("voicekick")
                            .setDisabled(false)
                            .setMaxValues(interaction.guild.members.cache.size > 25 ? 25 : interaction.guild.members.cache.size)
                            .setMinValues(1)
                            .setPlaceholder("Les utilisateurs sélectionnés seront expulser.")
                    )
            ],
            ephemeral: true
        });
    }
};