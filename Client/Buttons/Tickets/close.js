const { Client, ButtonInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    id: "close",

    /**
     * 
     * @param {Client} client 
     * @param {ButtonInteraction} interaction 
     */
    execute: async (client, interaction) => {

        return await interaction.reply({
            content: `${interaction.user}`,
            embeds: [
                new EmbedBuilder()
                    .setTitle("Confirmation de la fermeture")
                    .setDescription("Veuillez confirmer que vous souhaitez fermer ce ticket")
                    .setColor("Blurple")
                    .setFooter({
                        text: "Fait par the_bisounours",
                        iconURL: client.user.displayAvatarURL()
                    })
            ],
            components: [
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId("close_confirm")
                            .setDisabled(false)
                            .setEmoji(`${client.emo.yes}`)
                            .setLabel("Fermé le ticket")
                            .setStyle(ButtonStyle.Success)
                    )
            ]
        });
    }
};