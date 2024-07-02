const { SlashCommandBuilder, PermissionFlagsBits, Client, ChatInputCommandInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("derank")
        .setDescription("Permet de dérank.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
        .addUserOption(option => option
            .setName("membre")
            .setDescription("Le membre à dérank.")
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName("raison")
            .setDescription("La raison du dérank.")
            .setRequired(false)
            .setMaxLength(200)
            .setMinLength(1)
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

        if (member.user.id === interaction.guild.ownerId) {
            return await interaction.reply({
                content: ":x: Vous ne pouvez pas dérank propriétaire du serveur discord.",
                ephemeral: true
            });
        };

        if (member.user.id === interaction.user.id) {
            return await interaction.reply({
                content: ":x: Pourquoi essayez-vous de vous dérank ?",
                ephemeral: true
            });
        };

        if (member.user.id === client.user.id) {
            return await interaction.reply({
                content: ":x: Vous ne pouvez pas me dérank.",
                ephemeral: true
            });
        };

        if (interaction.user.id !== interaction.guild.ownerId && interaction.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) {
            return await interaction.reply({
                content: ":x: Vous ne pouvez pas dérank un membre plus haut que vous.",
                ephemeral: true
            });
        };

        if (interaction.guild.members.me.roles.highest.comparePositionTo(member.roles.highest) <= 0) {
            return await interaction.reply({
                content: ":x: Je ne peux pas dérank un membre plus haut que moi.",
                ephemeral: true
            });
        };

        if (member.roles.cache.size === 1) {
            return await interaction.reply({
                content: ":x: Je ne peux pas dérank ce membre.",
                ephemeral: true
            });
        };

        if (!member.user.bot) {
            try {
                await member.send({
                    content: `Vous avez été dérank par \`${interaction.user.displayName}\` pour \`${raison}\`.${interaction.options.getAttachment("preuve") ? ` [\`preuve\`](${interaction.options.getAttachment("preuve").url})` : ""}`,
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
            } catch (err) {};
        };

        return await Promise.all(member.roles.cache.filter(role => role.id !== interaction.guild.id).map(async role => {
            await member.roles.remove(role, raison);
        }))
            .then(async () => {
                return await interaction.reply({
                    content: `Vous avez dérank \`${member.user.displayName}\` pour \`${raison}\`.${interaction.options.getAttachment("preuve") ? ` [\`preuve\`](${interaction.options.getAttachment("preuve").url})` : ""}`,
                });
            })
            .catch(async err => {
                console.log(err)
                return await interaction.reply({
                    content: `\`${member.user.displayName}\` n'a pas été dérank à cause d'une erreur.`,
                    ephemeral: true
                });
            });
    }
};