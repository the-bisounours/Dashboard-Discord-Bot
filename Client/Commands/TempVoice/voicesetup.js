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
                content: ":x: Impossible de trouver la base de donnée du serveur.",
                ephemeral: true
            });
        };

        if (data.voice.voiceId && interaction.guild.channels.cache.get(data.voice.voiceId)) {
            return await interaction.reply({
                content: `:x: Le système de vocal temporaire est déjà configuré ${interaction.guild.channels.cache.get(data.voice.voiceId)}.`,
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
                                            .setDescription("Cette **interface** peut être utilisée pour gérer les canaux vocaux temporaires. D'autres options sont disponibles avec les commandes **/voice**.")
                                            .setColor("Blurple")
                                            .setFooter({
                                                text: client.user.displayName,
                                                iconURL: client.user.displayAvatarURL()
                                            })
                                            .setTimestamp()
                                            .setImage("https://cdn.discordapp.com/attachments/1265979183377416194/1265979185252536320/NeverGonnaGiveYouUp.png?ex=66a37a7e&is=66a228fe&hm=ff9babbcd56cd17bac18ef046d2b2d8a80344bb84ce2cedbbdd7f90675943133&")
                                    ],
                                    components: [
                                        new ActionRowBuilder()
                                            .addComponents(
                                                new ButtonBuilder()
                                                    .setCustomId("voicename")
                                                    .setDisabled(false)
                                                    .setLabel("name")
                                                    .setStyle(ButtonStyle.Secondary),
                                                new ButtonBuilder()
                                                    .setCustomId("voicelimit")
                                                    .setDisabled(false)
                                                    .setLabel("limit")
                                                    .setStyle(ButtonStyle.Secondary),
                                                new ButtonBuilder()
                                                    .setCustomId("voiceprivacy")
                                                    .setDisabled(false)
                                                    .setLabel("privacy")
                                                    .setStyle(ButtonStyle.Secondary),
                                                new ButtonBuilder()
                                                    .setCustomId("voicewaiting")
                                                    .setDisabled(false)
                                                    .setLabel("waiting")
                                                    .setStyle(ButtonStyle.Secondary),
                                                new ButtonBuilder()
                                                    .setCustomId("voicethread")
                                                    .setDisabled(false)
                                                    .setLabel("thread")
                                                    .setStyle(ButtonStyle.Secondary)
                                            ),
                                        new ActionRowBuilder()
                                            .addComponents(
                                                new ButtonBuilder()
                                                    .setCustomId("voicetrust")
                                                    .setDisabled(false)
                                                    .setLabel("trust")
                                                    .setStyle(ButtonStyle.Secondary),
                                                new ButtonBuilder()
                                                    .setCustomId("voiceuntrust")
                                                    .setDisabled(false)
                                                    .setLabel("untrust")
                                                    .setStyle(ButtonStyle.Secondary),
                                                new ButtonBuilder()
                                                    .setCustomId("voiceinvite")
                                                    .setDisabled(false)
                                                    .setLabel("invite")
                                                    .setStyle(ButtonStyle.Secondary),
                                                new ButtonBuilder()
                                                    .setCustomId("voicekick")
                                                    .setDisabled(false)
                                                    .setLabel("kick")
                                                    .setStyle(ButtonStyle.Secondary),
                                                new ButtonBuilder()
                                                    .setCustomId("voiceregion")
                                                    .setDisabled(false)
                                                    .setLabel("thread")
                                                    .setStyle(ButtonStyle.Secondary)
                                            ),
                                        new ActionRowBuilder()
                                            .addComponents(
                                                new ButtonBuilder()
                                                    .setCustomId("voiceblock")
                                                    .setDisabled(false)
                                                    .setLabel("block")
                                                    .setStyle(ButtonStyle.Secondary),
                                                new ButtonBuilder()
                                                    .setCustomId("voiceunblock")
                                                    .setDisabled(false)
                                                    .setLabel("unblock")
                                                    .setStyle(ButtonStyle.Secondary),
                                                new ButtonBuilder()
                                                    .setCustomId("voiceclaim")
                                                    .setDisabled(false)
                                                    .setLabel("claim")
                                                    .setStyle(ButtonStyle.Secondary),
                                                new ButtonBuilder()
                                                    .setCustomId("voicetransfer")
                                                    .setDisabled(false)
                                                    .setLabel("transfer")
                                                    .setStyle(ButtonStyle.Secondary),
                                                new ButtonBuilder()
                                                    .setCustomId("voicedelete")
                                                    .setDisabled(false)
                                                    .setLabel("delete")
                                                    .setStyle(ButtonStyle.Secondary)
                                            )
                                    ]
                                })

                                return await interaction.editReply({
                                    content: `Le système de vocal temporaire a bien été configuré ${interface} ${voicechannel}`
                                });
                            })
                            .catch(async err => {
                                return await interaction.editReply({
                                    content: ":x: Une erreur est survenue lors de la création du salon vocal."
                                });
                            });
                    })
                    .catch(async err => {
                        return await interaction.editReply({
                            content: ":x: Une erreur est survenue lors de la création du salon d'interface."
                        });
                    });
            })
            .catch(async err => {
                return await interaction.editReply({
                    content: ":x: Une erreur est survenue lors de la création de la catégorie."
                });
            });
    }
};