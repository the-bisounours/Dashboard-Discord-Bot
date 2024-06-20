const { SlashCommandBuilder, PermissionFlagsBits, Client, ChatInputCommandInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("undeafen")
        .setDescription("Permet de mettre le casque.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.DeafenMembers)
        .addUserOption(option => option
            .setName("membre")
            .setDescription("Le membre à mettre le casque du salon vocal.")
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName("raison")
            .setDescription("La raison pour mettre le casque du membre.")
            .setRequired(false)
            .setMaxLength(200)
            .setMinLength(1)
        )
        .addAttachmentOption(option => option
            .setName("preuve")
            .setDescription("La preuve pour mettre le casque du membre.")
            .setRequired(false)
        ),

    category: "Modérations",

    /**
     * 
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    execute: async (client, interaction) => {

        const user = interaction.options.getUser("membre") ? interaction.options.getUser("membre") : interaction.user;
        const member = interaction.guild.members.cache.get(user.id);

        const raison = interaction.options.getString("raison") ? interaction.options.getString("raison") : "aucune raison";

        if (!member) {
            return await interaction.reply({
                content: ":x: Je n'arrive pas a trouver le membre.",
                ephemeral: true
            });
        };

        /*if (member.user.id === interaction.guild.ownerId) {
            return await interaction.reply({
                content: ":x: Vous ne pouvez pas mettre le casque du propriétaire du serveur discord.",
                ephemeral: true
            });
        };

        if (member.user.id === interaction.user.id) {
            return await interaction.reply({
                content: ":x: Pourquoi essayez-vous de vous mettre votre casque ?",
                ephemeral: true
            });
        };

        if (member.user.id === client.user.id) {
            return await interaction.reply({
                content: ":x: Vous ne pouvez pas mettre mon casque.",
                ephemeral: true
            });
        };

        if (interaction.user.id !== interaction.guild.ownerId && interaction.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) {
            return await interaction.reply({
                content: ":x: Vous ne pouvez pas mettre le casque d'un membre plus haut que vous.",
                ephemeral: true
            });
        };

        if (interaction.guild.members.me.roles.highest.comparePositionTo(member.roles.highest) <= 0) {
            return await interaction.reply({
                content: ":x: Je ne peux pas mettre le casque d'un membre plus haut que moi.",
                ephemeral: true
            });
        };*/

        if (!member.voice || !member.voice?.channel) {
            return await interaction.reply({
                content: ":x: Le membre n'est pas en vocal.",
                ephemeral: true
            });
        };

        if (!member.voice.deaf) {
            return await interaction.reply({
                content: ":x: Le membre a déjà le casque désactivé.",
                ephemeral: true
            });
        };

        if (!member.user.bot) {
            try {
                await member.send({
                    content: `Vous pouvez de nouveau écouté par \`${interaction.user.displayName}\` pour \`${raison}\`.${interaction.options.getAttachment("preuve") ? ` [\`preuve\`](${interaction.options.getAttachment("preuve").url})` : ""}`,
                    components: [
                        new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setStyle(ButtonStyle.Secondary)
                                    .setLabel(`Envoyé depuis ${interaction.guild.name}`)
                                    .setDisabled(true)
                            )
                    ]
                });
            } catch (err) {};
        };

        return await member.voice.setDeaf(false, raison)
            .then(async deafInfo => {
                return await interaction.reply({
                    content: `Vous avez mis la possibilité d'écouté à \`${deafInfo.user.displayName}\` pour \`${raison}\`.${interaction.options.getAttachment("preuve") ? ` [\`preuve\`](${interaction.options.getAttachment("preuve").url})` : ""}`,
                });
            })
            .catch(async err => {
                return await interaction.reply({
                    content: `\`${member.user.displayName}\` n'écoute pas à cause d'une erreur.`,
                    ephemeral: true
                });
            });
    }
};