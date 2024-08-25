const { Client, ButtonInteraction, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { Guilds } = require("../../Models");
const fakeMessage = require("../../Functions/Invites/fakeMessage");

module.exports = {
    id: "remove_fake",

    /**
     * 
     * @param {Client} client 
     * @param {ButtonInteraction} interaction 
     */
    execute: async (client, interaction) => {

        if (interaction.user.id !== interaction.message.interaction.user.id) {
            return await interaction.reply({
                content: `${client.emo.no} Vous n'êtes pas l'auteur de cette commande.`,
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

        if (data.invites.fake.obligation.length === 0) {
            return await interaction.reply({
                content: `${client.emo.no} Il n'y a aucune condition a enlever.`,
                ephemeral: true
            });
        };

        return await interaction.update({
            embeds: [],
            components: [
                new ActionRowBuilder()
                    .addComponents(
                        new StringSelectMenuBuilder()
                            .setCustomId("remove_fake")
                            .setDisabled(false)
                            .setMaxValues(1)
                            .setMinValues(1)
                            .addOptions(
                                data.invites.fake.obligation.map(number => new StringSelectMenuOptionBuilder().setLabel(fakeMessage(number).replace("**", "").replace("**", "")).setValue(`${number}`))
                            )
                    ),
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId("delete")
                            .setDisabled(false)
                            .setEmoji(`${client.emo.no}`)
                            .setLabel("Annuler")
                            .setStyle(ButtonStyle.Danger)
                    )
            ]
        });
    }
};