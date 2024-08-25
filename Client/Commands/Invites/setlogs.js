const { SlashCommandBuilder, Client, ChatInputCommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require("discord.js");
const { Guilds } = require("../../Models");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setlogs")
        .setDescription("Permet paramètrer les logs.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addStringOption(option => option
            .setName("type")
            .setDescription("Permet de choisir le type de logs.")
            .addChoices(
                { name: "Logs d'arrivé", value: "join" },
                { name: "Logs de départ", value: "leave" }
            )
            .setRequired(true)
        ),

    category: "Invites",

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
                content: `${client.emo.no} Impossible de trouver la base de donnée du serveur.`,
                ephemeral: true
            });
        };

        switch (interaction.options.getString("type")) {
            case "join":

                await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Informations des logs d'arrivé")
                            .setColor("Blurple")
                            .setFooter({
                                text: client.user.displayName,
                                iconURL: client.user.displayAvatarURL()
                            })
                            .setThumbnail(client.user.displayAvatarURL())
                            .setDescription(`> **Salon:** ${data.invites.joinChannel && interaction.guild.channels.cache.get(data.invites.joinChannel) ? interaction.guild.channels.cache.get(data.invites.joinChannel) : `\`Aucun\``}\n\nCliquez sur le ✏️ pour le modifier.\nCliquez sur le 🗑️ pour le supprimer.\nCliquez sur le ❌ pour annuler.`)
                    ],
                    components: [
                        new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId("join_logs_edit")
                                    .setDisabled(false)
                                    .setEmoji(`${client.emo.pencil}`)
                                    .setLabel("Modifier")
                                    .setStyle(ButtonStyle.Primary),
                                new ButtonBuilder()
                                    .setCustomId("join_logs_delete")
                                    .setDisabled(false)
                                    .setEmoji(`${client.emo.delete}`)
                                    .setLabel("Supprimer")
                                    .setStyle(ButtonStyle.Danger),
                                new ButtonBuilder()
                                    .setCustomId("delete")
                                    .setDisabled(false)
                                    .setEmoji(`${client.emo.no}`)
                                    .setLabel("Annuler")
                                    .setStyle(ButtonStyle.Danger)
                            )
                    ]
                });

            break;
            case "leave":

                await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Informations des logs de départ")
                            .setColor("Blurple")
                            .setFooter({
                                text: client.user.displayName,
                                iconURL: client.user.displayAvatarURL()
                            })
                            .setThumbnail(client.user.displayAvatarURL())
                            .setDescription(`> **Salon:** ${data.invites.leaveChannel && interaction.guild.channels.cache.get(data.invites.leaveChannel) ? interaction.guild.channels.cache.get(data.invites.leaveChannel) : `\`Aucun\``}\n\nCliquez sur le ✏️ pour le modifier.\nCliquez sur le 🗑️ pour le supprimer.\nCliquez sur le ❌ pour annuler.`)
                    ],
                    components: [
                        new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId("leave_logs_edit")
                                    .setDisabled(false)
                                    .setEmoji(`${client.emo.pencil}`)
                                    .setLabel("Modifier")
                                    .setStyle(ButtonStyle.Primary),
                                    new ButtonBuilder()
                                    .setCustomId("leave_logs_delete")
                                    .setDisabled(false)
                                    .setEmoji(`${client.emo.delete}`)
                                    .setLabel("Supprimer")
                                    .setStyle(ButtonStyle.Danger),
                                new ButtonBuilder()
                                    .setCustomId("delete")
                                    .setDisabled(false)
                                    .setEmoji(`${client.emo.no}`)
                                    .setLabel("Annuler")
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