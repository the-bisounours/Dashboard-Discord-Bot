const { SlashCommandBuilder, PermissionFlagsBits, Client, ChatInputCommandInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("addrole")
        .setDescription("Permet de donner un rôle a un membre.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addUserOption(option => option
            .setName("membre")
            .setDescription("Le membre à donner le rôle.")
            .setRequired(true)
        )
        .addRoleOption(option => option
            .setName("rôle")
            .setDescription("Le role a donner au membre.")
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName("raison")
            .setDescription("La raison de donner le rôle au membre.")
            .setRequired(false)
            .setMaxLength(200)
            .setMinLength(1)
        )
        .addAttachmentOption(option => option
            .setName("preuve")
            .setDescription("La preuve de donner le rôle au membre.")
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
        const role = interaction.guild.roles.cache.get(interaction.options.getRole("rôle").id);
        const raison = interaction.options.getString("raison") ? interaction.options.getString("raison") : "aucune raison";

        if (!member) {
            return await interaction.reply({
                content: `${client.emo.no} Je n'arrive pas a trouver le membre.`,
                ephemeral: true
            });
        };

        if (member.user.id === interaction.guild.ownerId) {
            return await interaction.reply({
                content: `${client.emo.no} Vous ne pouvez pas donner un rôle au propriétaire du serveur discord.`,
                ephemeral: true
            });
        };

        if (member.user.id === interaction.user.id) {
            return await interaction.reply({
                content: `${client.emo.no} Pourquoi essayez-vous de vous donner un rôle ?`,
                ephemeral: true
            });
        };

        if (member.user.id === client.user.id) {
            return await interaction.reply({
                content: `${client.emo.no} Vous ne pouvez pas me donner un rôle.`,
                ephemeral: true
            });
        };

        if (interaction.user.id !== interaction.guild.ownerId && interaction.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) {
            return await interaction.reply({
                content: `${client.emo.no} Vous ne pouvez pas donner un rôle a un membre plus haut que vous.`,
                ephemeral: true
            });
        };

        if (interaction.guild.members.me.roles.highest.comparePositionTo(member.roles.highest) <= 0) {
            return await interaction.reply({
                content: `${client.emo.no} Je ne peux pas donner un rôle a un membre plus haut que moi.`,
                ephemeral: true
            });
        };

        if (interaction.user.id !== interaction.guild.ownerId && interaction.member.roles.highest.comparePositionTo(role) <= 0) {
            return await interaction.reply({
                content: `${client.emo.no} Vous ne pouvez pas donner un rôle plus haut que vous.`,
                ephemeral: true
            });
        };

        if (interaction.guild.members.me.roles.highest.comparePositionTo(role) <= 0) {
            return await interaction.reply({
                content: `${client.emo.no} Je ne peux pas donner un rôle a plus haut que moi.`,
                ephemeral: true
            });
        };

        if (member.roles.cache.has(role.id)) {
            return await interaction.reply({
                content: `${client.emo.no} Le membre possède déjà ce rôle.`,
                ephemeral: true
            });
        };

        if (!member.user.bot) {
            try {
                await member.send({
                    content: `Vous avez reçu \`${role.name}\` par \`${interaction.user.displayName}\` pour \`${raison}\`.${interaction.options.getAttachment("preuve") ? ` [\`preuve\`](${interaction.options.getAttachment("preuve").url})` : ""}`,
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

        return await interaction.guild.members.addRole({
            user: member.user,
            role: role,
            reason: raison
        })
            .then(async addInfo => {
                return await interaction.reply({
                    content: `Vous avez donner \`${role.name}\` à \`${addInfo.displayName}\` pour \`${raison}\`.${interaction.options.getAttachment("preuve") ? ` [\`preuve\`](${interaction.options.getAttachment("preuve").url})` : ""}`,
                });
            })
            .catch(async err => {
                return await interaction.reply({
                    content: `\`${member.user.displayName}\` n'a pas reçu le rôle à cause d'une erreur.`,
                    ephemeral: true
                });
            });
    }
};