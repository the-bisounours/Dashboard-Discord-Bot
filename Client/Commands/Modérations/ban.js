const { SlashCommandBuilder, PermissionFlagsBits, Client, ChatInputCommandInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle, AutocompleteInteraction } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ban")
        .setDescription("Permet de bannir un utilisateur.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addUserOption(option => option
            .setName("membre")
            .setDescription("Le membre à bannir du serveur discord.")
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName("raison")
            .setDescription("La raison du bannissement du membre.")
            .setRequired(false)
            .setMaxLength(200)
            .setMinLength(1)
        )
        .addStringOption(option => option
            .setName("messages")
            .setDescription("Les messages du membre a bannir du serveur discord.")
            .setRequired(false)
            .setAutocomplete(true)
        )
        .addAttachmentOption(option => option
            .setName("preuve")
            .setDescription("La preuve de bannissement du membre.")
            .setRequired(false)
        ),

    category: "Modérations",

    /**
     * 
     * @param {Client} client 
     * @param {AutocompleteInteraction} interaction 
     */
    autocomplete: async (client, interaction) => {

        const options = [
            { name: 'Dernière heure', value: "3600" },
            { name: 'Dernières 6 heures', value: "21600" },
            { name: 'Dernières 12 heures', value: "43200" },
            { name: 'Dernières 24 heures', value: "86400" },
            { name: '3 derniers jours', value: "259200" },
            { name: '7 derniers jours', value: "604800" }
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

        const user = interaction.options.getUser("membre") ? interaction.options.getUser("membre") : interaction.user;
        const member = interaction.guild.members.cache.get(user.id);

        const raison = interaction.options.getString("raison") ? interaction.options.getString("raison") : "aucune raison";
        const messages = interaction.options.getString("messages") ? new Number(interaction.options.getString("messages")) : 3600

        if (!member) {
            return await interaction.reply({
                content: `${client.emo.no} Je n'arrive pas a trouver le membre.`,
                ephemeral: true
            });
        };

        if (member.user.id === interaction.guild.ownerId) {
            return await interaction.reply({
                content: `${client.emo.no} Vous ne pouvez pas bannir propriétaire du serveur discord.`,
                ephemeral: true
            });
        };

        if (member.user.id === interaction.user.id) {
            return await interaction.reply({
                content: `${client.emo.no} Pourquoi essayez-vous de vous bannir ?`,
                ephemeral: true
            });
        };

        if (member.user.id === client.user.id) {
            return await interaction.reply({
                content: `${client.emo.no} Vous ne pouvez pas me bannir, essayer la commande /leave.`,
                ephemeral: true
            });
        };

        if (interaction.user.id !== interaction.guild.ownerId && interaction.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) {
            return await interaction.reply({
                content: `${client.emo.no} Vous ne pouvez pas bannir un membre plus haut que vous.`,
                ephemeral: true
            });
        };

        if (interaction.guild.members.me.roles.highest.comparePositionTo(member.roles.highest) <= 0) {
            return await interaction.reply({
                content: `${client.emo.no} Je ne peux pas bannir un membre plus haut que moi.`,
                ephemeral: true
            });
        };

        if (!member.bannable) {
            return await interaction.reply({
                content: `${client.emo.no} Je ne peux pas bannir ce membre.`,
                ephemeral: true
            });
        };

        if (!member.user.bot) {
            try {
                await member.send({
                    content: `Vous avez été bannis par \`${interaction.user.displayName}\` pour \`${raison}\`.${interaction.options.getAttachment("preuve") ? ` [\`preuve\`](${interaction.options.getAttachment("preuve").url})` : ""}`,
                    components: [
                        new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId("send")
                                    .setStyle(ButtonStyle.Secondary)
                                    .setLabel(`Envoyé depuis ${interaction.guild.name}`)
                                    .setDisabled(true)
                            )
                    ]
                });
            } catch (err) { };
        };

        return await interaction.guild.members.ban(member.user.id, {
            reason: raison,
            deleteMessageSeconds: messages
        })
            .then(async banInfo => {
                return await interaction.reply({
                    content: `Vous avez bannis \`${banInfo.username}\` pour \`${raison}\`.${interaction.options.getAttachment("preuve") ? ` [\`preuve\`](${interaction.options.getAttachment("preuve").url})` : ""}`,
                });
            })
            .catch(async err => {
                return await interaction.reply({
                    content: `\`${member.user.displayName}\` n'a pas été bannis à cause d'une erreur.`,
                    ephemeral: true
                });
            });
    }
};