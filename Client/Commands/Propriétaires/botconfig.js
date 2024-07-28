const { SlashCommandBuilder, Client, ChatInputCommandInteraction, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js");
const activity = require("../../Functions/Gestions/activity");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("botconfig")
        .setDescription("Permet configurer le robot.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(null),

    category: "Propriétaires",

    /**
     * 
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    execute: async (client, interaction) => {

        if (interaction.user.id !== process.env.ownerId) {
            return await interaction.reply({
                content: `${client.emo.no} Vous n'etes pas le propriétaire du robot.`,
                ephemeral: true
            });
        };

        return await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Informations du robot")
                    .setThumbnail(client.user.displayAvatarURL())
                    .setColor("Blurple")
                    .setFooter({
                        text: client.user.displayName,
                        iconURL: client.user.displayAvatarURL()
                    })
                    .setTimestamp()
                    .setDescription(`> **Nom:** \`${client.user.username}\`\n> **Description:** \`${client.application.description ? client.application.description : "Aucune"}\`\n> **Avatar:** ${client.user.avatar ? `[\`clique ici\`](${client.user.displayAvatarURL()})` : "\`Aucun\`"}\n> **Bannière:** ${client.user.banner ? `[\`clique ici\`](${client.user.bannerURL()})` : "\`Aucune\`"}\n> **Satus:** \`${client.user.presence && client.user.presence.status ? client.user.presence.status : "Aucun"}\`\n> **Activité:** \`${client.user.presence && client.user.presence.activities.length > 0 ? `${activity(client.user.presence.activities[0].type)} ${client.user.presence.activities[0].name}` : "Aucune"}\``)
            ],
            components: [
                new ActionRowBuilder()
                    .addComponents(
                        new StringSelectMenuBuilder()
                            .setCustomId("botconfig")
                            .setDisabled(false)
                            .setMaxValues(1)
                            .setMinValues(1)
                            .setPlaceholder("Config les informations du robot")
                            .addOptions(
                                new StringSelectMenuOptionBuilder()
                                    .setLabel("Modifier le nom")
                                    .setValue("name"),
                                new StringSelectMenuOptionBuilder()
                                    .setLabel("Modifier la description")
                                    .setValue("description")
                            )
                    )
            ]
        })
    }
};