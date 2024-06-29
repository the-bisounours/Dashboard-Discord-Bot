const { Client, ButtonInteraction, EmbedBuilder, PermissionFlagsBits, PermissionsBitField, ChannelType, ThreadAutoArchiveDuration, ThreadChannel, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { Guilds } = require("../../Models");

module.exports = {
    id: "ticket-",

    /**
     * 
     * @param {Client} client 
     * @param {ButtonInteraction} interaction 
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

        if (!data.tickets.settings.enabled) {
            return await interaction.reply({
                content: "Les tickets ne sont pas activé.",
                ephemeral: true
            });
        };

        const panel = data.tickets.panels.find(panel => panel.messageId === interaction.message.id);
        if (!panel) {
            return await interaction.reply({
                content: "Impossible de retrouver le panneau de ticket.",
                ephemeral: true
            });
        };

        const button = panel.buttons.find(button => button.label === interaction.customId.split("-")[1]);
        if (!button) {
            return await interaction.reply({
                content: "Impossible de retrouver le bouton du ticket.",
                ephemeral: true
            });
        };

        if (data.tickets.settings.threads.enabled) {

            await interaction.channel.threads.create({
                name: interaction.user.username,
                autoArchiveDuration: ThreadAutoArchiveDuration.OneWeek,
                type: ChannelType.PrivateThread
            })
                .then(
                    /**
                     * 
                     * @param {ThreadChannel} threadChannel 
                     */
                    async threadChannel => {

                        await interaction.reply({
                            content: `J'ai ouvert un nouveau ticket: ${threadChannel}`,
                            ephemeral: true
                        });

                        await threadChannel.members.add(interaction.user).catch(async err => {
                            return await interaction.reply({
                                content: "Je n'ai pas ajouter l'utilisateur au ticket à cause d'une erreur.",
                                ephemeral: true
                            });
                        });

                        await threadChannel.send({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor("Blurple")
                                    .setDescription("Merci d'avoir contacté le support.\nVeuillez décrire votre problème et attendre une réponse.")
                                    .setFooter({
                                        text: "Fait par the_bisounours",
                                        iconURL: client.user.displayAvatarURL()
                                    })
                            ],
                            components: [
                                new ActionRowBuilder()
                                    .addComponents(
                                        new ButtonBuilder()
                                            .setCustomId("close")
                                            .setDisabled(false)
                                            .setEmoji("🔒")
                                            .setLabel("Fermé")
                                            .setStyle(ButtonStyle.Danger),
                                        new ButtonBuilder()
                                            .setCustomId("close_reason")
                                            .setDisabled(false)
                                            .setEmoji("🔒")
                                            .setLabel("Fermé avec raison")
                                            .setStyle(ButtonStyle.Danger)
                                    )
                            ]
                        });

                        if (data.tickets.settings.threads.channelId && interaction.guild.channels.cache.get(data.tickets.settings.threads.channelId)) {
                            return await interaction.guild.channels.cache.get(data.tickets.settings.threads.channelId).send({
                                embeds: [
                                    new EmbedBuilder()
                                        .setTitle("Rejoindre le ticket")
                                        .setColor("Blurple")
                                        .setFooter({
                                            text: "Fait par the_bisounours",
                                            iconURL: client.user.displayAvatarURL()
                                        })
                                        .setDescription("Un ticket a été ouvert. Appuyez sur le bouton ci-dessous pour le rejoindre.")
                                        .addFields(
                                            {
                                                name: "Ouvert par",
                                                value: `${interaction.user}`,
                                                inline: true
                                            },
                                            {
                                                name: "Panneau",
                                                value: `\`${button.customId.split("-")[1]}\``,
                                                inline: true
                                            },
                                            {
                                                name: "Staff en Ticket",
                                                value: `\`${threadChannel.members.cache.filter(member => !member.user.bot && member.user.id !== interaction.user.id).size}\``,
                                                inline: true
                                            }
                                        )
                                ],
                                components: [
                                    new ActionRowBuilder()
                                        .addComponents(
                                            new ButtonBuilder()
                                                .setCustomId(`join_ticket_${threadChannel.id}`)
                                                .setDisabled(false)
                                                .setEmoji("➕")
                                                .setLabel("Rejoindre le ticket")
                                                .setStyle(ButtonStyle.Primary)
                                        )
                                ]
                            });
                        };
                    })
                .catch(async err => {
                    return await interaction.reply({
                        content: "Je n'ai pas créer votre ticket à cause d'une erreur.",
                        ephemeral: true
                    });
                });

        } else {

            await interaction.guild.channels.create({
                name: interaction.user.username,
                type: ChannelType.GuildText,
                parent: panel.categoryId && interaction.guild.channels.cache.get(panel.categoryId) ? panel.categoryId : null,
                permissionOverwrites: [
                    {
                        id: interaction.guild.id,
                        deny: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages]
                    },
                    {
                        id: interaction.user.id,
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages]
                    }
                ]
            })
                .then(async channel => {
                    await channel.send({
                        embeds: [
                            new EmbedBuilder()
                                .setColor("Blurple")
                                .setDescription("Merci d'avoir contacté le support.\nVeuillez décrire votre problème et attendre une réponse.")
                                .setFooter({
                                    text: "Fait par the_bisounours",
                                    iconURL: client.user.displayAvatarURL()
                                })
                        ],
                        components: [
                            new ActionRowBuilder()
                                .addComponents(
                                    new ButtonBuilder()
                                        .setCustomId("close")
                                        .setDisabled(false)
                                        .setEmoji("🔒")
                                        .setLabel("Fermé")
                                        .setStyle(ButtonStyle.Danger),
                                    new ButtonBuilder()
                                        .setCustomId("close_reason")
                                        .setDisabled(false)
                                        .setEmoji("🔒")
                                        .setLabel("Fermé avec raison")
                                        .setStyle(ButtonStyle.Danger),
                                    new ButtonBuilder()
                                        .setCustomId("claim")
                                        .setDisabled(false)
                                        .setEmoji("🙋‍♂️")
                                        .setLabel("Réclamer")
                                        .setStyle(ButtonStyle.Success)
                                )
                        ]
                    });

                    if (data.tickets.settings.support && interaction.guild.roles.cache.get(data.tickets.settings.support)) {
                        await channel.permissionOverwrites.create(interaction.guild.roles.cache.get(data.tickets.settings.support), {
                            ViewChannel: true,
                            SendMessages: true
                        }).catch(err => err);
                    };

                    for (let index = 0; index < panel.roles.length; index++) {
                        const roleId = panel.roles[index];
                        if (interaction.guild.roles.cache.get(roleId)) {
                            await channel.permissionOverwrites.create(interaction.guild.roles.cache.get(roleId), {
                                ViewChannel: true,
                                SendMessages: true
                            }).catch(err => err);
                        };
                    };
                })
                .catch(async err => {
                    return await interaction.reply({
                        content: "Je n'ai pas créer votre ticket à cause d'une erreur.",
                        ephemeral: true
                    });
                });
        };
    }
};