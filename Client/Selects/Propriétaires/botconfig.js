const { Client, StringSelectMenuInteraction, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");

module.exports = {
    id: "botconfig",

    /**
     * 
     * @param {Client} client 
     * @param {StringSelectMenuInteraction} interaction 
     */
    execute: async (client, interaction) => {

        if(interaction.user.id !== interaction.message.interaction.user.id) {
            return await interaction.reply({
                content: `${client.emo.no} Vous n'êtes pas l'auteur de cette commande.`,
                ephemeral: true
            });
        };
        
        const modal = new ModalBuilder()
            .setTitle("Informations du robot")

        switch (interaction.values[0]) {
            case "name":
                modal.setCustomId("configName")
                modal.addComponents(
                    new ActionRowBuilder()
                        .addComponents(
                            new TextInputBuilder()
                                .setLabel("Nom")
                                .setMaxLength(32)
                                .setMinLength(2)
                                .setPlaceholder(`Actuellement: ${client.user.displayName}`)
                                .setRequired(true)
                                .setStyle(TextInputStyle.Short)
                                .setCustomId("name")
                        )
                );
            break;
            case "description":
                modal.setCustomId("configDescription")
                modal.addComponents(
                    new ActionRowBuilder()
                        .addComponents(
                            new TextInputBuilder()
                                .setLabel("Description")
                                .setMaxLength(400)
                                .setMinLength(0)
                                .setPlaceholder(`Renseigne la description du robot.`)
                                .setRequired(false)
                                .setStyle(TextInputStyle.Paragraph)
                                .setCustomId("description")
                        )
                );
            break;
            default:
            break;
        };

        return await interaction.showModal(modal);
    }
};