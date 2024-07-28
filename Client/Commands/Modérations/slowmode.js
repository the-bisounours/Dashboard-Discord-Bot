const { SlashCommandBuilder, PermissionFlagsBits, Client, ChatInputCommandInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle, AutocompleteInteraction, ChannelType } = require("discord.js");
const convert = require("../../Functions/Gestions/convert");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("slowmode")
        .setDescription("Modifie le flux des messages.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .addStringOption(option => option
            .setName("temps")
            .setDescription("Le temps entre chaque message envoyé.")
            .setRequired(true)
            .setAutocomplete(true)
        )
        .addChannelOption(option => option
            .setName("salon")
            .setDescription("Le salon pour ajouter le mode lent.")
            .setRequired(false)
            .addChannelTypes(
                ChannelType.GuildForum, 
                ChannelType.GuildMedia, 
                ChannelType.GuildStageVoice, 
                ChannelType.GuildText, 
                ChannelType.GuildVoice,
                ChannelType.PrivateThread,
                ChannelType.PublicThread
            )
        )
        .addStringOption(option => option
            .setName("raison")
            .setDescription("La raison du mode lent du salon.")
            .setRequired(false)
            .setMaxLength(200)
            .setMinLength(1)
        ),

    category: "Modérations",

    /**
     * 
     * @param {Client} client 
     * @param {AutocompleteInteraction} interaction 
     */
    autocomplete: async (client, interaction) => {

        const options = [
            { name: '5 secondes', value: "5" },
            { name: '10 secondes', value: "1" },
            { name: '15 secondes', value: "15" },
            { name: '30 secondes', value: "30" },
            { name: '1 minute', value: "60" },
            { name: '2 minutes', value: "120" },
            { name: '5 minutes', value: "300" },
            { name: '10 minutes', value: "600" },
            { name: '15 minutes', value: "900" },
            { name: '30 minutes', value: "1800" },
            { name: '1 heure', value: "3600" },
            { name: '2 heures', value: "7200" },
            { name: '6 heures', value: "21600" },
        ];

        const focusedValue = interaction.options.getFocused();
        const filteredOptions = options.filter(option => 
            option.name.toLowerCase().includes(focusedValue.toLowerCase())
        );

        await interaction.respond(
            filteredOptions.map(option => ({
                name: option.name,
                value: option.value
            }))
        );
    },
    /**
     * 
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    execute: async (client, interaction) => {

        const number = new Number(interaction.options.getString("temps"));
        const channel = interaction.options.getChannel("salon") ? interaction.options.getChannel("salon") : interaction.channel;
        const raison = interaction.options.getString("raison") ? interaction.options.getString("raison") : "aucune raison";

        if(![
            ChannelType.GuildForum, 
            ChannelType.GuildMedia, 
            ChannelType.GuildStageVoice, 
            ChannelType.GuildText, 
            ChannelType.GuildVoice,
            ChannelType.PrivateThread,
            ChannelType.PublicThread
        ].includes(channel.type)) {
            return await interaction.reply({
                content: `${client.emo.no} Vous ne pouvez pas ajouter un mode lent sur ce type de salon.`,
                ephemeral: true
            });
        };

        if(channel.rateLimitPerUser === number) {
            return await interaction.reply({
                content: `${client.emo.no} Vous ne pouvez pas ajouter le même temps.`,
                ephemeral: true
            });
        };

        return await channel.setRateLimitPerUser(number, raison)
            .then(async () => {
                return await interaction.reply({
                    content: `Vous avez mis un mode lent de ${convert(number, "secondes")} ${interaction.channel.id === channel.id ? "sur ce salon" : `sur le salon ${channel}`} pour \`${raison}\`.`,
                });
            })
            .catch(async err => {
                return await interaction.reply({
                    content: `Le mode lent n'a pas été mis à cause d'une erreur.`,
                    ephemeral: true
                });
            }); 
    }
};