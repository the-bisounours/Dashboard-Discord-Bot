const { Client, ButtonInteraction, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js");

module.exports = {
    id: "close_reason",

    /**
     * 
     * @param {Client} client 
     * @param {ButtonInteraction} interaction 
     */
    execute: async (client, interaction) => {

        return await interaction.showModal(
            new ModalBuilder()
                .setCustomId("close_reason")
                .setTitle('Fermeture')
                .addComponents(
                    new ActionRowBuilder().addComponents(
                        new TextInputBuilder()
                            .setCustomId("reason")
                            .setLabel("Raison")
                            .setStyle(TextInputStyle.Paragraph)
                            .setMaxLength(300)
                            .setMinLength(4)
                            .setValue("Problème résolu")
                            .setRequired(true)
                    )
                )
        );
    }
};