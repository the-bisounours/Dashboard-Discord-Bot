const { Client, ButtonInteraction, ActionRowBuilder, ChannelSelectMenuBuilder, ButtonStyle, ButtonBuilder, ChannelType } = require("discord.js");
const { Guilds } = require("../../Models");

module.exports = {
    id: "join_logs_edit",

    /**
     * 
     * @param {Client} client 
     * @param {ButtonInteraction} interaction 
     */
    execute: async (client, interaction) => {

        if(interaction.user.id !== interaction.message.interaction.user.id) {
            return await interaction.reply({
                content: "Vous n'êtes pas l'auteur de cette commande.",
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

        return await interaction.update({
            embeds: [],
            components: [
                new ActionRowBuilder()
                    .addComponents(
                        new ChannelSelectMenuBuilder()
                            .setCustomId("join_logs_edit")
                            .setDisabled(false)
                            .setMaxValues(1)
                            .setMinValues(1)
                            .addChannelTypes(ChannelType.GuildText)
                            .setDefaultChannels(data.invites.joinChannel ? [data.invites.joinChannel] : [])
                    ),
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId("delete")
                            .setDisabled(false)
                            .setEmoji("❌")
                            .setLabel("Annuler")
                            .setStyle(ButtonStyle.Danger)
                    )
            ]
        });
    }
};