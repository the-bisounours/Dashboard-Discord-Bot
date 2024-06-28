const { SlashCommandBuilder, Client, ChatInputCommandInteraction, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, ActionRow, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js");
const { Guilds } = require("../../Models");
const messagePanel = require("../../Functions/Panneaux/messagePanel");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("panels")
        .setDescription("Permet de configurer les panneaux des tickets.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    category: "Tickets",

    /**
     * 
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    execute: async (client, interaction) => {

        const data = await Guilds.findOne({
            guildId: interaction.guild.id
        });

        if (!data) {
            return await interaction.reply({
                content: "Impossible de trouver la base de donnée du serveur.",
                ephemeral: true
            });
        };

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

        return await interaction.reply({
            embeds: [embed],
            components: components
        });
    }
};