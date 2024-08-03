const { SlashCommandBuilder, Client, ChatInputCommandInteraction, PermissionFlagsBits, ChannelType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { Guilds } = require("../../Models");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("voicesetup")
        .setDescription("Permet de configurer le système de vocal temporaire.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

    category: "TempVoice",

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

        if (data.voice.voiceId && interaction.guild.channels.cache.get(data.voice.voiceId)) {
            return await interaction.reply({
                content: `${client.emo.no} Le système de vocal temporaire est déjà configuré ${interaction.guild.channels.cache.get(data.voice.voiceId)}.`,
                ephemeral: true
            });
        };

        await interaction.deferReply({ ephemeral: true });
        await interaction.guild.channels.create({
            name: "TEMPVOICE CATEGORY",
            type: ChannelType.GuildCategory,
            permissionOverwrites: [
                {
                    id: interaction.guild.id,
                    deny: [PermissionFlagsBits.SendMessages]
                },
                {
                    id: client.user.id,
                    allow: [
                        PermissionFlagsBits.ViewChannel,
                        PermissionFlagsBits.ManageChannels,
                        PermissionFlagsBits.ManageWebhooks,
                        PermissionFlagsBits.SendMessages,
                        PermissionFlagsBits.EmbedLinks,
                        PermissionFlagsBits.Connect,
                        PermissionFlagsBits.Speak
                    ]
                }
            ]
        })
            .then(async category => {

                await interaction.guild.channels.create({
                    name: "✨・interface",
                    type: ChannelType.GuildText,
                    parent: category.id
                })
                    .then(async interface => {

                        await interaction.guild.channels.create({
                            name: "➕ Créer Vocal",
                            type: ChannelType.GuildVoice,
                            parent: category.id
                        })
                            .then(async voicechannel => {

                                await interface.send({
                                    embeds: [
                                        new EmbedBuilder()
                                            .setTitle("Interface des vocaux temporaires")
                                            .setDescription(`Cette **interface** peut être utilisée pour gérer les canaux vocaux temporaires. D'autres options sont disponibles avec les commandes **/voice**.`)
                                            .setColor("Blurple")
                                            .setFooter({
                                                text: client.user.displayName,
                                                iconURL: client.user.displayAvatarURL()
                                            })
                                            .setTimestamp()
                                            .addFields(
                                                {
                                                    name: "\u200b",
                                                    value: `> ${client.emo.salon} \`Nom\`\n> ${client.emo.member} \`Limite\`\n> ${client.emo.privacy} \`Confidentialité\`\n> ${client.emo.temp} \`Attente\`\n> ${client.emo.salon_thread} \`Fil de discussion\``,
                                                    inline: true
                                                },
                                                {
                                                    name: "\u200b",
                                                    value: `> ${client.emo.user_trust} \`Confiance\`\n> ${client.emo.user_untrust} \`Méfiance\`\n> ${client.emo.invite} \`Inviter\`\n> ${client.emo.kick} \`Expulser\`\n> ${client.emo.region} \`Région\``,
                                                    inline: true
                                                },
                                                {
                                                    name: "\u200b",
                                                    value: `> ${client.emo.user_block} \`Bloquer\`\n> ${client.emo.user_unblock} \`Débloquer\`\n> ${client.emo.owner} \`Réclamer\`\n> ${client.emo.owner_tranfer} \`Transférer\`\n> ${client.emo.delete} \`Supprimer\``,
                                                    inline: true
                                                }
                                            )
                                    ],
                                    components: [
                                        new ActionRowBuilder()
                                            .addComponents(
                                                new ButtonBuilder()
                                                    .setCustomId("voicename")
                                                    .setDisabled(false)
                                                    .setEmoji(`${client.emo.salon}`)
                                                    .setStyle(ButtonStyle.Primary),
                                                new ButtonBuilder()
                                                    .setCustomId("voicelimit")
                                                    .setDisabled(false)
                                                    .setEmoji(`${client.emo.member}`)
                                                    .setStyle(ButtonStyle.Primary),
                                                new ButtonBuilder()
                                                    .setCustomId("voiceprivacy")
                                                    .setDisabled(false)
                                                    .setEmoji(`${client.emo.privacy}`)
                                                    .setStyle(ButtonStyle.Primary),
                                                new ButtonBuilder()
                                                    .setCustomId("voicewaiting")
                                                    .setDisabled(false)
                                                    .setEmoji(`${client.emo.temp}`)
                                                    .setStyle(ButtonStyle.Primary),
                                                new ButtonBuilder()
                                                    .setCustomId("voicethread")
                                                    .setDisabled(false)
                                                    .setEmoji(`${client.emo.salon_thread}`)
                                                    .setStyle(ButtonStyle.Primary)
                                            ),
                                        new ActionRowBuilder()
                                            .addComponents(
                                                new ButtonBuilder()
                                                    .setCustomId("voicetrust")
                                                    .setDisabled(false)
                                                    .setEmoji(`${client.emo.trust}`)
                                                    .setStyle(ButtonStyle.Primary),
                                                new ButtonBuilder()
                                                    .setCustomId("voiceuntrust")
                                                    .setDisabled(false)
                                                    .setEmoji(`${client.emo.untrust}`)
                                                    .setStyle(ButtonStyle.Primary),
                                                new ButtonBuilder()
                                                    .setCustomId("voiceinvite")
                                                    .setDisabled(false)
                                                    .setEmoji(`${client.emo.invite}`)
                                                    .setStyle(ButtonStyle.Primary),
                                                new ButtonBuilder()
                                                    .setCustomId("voicekick")
                                                    .setDisabled(false)
                                                    .setEmoji(`${client.emo.kick}`)
                                                    .setStyle(ButtonStyle.Primary),
                                                new ButtonBuilder()
                                                    .setCustomId("voiceregion")
                                                    .setDisabled(false)
                                                    .setEmoji(`${client.emo.region}`)
                                                    .setStyle(ButtonStyle.Primary)
                                            ),
                                        new ActionRowBuilder()
                                            .addComponents(
                                                new ButtonBuilder()
                                                    .setCustomId("voiceblock")
                                                    .setDisabled(false)
                                                    .setEmoji(`${client.emo.user_block}`)
                                                    .setStyle(ButtonStyle.Primary),
                                                new ButtonBuilder()
                                                    .setCustomId("voiceunblock")
                                                    .setDisabled(false)
                                                    .setEmoji(`${client.emo.user_unblock}`)
                                                    .setStyle(ButtonStyle.Primary),
                                                new ButtonBuilder()
                                                    .setCustomId("voiceclaim")
                                                    .setDisabled(false)
                                                    .setEmoji(`${client.emo.owner}`)
                                                    .setStyle(ButtonStyle.Primary),
                                                new ButtonBuilder()
                                                    .setCustomId("voicetransfer")
                                                    .setDisabled(false)
                                                    .setEmoji(`${client.emo.owner_tranfer}`)
                                                    .setStyle(ButtonStyle.Primary),
                                                new ButtonBuilder()
                                                    .setCustomId("voicedelete")
                                                    .setDisabled(false)
                                                    .setEmoji(`${client.emo.delete}`)
                                                    .setStyle(ButtonStyle.Danger)
                                            )
                                    ]
                                });

                                data.voice.voiceId = voicechannel.id;
                                data.voice.interfaceId = interface.id
                                await data.save();

                                return await interaction.editReply({
                                    content: `${client.emo.yes} Le système de vocal temporaire a bien été configuré ${interface} ${voicechannel}`
                                });
                            })
                            .catch(async err => {
                                return await interaction.editReply({
                                    content: `${client.emo.no} Une erreur est survenue lors de la création du salon vocal.`
                                });
                            });
                    })
                    .catch(async err => {
                        return await interaction.editReply({
                            content: `${client.emo.no} Une erreur est survenue lors de la création du salon d'interface.`
                        });
                    });
            })
            .catch(async err => {
                return await interaction.editReply({
                    content: `${client.emo.no} Une erreur est survenue lors de la création de la catégorie.`
                });
            });
    }
};