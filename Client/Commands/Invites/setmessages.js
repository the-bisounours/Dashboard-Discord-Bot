const { SlashCommandBuilder, Client, ChatInputCommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require("discord.js");
const { Guilds } = require("../../Models");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setmessages")
        .setDescription("Permet paramètrer les messages.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addStringOption(option => option
            .setName("type")
            .setDescription("Permet de choisir le type de message.")
            .addChoices(
                { name: "messages d'arrivé", value: "join" },
                { name: "messages de départ", value: "leave" }
            )
            .setRequired(true)
        ),

    category: "Administrateurs",

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

        switch (interaction.options.getString("type")) {
            case "join":

                await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Informations des messages d'arrivé")
                            .setColor("Blurple")
                            .setFooter({
                                text: client.user.displayName,
                                iconURL: client.user.displayAvatarURL()
                            })
                            .setTimestamp()
                            .setThumbnail(client.user.displayAvatarURL())
                            .addFields(
                                {
                                    name: "Veuillez selectionné un message pour le modifier:",
                                    value: `👤 Invite connue.\n⛔ Invité par lui même.\n❓ Invite inconnue.\n📩 Invitation personnalisée.\n❌Annuler.`
                                }
                            )
                    ],
                    components: [
                        new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId("join_msg_normal")
                                    .setDisabled(false)
                                    .setEmoji("👤")
                                    .setStyle(ButtonStyle.Primary),
                                new ButtonBuilder()
                                    .setCustomId("join_msg_self")
                                    .setDisabled(false)
                                    .setEmoji("⛔")
                                    .setStyle(ButtonStyle.Primary),
                                new ButtonBuilder()
                                    .setCustomId("join_msg_unknown")
                                    .setDisabled(false)
                                    .setEmoji("❓")
                                    .setStyle(ButtonStyle.Primary),
                                new ButtonBuilder()
                                    .setCustomId("join_msg_vanity")
                                    .setDisabled(false)
                                    .setEmoji("📩")
                                    .setStyle(ButtonStyle.Primary),
                                new ButtonBuilder()
                                    .setCustomId("delete")
                                    .setDisabled(false)
                                    .setEmoji("❌")
                                    .setStyle(ButtonStyle.Danger)
                            )
                    ]
                });

                break;
            case "leave":

                await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Informations des messages de départ")
                            .setColor("Blurple")
                            .setFooter({
                                text: client.user.displayName,
                                iconURL: client.user.displayAvatarURL()
                            })
                            .setTimestamp()
                            .setThumbnail(client.user.displayAvatarURL())
                            .addFields(
                                {
                                    name: "Veuillez selectionné un message pour le modifier:",
                                    value: `👤 Invite connue.\n❓ Invite inconnue.\n📩 Invitation personnalisée.\n❌Annuler.`
                                }
                            )
                    ],
                    components: [
                        new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId("leave_msg_normal")
                                    .setDisabled(false)
                                    .setEmoji("👤")
                                    .setStyle(ButtonStyle.Primary),
                                new ButtonBuilder()
                                    .setCustomId("leave_msg_unknown")
                                    .setDisabled(false)
                                    .setEmoji("❓")
                                    .setStyle(ButtonStyle.Primary),
                                new ButtonBuilder()
                                    .setCustomId("leave_msg_vanity")
                                    .setDisabled(false)
                                    .setEmoji("📩")
                                    .setStyle(ButtonStyle.Primary),
                                new ButtonBuilder()
                                    .setCustomId("delete")
                                    .setDisabled(false)
                                    .setEmoji("❌")
                                    .setStyle(ButtonStyle.Danger)
                            )
                    ]
                });

                break;
            default:
                break;
        }
    }
};