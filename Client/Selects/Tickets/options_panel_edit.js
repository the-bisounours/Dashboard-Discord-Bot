const { Client, StringSelectMenuInteraction, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ChannelSelectMenuBuilder, ChannelType, RoleSelectMenuBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { Guilds } = require("../../Models");
const messagePanel = require("../../Functions/Panneaux/messagePanel");
const options = require("../../Functions/Panneaux/options");

module.exports = {
    id: "options_panel_edit_",

    /**
     * 
     * @param {Client} client 
     * @param {StringSelectMenuInteraction} interaction 
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
                content: "Impossible de trouver la base de donnée du serveur.",
                ephemeral: true
            });
        };

        const panel = data.tickets.panels.find(panel => panel.panelId === interaction.customId.split("_")[3]);
        if (!panel) {
            return await interaction.reply({
                content: "Impossible de retrouver le panneau de ticket.",
                ephemeral: true
            });
        };

        switch (interaction.values[0]) {
            case "delete":

                const index = data.tickets.panels.findIndex(panel => panel.panelId === interaction.customId.split("_")[3]);
                data.tickets.panels.splice(index, 1);
                await data.save();

                const embed = new EmbedBuilder()
                    .setTitle("Informations des panneaux des tickets")
                    .setThumbnail(client.user.displayAvatarURL())
                    .setColor("Blurple")
                    .setFooter({
                        text: client.user.displayName,
                        iconURL: client.user.displayAvatarURL()
                    })
                    .setTimestamp();

                let components = [
                    new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId("create_panel")
                                .setDisabled(data.tickets.panels.length >= 3 ? true : false)
                                .setLabel("Créer un panneau de ticket")
                                .setStyle(ButtonStyle.Primary),
                            new ButtonBuilder()
                                .setCustomId("settings_ticket")
                                .setDisabled(false)
                                .setLabel("Modifier les paramètres généraux")
                                .setStyle(ButtonStyle.Primary)
                        )
                ];

                if (data.tickets.panels.length === 0) {
                    embed.setDescription("Explorez la création de panneaux de configuration pour vos tickets en toute simplicité ! Ajoutez-en un nouveau en un clic grâce au bouton situé juste en bas.");
                } else {
                    components.push(
                        new ActionRowBuilder()
                            .addComponents(
                                new StringSelectMenuBuilder()
                                    .setCustomId("edit_panel")
                                    .setDisabled(false)
                                    .setMaxValues(1)
                                    .setMinValues(1)
                                    .setPlaceholder("Modifie les paramètres des panneaux.")
                            )
                    );
                };

                for (let index = 0; index < data.tickets.panels.length; index++) {
                    const panel = data.tickets.panels[index];
                    embed.addFields(messagePanel(panel, interaction));

                    components[1].components[0].addOptions(
                        new StringSelectMenuOptionBuilder()
                            .setLabel(`Modifier - ${panel.panelId}`)
                            .setValue(panel.panelId)
                    )
                };

                await interaction.update({
                    embeds: [embed],
                    components: components
                });

                break;
            case "return":

                const embed1 = new EmbedBuilder()
                    .setTitle("Informations des panneaux des tickets")
                    .setThumbnail(client.user.displayAvatarURL())
                    .setColor("Blurple")
                    .setFooter({
                        text: client.user.displayName,
                        iconURL: client.user.displayAvatarURL()
                    })
                    .setTimestamp();

                let components1 = [
                    new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId("create_panel")
                                .setDisabled(data.tickets.panels.length >= 3 ? true : false)
                                .setLabel("Créer un panneau de ticket")
                                .setStyle(ButtonStyle.Primary),
                            new ButtonBuilder()
                                .setCustomId("settings_ticket")
                                .setDisabled(false)
                                .setLabel("Modifier les paramètres généraux")
                                .setStyle(ButtonStyle.Primary)
                        )
                ];

                if (data.tickets.panels.length === 0) {
                    embed1.setDescription("Explorez la création de panneaux de configuration pour vos tickets en toute simplicité ! Ajoutez-en un nouveau en un clic grâce au bouton situé juste en bas.");
                } else {
                    components1.push(
                        new ActionRowBuilder()
                            .addComponents(
                                new StringSelectMenuBuilder()
                                    .setCustomId("edit_panel")
                                    .setDisabled(false)
                                    .setMaxValues(1)
                                    .setMinValues(1)
                                    .setPlaceholder("Modifie les paramètres des panneaux.")
                            )
                    );
                };

                for (let index = 0; index < data.tickets.panels.length; index++) {
                    const panel = data.tickets.panels[index];
                    embed1.addFields(messagePanel(panel, interaction));

                    components1[1].components[0].addOptions(
                        new StringSelectMenuOptionBuilder()
                            .setLabel(`Modifier - ${panel.panelId}`)
                            .setValue(panel.panelId)
                    )
                };

                await interaction.update({
                    embeds: [embed1],
                    components: components1
                });

                break;
            case "options":

                return interaction.update({
                    embeds: [
                        options(panel, new EmbedBuilder())
                            .setColor("Blurple")
                            .setTitle("Informations des panneaux des tickets")
                            .setFooter({
                                text: client.user.displayName,
                                iconURL: client.user.displayAvatarURL()
                            })
                            .setTimestamp()
                            .setDescription(`- Personnalise tes options d'ouverture de ticket:\n> **Identifiant:** \`${panel.panelId}\`\n> **Boutons:** \`${panel.buttons.length}/7\``)
                    ],
                    components: [
                        new ActionRowBuilder()
                            .addComponents(
                                new StringSelectMenuBuilder()
                                    .setCustomId(`manage_options_panel_${panel.panelId}`)
                                    .setDisabled(false)
                                    .setMaxValues(1)
                                    .setMinValues(1)
                                    .setPlaceholder("Modifie les options.")
                                    .addOptions(
                                        new StringSelectMenuOptionBuilder()
                                            .setLabel("Ajouter un nouveau bouton.")
                                            .setValue("add_button"),
                                        new StringSelectMenuOptionBuilder()
                                            .setLabel("Supprimer toutes les options.")
                                            .setValue("delete_all"),
                                        new StringSelectMenuOptionBuilder()
                                            .setLabel("Retourner au menu principal.")
                                            .setValue("return")
                                    )
                            )
                    ]
                });

                break;
            default:
                break;
        }
    }
};