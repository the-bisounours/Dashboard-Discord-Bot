const { Client, StringSelectMenuInteraction, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ButtonBuilder, ChannelSelectMenuBuilder, RoleSelectMenuBuilder, ButtonStyle, ChannelType } = require("discord.js");
const { Guilds } = require("../../Models");

module.exports = {
    id: "xp_config",

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

        switch (interaction.values[0]) {
            case "xp_enabled":

                if (data.level.settings.enabled) {
                    data.level.settings.enabled = false;
                } else {
                    data.level.settings.enabled = true;
                };

                break;
            case "xp_reset":

                if (data.level.settings.resetLeave) {
                    data.level.settings.resetLeave = false;
                } else {
                    data.level.settings.resetLeave = true;
                };

                break;
            case "xp_message":

                return await interaction.update({
                    fetchReply: true,
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Information du système de niveaux")
                            .setThumbnail(client.user.displayAvatarURL())
                            .setColor("Blurple")
                            .setFooter({
                                text: client.user.displayName,
                                iconURL: client.user.displayAvatarURL()
                            })
                            .setTimestamp()
                            .setDescription(`> ${client.emo.messages} **Message:** \`${data.level.settings.message.enabled ? `Activé` : "Désactivé"}\`\n> ${client.emo.peinture} **Image:** \`${data.level.settings.message.image ? `Activé` : "Désactivé"}\`\n> ${client.emo.salon} **Salon:** ${data.level.settings.message.channel && interaction.guild.channels.cache.get(data.level.settings.message.channel) ? `${interaction.guild.channels.cache.get(data.level.settings.message.channel)}` : "\`Salon Actuel\`"}`)
                    ],
                    components: [
                        new ActionRowBuilder()
                            .addComponents(
                                new StringSelectMenuBuilder()
                                    .setCustomId("xp_message")
                                    .setDisabled(false)
                                    .setMaxValues(1)
                                    .setMinValues(1)
                                    .setPlaceholder("Permet de configurer le système de message.")
                                    .addOptions(
                                        new StringSelectMenuOptionBuilder()
                                            .setEmoji(`${data.level.settings.message.enabled ? client.emo.no : client.emo.yes}`)
                                            .setLabel(`${data.level.settings.message.enabled ? "Désactivé les messages" : "Activé les messages"}`)
                                            .setValue("message_enabled"),
                                        new StringSelectMenuOptionBuilder()
                                            .setEmoji(`${data.level.settings.message.image ? client.emo.no : client.emo.yes}`)
                                            .setLabel(`${data.level.settings.message.image ? "Désactivé les images" : "Activé les images"}`)
                                            .setValue("image_enabled"),
                                        new StringSelectMenuOptionBuilder()
                                            .setEmoji(`${client.emo.salon}`)
                                            .setLabel("Configurez le salon")
                                            .setValue("channel"),
                                        new StringSelectMenuOptionBuilder()
                                            .setEmoji(`${client.emo.fleche}`)
                                            .setLabel("Retournez au menu principal")
                                            .setValue("return")
                                    )
                            )
                    ]
                });

                break;
            case "xp_proportion":

                return await interaction.reply({
                    ephemeral: true,
                    components: [
                        new ActionRowBuilder()
                            .addComponents(
                                new StringSelectMenuBuilder()
                                    .setCustomId("xp_proportion")
                                    .setDisabled(false)
                                    .setMaxValues(1)
                                    .setMinValues(1)
                                    .setPlaceholder("Permet de configurer la proportion.")
                                    .addOptions(
                                        new StringSelectMenuOptionBuilder()
                                            .setEmoji(`${client.emo.etoile}`)
                                            .setLabel("Entre 5 et 15")
                                            .setValue("5-15"),
                                        new StringSelectMenuOptionBuilder()
                                            .setEmoji(`${client.emo.etoile}`)
                                            .setLabel("Entre 15 et 25")
                                            .setValue("15-25"),
                                        new StringSelectMenuOptionBuilder()
                                            .setEmoji(`${client.emo.etoile}`)
                                            .setLabel("Entre 25 et 35")
                                            .setValue("25-35"),
                                        new StringSelectMenuOptionBuilder()
                                            .setEmoji(`${client.emo.etoile}`)
                                            .setLabel("Entre 35 et 50")
                                            .setValue("35-50")
                                    )
                            )
                    ]
                });

                break;
            case "xp_ignore":

                return await interaction.update({
                    fetchReply: true,
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Information du système de niveaux")
                            .setThumbnail(client.user.displayAvatarURL())
                            .setColor("Blurple")
                            .setFooter({
                                text: client.user.displayName,
                                iconURL: client.user.displayAvatarURL()
                            })
                            .setTimestamp()
                            .setDescription(`> ${client.emo.ticket} **Ticket:** \`${data.level.settings.ignore.ticket ? "oui" : "non"}\`\n> ${client.emo.salon} **Salons:** ${data.level.settings.ignore.channels.length > 0 ? data.level.settings.ignore.channels.map(channel => `${interaction.guild.channels.cache.get(channel)}`).join(" ") : "\`Aucun\`"}\n> ${client.emo.mention} **Rôles:** ${data.level.settings.ignore.roles.length > 0 ? data.level.settings.ignore.roles.map(role => `${interaction.guild.roles.cache.get(role)}`).join(" ") : "\`Aucun\`"}`)
                    ],
                    components: [
                        new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId("xp_ignore_ticket")
                                    .setDisabled(false)
                                    .setEmoji(`${data.level.settings.ignore.ticket ? client.emo.yes : client.emo.no}`)
                                    .setLabel(`${data.level.settings.ignore.ticket ? "Activé l'expérience dans les tickets" : "Désactivé l'expérience dans les tickets"}`)
                                    .setStyle(ButtonStyle.Primary)
                            ),
                        new ActionRowBuilder()
                            .addComponents(
                                new ChannelSelectMenuBuilder()
                                    .setCustomId("xp_ignore_channels")
                                    .addDefaultChannels(data.level.settings.ignore.channels.length > 0 ? data.level.settings.ignore.channels : [])
                                    .addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement, ChannelType.PrivateThread, ChannelType.PublicThread)
                                    .setDisabled(false)
                                    .setMaxValues(interaction.guild.channels.cache.size > 25 ? 25 : interaction.guild.channels.cache.size)
                                    .setMinValues(1)
                                    .setPlaceholder("Permet de configurer les salons d'ignore.")
                            ),
                        new ActionRowBuilder()
                            .addComponents(
                                new RoleSelectMenuBuilder()
                                    .setCustomId("xp_ignore_roles")
                                    .addDefaultRoles(data.level.settings.ignore.roles.length > 0 ? data.level.settings.ignore.roles : [])
                                    .setDisabled(false)
                                    .setMaxValues(interaction.guild.roles.cache.size > 25 ? 25 : interaction.guild.roles.cache.size)
                                    .setMinValues(1)
                                    .setPlaceholder("Permet de configurer les rôles d'ignore.")
                            )
                    ]
                });

                break;
                case "xp_bonus":

                return await interaction.update({
                    fetchReply: true,
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Information du système de niveaux")
                            .setThumbnail(client.user.displayAvatarURL())
                            .setColor("Blurple")
                            .setFooter({
                                text: client.user.displayName,
                                iconURL: client.user.displayAvatarURL()
                            })
                            .setTimestamp()
                            .setDescription(`> ${client.emo.salon} **Salons:** ${data.level.settings.bonus.channels.length > 0 ? data.level.settings.bonus.channels.map(channel => `${interaction.guild.channels.cache.get(channel)}`).join(" ") : "\`Aucun\`"}\n> ${client.emo.mention} **Rôles:** ${data.level.settings.bonus.roles.length > 0 ? data.level.settings.bonus.roles.map(role => `${interaction.guild.roles.cache.get(role)}`).join(" ") : "\`Aucun\`"}`)
                    ],
                    components: [
                        new ActionRowBuilder()
                            .addComponents(
                                new ChannelSelectMenuBuilder()
                                    .setCustomId("xp_bonus_channels")
                                    .addDefaultChannels(data.level.settings.bonus.channels.length > 0 ? data.level.settings.bonus.channels : [])
                                    .addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement, ChannelType.PrivateThread, ChannelType.PublicThread)
                                    .setDisabled(false)
                                    .setMaxValues(interaction.guild.channels.cache.size > 25 ? 25 : interaction.guild.channels.cache.size)
                                    .setMinValues(1)
                                    .setPlaceholder("Permet de configurer les salons de bonus.")
                            ),
                        new ActionRowBuilder()
                            .addComponents(
                                new RoleSelectMenuBuilder()
                                    .setCustomId("xp_bonus_roles")
                                    .addDefaultRoles(data.level.settings.bonus.roles.length > 0 ? data.level.settings.bonus.roles : [])
                                    .setDisabled(false)
                                    .setMaxValues(interaction.guild.roles.cache.size > 25 ? 25 : interaction.guild.roles.cache.size)
                                    .setMinValues(1)
                                    .setPlaceholder("Permet de configurer les rôles de bonus.")
                            )
                    ]
                });

                break;

            default:
                break;
        };

        await data.save();

        return await interaction.update({
            fetchReply: true,
            embeds: [
                new EmbedBuilder()
                    .setTitle("Information du système de niveaux")
                    .setThumbnail(client.user.displayAvatarURL())
                    .setColor("Blurple")
                    .setFooter({
                        text: client.user.displayName,
                        iconURL: client.user.displayAvatarURL()
                    })
                    .setTimestamp()
                    .setDescription(`> ${client.emo.settings} **Système:** \`${data.level.settings.enabled ? "Activé" : "Désactivé"}\`\n> ${client.emo.messages} **Message:** ${data.level.settings.message.enabled ? `\`Activé\` ${data.level.settings.message.image ? `\`Image\`` : ""} ${data.level.settings.message.channel && interaction.guild.channels.cache.get(data.level.settings.message.channel) ? `${interaction.guild.channels.cache.get(data.level.settings.message.channel)}` : "\`Salon Actuel\`"}` : "\`Désactivé\`"}\n> ${client.emo.etoile} **Proportion:** entre \`${data.level.settings.ratio.min}\` et \`${data.level.settings.ratio.max}\`\n> ${client.emo.salon} **Ignore:** ${data.level.settings.ignore.ticket ? "\`Ticket\`" : ""} ${data.level.settings.ignore.channels.length > 0 ? `\`${data.level.settings.ignore.channels.length}\` salon${data.level.settings.ignore.channels.length > 1 ? "s" : ""}` : ""} ${data.level.settings.ignore.roles.length > 0 ? `\`${data.level.settings.ignore.roles.length}\` rôle${data.level.settings.ignore.roles.length > 1 ? "s" : ""}` : ""} ${!data.level.settings.ignore.ticket && data.level.settings.ignore.roles.length === 0 && data.level.settings.ignore.channels.length === 0 ? "\`Aucun\`" : ""}\n> ${client.emo.idee} **Bonus:** ${data.level.settings.bonus.channels.length > 0 ? `\`${data.level.settings.bonus.channels.length}\` salon${data.level.settings.bonus.channels.length > 1 ? "s" : ""}` : ""} ${data.level.settings.bonus.roles.length > 0 ? `\`${data.level.settings.bonus.roles.length}\` rôle${data.level.settings.bonus.roles.length > 1 ? "s" : ""}` : ""} ${data.level.settings.bonus.roles.length === 0 && data.level.settings.bonus.channels.length === 0 ? "\`Aucun\`" : ""}\n> ${client.emo.home} **Reset On Leave:** \`${data.level.settings.resetLeave ? "Activé" : "Désactivé"}\``)
            ],
            components: [
                new ActionRowBuilder()
                    .addComponents(
                        new StringSelectMenuBuilder()
                            .setCustomId("xp_config")
                            .setDisabled(false)
                            .setMaxValues(1)
                            .setMinValues(1)
                            .setPlaceholder("Permet de configurer le système d'expérience.")
                            .addOptions(
                                new StringSelectMenuOptionBuilder()
                                    .setValue("xp_enabled")
                                    .setEmoji(`${data.level.settings.enabled ? client.emo.no : client.emo.yes}`)
                                    .setLabel(`${data.level.settings.enabled ? "Désactivé l'xp" : "Activé l'xp"}`),
                                new StringSelectMenuOptionBuilder()
                                    .setValue("xp_reset")
                                    .setEmoji(`${data.level.settings.resetLeave ? client.emo.no : client.emo.yes}`)
                                    .setLabel(`${data.level.settings.resetLeave ? "Ne pas réinitialiser l'xp en quittant" : "Réinitialiser l'xp en quittant"}`),
                                new StringSelectMenuOptionBuilder()
                                    .setValue("xp_message")
                                    .setEmoji(`${client.emo.messages}`)
                                    .setLabel("Système de message"),
                                new StringSelectMenuOptionBuilder()
                                    .setValue("xp_proportion")
                                    .setEmoji(`${client.emo.etoile}`)
                                    .setLabel("Système de proportion"),
                                new StringSelectMenuOptionBuilder()
                                    .setValue("xp_ignore")
                                    .setEmoji(`${client.emo.salon}`)
                                    .setLabel("Système d'ignore"),
                                new StringSelectMenuOptionBuilder()
                                    .setValue("xp_bonus")
                                    .setEmoji(`${client.emo.idee}`)
                                    .setLabel("Système de bonus")
                            )
                    )
            ]
        });
    }
};