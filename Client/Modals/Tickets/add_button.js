const { Client, ModalSubmitInteraction, EmbedBuilder, ButtonStyle } = require("discord.js");
const componentsOptions = require("../../Functions/Panneaux/componentsOptions");
const options = require("../../Functions/Panneaux/options");
const { Guilds } = require("../../Models");

module.exports = {
    id: "add_button_",

    /**
     * 
     * @param {Client} client 
     * @param {ModalSubmitInteraction} interaction 
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
                content: `${client.emo.no} Impossible de trouver la base de donnée du serveur.`,
                ephemeral: true
            });
        };

        const panel = data.tickets.panels.find(panel => panel.panelId === interaction.customId.split("_")[2]);
        if (!panel) {
            return await interaction.reply({
                content: ":x: Impossible de retrouver le panneau de ticket.",
                ephemeral: true
            });
        };

        if (panel.buttons.length >= 7) {
            return await interaction.reply({
                content: "Vous avez atteint la limite de bouton.",
                ephemeral: true
            });
        };

        if (panel.buttons.some(button => button.label === interaction.fields.getTextInputValue("label"))) {
            return interaction.reply({
                content: `Le label est déjà inclus dans l'un des boutons.`,
                ephemeral: true
            });
        };

        let color = interaction.fields.getTextInputValue("color");
        if (![`${ButtonStyle.Primary}`, `${ButtonStyle.Secondary}`, `${ButtonStyle.Danger}`, `${ButtonStyle.Success}`].includes(color)) {
            color = `${ButtonStyle.Primary}`;
        };

        panel.buttons = [
            ...panel.buttons, {
                customId: `ticket-${interaction.fields.getTextInputValue("label")}`,
                label: interaction.fields.getTextInputValue("label"),
                color: color
            }
        ];
        await data.save();

        await interaction.update({
            embeds: [
                options(panel, new EmbedBuilder())
                    .setColor("Blurple")
                    .setTitle("Informations des panneaux des tickets")
                    .setThumbnail(client.user.displayAvatarURL())
                    .setFooter({
                        text: client.user.displayName,
                        iconURL: client.user.displayAvatarURL()
                    })
                    .setTimestamp()
                    .setDescription(`- Personnalise tes options d'ouverture de ticket:\n> **Identifiant:** \`${panel.panelId}\`\n> **Boutons:** \`${panel.buttons.length}/7\``)
            ],
            components: componentsOptions(panel)
        });
    }
};