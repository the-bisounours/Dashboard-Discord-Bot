const { Client, ButtonInteraction, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");
const { Guilds } = require("../../Models");

module.exports = {
    id: "leave_normal_edit",

    /**
     * 
     * @param {Client} client 
     * @param {ButtonInteraction} interaction 
     */
    execute: async (client, interaction) => {

        if (interaction.user.id !== interaction.message.interaction.user.id) {
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
                content: ":x: Impossible de trouver la base de donnée du serveur.",
                ephemeral: true
            });
        };

        return await interaction.showModal(
            new ModalBuilder()
                .setTitle("Modifications du message de départ (normal)")
                .setCustomId("leave_normal_edit")
                .addComponents(
                    new ActionRowBuilder()
                        .addComponents(
                            new TextInputBuilder()
                                .setLabel("Message")
                                .setMaxLength(1999)
                                .setMinLength(10)
                                .setValue(data.invites.leaveMessage.normal)
                                .setRequired(true)
                                .setStyle(TextInputStyle.Paragraph)
                                .setCustomId("message")
                        )
                )
        )
    }
};