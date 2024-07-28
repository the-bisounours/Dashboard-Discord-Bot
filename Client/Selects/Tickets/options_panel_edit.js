const { Client, StringSelectMenuInteraction, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ChannelSelectMenuBuilder, ChannelType, RoleSelectMenuBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { Guilds } = require("../../Models");
const messagePanel = require("../../Functions/Panneaux/messagePanel");
const options = require("../../Functions/Panneaux/options");
const componentsOptions = require("../../Functions/Panneaux/componentsOptions");
const componentsPanel = require("../../Functions/Panneaux/componentsPanel");
const buildButtons = require("../../Functions/Panneaux/buildButtons");

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
                content: `${client.emo.no} Impossible de trouver la base de donnée du serveur.`,
                ephemeral: true
            });
        };

        const panel = data.tickets.panels.find(panel => panel.panelId === interaction.customId.split("_")[3]);
        if (!panel) {
            return await interaction.reply({
                content: `${client.emo.no} Impossible de retrouver le panneau de ticket.`,
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

                break;
            case "name":

                await interaction.update({
                    embeds: [],
                    components: [
                        new ActionRowBuilder()
                            .addComponents(
                                new StringSelectMenuBuilder()
                                    .setCustomId(`ticket_name_edit_${panel.panelId}`)
                                    .setDisabled(false)
                                    .setMaxValues(1)
                                    .setMinValues(1)
                                    .setPlaceholder("Quels noms préfèrez-vous ?")
                                    .addOptions(
                                        new StringSelectMenuOptionBuilder()
                                            .setDefault(panel.name === "ticket-{user}" ? true : false)
                                            .setLabel("ticket-{user}")
                                            .setValue("ticket-{user}"),
                                        new StringSelectMenuOptionBuilder()
                                            .setDefault(panel.name === "{user}-ticket" ? true : false)
                                            .setLabel("{user}-ticket")
                                            .setValue("{user}-ticket"),
                                        new StringSelectMenuOptionBuilder()
                                            .setDefault(panel.name === "{user}" ? true : false)
                                            .setLabel("{user}")
                                            .setValue("{user}"),
                                        new StringSelectMenuOptionBuilder()
                                            .setDefault(panel.name === "ticket-{number}" ? true : false)
                                            .setLabel("ticket-{number}")
                                            .setValue("ticket-{number}")
                                    )
                            )
                    ]
                });

                break;
                case "send":

                if (!data.tickets.settings.enabled) {
                    return interaction.reply({
                        content: `Les tickets ne sont pas activé.`,
                        ephemeral: true
                    });
                };

                if (panel.buttons.length === 0 || panel.buttons.length > 7) {
                    return interaction.reply({
                        content: `Vous devez configuré les boutons du ticket.`,
                        ephemeral: true
                    });
                };

                if (!panel.channelId || !interaction.guild.channels.cache.get(panel.channelId)) {
                    return interaction.reply({
                        content: `Vous devez configuré le salon du ticket.`,
                        ephemeral: true
                    });
                };

                await interaction.guild.channels.cache.get(panel.channelId).send({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Création d'un ticket")
                            .setDescription("> Pour toute demande d'assistance, veuillez ouvrir un ticket de support ci-dessous. En ouvrant un ticket, vous acceptez que votre conversation soit enregistrée et stockée dans les logs du serveur. Merci de ne pas mentionner les membres du staff directement. Toute demande de support jugée inutile sera supprimée, et son auteur pourra être sanctionné.")
                            .setFooter({
                                text: client.user.displayName,
                                iconURL: client.user.displayAvatarURL()
                            })
                            .setTimestamp()
                            .setThumbnail(client.user.displayAvatarURL())
                            .setColor("Blurple")
                    ],
                    components: buildButtons(panel)
                }).then(async msg => {
                    panel.messageId = msg.id;
                    await data.save();
                });

                await interaction.update({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Informations des panneaux des tickets")
                            .setThumbnail(client.user.displayAvatarURL())
                            .setColor("Blurple")
                            .setFooter({
                                text: client.user.displayName,
                                iconURL: client.user.displayAvatarURL()
                            })
                            .setTimestamp()
                            .addFields(messagePanel(panel, interaction))
                    ],
                    components: componentsPanel(panel, interaction)
                });

                break;
            default:
                break;
        }
    }
};